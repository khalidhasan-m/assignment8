import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handleRequest(request) {
  return toNextJsHandler(getAuth()).POST(request);
}

export const GET = async (request) => toNextJsHandler(getAuth()).GET(request);
export const POST = handleRequest;
export const PATCH = async (request) => toNextJsHandler(getAuth()).PATCH(request);
export const PUT = async (request) => toNextJsHandler(getAuth()).PUT(request);
export const DELETE = async (request) => toNextJsHandler(getAuth()).DELETE(request);
