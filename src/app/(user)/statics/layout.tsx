import { Header } from "../_components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="statics-layout" className="bg-gray-100">
      <div className="flex-1">{children}</div>
    </div>
  );
}
