import { createUploadthing, type FileRouter } from "uploadthing/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/db";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/app/config/stripe";

// UploadThing router instance
const f = createUploadthing();

// Helper: Chunk long text into segments
function chunkText(text: string, maxWords = 500): string[] {
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += maxWords) {
    chunks.push(words.slice(i, i + maxWords).join(" "));
  }

  return chunks;
}

// Middleware to inject user and plan
const middleware = async () => {
  const user = await getUserFromRequest();
  if (!user) throw new Error("User is not authenticated");

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  return { user, subscriptionPlan };
};

// Upload handler factory
const onUploadComplete = (planName: "Free" | "Pro") => {
  return async ({
    file,
    metadata,
  }: {
    file: { name: string; key: string; url: string };
    metadata: Awaited<ReturnType<typeof middleware>>;
  }) => {
    const { user } = metadata;

    // Save initial file entry
    const createdFile = await db.file.create({
      data: {
        name: file.name,
        key: file.key,
        url: file.url,
        userId: user.id,
        uploadStatus: "PROCESSING",
      },
    });

    try {
      const response = await fetch(file.url);
      const arrayBuffer = await response.arrayBuffer();

      const loader = new PDFLoader(new Blob([arrayBuffer]));
      const pageLevelDocs = await loader.load();
      console.log("Number of extracted pages:", pageLevelDocs.length);
      console.log("Sample page content:", pageLevelDocs[0]?.pageContent);

      const pageCount = pageLevelDocs.length;

      const currentPlan = PLANS.find((p) => p.name === planName);
      if (!currentPlan) {
        throw new Error(`Plan "${planName}" not found`);
      }

      if (pageCount > currentPlan.pagesPerPdf) {
        await db.file.update({
          where: { id: createdFile.id },
          data: { uploadStatus: "FAILED" },
        });

        console.warn(
          `⛔ Exceeded page limit for ${planName} plan (${pageCount}/${currentPlan.pagesPerPdf})`,
        );
        return;
      }

      // Chunk + insert
      for (const doc of pageLevelDocs) {
        const chunks = chunkText(doc.pageContent);
        if (!doc.pageContent || !doc.pageContent.trim()) {
          console.warn("⚠️ Empty page content. Skipping...");
          continue;
        }

        for (const chunk of chunks) {
          await db.chunk.create({
            data: {
              text: chunk,
              fileId: createdFile.id,
            },
          });
        }
      }

      // Success
      await db.file.update({
        where: { id: createdFile.id },
        data: { uploadStatus: "SUCCESS" },
      });

      console.log(
        `✅ Upload complete for ${planName} plan (File ID: ${createdFile.id})`,
      );
    } catch (error) {
      console.error("❌ Error processing PDF:", error);
      await db.file.update({
        where: { id: createdFile.id },
        data: { uploadStatus: "FAILED" },
      });
    }
  };
};

// Router definition
export const ourFileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "8MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete("Free")),

  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete("Pro")),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
