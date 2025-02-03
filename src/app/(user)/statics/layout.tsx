import { Header } from "./_components/Header";
import Navbar from "./_components/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="statics-layout" className="bg-gray-100">
      <Header />
      {children}
      {/* <Navbar /> */}
    </div>
  );
}
