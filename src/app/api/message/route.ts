import { db } from "@/db";
import { getUserFromRequest } from "@/lib/auth";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { NextRequest } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { fileId, message } = SendMessageValidator.parse(body);

    const user = await getUserFromRequest();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const file = await db.file.findFirst({
      where: { id: fileId, userId: user.id },
    });

    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    await db.message.create({
      data: {
        text: message,
        isUserMessage: true,
        userId: user.id,
        fileId,
      },
    });

    const chunks = await db.chunk.findMany({
      where: {
        fileId,
        text: {
          contains: message,
          mode: "insensitive",
        },
      },
      take: 2, // قلل عدد القطع
    });

    const prevMessages = await db.message.findMany({
      where: { fileId },
      orderBy: { createdAt: "desc" },
      take: 2, // قلل عدد الرسائل السابقة
    });

    const formattedPrevMessages = prevMessages.reverse().map((msg) => ({
      role: msg.isUserMessage ? "user" : "assistant",
      content: msg.text,
    }));

    const response = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat:free",
      temperature: 0.7,
      max_tokens: 1024, //
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversation if needed) to answer the user's question in markdown format.",
        },
        {
          role: "user",
          content: `Use the following context (and previous messages if helpful) to answer the question.

----------------
PREVIOUS CONVERSATION:
${formattedPrevMessages
  .map((m) =>
    m.role === "user" ? `User: ${m.content}` : `Assistant: ${m.content}`,
  )
  .join("\n")}

----------------
CONTEXT:
${chunks.map((c) => c.text).join("\n\n")}

USER INPUT: ${message}`,
        },
      ],
    });

    const stream = OpenAIStream(response as unknown as Response, {
      async onCompletion(completion) {
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId,
            userId: user.id,
          },
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (err) {
    console.error("Error handling POST request:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
};
