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
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="transition-all hover:shadow-card-hover">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.color}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-all hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="income" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--success))" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--destructive))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Savings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="savings" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
