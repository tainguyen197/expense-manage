import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { Expense, ExpenseWithoutCategory, Income } from "@/types/expense";
import { formatCurrency } from "@/utils/curency";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { ConfirmDeleteModal } from "./ConfirmDelete";
import { EditFormDialog } from "./EditForm";

export type ItemProps = ExpenseWithoutCategory & {
  category?: Category;
  onEdit?: (item: ExpenseWithoutCategory) => void;
  onDelete?: (item: ExpenseWithoutCategory) => void;
};

const Item = (item: ItemProps) => {
  const handleDelete = () => {
    item.onDelete && item.onDelete(item);
  };

  const handleEdit = (values: any) => {
    item.onEdit && item.onEdit({ ...item, ...values });
  };

  return (
    <div
      className="flex items-center justify-between p-2 group focus:bg-gray-100 transition rounded cursor-pointer"
      key={item.timestamp}
      tabIndex={0}
    >
      <div className="flex items-center">
        <Button size="icon" className="bg-gray-100 shadow-none text-lg">
          {item.category?.icon ?? ""}
        </Button>
        <div className="ml-4">
          <p className="font-semibold text-sm text-muted">{item.item}</p>
          <p className="text-gray-500 text-xs">
            {moment(item.timestamp).format("LL, LT")}
          </p>
        </div>
      </div>
      <div className="text-right group-hover:hidden group-focus-within:hidden">
        <p className="font-semibold text-sm text-muted">
          {formatCurrency(item.amount)}
        </p>
        <p className="text-gray-500 text-xs">{item.category?.name}</p>
      </div>
      <div className="hidden group-hover:flex group-focus-within:flex gap-4 transition">
        <EditFormDialog
          onSave={handleEdit}
          defaultValue={{ ...item, category: item.category?.id ?? "" }}
          trigger={<Pencil size={16} className="cursor-pointer text-muted" />}
        />
        <ConfirmDeleteModal
          onConfirm={handleDelete}
          onCancel={() => {}}
          trigger={<Trash2 color="red" size={16} className="cursor-pointer" />}
        />
      </div>
    </div>
  );
};

export default Item;
