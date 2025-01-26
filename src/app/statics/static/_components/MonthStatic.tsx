import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MonthStatic = () => {
  return (
    <Card>
      <CardHeader>
        <Popover>
          <PopoverTrigger asChild>
            <CardTitle className="flex items-end text-md gap-2">
              <CalendarDays />{" "}
              <span className="text-lg font-bold leading-4">July 2024</span>
              <ChevronDown size={16} />
            </CardTitle>
          </PopoverTrigger>
          <PopoverContent className="w-80 flex gap-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                  <SelectItem value="blueberry">Blueberry</SelectItem>
                  <SelectItem value="grapes">Grapes</SelectItem>
                  <SelectItem value="pineapple">Pineapple</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </PopoverContent>
        </Popover>
      </CardHeader>
      <CardContent>
        <Progress className="h-4" value={33} />
        <div className="flex flex-col mt-6 gap-1">
          <div className="flex justify-between">
            <p className="text-md text-gray-500">Total income</p>
            <p className="text-xl font-bold ">₹ 1,00,000</p>
          </div>
          <div className="flex justify-between">
            <p className="text-md text-gray-500">Total outcome</p>
            <p className="text-xl font-bold ">₹ 1,00,000</p>
          </div>
        </div>
        {/* <CardDescription className="mt-6">
          <p className="text-md text-gray-500">You are doing great!</p>
        </CardDescription> */}
      </CardContent>
    </Card>
  );
};

export default MonthStatic;
