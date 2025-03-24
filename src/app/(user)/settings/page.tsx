import { Suspense } from "react";
import { Bell, Globe, Palette, Mail, LogOut } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const SettingPage = async () => {
  const user = await currentUser();

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-gray-400">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center justify-center py-8">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-24 h-24",
            },
          }}
        />
        <h2 className="text-2xl font-semibold mt-4">{user?.fullName}</h2>
        <p className="text-gray-400">
          {user?.emailAddresses?.[0]?.emailAddress}
        </p>
      </div>

      {/* Account Settings */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Account Settings</h2>
        <div className="space-y-1">
          <div className="flex items-center justify-between p-4 hover:bg-gray-800/30 rounded-lg transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-2">
                <Mail className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium">Change Email</h3>
                <p className="text-gray-400">Update your email address</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/80"
            >
              Change
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-800/30 rounded-lg transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-2">
                <LogOut className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium">Logout</h3>
                <p className="text-gray-400">Sign out of your account</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive/80"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Preferences</h2>
        <div className="space-y-1">
          <div className="flex items-center justify-between p-4 hover:bg-gray-800/30 rounded-lg transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-2">
                <Bell className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-gray-400">
                  Manage your notification preferences
                </p>
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-transparent border-0">
                <SelectValue placeholder="Select notifications" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">All Notifications</SelectItem>
                  <SelectItem value="important">Important Only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-800/30 rounded-lg transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-2">
                <Globe className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium">Language</h3>
                <p className="text-gray-400">Choose your preferred language</p>
              </div>
            </div>
            <Select defaultValue="en">
              <SelectTrigger className="w-[180px] bg-transparent border-0">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="en">🇺🇸 English</SelectItem>
                  <SelectItem value="vi">🇻🇳 Vietnamese</SelectItem>
                  <SelectItem value="jp">🇯🇵 Japanese</SelectItem>
                  <SelectItem value="kr">🇰🇷 Korean</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 hover:bg-gray-800/30 rounded-lg transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-2">
                <Palette className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium">Theme</h3>
                <p className="text-gray-400">Customize your app appearance</p>
              </div>
            </div>
            <Select defaultValue="system">
              <SelectTrigger className="w-[180px] bg-transparent border-0">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="light">☀️ Light</SelectItem>
                  <SelectItem value="dark">🌙 Dark</SelectItem>
                  <SelectItem value="system">💻 System</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingPage;
