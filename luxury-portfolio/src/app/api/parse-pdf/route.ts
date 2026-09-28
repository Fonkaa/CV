import { NextRequest, NextResponse } from "next/server";
import { extractText } from "unpdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No PDF file attached to request." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    // Extract text and page telemetry cleanly without canvas dependencies
    const { text, totalPages } = await extractText(arrayBuffer);

    // Join page text arrays if returned as an array, or handle string
    const fullText = Array.isArray(text) ? text.join("\n\n") : text;
    const cleanedText = (fullText || "").trim();

    return NextResponse.json({
      success: true,
      text: cleanedText,
      numPages: totalPages || 1,
      fileName: file.name,
    });
  } catch (error: any) {
    console.error("PDF Parsing Route Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to extract text from PDF on server.",
      },
      { status: 500 }
    );
  }
}