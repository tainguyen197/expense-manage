import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/types/message";
import { useState } from "react";
import { PlaneIcon as PaperPlaneIcon } from "lucide-react";

type AddMessageFormProps = {
  onSubmit: (data: Message) => void;
};

const AddMessageForm = ({ onSubmit }: AddMessageFormProps) => {
  const [newExpense, setNewExpense] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.trim()) return;

    onSubmit({
      content: newExpense,
      role: "user",
      timestamp: new Date().toISOString(),
      kind: null,
    });

    setNewExpense("");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto w-full">
      <div
        className={`
          relative backdrop-blur-md 
          bg-white/80 dark:bg-gray-800/80 
          rounded-full shadow-lg 
          border border-indigo-100 dark:border-gray-700 
          overflow-hidden
          transition-all duration-200 ease-out
          ${
            isFocused
              ? "shadow-indigo-200 dark:shadow-indigo-900/30 scale-[1.02]"
              : ""
          }
        `}
      >
        <Input
          value={newExpense}
          onChange={(e) => setNewExpense(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="50k trà sữa..."
          className="
            border-0 bg-transparent 
            h-12 pl-6 pr-16 
            focus-visible:ring-0 focus-visible:ring-offset-0 
            placeholder:text-indigo-300 dark:placeholder:text-gray-500
            transition-colors duration-200
          "
        />
        <Button
          type="submit"
          size="icon"
          className={`
            absolute right-2 top-1/2 -translate-y-1/2 
            h-8 w-8 rounded-full 
            bg-gradient-to-r from-indigo-500 to-purple-500 
            hover:from-indigo-600 hover:to-purple-600 
            shadow-md
            transition-all duration-200
            ${
              newExpense.trim()
                ? "opacity-100 scale-100"
                : "opacity-70 scale-95"
            }
          `}
          disabled={!newExpense.trim()}
        >
          <PaperPlaneIcon className="h-4 w-4 text-white" />
        </Button>
      </div>
    </form>
  );
};

export default AddMessageForm;
