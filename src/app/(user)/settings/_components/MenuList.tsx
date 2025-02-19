import MenuItem, { MenuItemProps } from "./MenuItem";
import { Separator } from "@/components/ui/separator";

type MenuListProps = {
  items: MenuItemProps[];
  title?: string;
};

const MenuList = ({ items, title }: MenuListProps) => {
  return (
    <div className="flex flex-col gap-2">
      {title ? (
        <h3 className="text-muted/90 font-semibold text-sm">{title}</h3>
      ) : null}
      <div className="p-1 rounded-xl bg-white overflow-hidden shadow-gray-100 shadow-xl border border-solid">
        {items.map((item, index) => (
          <>
            <MenuItem {...item} />{" "}
            {index !== 2 && <Separator className="bg-muted/5 mx-4 w-auto" />}
          </>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
