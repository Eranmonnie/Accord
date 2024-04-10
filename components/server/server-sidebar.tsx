import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { channelType, MemberRole } from "@prisma/client";
import React from "react";
import ServerHeader from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import ServerSearch from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { channel } from "diagnostics_channel";
import { Separator } from "../ui/separator";
import ServerSection from "./server-section";
import ServerChannel from "./server-channel";
import ServerMember from "./server-member";

interface ServerSideBarProps {
  serverid: string;
}
const iconMap = {
  [channelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [channelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [channelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
};

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
  const members = server?.members.filter((member) => {
    return member.profileId !== profile.id;
  });

  if (!server) {
    return redirect("/");
  }
  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
      <ServerHeader server={server} role={role} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text channels",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "voice channels",
                type: "channel",
                data: audiochannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "video channels",
                type: "channel",
                data: videochannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Member",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-500 dark:ng-zinc-700 rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={channelType.TEXT}
              role={role}
              label="text Channel"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  role={role}
                  channel={channel}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audiochannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={channelType.AUDIO}
              role={role}
              label="Audio Channel"
            />
            <div className="space-y-[2px]">
              {audiochannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  role={role}
                  channel={channel}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videochannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={channelType.VIDEO}
              role={role}
              label="Video Channel"
            />

            <div className="space-y-[2px]">
              {videochannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  role={role}
                  channel={channel}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}

        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              channelType={channelType.VIDEO}
              role={role}
              label="Members"
              server={server}
            />

            {members.map((member) => (
              <ServerMember 
              key={member.id}
              member={member}
              server={server}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSideBar;
