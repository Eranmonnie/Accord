"use client";

import CreateServerModal from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";
import InviteModal from "../modals/invite-Modal";
import EditModal from "../modals/edit-server-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <>
      <CreateServerModal />
      <InviteModal/>
      <EditModal/>
    </>
  );
};
