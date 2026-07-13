"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export function JsonFormatter() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(e.message);
      setSuccess(false);
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(e.message);
      setSuccess(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setError("");
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Textarea
            placeholder="Paste your JSON here..."
            className="min-h-[300px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleFormat}>Format / Beautify</Button>
            <Button variant="secondary" onClick={handleMinify}>Minify</Button>
            <Button variant="outline" onClick={handleClear}>Clear</Button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-md text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Invalid JSON: {error}</span>
            </div>
          )}

          {success && !error && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md text-sm dark:bg-green-500/10 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>JSON processed successfully!</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
