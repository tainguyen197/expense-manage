import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  active?: boolean;
  actionMenu?: React.ReactNode;
};

const MenuItem = ({ icon, title, active, actionMenu }: MenuItemProps) => {
  return (
    <div className="flex justify-between p-2 pr-4">
      <div className="flex items-center gap-2">
        <Button className="bg-white shadow-none text-muted/70" size={"icon"}>
          {icon}
        </Button>
        <span
          className={`text-sm font-semibold ${
            active ? "text-primary" : "text-muted/70"
          }`}
        >
          {title}
        </span>
      </div>
      <div>{actionMenu}</div>
    </div>
  );
};

export default MenuItem;
