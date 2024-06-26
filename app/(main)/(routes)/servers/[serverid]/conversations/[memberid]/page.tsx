
import React from "react";

import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getOrCreateConvo } from "@/lib/conversation";
import { ChatMessages } from "@/components/chat/chat-messages";
import ChatInput from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";

interface memberIdPageProps {
  params: {
    serverid: string;
    memberid: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemgerIdPage = async ({ params, searchParams }: memberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverid,
      profileId: profile.id,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const convo = await getOrCreateConvo(currentMember.id, params.memberid);
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
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={convo.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={convo.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: convo.id,
            }}
          />

          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: convo.id,
            }}
          />
        </>
      )}

      {searchParams.video && (
        <MediaRoom chatId={convo.id} video={true} audio={true} />
      )}
    </div>
  );
};

export default MemgerIdPage;
