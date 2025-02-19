import MenuList from "./_components/MenuList";
import Profile from "./_components/Profile";

const SettingPage = () => {
  return (
    <div className="container p-4">
      <Profile />
      <div className="flex flex-col gap-4 mt-8">
        <MenuList />
        <MenuList />
      </div>
    </div>
  );
};

export default SettingPage;
