import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { ExpenseTracker } from "@/components/dashboard/ExpenseTracker";
import { IncomeTracker } from "@/components/dashboard/IncomeTracker";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { GoalsTracker } from "@/components/dashboard/GoalsTracker";
import { FinancialChatbot } from "@/components/dashboard/FinancialChatbot";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <FinancialOverview />;
      case "expenses":
        return <ExpenseTracker />;
      case "income":
        return <IncomeTracker />;
      case "budget":
        return <BudgetProgress />;
      case "goals":
        return <GoalsTracker />;
      default:
        return <FinancialOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          
          <div className="border-b border-border bg-card px-4 py-2 flex items-center gap-2">
            <SidebarTrigger className="text-foreground" />
            <h2 className="text-lg font-semibold text-foreground capitalize">
              {activeTab}
            </h2>
          </div>

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>

      <FinancialChatbot />
    </SidebarProvider>
  );
};

export default Index;
