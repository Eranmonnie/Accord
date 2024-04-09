import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { serverid: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!params.serverid) {
      return new NextResponse("serverId not found", { status: 400 });
    }
    const server = await db.server.delete({
      where: {
        id: params.serverid,
        profileId: profile.id,
      },
    });
    return NextResponse.json(server);
  } catch (error) {
    console.log("SERVER_ID_DELETE", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
