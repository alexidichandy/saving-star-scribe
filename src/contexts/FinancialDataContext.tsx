import { createContext, useContext, useState, ReactNode } from "react";
import type { Expense, Income, Budget, Goal } from "@/types/financial";

interface FinancialData {
  expenses: Expense[];
  income: Income[];
  budgets: Budget[];
  goals: Goal[];
  setExpenses: (expenses: Expense[]) => void;
  setIncome: (income: Income[]) => void;
  setBudgets: (budgets: Budget[]) => void;
  setGoals: (goals: Goal[]) => void;
}

const FinancialDataContext = createContext<FinancialData | undefined>(undefined);

export const useFinancialData = () => {
  const context = useContext(FinancialDataContext);
  if (!context) {
    throw new Error("useFinancialData must be used within FinancialDataProvider");
  }
  return context;
};

const EXPENSE_CATEGORIES = ["Food", "Transport", "Entertainment", "Shopping", "Bills", "Healthcare", "Other"];
const initialExpenses: Expense[] = [
  { id: "1", category: "Food", amount: 450, description: "Groceries & Dining", date: "2025-01-15" },
  { id: "2", category: "Transport", amount: 200, description: "Gas & Uber", date: "2025-01-10" },
  { id: "3", category: "Entertainment", amount: 150, description: "Movies & Games", date: "2025-01-05" },
  { id: "4", category: "Bills", amount: 1200, description: "Rent & Utilities", date: "2025-01-01" },
  { id: "5", category: "Food", amount: 480, description: "Groceries & Dining", date: "2024-12-15" },
  { id: "6", category: "Shopping", amount: 320, description: "Clothes & Electronics", date: "2024-12-20" },
  { id: "7", category: "Bills", amount: 1200, description: "Rent & Utilities", date: "2024-12-01" },
];

const initialIncome: Income[] = [
  { id: "1", source: "Salary", amount: 4500, description: "Monthly Salary", date: "2025-01-01" },
  { id: "2", source: "Freelance", amount: 300, description: "Web Design Project", date: "2025-01-15" },
  { id: "3", source: "Salary", amount: 4500, description: "Monthly Salary", date: "2024-12-01" },
];

const initialBudgets: Budget[] = [
  { id: "1", category: "Food", limit: 500, spent: 450 },
  { id: "2", category: "Transport", limit: 300, spent: 200 },
  { id: "3", category: "Entertainment", limit: 200, spent: 150 },
  { id: "4", category: "Shopping", limit: 400, spent: 320 },
  { id: "5", category: "Bills", limit: 1300, spent: 1200 },
];

const initialGoals: Goal[] = [
  { id: "1", title: "Emergency Fund", targetAmount: 5000, currentAmount: 2700, deadline: "2025-06-01", isCompleted: false },
  { id: "2", title: "Vacation Fund", targetAmount: 2000, currentAmount: 800, deadline: "2025-08-01", isCompleted: false },
  { id: "3", title: "New Laptop", targetAmount: 1500, currentAmount: 1500, deadline: "2025-02-01", isCompleted: true },
  { id: "4", title: "Investment Portfolio", targetAmount: 10000, currentAmount: 4200, deadline: "2025-12-31", isCompleted: false },
  { id: "5", title: "Car Down Payment", targetAmount: 3000, currentAmount: 3000, deadline: "2025-01-15", isCompleted: true },
];

export const FinancialDataProvider = ({ children }: { children: ReactNode }) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [income, setIncome] = useState<Income[]>(initialIncome);
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);

  return (
    <FinancialDataContext.Provider
      value={{
        expenses,
        income,
        budgets,
        goals,
        setExpenses,
        setIncome,
        setBudgets,
        setGoals,
      }}
    >
      {children}
    </FinancialDataContext.Provider>
  );
};
