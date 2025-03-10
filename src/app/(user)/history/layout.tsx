// import { NavigationBar } from "../chat/_components/NavigationBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <div className="flex-1 pb-16">{children}</div>
      {/* <NavigationBar /> */}
    </div>
  );
}
