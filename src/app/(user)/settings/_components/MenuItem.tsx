import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
};

const MenuItem = ({ icon, title, active }: MenuItemProps) => {
  return (
    <div className="flex items-center p-2 gap-2">
      <Button className="bg-white shadow-none text-muted/70" size={"icon"}>
        <Settings size={20} />
      </Button>
      <span
        className={`text-sm font-semibold ${
          active ? "text-primary" : "text-muted/70"
        }`}
      >
        {title}
      </span>
    </div>
  );
};

export default MenuItem;
