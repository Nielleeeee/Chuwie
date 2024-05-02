import type { NextRequest } from "next/server";
import { json } from "stream/consumers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    console.log(body);

    return new Response(JSON.stringify(body), { status: 200 });
  } catch (error) {
    console.error(error);

    return new Response(`Error: ${error}`, { status: 500 });
  }
}
