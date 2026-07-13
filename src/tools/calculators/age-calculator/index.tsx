"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculateAge = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();
    
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months -= 1;
      const previousMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += previousMonth.getDate();
    }
    
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    setAge({ years, months, days });
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input 
              id="dob" 
              type="date" 
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <Button className="w-full" onClick={calculateAge}>
            Calculate Age
          </Button>

          {age && (
            <div className="mt-6 p-6 bg-muted rounded-xl text-center space-y-2">
              <p className="text-sm text-muted-foreground">Your age is</p>
              <div className="text-4xl font-bold font-heading text-primary">
                {age.years} <span className="text-xl text-foreground font-normal">years</span>
              </div>
              <p className="text-lg font-medium">
                {age.months} months and {age.days} days
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
