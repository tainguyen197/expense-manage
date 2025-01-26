import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import CategoryItem from "./CategoryItem";

const CategoryStatic = () => {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 mt-4">
        {[1, 2, 3].map((item) => (
          <CategoryItem icon="🏠" category="Nhà ở" key={item} total={1230000} />
        ))}
        {/* <CardDescription className="mt-6">
          <p className="text-md text-gray-500">You are doing great!</p>
        </CardDescription> */}
      </CardContent>
    </Card>
  );
};

export default CategoryStatic;
