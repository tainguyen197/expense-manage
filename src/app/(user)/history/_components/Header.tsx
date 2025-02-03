import { BotMessageSquare, Ellipsis, MessageSquareMore } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between w-full text-blue-main">
        <Link href="/chat">
          <MessageSquareMore className="cursor-pointer" size={24} />
        </Link>
        <h2 className="text-xl font-bold">Statics</h2>
        <Ellipsis className="cursor-pointer" size={24} />
      </div>
    </div>
  );
}
