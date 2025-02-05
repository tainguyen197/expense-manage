export function Header({ title }: { title: string }) {
  return (
    <div className="text-center p-4 bg-white border-b border-gray-200 w-full">
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}
