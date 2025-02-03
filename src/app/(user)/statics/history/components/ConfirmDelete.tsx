import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ConfirmDeleteModalProps = {
  trigger: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDeleteModal({
  trigger,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row justify-between items-center gap-4">
          <AlertDialogCancel className="mt-0 flex-1" onClick={onCancel}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="flex-1 bg-[#d20101] hover:bg-[#9b0101] hover:font-semibold text-white"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
