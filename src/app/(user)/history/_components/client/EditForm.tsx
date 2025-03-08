import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Expense, Income } from "@/types/expense";
import { Formik, Form, Field } from "formik";
import React from "react";
import CategorySelect from "./CategorySelect";

const EditForm = ({
  defaultValue,
  onSave,
}: {
  defaultValue?: Expense | Income;
  onSave?: (values: any) => void;
}) => {
  const initialValues = {
    item: defaultValue?.item || "",
    amount: defaultValue?.amount || "",
    category: defaultValue?.category || "",
  };

  const handleSubmit = (values: typeof initialValues) => {
    onSave && onSave(values);
  };

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ values, setFieldValue }) => (
        <Form className="flex flex-col gap-3 items-center w-full px-0 pt-0">
          <Field name="item">
            {({ field }: { field: any }) => (
              <Input
                {...field}
                className="text-sm"
                id="content"
                placeholder="50k trà sữa ..."
              />
            )}
          </Field>
          <Field name="amount">
            {({ field }: { field: any }) => (
              <Input
                {...field}
                type="number"
                className="text-sm"
                placeholder="Input your amount..."
              />
            )}
          </Field>

          <CategorySelect
            value={values.category.toString()}
            onValueChange={(value) => setFieldValue("category", value)}
          />
          <Button
            type="submit"
            className="w-full mt-2 text-white font-semibold"
          >
            Save
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export const EditFormDialog = ({
  trigger,
  defaultValue,
  onSave,
}: {
  trigger: React.ReactNode;
  defaultValue: Expense | Income;
  onSave: (values: any) => void;
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSave = (values: any) => {
    onSave(values);

    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[80%] rounded p-4">
        <DialogHeader className="text-left">
          <DialogTitle className="font-semibold">Edit</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <EditForm defaultValue={defaultValue} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
};
export default EditForm;
