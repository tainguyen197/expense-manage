import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/types/message";
import { SendHorizontal } from "lucide-react";

type AddMessageFormProps = {
  onSubmit: (data: Message) => void;
};

const AddMessageForm = ({ onSubmit }: AddMessageFormProps) => {
  const handleSubmit = async (formData: FormData) => {
    const userMessage = formData.get("content") as string;

    if (!userMessage) return;

    onSubmit &&
      onSubmit({
        content: userMessage,
        role: "user",
        timestamp: new Date(),
        kind: null,
      });
  };

  return (
    <form className="flex items-center w-full px-0 pt-0 gap-3">
      <Input
        name="content"
        className="rounded-full text-accent"
        id="content"
        placeholder="50k trà sữa ..."
      />
      <Button
        className="px-4 [&_svg]:size-6 text-primary-foreground bg-cta-button-background"
        type="submit"
        formAction={handleSubmit}
      >
        <SendHorizontal size={32} strokeWidth={1.5} />
      </Button>
    </form>
  );
};

export default AddMessageForm;
