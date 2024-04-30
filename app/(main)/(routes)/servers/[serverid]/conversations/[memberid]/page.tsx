import React from "react";

import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getOrCreateConvo } from "@/lib/conversation";

interface memberIdPageProps {
  params: {
    serverid: string;
    memberid: string;
  };
}

const MemgerIdPage = async ({ params }: memberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverid,
      profileId: profile.id,
    },
  });

  if (!member) {
    return redirect("/");
  }

  const convo = await getOrCreateConvo(member.id, params.memberid);
  if (!convo) {
    return redirect(`servers/${params.serverid}`);
  }

  const { memberOne, memberTwo } = convo;
  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imgUrl}
        name={otherMember.profile.name}
        serverid={params.serverid}
        type="conversation"
      />
    </div>
  );
};

export default MemgerIdPage;
