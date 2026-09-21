"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { History, Download, BookmarkPlus, Loader2, Bell } from "lucide-react";

interface MoodTrackerPanelProps {
  selectedEmotions: string[];
  onClear: () => void;
}

interface MoodLog {
  id: string;
  emotions: string[];
  note: string;
  createdAt: Date;
}

export function MoodTrackerPanel({ selectedEmotions, onClear }: MoodTrackerPanelProps) {
  const { user, signInWithGoogle, loading: authLoading } = useAuth();
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [fetchingLogs, setFetchingLogs] = useState(false);
  const [activeTab, setActiveTab] = useState<"save" | "history" | "settings">("save");
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("20:00");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReminderEnabled(localStorage.getItem("mood_reminder_enabled") === "true");
      setReminderTime(localStorage.getItem("mood_reminder_time") || "20:00");
    }
  }, []);

  const handleReminderToggle = async (enabled: boolean) => {
    if (enabled && "Notification" in window) {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") return;
    }
    setReminderEnabled(enabled);
    localStorage.setItem("mood_reminder_enabled", enabled.toString());
  };

  const handleTimeChange = (time: string) => {
    setReminderTime(time);
    localStorage.setItem("mood_reminder_time", time);
  };

  useEffect(() => {
    if (user && activeTab === "history") {
      fetchLogs();
    }
  }, [user, activeTab]);

  const fetchLogs = async () => {
    if (!user) return;
    setFetchingLogs(true);
    try {
      const q = query(
        collection(db, "users", user.uid, "mood_logs"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const fetchedLogs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          emotions: data.emotions || [],
          note: data.note || "",
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
      setLogs(fetchedLogs);
    } catch (error) {
      console.error("Error fetching logs:", error);
    } finally {
      setFetchingLogs(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      // Trigger login prompt
      try {
        await signInWithGoogle();
      } catch (e) {
        return; // Login failed or cancelled
      }
    }

    if (selectedEmotions.length === 0) return;
    setSaving(true);
    try {
      let currentUser = user;
      if (!currentUser) {
        currentUser = await signInWithGoogle();
        if (!currentUser) throw new Error("No user found after login");
      }
      
      await addDoc(collection(db, "users", currentUser.uid, "mood_logs"), {
        userId: currentUser.uid,
        emotions: selectedEmotions,
        note,
        createdAt: Timestamp.now()
      });
      
      setNote("");
      onClear();
      if (activeTab === "history") fetchLogs();
    } catch (error) {
      console.error("Error saving log:", error);
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    if (!logs.length) return;
    const header = "Date,Time,Emotions,Note\n";
    const rows = logs.map(log => {
      const date = log.createdAt.toLocaleDateString();
      const time = log.createdAt.toLocaleTimeString();
      const ems = `"${log.emotions.join(", ")}"`;
      const txt = `"${log.note.replace(/"/g, '""')}"`;
      return `${date},${time},${ems},${txt}`;
    }).join("\n");

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "mood_history.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (authLoading) {
    return <div className="p-4 text-center text-xs text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin mx-auto mb-2"/> Loading...</div>;
  }

  return (
    <Card className="shadow-sm overflow-hidden flex flex-col">
      <div className="flex border-b bg-muted/20">
        <button
          className={`flex-1 py-2 text-xs font-medium ${activeTab === "save" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
          onClick={() => setActiveTab("save")}
        >
          Save Log
        </button>
        <button
          className={`flex-1 py-2 text-xs font-medium ${activeTab === "history" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
        <button
          className={`flex-1 py-2 text-xs font-medium ${activeTab === "settings" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground hover:bg-muted/50"}`}
          onClick={() => setActiveTab("settings")}
        >
          Settings
        </button>
      </div>

      {activeTab === "save" && (
        <>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
              <Label className="text-[10px] font-semibold text-muted-foreground uppercase">Note (Optional)</Label>
              <Input 
                placeholder="What triggered these feelings?" 
                className="h-8 text-sm" 
                value={note} 
                onChange={e => setNote(e.target.value)} 
              />
            </div>
            
            {!user && (
              <div className="text-[11px] text-muted-foreground bg-primary/5 p-2 rounded border border-primary/10">
                You will be prompted to sign in with Google to save and sync your check-ins across devices.
              </div>
            )}
          </CardContent>
          <CardFooter className="px-4 pb-4 pt-0">
            <Button
              className="w-full h-9 text-sm"
              onClick={handleSave}
              disabled={selectedEmotions.length === 0 || saving}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <BookmarkPlus className="w-3.5 h-3.5 mr-1.5" />}
              {user ? "Save Check-in" : "Sign in to Save"}
            </Button>
          </CardFooter>
        </>
      )}

      {activeTab === "history" && (
        <CardContent className="p-0 flex flex-col h-[300px]">
          {!user ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
              <History className="w-8 h-8 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Sign in to view your mood history and trends.</p>
              <Button size="sm" onClick={signInWithGoogle}>Sign in with Google</Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 border-b bg-muted/10">
                <span className="text-xs font-medium">{logs.length} Entries</span>
                <Button variant="outline" size="sm" className="h-6 text-[10px] px-2" onClick={exportCSV} disabled={!logs.length}>
                  <Download className="w-3 h-3 mr-1" /> Export CSV
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {fetchingLogs ? (
                  <div className="flex justify-center py-6"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : logs.length === 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-6">No check-ins yet.</p>
                ) : (
                  logs.map(log => (
                    <div key={log.id} className="text-sm p-3 rounded-lg border bg-card shadow-sm space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {log.createdAt.toLocaleDateString()} {log.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {log.emotions.map(e => <Badge key={e} variant="secondary" className="text-[10px] px-1.5 py-0 h-4">{e}</Badge>)}
                      </div>
                      {log.note && <p className="text-xs text-foreground/80 leading-relaxed border-l-2 border-primary/30 pl-2 mt-2">{log.note}</p>}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      )}
      {activeTab === "settings" && (
        <CardContent className="p-4 space-y-4 h-[300px]">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" /> Daily Reminders
            </h4>
            <p className="text-xs text-muted-foreground">
              Enable local browser notifications to remind you to check-in. Note: true push notifications on mobile require a backend server.
            </p>
            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
              <Label className="text-sm cursor-pointer" htmlFor="reminder-toggle">Enable Reminders</Label>
              <input 
                type="checkbox" 
                id="reminder-toggle" 
                className="w-4 h-4"
                checked={reminderEnabled}
                onChange={e => handleReminderToggle(e.target.checked)}
              />
            </div>
            {reminderEnabled && (
              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/10">
                <Label className="text-sm" htmlFor="reminder-time">Reminder Time</Label>
                <Input 
                  type="time" 
                  id="reminder-time" 
                  className="w-[120px] h-8 text-sm" 
                  value={reminderTime}
                  onChange={e => handleTimeChange(e.target.value)}
                />
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
