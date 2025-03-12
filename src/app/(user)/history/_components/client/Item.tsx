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
  transaction: TransactionWithCategory;
  onDelete?: (item: TransactionWithCategory) => void;
  onEdit?: (item: Income | Expense) => void;
};

const Item = ({ transaction, onDelete, onEdit }: ItemProps) => {
  const handleDelete = () => {
    onDelete?.(transaction);
  };

  const handleEdit = (values: any) => {
    onEdit?.({ ...transaction, ...values });
  };

  return (
    <div className="group relative flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors rounded-xs">
      <div className="flex items-center gap-2 flex-1">
        <div
          className={`p-1.5 rounded-lg ${
            "type" in transaction && transaction.type === "income"
              ? "bg-emerald-500/10"
              : "bg-rose-500/10"
          }`}
        >
          {transaction?.category?.icon}
        </div>
        <div>
          <h3 className="font-medium text-gray-200">{transaction.item}</h3>
          <p className="text-xs text-gray-400">
            {moment(transaction.timestamp).format("MMMM D, YYYY, h:mm A")}
          </p>
        </div>
      </div>
      <div className="text-right group-focus-within:hidden group-hover:hidden">
        <span className={`text-md font-medium text-white`}>
          {formatCurrency(transaction.amount)}
        </span>
        <p className="text-gray-400 text-xs">{transaction?.category?.name}</p>
      </div>
      <div className="hidden group-hover:flex group-focus-within:flex gap-1">
        <EditFormDialog
          trigger={
            <Button size="icon" variant="ghost" className="h-7 w-7 text-white">
              <Pencil className="h-4 w-4" />
            </Button>
          }
          defaultValue={{
            ...transaction,
            category: transaction?.category?.id,
          }}
          onSave={handleEdit}
        />
        <ConfirmDeleteModal
          trigger={
            <Button size="icon" variant="ghost" className="h-7 w-7 ">
              <Trash2 className="h-4 w-4 text-rose-400" />
            </Button>
          }
          onConfirm={handleDelete}
          onCancel={() => {}}
        />
      </div>
    </div>
  );
};

Item.Skeleton = SkeletonItem;

export default Item;
