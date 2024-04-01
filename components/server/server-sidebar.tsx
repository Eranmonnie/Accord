import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { channelType } from "@prisma/client";
import React from "react";
import ServerHeader from "./server-header";

interface ServerSideBarProps {
  serverid: string;
}

const ServerSideBar = async ({ serverid }: ServerSideBarProps) => {
  const profile = await currentProfile();
  if (!profile) {
    return redirect("/");
  }
  const server = await db.server.findUnique({
    where: {
      id: serverid,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  const textChannels = server?.channels.filter((channel) => {
    return channel.type == channelType.TEXT;
  });
  const audiochannels = server?.channels.filter((channel) => {
    return channel.type == channelType.AUDIO;
  });
  const videochannels = server?.channels.filter((channel) => {
    return channel.type == channelType.VIDEO;
  });

  if (!server) {
    return redirect("/");
  }
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return( 
  <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
    <ServerHeader
    server={server}
    role={role}
    />
    </div>);
};

export default ServerSideBar;
