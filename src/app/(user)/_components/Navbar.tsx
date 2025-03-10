"use client";

import { useState } from "react";
import { MessageSquare, Clock, BarChart3, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const items = [
    { id: "chat", icon: MessageSquare, label: "Chat", value: "/chat" },
    { id: "history", icon: Clock, label: "History", value: "/history" },
    { id: "stats", icon: BarChart3, label: "Statistics", value: "/statics" },
    { id: "menu", icon: Menu, label: "Menu", value: "/settings" },
  ];

  return (
    <div className="sticky bottom-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-t border-indigo-100 dark:border-gray-700">
      <div className="max-w-3xl mx-auto grid grid-cols-4">
        {items.slice(0, 2).map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.value)}
            className={cn(
              "flex flex-col items-center justify-center py-3 relative",
              isActive(item.value)
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <Link href={item.value} className="absolute w-full h-full" />
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>

            {isActive(item.value) && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-t-full" />
            )}
          </button>
        ))}

        {items.slice(2).map((item) => (
          <button
            key={item.id}
            onClick={() => router.push(item.value)}
            className={cn(
              "flex flex-col items-center justify-center py-3 relative",
              isActive(item.value)
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
          >
            <Link href={item.value} className="absolute w-full h-full" />
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{item.label}</span>

            {isActive(item.value) && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default NavigationBar;
