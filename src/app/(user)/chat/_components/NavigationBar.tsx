import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Clock, BarChart3, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Chat",
      href: "/chat",
      icon: MessageSquare,
    },
    {
      label: "History",
      href: "/history",
      icon: Clock,
    },
    {
      label: "Statistics",
      href: "/statistics",
      icon: BarChart3,
    },
    {
      label: "Menu",
      href: "/menu",
      icon: Menu,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 text-sm transition-colors",
                isActive
                  ? "text-primary"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
              )}
            >
              <Icon className="h-6 w-6" />
              <span className="mt-1 text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
