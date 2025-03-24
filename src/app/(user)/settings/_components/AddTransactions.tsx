// // src/app/(user)/some-page/AddTransactionsButton.tsx
// "use client";

// import { addBulkTransactions } from "@/actions/add-transactions";
// import { useState } from "react";

// export function AddTransactionsButton() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [result, setResult] = useState<{
//     success: boolean;
//     message: string;
//   } | null>(null);

//   const handleClick = async () => {
//     setIsLoading(true);
//     try {
//       const result = await addBulkTransactions();
//       setResult(result);
//     } catch (error) {
//       setResult({ success: false, message: "Failed to add transactions" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={handleClick}
//         disabled={isLoading}
//         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
//       >
//         {isLoading ? "Adding..." : "Add March Transactions"}
//       </button>

//       {result && (
//         <p className={result.success ? "text-green-500" : "text-red-500"}>
//           {result.message}
//         </p>
//       )}
//     </div>
//   );
// }
