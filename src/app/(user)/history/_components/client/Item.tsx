import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { Expense, Income } from "@/types/expense";
import { formatCurrency } from "@/utils/curency";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { ConfirmDeleteModal } from "./ConfirmDelete";
import { EditFormDialog } from "./EditForm";
import { SkeletonItem } from "../Skeleton";

type TransactionWithCategory = (Expense | Income) & {
  category: Category;
};

export type ItemProps = {
  item: TransactionWithCategory;
  onDelete?: (item: TransactionWithCategory) => void;
  onEdit?: (item: Income | Expense) => void;
};

const Item = ({ item, onDelete, onEdit }: ItemProps) => {
  const handleDelete = () => {
    onDelete?.(item);
  };

  const handleEdit = (values: any) => {
    onEdit?.({ ...item, ...values });
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-gray-800/50 hover:bg-gray-800/70 transition-colors rounded-lg">
      <div className="flex items-center gap-3">
        <div
          className={`p-1.5 rounded-lg ${
            "type" in item && item.type === "income"
              ? "bg-emerald-500/10"
              : "bg-rose-500/10"
          }`}
        >
          {item.category.icon}
        </div>
        <div className="space-y-0.5">
          <h3 className="font-medium text-gray-200">{item.item}</h3>
          <p className="text-sm text-gray-400">
            {moment(item.timestamp).format("MMM D, YYYY")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span
          className={`font-medium ${
            "type" in item && item.type === "income"
              ? "text-emerald-400"
              : "text-rose-400"
          }`}
        >
          {formatCurrency(item.amount)}
        </span>
        <div className="flex items-center gap-1">
          <EditFormDialog
            trigger={
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-gray-300"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            }
            defaultValue={item}
            onSave={handleEdit}
          />
          <ConfirmDeleteModal
            trigger={
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-gray-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            }
            onConfirm={handleDelete}
            onCancel={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

Item.Skeleton = SkeletonItem;

export default Item;
