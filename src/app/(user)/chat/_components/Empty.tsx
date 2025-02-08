import Image from "next/image";

const Empty = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Image
        src={"/images/no_chat.jpg"}
        alt="no_chat"
        width={300}
        height={100}
      />
      <span className="text-muted-foreground text-md">
        Bắt đầu ghi chép chi tiêu ngay đi
      </span>
    </div>
  );
};

export default Empty;
