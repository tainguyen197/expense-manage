import { Header } from "../_components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="statics-layout" className="bg-gray-100">
      <Header title="Statics" />
      <div className="pt-12">{children}</div>
    </div>
  );
}
