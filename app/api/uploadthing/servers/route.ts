import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const {name, imgUrl} = await req.json()
  } catch (err) {
    console.log("[SERVER_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
