import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Edit2 } from "lucide-react";
import { useFinancialData } from "@/contexts/FinancialDataContext";
import type { Budget } from "@/types/financial";

export const BudgetProgress = () => {
  const { budgets, setBudgets } = useFinancialData();
  const [newBudget, setNewBudget] = useState({
    category: "",
    limit: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState("");

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.limit) {
      const budget: Budget = {
        id: Date.now().toString(),
        category: newBudget.category,
        limit: parseFloat(newBudget.limit),
        spent: 0,
      };
      setBudgets([...budgets, budget]);
      setNewBudget({ category: "", limit: "" });
    }
  };

  const handleUpdateLimit = (id: string) => {
    if (editLimit) {
      setBudgets(budgets.map(b => 
        b.id === id ? { ...b, limit: parseFloat(editLimit) } : b
      ));
      setEditingId(null);
      setEditLimit("");
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return "bg-destructive";
    if (percentage >= 70) return "bg-warning";
    return "bg-success";
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = (totalSpent / totalBudget) * 100;

  return (
    <div className="space-y-6">
      <Card className="transition-all hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Add New Budget Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="budget-category">Category</Label>
              <Input
                id="budget-category"
                placeholder="e.g., Healthcare"
                value={newBudget.category}
                onChange={(e) => setNewBudget({ ...newBudget, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget-limit">Monthly Limit ($)</Label>
              <Input
                id="budget-limit"
                type="number"
                placeholder="0.00"
                value={newBudget.limit}
                onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddBudget} className="w-full bg-gradient-primary">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Budget
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Overall Budget Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Total: ${totalSpent.toFixed(2)} / ${totalBudget.toFixed(2)}</span>
              <span className="font-semibold">{overallPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={overallPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {budgets.map(budget => {
          const percentage = (budget.spent / budget.limit) * 100;
          const isEditing = editingId === budget.id;

          return (
            <Card key={budget.id} className="transition-all hover:shadow-card-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{budget.category}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingId(budget.id);
                      setEditLimit(budget.limit.toString());
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={editLimit}
                      onChange={(e) => setEditLimit(e.target.value)}
                      placeholder="New limit"
                    />
                    <Button onClick={() => handleUpdateLimit(budget.id)}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </span>
                      <span className={`font-semibold ${percentage >= 90 ? 'text-destructive' : percentage >= 70 ? 'text-warning' : 'text-success'}`}>
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className={`h-2 ${getProgressColor(percentage)}`}
                    />
                    <p className="text-xs text-muted-foreground">
                      ${(budget.limit - budget.spent).toFixed(2)} remaining
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
