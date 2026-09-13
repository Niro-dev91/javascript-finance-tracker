// =================================
// Data
// =================================

const STORAGE_KEY = "financeTrackerTransactions";

const defaultTransactions = [
    {
        id: 1,
        title: "Salary",
        amount: 250000,
        type: "income",
        category: "Work"
    },
    {
        id: 2,
        title: "Rent",
        amount: 50000,
        type: "expense",
        category: "Housing"
    },
    {
        id: 3,
        title: "Internet",
        amount: 5000,
        type: "expense",
        category: "Utilities"
    },
    {
        id: 4,
        title: "Freelance",
        amount: 40000,
        type: "income",
        category: "Work"
    }
];

//load transactions from local storage

function loadTransactions() {

    const savedTransactions = localStorage.getItem(STORAGE_KEY);

    if (!savedTransactions) {

        return [
            ...defaultTransactions
        ];
    }

    try {

        const parsedTransactions = JSON.parse(savedTransactions);

        if (
            !Array.isArray(parsedTransactions)
        ) {
            return [
                ...defaultTransactions
            ];
        }

        return parsedTransactions;

    } catch (error) {

        console.error(
            "Failed to parse saved transactions:",
            error
        );

        return [
            ...defaultTransactions
        ];
    }
}

let transactions = loadTransactions();

let editingTransactionId = null;

const transactionTypeConfig =
    new Map([
        [
            "income",
            {
                label: "Income",
                sign: "+"
            }
        ],
        [
            "expense",
            {
                label: "Expense",
                sign: "-"
            }
        ]
    ]);


// =================================
// DOM Elements
// =================================

const transactionListElement = document.getElementById("transaction-list");

const incomeElement = document.getElementById("income");

const expensesElement = document.getElementById("expenses");

const balanceElement = document.getElementById("balance");

const transactionForm = document.getElementById("transaction-form");

const titleInput = document.getElementById("title");

const amountInput = document.getElementById("amount");

const typeInput = document.getElementById("type");

const errorMessage = document.getElementById("error-message");

const submitButton = document.getElementById("submit-button");

const cancelButton = document.getElementById("cancel-button");

const categoryInput = document.getElementById("category");

const resetButton = document.getElementById("reset-button");

// =================================
// Currency Formatter
// =================================

function formatCurrency(amount = 0) {

    return `Rs. ${amount.toLocaleString()}`;
}

function createTransaction(
    title,
    amount,
    type = "expense",
    category = "Uncategorized"
) {

    return {
        id: Date.now(),
        title,
        amount,
        type,
        category,
        createdAt: new Date().toISOString()
    };
}

// save transactions to local storage

function saveTransactions() {

    localStorage.setItem(
        STORAGE_KEY, JSON.stringify(transactions)
    );
}

// =================================
// Render Transactions
// =================================

function renderTransactions() {

    transactionListElement.innerHTML = "";

    transactions.forEach(transaction => {

        const {
            id,
            title,
            amount,
            type,
            category = "Uncategorized",
            createdAt
        } = transaction;

        const config =
            transactionTypeConfig.get(
                type
            );

        const sign = config?.sign ?? "";

        const displayDate = createdAt
            ? new Date(
                createdAt
            ).toLocaleDateString()
            : "";

        transactionListElement.innerHTML += `
    <div class ="transaction ${type}">
    <div>
<strong>
${title} 
</strong>
<small>
${category}
</small>
<small>
${displayDate}
</small>
<span>
${sign}
${formatCurrency(amount)}
</span>
</div>
<div>
<button
  class ="edit-btn"
  data-id ="${id}">
  Edit
  </button>
  <button
  class ="delete-btn"
  data-id ="${id}">
  Delete
  </button>
</div>
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
// Form Submit
// =================================

function handleFormSubmit(event) {

    event.preventDefault();

    // Get input values

    const title = titleInput.value.trim();

    const amount = Number(amountInput.value);

    const type = typeInput.value;

    const category = categoryInput.value.trim() || "Uncategorized";

    // Validation

    if (title === "") {
        errorMessage.textContent = "Title is required.";
        return;
    }

    if (Number.isNaN(amount) || amount <= 0) {
        errorMessage.textContent = "Enter a valid amount.";
        return;
    }

    if (type === "") {
        errorMessage.textContent = "Select a transaction type.";
        return;
    }

    //CREATE

    if (editingTransactionId === null) {

        // Create transaction object

        const newTransaction =
            createTransaction(
                title,
                amount,
                type,
                category
            );

        // Add object into array

        transactions = [
            ...transactions,
            newTransaction
        ];

    }

    //UPDATE

    else {

        transactions = transactions.map(transaction => {

            if (transaction.id === editingTransactionId) {
                return {
                    ...transaction,
                    title,
                    amount,
                    type,
                    category
                };
            }
            return transaction;
        });
    }

    saveTransactions();

    // Update screen

    renderTransactions();

    updateSummary();

    // Reset error

    errorMessage.textContent = "";

    // Reset form

    transactionForm.reset();

    editingTransactionId = null;

    submitButton.textContent = "Add Transaction";

    cancelButton.hidden = true;

}

// =================================
// Edit
// =================================

function editTransaction(id) {

    const transaction = transactions.find(
        transaction => transaction.id === id
    );

    if (!transaction) {
        return;
    }

    titleInput.value = transaction.title;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    categoryInput.value = transaction.category ?? "Uncategorized";

    editingTransactionId = transaction.id;

    submitButton.textContent = "Update Transaction";

    cancelButton.hidden = false;
}

// =================================
// Delete
// =================================

function deleteTransaction(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmed) {
        return;
    }


    transactions =
        transactions.filter(
            transaction =>
                transaction.id !== id
        );


    saveTransactions();

    renderTransactions();

    updateSummary();


    if (
        editingTransactionId === id
    ) {

        cancelEdit();
    }
}

// =================================
// Cancel Edit
// =================================

function cancelEdit() {

    editingTransactionId = null;

    transactionForm.reset();

    errorMessage.textContent = "";

    submitButton.textContent =
        "Add Transaction";

    cancelButton.hidden =
        true;
}

// reset with default Transactions

function resetTransactions() {

    const confirmed = confirm(
        "Reset all transactions?"
    );

    if (!confirmed) {
        return;
    }

    localStorage.removeItem(STORAGE_KEY);

    transactions = [
        ...defaultTransactions
    ];

    cancelEdit();

    renderTransactions();
    updateSummary();
}

// =================================
// Event Delegation
// =================================

transactionListElement.addEventListener(
    "click",
    event => {

        const id =
            Number(
                event.target.dataset.id
            );


        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {

            editTransaction(id);
        }


        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {

            deleteTransaction(id);
        }

    }
);

// =================================
// Form Events
// =================================

transactionForm.addEventListener(
    "submit",
    handleFormSubmit
);


cancelButton.addEventListener(
    "click",
    cancelEdit
);

resetButton.addEventListener(
    "click",
    resetTransactions
);

// =================================
// Start Application
// =================================

renderTransactions();
updateSummary();

