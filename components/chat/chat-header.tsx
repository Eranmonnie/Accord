import React from "react";
import { Hash } from "lucide-react";
import MobileToggle from "../ui/mobile-toggle";
import UserAvatar from "../user-avatar";
import SocketIndicator from "../socket-indicator";
interface chatHeaderProps {
  serverid: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader = ({ serverid, name, type, imageUrl }: chatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      <MobileToggle serverid={serverid} />
      {type === "channel" && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2" />
      )}

      {type === "conversation" && (
        <div className=" flex items-center w-8 h-8 md:w-8 md:h-8 mr-4">
          <UserAvatar src={imageUrl} />
        </div>
      )}
      <p className="font-semibold text-md text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
