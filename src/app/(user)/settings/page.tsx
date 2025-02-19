import { Settings } from "lucide-react";
import MenuList from "./_components/MenuList";
import Profile from "./_components/Profile";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SettingPage = () => {
  const profileItems = [
    {
      icon: "🔐",
      title: "Change Password",
      description: "Change your password",
    },
    {
      icon: "📧",
      title: "Change Email",
      description: "Change your email",
    },
    {
      icon: "🔒",
      title: "Logout",
      description: "Logout your account",
    },
  ];

  const settingItems = [
    {
      icon: <Settings size={20} />,
      title: "Notification",
      description: "Notification setting",
    },
    {
      icon: "🌐",
      title: "Language",
      description: "Change your language",
      actionMenu: (
        <Select>
          <SelectTrigger className="border-none shadow-none text-muted/70 gap-4">
            <SelectValue placeholder="Select a language" />
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
      title: "Theme",
      icon: "🎨",
      description: "Change your theme",
      actionMenu: (
        <Select>
          <SelectTrigger className="border-none shadow-none text-muted/70 gap-4">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="light">☀️ Light</SelectItem>
              <SelectItem value="dark">🌙 Dark</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="container p-4">
      <Profile />
      <div className="flex flex-col gap-4 mt-8">
        <MenuList items={profileItems} title="Profile" />
        <MenuList items={settingItems} title="Settings" />
      </div>
    </div>
  );
};

export default SettingPage;
