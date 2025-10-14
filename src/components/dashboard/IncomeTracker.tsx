import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Income {
  id: string;
  source: string;
  amount: number;
  description: string;
  date: string;
}

const SOURCES = ["Salary", "Freelance", "Investment", "Business", "Other"];

const initialIncome: Income[] = [
  { id: "1", source: "Salary", amount: 4500, description: "Monthly Salary", date: "2025-01-01" },
  { id: "2", source: "Freelance", amount: 300, description: "Web Design Project", date: "2025-01-15" },
  { id: "3", source: "Salary", amount: 4500, description: "Monthly Salary", date: "2024-12-01" },
];

export const IncomeTracker = () => {
  const [income, setIncome] = useState<Income[]>(initialIncome);
  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    description: "",
  });

  const handleAddIncome = () => {
    if (newIncome.source && newIncome.amount && newIncome.description) {
      const incomeEntry: Income = {
        id: Date.now().toString(),
        source: newIncome.source,
        amount: parseFloat(newIncome.amount),
        description: newIncome.description,
        date: new Date().toISOString().split('T')[0],
      };
      setIncome([incomeEntry, ...income]);
      setNewIncome({ source: "", amount: "", description: "" });
    }
  };

  const handleDelete = (id: string) => {
    setIncome(income.filter(inc => inc.id !== id));
  };

  const sourceTotals = SOURCES.map(source => ({
    source,
    amount: income.filter(i => i.source === source).reduce((sum, i) => sum + i.amount, 0),
  })).filter(s => s.amount > 0);

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);

  return (
    <div className="space-y-6">
      <Card className="transition-all hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Add New Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select value={newIncome.source} onValueChange={(value) => setNewIncome({ ...newIncome, source: value })}>
                <SelectTrigger id="source">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {SOURCES.map(source => (
                    <SelectItem key={source} value={source}>{source}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="income-amount">Amount ($)</Label>
              <Input
                id="income-amount"
                type="number"
                placeholder="0.00"
                value={newIncome.amount}
                onChange={(e) => setNewIncome({ ...newIncome, amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="income-description">Description</Label>
              <Input
                id="income-description"
                placeholder="Enter description"
                value={newIncome.description}
                onChange={(e) => setNewIncome({ ...newIncome, description: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddIncome} className="w-full bg-gradient-success">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Income
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="transition-all hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Income by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceTotals}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="source" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Bar dataKey="amount" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-card-hover">
          <CardHeader>
            <CardTitle>Income History (Total: ${totalIncome.toFixed(2)})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {income.map(inc => (
                <div key={inc.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted transition-colors">
                  <div className="flex-1">
                    <p className="font-medium">{inc.description}</p>
                    <p className="text-sm text-muted-foreground">{inc.source} • {inc.date}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-success">${inc.amount.toFixed(2)}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(inc.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
