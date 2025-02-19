import Navbar from "./_components/Navbar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-100">
      {children}
      <Navbar />
    </div>
  );
};

export default UserLayout;
