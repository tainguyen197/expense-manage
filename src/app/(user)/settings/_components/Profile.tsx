import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Avatar className="h-20 w-20 ">
        <AvatarImage
          className=" object-cover object-center"
          src="https://i.pinimg.com/236x/36/ff/67/36ff67aa91f7a4ba0f6db40b36f31436.jpg"
        />
        <AvatarFallback>KR</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="text-lg font-bold leading-none text-muted/90">Kira</p>
        <p className="text-sm text-muted/50">expert_here@example.com</p>
      </div>
    </div>
  );
};

export default Profile;
