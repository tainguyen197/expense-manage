import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth, currentUser } from "@clerk/nextjs/server";
const UserAvatar = async () => {
  console.log("UserAvatar");
  const { userId } = await auth();

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  console.log("UserAvatar", user);

  const { imageUrl, lastName, emailAddresses } = user;
  return (
    <div className="flex gap-2 items-center p-4 bg-background w-full fixed top-0 z-10">
      <Avatar>
        <AvatarImage src={imageUrl} />
      </Avatar>
      <div>
        <p className="text-sm font-bold leading-none text-muted/90">
          {lastName}
        </p>
        <p className="text-sm text-muted/50">
          {emailAddresses[0].emailAddress}
        </p>
      </div>
    </div>
  );
};

export default UserAvatar;
