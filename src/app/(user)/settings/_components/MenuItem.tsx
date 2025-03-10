import { cn } from "@/lib/utils";

export interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionMenu?: React.ReactNode;
  onClick?: () => void;
}

const MenuItem = ({
  icon,
  title,
  description,
  actionMenu,
  onClick,
}: MenuItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-3 px-4 rounded-lg transition-colors",
        onClick && "cursor-pointer hover:bg-muted/50"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="text-muted-foreground">{icon}</div>
        <div className="flex flex-col">
          <span className="font-medium">{title}</span>
          <span className="text-sm text-muted-foreground">{description}</span>
        </div>
      </div>
      {actionMenu && <div className="flex items-center">{actionMenu}</div>}
    </div>
  );
};

export default MenuItem;
