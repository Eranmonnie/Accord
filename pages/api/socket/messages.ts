import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";

import { NextApiRequest } from "next";

export default async function handeler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method != "POST") {
    return res.status(405).json({ error: "method not allowed" });
  }

  try {
    const profile = await currentProfilePages(req);

    const { content, fileUrl } = req.body;
    const { serverid, channelid } = req.query;

    if (!profile) {
      return res.status(401).json({ message: "unauthorised" });
    }

    if (!serverid) {
      return res.status(400).json({ message: "serverid  missing" });
    }

    if (!channelid) {
      return res.status(400).json({ message: "channelid missing" });
    }

    if (!content) {
      return res.status(400).json({ message: "content missing" });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverid as string,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: "server not found" });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelid as string,
        serverId: serverid as string,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: "channel not found" });
    }

    const member = server.members.find(
      (member) => member.profileId == profile.id
    );
    console.log(member);

    if (!member) {
      return res.status(404).json({ message: "member not found omommoo" });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelid as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelid}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ message: "internal server error" });
  }
}
