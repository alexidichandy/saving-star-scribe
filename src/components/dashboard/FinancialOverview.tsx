import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Target } from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFinancialData } from "@/contexts/FinancialDataContext";

export const FinancialOverview = () => {
  const { expenses, income, budgets, goals } = useFinancialData();

  // Calculate real totals
  const totalIncome = useMemo(() => 
    income.reduce((sum, i) => sum + i.amount, 0), [income]
  );
  
  const totalExpenses = useMemo(() => 
    expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]
  );

  const netSavings = useMemo(() => 
    totalIncome - totalExpenses, [totalIncome, totalExpenses]
  );

  const activeGoals = useMemo(() => 
    goals.filter(g => !g.isCompleted), [goals]
  );

  const completedGoals = useMemo(() => 
    goals.filter(g => g.isCompleted), [goals]
  );

  // Calculate monthly data from actual transactions
  const monthlyData = useMemo(() => {
    const monthMap = new Map();
    
    // Process expenses
    expenses.forEach(e => {
      const date = new Date(e.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { month: date.toLocaleString('default', { month: 'short' }), income: 0, expenses: 0, savings: 0 });
      }
      monthMap.get(monthKey).expenses += e.amount;
    });

    // Process income
    income.forEach(i => {
      const date = new Date(i.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { month: date.toLocaleString('default', { month: 'short' }), income: 0, expenses: 0, savings: 0 });
      }
      monthMap.get(monthKey).income += i.amount;
    });

    // Calculate savings
    monthMap.forEach(data => {
      data.savings = data.income - data.expenses;
    });

    return Array.from(monthMap.values()).slice(-6); // Last 6 months
  }, [expenses, income]);

  const stats = useMemo(() => [
    {
      title: "Total Income",
      value: `$${totalIncome.toFixed(2)}`,
      change: "+0%",
      trend: "up",
      icon: ArrowUpRight,
      color: "text-success",
    },
    {
      title: "Total Expenses",
      value: `$${totalExpenses.toFixed(2)}`,
      change: "+0%",
      trend: "down",
      icon: ArrowDownRight,
      color: "text-destructive",
    },
    {
      title: "Net Savings",
      value: `$${netSavings.toFixed(2)}`,
      change: netSavings >= 0 ? "+0%" : "-0%",
      trend: netSavings >= 0 ? "up" : "down",
      icon: TrendingUp,
      color: netSavings >= 0 ? "text-success" : "text-destructive",
    },
    {
      title: "Goals Progress",
      value: `${completedGoals.length} of ${goals.length}`,
      change: `${goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%`,
      trend: "up",
      icon: Target,
      color: "text-primary",
    },
  ], [totalIncome, totalExpenses, netSavings, completedGoals.length, goals.length]);
  return (
    <div className="space-y-8">
      {/* Hero Stats Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Featured Net Savings Card */}
        <Card className="relative overflow-hidden transition-all hover:shadow-card-hover border-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-muted-foreground">Net Savings</CardTitle>
              <div className={`rounded-full p-2 ${netSavings >= 0 ? 'bg-success/10' : 'bg-destructive/10'}`}>
                <TrendingUp className={`h-5 w-5 ${netSavings >= 0 ? 'text-success' : 'text-destructive'}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">${netSavings.toFixed(2)}</div>
            <p className={`text-sm font-medium ${netSavings >= 0 ? 'text-success' : 'text-destructive'}`}>
              {netSavings >= 0 ? 'Great job saving!' : 'Review your expenses'}
            </p>
          </CardContent>
        </Card>

        {/* Featured Goals Progress Card */}
        <Card className="relative overflow-hidden transition-all hover:shadow-card-hover border-2">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-success opacity-10 rounded-full -mr-16 -mt-16" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-muted-foreground">Goals Achieved</CardTitle>
              <div className="rounded-full p-2 bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">{completedGoals.length} of {goals.length}</div>
            <div className="w-full bg-muted rounded-full h-2.5 mb-2">
              <div 
                className="bg-gradient-primary h-2.5 rounded-full transition-all" 
                style={{ width: `${goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0}%` }}
              />
            </div>
            <p className="text-sm font-medium text-primary">
              {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}% Complete
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <div className="rounded-full p-2 bg-success/10">
              <ArrowUpRight className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <div className="rounded-full p-2 bg-destructive/10">
              <ArrowDownRight className="h-4 w-4 text-destructive" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Goals</CardTitle>
            <div className="rounded-full p-2 bg-warning/10">
              <Target className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals.length}</div>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget Items</CardTitle>
            <div className="rounded-full p-2 bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{budgets.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-all hover:shadow-card-hover">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg">Income vs Expenses</CardTitle>
            <p className="text-sm text-muted-foreground">Track your financial flow over time</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  className="text-xs" 
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--success))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--destructive))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-card-hover">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg">Savings Trend</CardTitle>
            <p className="text-sm text-muted-foreground">Your savings growth over time</p>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis 
                  className="text-xs"
                  stroke="hsl(var(--muted-foreground))"
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="hsl(var(--primary))" 
                  fill="url(#savingsGradient)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
