import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/expense";
import { formatCurrency } from "@/utils/curency";
import moment from "moment";

type CategoryItemProps = {
  icon: string;
  category: string;
  total: number;
};

const CategoryItem = (item: CategoryItemProps) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center">
        <Button size="icon" className="bg-gray-100 shadow-none text-lg">
          {item.icon ?? ""}
        </Button>
        <div className="ml-4">
          <p className="font-semibold text-sm text-muted">{item.category}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-md font-semibold text-muted/90">
          {formatCurrency(item.total)}
        </p>
      </div>
    </div>
  );
};

export default CategoryItem;
