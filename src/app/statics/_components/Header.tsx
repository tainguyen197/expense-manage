import { BotMessageSquare, Ellipsis } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between w-full ">
        <Link href="/chat">
          <BotMessageSquare
            className="cursor-pointer"
            size={24}
            strokeWidth={2}
            color="green"
          />
        </Link>
        <h2 className="text-xl font-semibold">Statics</h2>
        <Ellipsis className="cursor-pointer" size={24} />
      </div>
    </div>
  );
}
