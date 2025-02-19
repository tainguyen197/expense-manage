import MenuItem from "./MenuItem";
import { Separator } from "@/components/ui/separator";

const MenuList = () => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-muted/90 font-semibold text-sm">Settings</h3>
      <div className="p-1 rounded-xl bg-white overflow-hidden shadow-gray-100 shadow-xl border border-solid">
        {[1, 2, 3].map((item, index) => (
          <>
            <MenuItem icon="🍔" title="Menu" />{" "}
            {index !== 2 && <Separator className="bg-muted/5 mx-4 w-auto" />}
          </>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
