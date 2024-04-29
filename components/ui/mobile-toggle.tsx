import { Menu } from "lucide-react";
import React from "react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./button";
import NavigationSideBar from "../navigation/navigation-sidebar";
import ServerSideBar from "../server/server-sidebar";

interface mobileToggleProps {
  serverid: string;
}

const MobileToggle = ({serverid}:mobileToggleProps) => {
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="p-0 flex gap-0">
          <div className="w-[72px]">
            <NavigationSideBar />
          </div>
          <ServerSideBar serverid={serverid} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileToggle;
