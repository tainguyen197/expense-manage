import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-10 w-10 ring-2 ring-indigo-200 dark:ring-indigo-700">
        <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
        <AvatarFallback className="bg-gradient-to-br from-indigo-400 to-purple-500 text-white">
          K
        </AvatarFallback>
      </Avatar>
      <div>
        <h1 className="font-semibold text-gray-900 dark:text-white">Kira</h1>
        <p className="text-xs text-indigo-600 dark:text-indigo-400">
          expert_here@example.com
        </p>
      </div>
    </div>
  );
};

export default Header;
