import { Suspense } from "react";
import { Bell, Globe, Palette, Lock, Mail, LogOut } from "lucide-react";
import MenuList from "./_components/MenuList";
import Profile from "./_components/Profile";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Migrating from "./_components/Migration";

const SettingPage = () => {
  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        <Suspense
          fallback={
            <div className="h-32 bg-gray-800/50 animate-pulse rounded-lg" />
          }
        >
          <Profile />
        </Suspense>

        <Suspense
          fallback={
            <div className="space-y-2">
              <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
              <div className="h-20 bg-gray-800/50 animate-pulse rounded-lg" />
              <div className="h-20 bg-gray-800/50 animate-pulse rounded-lg" />
            </div>
          }
        >
          <AccountSettings />
        </Suspense>

        <Suspense
          fallback={
            <div className="space-y-2">
              <h2 className="text-lg font-semibold mb-4">Preferences</h2>
              <div className="h-20 bg-gray-800/50 animate-pulse rounded-lg" />
              <div className="h-20 bg-gray-800/50 animate-pulse rounded-lg" />
              <div className="h-20 bg-gray-800/50 animate-pulse rounded-lg" />
            </div>
          }
        >
          <PreferencesSettings />
        </Suspense>
      </div>
    </div>
  );
};

const AccountSettings = () => {
  const profileItems = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Change Email",
      description: "Update your email address",
      actionMenu: (
        <button className="text-sm text-primary hover:text-primary/80">
          Change
        </button>
      ),
    },
    {
      icon: <LogOut className="w-5 h-5" />,
      title: "Logout",
      description: "Sign out of your account",
      actionMenu: (
        <button className="text-sm text-destructive hover:text-destructive/80">
          Logout
        </button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
      <MenuList items={profileItems} />
    </div>
  );
};

const PreferencesSettings = () => {
  const settingItems = [
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Notifications",
      description: "Manage your notification preferences",
      actionMenu: (
        <Select defaultValue="all">
          <SelectTrigger className="border-none shadow-none text-foreground">
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="important">Important Only</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Language",
      description: "Choose your preferred language",
      actionMenu: (
        <Select defaultValue="en">
          <SelectTrigger className="border-none shadow-none text-foreground">
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
      ),
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Theme",
      description: "Customize your app appearance",
      actionMenu: (
        <Select defaultValue="system">
          <SelectTrigger className="border-none shadow-none text-foreground">
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
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Preferences</h2>
      <MenuList items={settingItems} />
    </div>
  );
};

export default SettingPage;
