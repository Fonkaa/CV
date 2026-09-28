import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { initialData } from "@/data/initialData";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

const DB_KEY = "luxury_portfolio_live_data";

// GET: Called when any phone, PC, or visitor loads the portfolio
export async function GET() {
  try {
    if (!process.env.KV_REST_API_URL && !process.env.UPSTASH_REDIS_REST_URL) {
      return NextResponse.json({ success: true, data: initialData });
    }

    const savedData = await redis.get(DB_KEY);
    return NextResponse.json({
      success: true,
      data: savedData || initialData,
    });
  } catch (error: any) {
    console.error("Redis fetch error:", error);
    return NextResponse.json({ success: true, data: initialData });
  }
}

// POST: Called when you click "Inscribe & Bind Grimoire" from ANY device
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();

    const currentPasscode = payload.adminPasscode || "fiker4620";
    if (payload.adminPasscode !== currentPasscode) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) {
      await redis.set(DB_KEY, payload);
    }

    return NextResponse.json({ success: true, message: "Synchronized globally." });
  } catch (error: any) {
    console.error("Redis write error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}