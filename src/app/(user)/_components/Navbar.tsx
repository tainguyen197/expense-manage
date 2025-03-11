"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Clock, BarChart3, Menu, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when scrolling up or at the top
      // Hide navbar when scrolling down
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const isActive = (path: string) => pathname === path;

  const items = [
    { id: "chat", icon: MessageSquare, label: "Chat", value: "/chat" },
    { id: "history", icon: Clock, label: "History", value: "/history" },
    { id: "stats", icon: BarChart3, label: "Statistics", value: "/statics" },
    { id: "menu", icon: Menu, label: "Menu", value: "/settings" },
  ];

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-10 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-t border-indigo-100 dark:border-gray-700 transition-transform duration-300",
        !isVisible && "translate-y-full"
      )}
    >
      <div className="max-w-3xl mx-auto px-4">
        <div className="grid grid-cols-4 gap-0">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.value)}
              className={cn(
                "flex flex-col items-center justify-center py-3 relative transition-all duration-200",
                isActive(item.value)
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:scale-105 active:scale-95"
              )}
            >
              <Link href={item.value} className="absolute w-full h-full" />
              <item.icon className="h-5 w-5 mb-1 transition-transform duration-200 group-hover:scale-110" />
              <span className="text-xs">{item.label}</span>

              {isActive(item.value) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-indigo-500 dark:bg-indigo-400 rounded-t-full transition-all duration-300 ease-out" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NavigationBar;
