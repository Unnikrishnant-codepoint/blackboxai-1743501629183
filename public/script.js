// Global variables
let expenseHeads = [];
let incomeHeads = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load dashboard data
    loadDashboardData();
    
    // Load heads data for forms
    loadExpenseHeads();
    loadIncomeHeads();
});

// Load dashboard summary data
async function loadDashboardData() {
    try {
        // Get current month's start and end dates
        const now = new Date();
        const startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
        const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

        // Fetch report data
        const response = await fetch('/api/reports', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startDate, endDate })
        });
        
        const data = await response.json();
        
        // Update dashboard cards
        document.getElementById('income-summary').innerHTML = `
            <p class="text-2xl font-bold">$${data.totals.incomeTotal.toFixed(2)}</p>
            <p class="text-sm">This month</p>
        `;
        
        document.getElementById('expense-summary').innerHTML = `
            <p class="text-2xl font-bold">$${data.totals.expenseTotal.toFixed(2)}</p>
            <p class="text-sm">This month</p>
        `;
        
        const balanceClass = data.totals.balance >= 0 ? 'text-green-600' : 'text-red-600';
        document.getElementById('balance-summary').innerHTML = `
            <p class="text-2xl font-bold ${balanceClass}">$${data.totals.balance.toFixed(2)}</p>
            <p class="text-sm">This month</p>
        `;
        
        // Load recent transactions
        loadRecentTransactions();
        
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Failed to load dashboard data');
    }
}

// Load recent transactions
async function loadRecentTransactions() {
    try {
        // Fetch last 5 expenses
        const expensesResponse = await fetch('/api/expenses/entries?limit=5');
        const expenses = await expensesResponse.json();
        
        // Fetch last 5 incomes
        const incomesResponse = await fetch('/api/incomes/entries?limit=5');
        const incomes = await incomesResponse.json();
        
        // Combine and sort by date
        const transactions = [...expenses.map(e => ({...e, type: 'expense'})), 
                             ...incomes.map(i => ({...i, type: 'income'}))]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        // Display transactions
        const transactionsHTML = transactions.map(t => `
            <div class="flex justify-between items-center py-2 border-b">
                <div>
                    <span class="font-medium">${t.type === 'expense' ? t.head_name : t.name}</span>
                    <p class="text-sm text-gray-500">${new Date(t.date).toLocaleDateString()}</p>
                </div>
                <span class="${t.type === 'expense' ? 'text-red-600' : 'text-green-600'} font-bold">
                    ${t.type === 'expense' ? '-' : '+'}$${t.amount.toFixed(2)}
                </span>
            </div>
        `).join('');
        
        document.getElementById('recent-transactions').innerHTML = transactionsHTML || 
            '<p class="text-gray-500">No recent transactions found</p>';
            
    } catch (error) {
        console.error('Error loading transactions:', error);
        document.getElementById('recent-transactions').innerHTML = 
            '<p class="text-red-500">Failed to load transactions</p>';
    }
}

// Load expense heads for forms
async function loadExpenseHeads() {
    try {
        const response = await fetch('/api/expenses/heads');
        expenseHeads = await response.json();
    } catch (error) {
        console.error('Error loading expense heads:', error);
    }
}

// Load income heads for forms
async function loadIncomeHeads() {
    try {
        const response = await fetch('/api/incomes/heads');
        incomeHeads = await response.json();
    } catch (error) {
        console.error('Error loading income heads:', error);
    }
}

// Utility function for API error handling
function handleApiError(error) {
    console.error('API Error:', error);
    alert(error.message || 'An error occurred');
}