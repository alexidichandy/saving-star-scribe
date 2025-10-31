import { Wallet } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <header className="border-b border-border bg-card shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-primary p-2">
              <Wallet className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Finalyser</h1>
              <p className="text-sm text-muted-foreground">Your Personal Financial Assistant</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Welcome back!</p>
            <p className="font-semibold text-foreground">Day 60 of your journey</p>
          </div>
        </div>
      </div>
    </header>
  );
};
