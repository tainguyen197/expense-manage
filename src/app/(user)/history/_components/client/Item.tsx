import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { Expense, ExpenseWithoutCategory, Income } from "@/types/expense";
import { formatCurrency } from "@/utils/curency";
import { Pencil, Trash2 } from "lucide-react";
import moment from "moment";
import { ConfirmDeleteModal } from "./ConfirmDelete";
import { EditFormDialog } from "./EditForm";
import { SkeletonItem } from "../Skeleton";

type ItemData = ExpenseWithoutCategory & { category: Category };

export type ItemProps = {
  item: ItemData;
  onDelete?: (item: ItemData) => void;
  onEdit?: (item: Expense | Income) => void;
};

const Item = (props: ItemProps) => {
  const { item } = props;

  const handleDelete = () => {
    props.onDelete && props.onDelete(item);
  };

  const handleEdit = (values: any) => {
    props.onEdit && props.onEdit({ ...item, ...values });
  };

  return (
    <div
      className="flex items-center justify-between p-2 group transition rounded cursor-pointer"
      tabIndex={0}
    >
      <div className="flex items-center">
        <Button
          size="icon"
          className="bg-gray-800 dark:bg-gray-700 shadow-none text-lg"
        >
          {item.category?.icon ?? ""}
        </Button>
        <div className="ml-4">
          <p className="font-semibold text-sm text-gray-100">{item.item}</p>
          <p className="text-gray-400 text-xs">
            {moment(item.timestamp).format("LL, LT")}
          </p>
        </div>
      </div>
      <div className="text-right group-hover:hidden group-focus-within:hidden">
        <p className="font-semibold text-sm text-gray-100">
          {formatCurrency(item.amount)}
        </p>
        <p className="text-gray-400 text-xs">{item.category?.name}</p>
      </div>
      <div className="hidden group-hover:flex group-focus-within:flex gap-4 transition">
        <EditFormDialog
          onSave={handleEdit}
          defaultValue={{ ...item, category: item.category?.id ?? "" }}
          trigger={
            <Pencil size={16} className="cursor-pointer text-gray-100" />
          }
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

Item.Skeleton = SkeletonItem;

export default Item;
