import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverid: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("Unauthoried", { status: 401 });
    }

    if (!params.serverid) {
      return new NextResponse("serverid missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverid,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server);
  } catch (err) {
    console.log("[SERVER_ID]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
