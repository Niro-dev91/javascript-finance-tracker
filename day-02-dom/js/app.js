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
    },
    {
        id: 5,
        title: "Food",
        amount: 12000,
        type: "expense"
    }
];

// =================================
// DOM Elements
// =================================

const transactionListElement = document.getElementById("transaction-list");

const incomeElement = document.getElementById("income");

const expensesElement = document.getElementById("expenses");

const balanceElement = document.getElementById("balance");

// =================================
// Currency Formatter
// =================================

function formatCurrency(amount) {

    // return `Rs. ${amount.toLocaleString()}`;
    return `Rs. ${amount.toLocaleString()}`;
}

// =================================
// Render Transactions
// =================================

function renderTransactions() {

    transactionListElement.innerHTML = "";

    transactions.forEach(transaction => {

        const sign = transaction.type === "income" ? "+" : "-";

        transactionListElement.innerHTML += `
    <div class ="transaction ${transaction.type}">
<span>
${transaction.title} 
</span>
<span>
${sign}
${formatCurrency(transaction.amount)}
</span>
</div>
    `;
    });
}

// =================================
// Calculate Summary
// =================================

function updateSummary() {

    const totalIncome = transactions.filter(
        transaction => transaction.type === "income"
    ).reduce(
        (total, transaction) => total + transaction.amount, 0
    );

    const totalExpenses = transactions.filter(
        transaction => transaction.type === "expense"
    ).reduce(
        (total, transaction) => total + transaction.amount, 0
    );

    const balance = totalIncome - totalExpenses;

    incomeElement.textContent = formatCurrency(totalIncome);

    expensesElement.textContent = formatCurrency(totalExpenses);

    balanceElement.textContent = formatCurrency(balance);

}
// =================================
// Start Application
// =================================

renderTransactions();
updateSummary();

