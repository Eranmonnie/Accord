"use client";
import { ServerwithMembersWithProfile } from "@/types";
import { channelType, MemberRole } from "@prisma/client";
import React from "react";
import ActionTooltip from "../action-tooltip";
import { Plus, Settings } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface serverSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: "members" | "channels";
  channelType?: channelType;
  server?: ServerwithMembersWithProfile;
}
const ServerSection = ({
  label,
  role,
  sectionType,
  channelType,
  server,
}: serverSectionProps) => {
  const { onOpen } = useModal();
  // console.log("chnnel type ", channelType)
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType == "channels" && (
        <ActionTooltip label="create channel" side="top">
          <button
            onClick={() => onOpen("createChannel", {channelType})}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role == MemberRole.ADMIN && sectionType == "members" && (
        <ActionTooltip label="manege members" side="top">
          <button
            onClick={() => onOpen("members", {server})}
            className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
