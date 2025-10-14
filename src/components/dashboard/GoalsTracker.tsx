import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Check, Target } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  isCompleted: boolean;
}

const initialGoals: Goal[] = [
  { id: "1", title: "Emergency Fund", targetAmount: 5000, currentAmount: 2700, deadline: "2025-06-01", isCompleted: false },
  { id: "2", title: "Vacation Fund", targetAmount: 2000, currentAmount: 800, deadline: "2025-08-01", isCompleted: false },
  { id: "3", title: "New Laptop", targetAmount: 1500, currentAmount: 1500, deadline: "2025-02-01", isCompleted: true },
  { id: "4", title: "Investment Portfolio", targetAmount: 10000, currentAmount: 4200, deadline: "2025-12-31", isCompleted: false },
  { id: "5", title: "Car Down Payment", targetAmount: 3000, currentAmount: 3000, deadline: "2025-01-15", isCompleted: true },
];

export const GoalsTracker = () => {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
  });

  const handleAddGoal = () => {
    if (newGoal.title && newGoal.targetAmount && newGoal.currentAmount && newGoal.deadline) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        targetAmount: parseFloat(newGoal.targetAmount),
        currentAmount: parseFloat(newGoal.currentAmount),
        deadline: newGoal.deadline,
        isCompleted: false,
      };
      setGoals([goal, ...goals]);
      setNewGoal({ title: "", targetAmount: "", currentAmount: "", deadline: "" });
    }
  };

  const handleAddContribution = (id: string, amount: number) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const newAmount = g.currentAmount + amount;
        return {
          ...g,
          currentAmount: newAmount,
          isCompleted: newAmount >= g.targetAmount,
        };
      }
      return g;
    }));
  };

  const activeGoals = goals.filter(g => !g.isCompleted);
  const completedGoals = goals.filter(g => g.isCompleted);

  return (
    <div className="space-y-6">
      <Card className="transition-all hover:shadow-card-hover">
        <CardHeader>
          <CardTitle>Add New Financial Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal Title</Label>
              <Input
                id="goal-title"
                placeholder="e.g., New Car"
                value={newGoal.title}
                onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-amount">Target ($)</Label>
              <Input
                id="target-amount"
                type="number"
                placeholder="0.00"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current-amount">Current ($)</Label>
              <Input
                id="current-amount"
                type="number"
                placeholder="0.00"
                value={newGoal.currentAmount}
                onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddGoal} className="w-full bg-gradient-primary">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Active Goals ({activeGoals.length})
          </h3>
          {activeGoals.map(goal => {
            const percentage = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <Card key={goal.id} className="transition-all hover:shadow-card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </span>
                    <span className="font-semibold text-primary">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">
                      Deadline: {new Date(goal.deadline).toLocaleDateString()}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddContribution(goal.id, 100)}
                    >
                      Add $100
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Check className="h-5 w-5 text-success" />
            Completed Goals ({completedGoals.length})
          </h3>
          {completedGoals.map(goal => (
            <Card key={goal.id} className="border-success bg-success/5 transition-all hover:shadow-card-hover">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Check className="h-5 w-5 text-success" />
                  {goal.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                    </span>
                    <span className="font-semibold text-success">100%</span>
                  </div>
                  <Progress value={100} className="h-2 bg-success" />
                  <p className="text-xs text-muted-foreground">
                    Completed! Target deadline was {new Date(goal.deadline).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
