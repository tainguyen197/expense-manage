import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { House } from "lucide-react";
import { Chart } from "./Chart";

export function TabsDemo() {
  return (
    <Tabs
      defaultValue="account"
      className=" bg-card p-2 rounded-tl-2xl rounded-tr-2xl w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Spends</TabsTrigger>
        <TabsTrigger value="password">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="flex flex-col gap-1">
          {[1, 2, 3].map(() => (
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center">
                <Button size="icon" className="bg-gray-100 shadow-none">
                  <House size={36} color="black" strokeWidth={3} />
                </Button>
                <div className="ml-4">
                  <p className="font-semibold text-sm">Food</p>
                  <p className="text-gray-500 text-xs">20 Feb 2024</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">$20</p>
                <p className="text-gray-500 text-xs">Google pay</p>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      <TabsContent value="password">
        <Chart />
      </TabsContent>
    </Tabs>
  );
}
