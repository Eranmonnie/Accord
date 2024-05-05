import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
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
      <div className="flex-1">Future messages</div>
      <ChatInput
        apiUrl="/api/socket/messages"
        query={{
          channelid: channel.id,
          serverid: channel.serverId,
        }}
        name={channel.name}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;