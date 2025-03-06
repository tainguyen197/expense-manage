import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  return (
    <div className="flex gap-2 items-center">
      <Avatar>
        <AvatarImage src="https://i.pinimg.com/236x/36/ff/67/36ff67aa91f7a4ba0f6db40b36f31436.jpg" />
        <AvatarFallback>KR</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm font-bold leading-none text-muted/90">Kira</p>
        <p className="text-sm text-muted/50">expert_here@example.com</p>
      </div>
    </div>
  );
};

export default Header;
