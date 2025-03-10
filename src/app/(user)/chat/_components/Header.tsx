"use client";

import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

const Header = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="space-y-0.5">
        <h1 className="text-lg font-medium text-gray-100">Kira</h1>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span>Chat with Kira or ask anything</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
