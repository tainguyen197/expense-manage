import Navbar from "./_components/Navbar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <Navbar />
    </div>
  );
};

export default UserLayout;
