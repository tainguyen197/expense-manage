import { getCategories } from "@/actions/category";
import { Category } from "@/types/category";
import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
};

const CategorySelect = ({ value, onValueChange }: Props) => {
  const [category, setCategory] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const fetchCategory = async () => {
      const result = await getCategories();
      setCategory(result);
    };

    fetchCategory();
  }, []);

  return (
    <Select value={String(value)} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>--Select category--</SelectLabel>
          {category.map((item) => (
            <SelectItem key={item.id} value={String(item.id)}>
              {item.icon} {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CategorySelect;
