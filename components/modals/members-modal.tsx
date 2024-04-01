"use client";
import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCcw, ShieldAlert, ShieldCheck } from "lucide-react";

import { useState } from "react";
import axios from "axios";
import { ServerwithMembersWithProfile } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";

const roleIconMap = {
  "GUEST":null,
  "MODERATOR":<ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
  "ADMIN":<ShieldAlert  className="h-4 w-4 ml-2 text-rose-500"/>
}

const MembersModal = () => {
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const { server } = data as { server: ServerwithMembersWithProfile };

  const isModalOpen = isOpen && type == "members";

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {server?.members?.length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => {
            return (
              <div key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member?.profile?.imgUrl} />
                <div className="flex flex-col gap-y-1">
                  <div className="text-xs font-semibold flex items-center gap-x-1 capitalize">
                    {member?.profile?.name}
                    {roleIconMap[member.role]}
                  </div>
                  <p className="text-sm text-zinc-500">
                    {member.profile.email}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
