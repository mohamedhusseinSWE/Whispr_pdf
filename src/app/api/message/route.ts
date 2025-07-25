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
      },
      take: 10,
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
      model: "deepseek/deepseek-r1:free",
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are an intelligent assistant. Use the provided context from a PDF document to answer questions or summarize it. Respond in markdown.`,
        },
        {
          role: "user",
          content: `
Here is the extracted content from the PDF:

${chunks.map((c) => c.text).join("\n\n")}

Now, please respond to the following prompt: "${message}"
      `,
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
