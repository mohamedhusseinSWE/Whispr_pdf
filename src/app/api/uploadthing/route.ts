import { createRouteHandler } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextRequest } from "next/server";

const handler = createRouteHandler({
  router: ourFileRouter,
});

// Wrap the handler to match Next.js route handler signature
export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
