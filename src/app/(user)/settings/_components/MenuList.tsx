import MenuItem, { MenuItemProps } from "./MenuItem";
import { Separator } from "@/components/ui/separator";

type MenuListProps = {
  items: MenuItemProps[];
  title?: string;
};

const MenuList = ({ items }: MenuListProps) => {
  return (
    <div className="space-y-1">
      {items.map((item, index) => (
        <div key={item.title}>
          <MenuItem {...item} />
          {index !== items.length - 1 && <Separator className="my-1" />}
        </div>
      ))}
    </div>
  );
};

export default MenuList;
