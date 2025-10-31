import { useState, useEffect } from "react";
import { FinancialOverview } from "@/components/dashboard/FinancialOverview";
import { ExpenseTracker } from "@/components/dashboard/ExpenseTracker";
import { IncomeTracker } from "@/components/dashboard/IncomeTracker";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { GoalsTracker } from "@/components/dashboard/GoalsTracker";
import { FinancialChatbot } from "@/components/dashboard/FinancialChatbot";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "overview";
      setActiveSection(hash);
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
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
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-xl font-semibold capitalize">{activeSection}</h1>
            </div>
          </header>
          
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </main>

        <FinancialChatbot />
      </div>
    </SidebarProvider>
  );
};

export default Index;
