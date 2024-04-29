import React from "react";

import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface channelIdPageProps {
  params: {
    serverid: string;
    memberid: string;
  };
}

const MemgerIdPage = async ({ params }: channelIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }
  const channel = await db.channel.findUnique({
    where: {
      id: params.memberid,
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
    </div>
  );
};

export default MemgerIdPage;
