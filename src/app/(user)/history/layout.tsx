import { Header } from "../_components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="history-layout" className="bg-gray-100">
      <Header title="History" />
      {children}
    </div>
  );
}
