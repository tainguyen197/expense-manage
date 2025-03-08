import { Expense } from "@/types/expense";

function calculateSpentByDays(
  expenses: Expense[],
  days: number,
  startDate: Date
) {
  // Return an array of spent by days [1000, 40000, 6000, 0,0,0,0]
  const spentByDays = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const spent = expenses
      .filter((entry) => {
        const entryDate = new Date(entry.timestamp);
        return (
          entryDate.getFullYear() === date.getFullYear() &&
          entryDate.getMonth() === date.getMonth() &&
          entryDate.getDate() === date.getDate()
        );
      })
      .reduce((acc, cur) => acc + cur.amount, 0);

    return spent;
  });

  return spentByDays;
}

export default calculateSpentByDays;
