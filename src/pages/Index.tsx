import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { ExpenseTracker } from "@/components/dashboard/ExpenseTracker";
import { IncomeTracker } from "@/components/dashboard/IncomeTracker";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { GoalsTracker } from "@/components/dashboard/GoalsTracker";
import { FinancialChatbot } from "@/components/dashboard/FinancialChatbot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FinancialDataProvider } from "@/contexts/FinancialDataContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <FinancialDataProvider>
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        
        <main className="container mx-auto px-4 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="budget">Budget</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <FinancialOverview />
            </TabsContent>

            <TabsContent value="expenses" className="space-y-6">
              <ExpenseTracker />
            </TabsContent>

            <TabsContent value="income" className="space-y-6">
              <IncomeTracker />
            </TabsContent>

            <TabsContent value="budget" className="space-y-6">
              <BudgetProgress />
            </TabsContent>

            <TabsContent value="goals" className="space-y-6">
              <GoalsTracker />
            </TabsContent>
          </Tabs>
        </main>

        <FinancialChatbot />
      </div>
    </FinancialDataProvider>
  );
};

export default Index;
