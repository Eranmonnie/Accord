import { Channel, channelType, Server } from "@prisma/client";
import { create } from "zustand";
export type ModalType =
  | "createServer"
  | "deleteServer"
  | "leaveServer"
  | "editServer"
  | "invite"
  | "members"
  | "createChannel"
  | "deleteChannel"
  | "editChannel";

interface ModalData {
  server?: Server;
  channel?: Channel;
  channelType?: channelType;
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
