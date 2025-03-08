"use server";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

const Profile = async () => {
  const user = await currentUser();

  if (!user) return <RedirectToSignIn />;
  console.log("user", user);

  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      <Avatar className="h-20 w-20 ">
        <AvatarImage
          className="object-cover object-center"
          src={user.imageUrl}
          alt="avatar"
        />
        <AvatarFallback>KR</AvatarFallback>
      </Avatar>
      <div className="text-center">
        <p className="text-lg font-bold leading-none text-muted/90">
          {user.fullName}
        </p>
        <p className="text-sm text-muted/50">
          {user.primaryEmailAddress?.emailAddress}
        </p>
      </div>
    </div>
  );
};

export default Profile;
