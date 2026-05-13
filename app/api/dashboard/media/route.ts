import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { deletePublicMedia, listPublicMedia, savePublicMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

async function rejectUnauthenticated() {
  const admin = await getCurrentAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return null;
}

export async function GET() {
  const denied = await rejectUnauthenticated();

  if (denied) {
    return denied;
  }

  return NextResponse.json({ media: await listPublicMedia() });
}

export async function POST(request: Request) {
  const denied = await rejectUnauthenticated();

  if (denied) {
    return denied;
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No image selected." }, { status: 400 });
  }

  const src = await savePublicMedia(file);

  return NextResponse.json({ src, media: await listPublicMedia() });
}

export async function DELETE(request: Request) {
  const denied = await rejectUnauthenticated();

  if (denied) {
    return denied;
  }

  const { src } = (await request.json()) as { src?: string };

  if (!src) {
    return NextResponse.json({ error: "Missing image path." }, { status: 400 });
  }

  await deletePublicMedia(src);

  return NextResponse.json({ media: await listPublicMedia() });
}
