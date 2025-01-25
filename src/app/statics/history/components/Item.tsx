import { Button } from "@/components/ui/button";
import { Expense } from "@/types/expense";
import { formatCurrency } from "@/utils/curency";
import { House } from "lucide-react";

const Item = ({ item }: { item: Expense }) => {
  return (
    <div className="flex items-center justify-between p-2" key={item.timestamp}>
      <div className="flex items-center">
        <Button size="icon" className="bg-gray-100 shadow-none">
          <House size={36} color="black" strokeWidth={3} />
        </Button>
        <div className="ml-4">
          <p className="font-semibold text-sm">{item.item}</p>
          <p className="text-gray-500 text-xs">
            {new Date(item.timestamp).toDateString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-sm">{formatCurrency(item.amount)}</p>
        <p className="text-gray-500 text-xs">{item.category ?? "--"}</p>
      </div>
    </div>
  );
};

export default Item;
