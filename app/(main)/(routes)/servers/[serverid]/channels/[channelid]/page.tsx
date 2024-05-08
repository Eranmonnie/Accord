import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { channelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";

interface channelIdPageProps {
  params: {
    serverid: string;
    channelid: string;
  };
}

const ChannelIdPage = async ({ params }: channelIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelid,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverid,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect("/");
  }

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverid={channel.serverId}
        type="channel"
      />

      {channel.type == channelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            member={member}
            chatId={channel.id}
            type={"channel"}
            apiUrl={"/api/messages"}
            socketUrl={"/api/socket/messages"}
            socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
            paramKey={"channelId"}
            paramValue={channel.id}
          />

          <ChatInput
            apiUrl="/api/socket/messages"
            query={{
              channelid: channel.id,
              serverid: channel.serverId,
            }}
            name={channel.name}
            type="channel"
          />
        </>
      )}
      {channel.type ==channelType.AUDIO &&(
        <MediaRoom
        chatId={channel.id}
        video={false}
        audio={true}
        />
      )}
      {channel.type ==channelType.VIDEO &&(
        <MediaRoom
        chatId={channel.id}
        video={true}
        audio={false}
        />
      )}
    </div>
  );
};

export default ChannelIdPage;
