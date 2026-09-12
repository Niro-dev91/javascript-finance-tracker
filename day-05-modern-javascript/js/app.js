// =================================
// Data
// =================================

let transactions = [
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
    },
    {
        id: 5,
        title: "Pizza",
        amount: 12000,
        type: "expense",
        category: "Food"
    }
];

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
        category
    };
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
            category = "Uncategorized"
        } = transaction;

        const config =
            transactionTypeConfig.get(
                type
            );

        const sign = config?.sign ?? "";

        transactionListElement.innerHTML += `
    <div class ="transaction ${type}">
    <div>
<strong>
${title} 
</strong>
<small>
${category}
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
    categoryInput.value = transaction.category;

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


// =================================
// Start Application
// =================================

renderTransactions();
updateSummary();

