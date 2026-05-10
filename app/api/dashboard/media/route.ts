import { NextResponse } from "next/server";
import { deletePublicMedia, listPublicMedia, savePublicMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ media: await listPublicMedia() });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "No image selected." }, { status: 400 });
  }

  const src = await savePublicMedia(file);

  return NextResponse.json({ src, media: await listPublicMedia() });
}

export async function DELETE(request: Request) {
  const { src } = (await request.json()) as { src?: string };

  if (!src) {
    return NextResponse.json({ error: "Missing image path." }, { status: 400 });
  }

  await deletePublicMedia(src);

  return NextResponse.json({ media: await listPublicMedia() });
}
