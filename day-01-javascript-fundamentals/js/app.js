const transactions = [
    {
        id: 1,
        title: "Salary",
        amount: 250000,
        type: "income"
    },
    {
        id: 2,
        title: "Rent",
        amount: 50000,
        type: "expense"
    },
    {
        id: 3,
        title: "Internet",
        amount: 5000,
        type: "expense"
    },
    {
        id: 4,
        title: "Freelance",
        amount: 40000,
        type: "income"
    }
];

const incomeTransactions = transactions.filter(
    transactions => transactions.type === "income"
);

const expenseTransactions = transactions.filter(
    transactions => transactions.type ==="expense"
);

const totalIncome = incomeTransactions.reduce(
    (total,incomeTransactions) => total +incomeTransactions.amount,0
);

const totalExpenses = expenseTransactions.reduce(
    (total,expenseTransactions) => total + expenseTransactions.amount,0
);

const balance = totalIncome - totalExpenses;

console.log(`Income: Rs. ${totalIncome}`);
console.log(`Expenses: Rs. ${totalExpenses}`);
console.log(`Balance: Rs. ${balance}`);
