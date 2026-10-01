"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, Plus, Trash2, CalendarDays, CheckCircle2, Play, Bell, Settings2, 
  RotateCcw, Ban, LayoutDashboard, History, Zap, ShieldAlert, Download, Upload, LineChart, Moon, Sun, Edit3, PlayCircle
} from "lucide-react";
import { PRESETS, DAYS_OF_WEEK, CATEGORIES, formatCountdown, getNextOccurrences, initAudio, playNotificationSound, formatInterval } from "./utils";
import { useTempoRoutines } from "./hooks";
import { Routine } from "./types";

export function TempoRoutine() {
  const {
    routines,
    isClient,
    currentTime,
    permission,
    requestPermission,
    addRoutine,
    toggleRoutine,
    deleteRoutine,
    editRoutine,
    handleAction,
    nextOccurrences,
    activeRoutine,
    allHistory,
    stats,
    isGloballyPaused,
    globalPauseUntil,
    pauseAll,
    resumeAll,
    exportData,
    importData,
    settings,
    setSettings,
    dismissOverdue,
  } = useTempoRoutines();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'routines' | 'history' | 'settings'>('dashboard');
  
  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Other");
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("20:00");
  const [intervalMinutes, setIntervalMinutes] = useState(120);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [routineSettings, setRoutineSettings] = useState<Partial<Routine['settings']>>({});
  
  const intervalHours = Math.floor(intervalMinutes / 60);
  const intervalMins = Math.floor(intervalMinutes % 60);
  const intervalSecs = Math.round((intervalMinutes * 60) % 60);
  const updateInterval = (h: number, m: number, s: number) => setIntervalMinutes(h * 60 + m + s / 60);

  const ringDuration = routineSettings?.alarmDuration !== undefined ? routineSettings.alarmDuration : (settings?.alarmDuration || 5);
  const updateRing = (h: number, m: number, s: number) => setRoutineSettings({...routineSettings, alarmDuration: h * 3600 + m * 60 + s});

  const snoozeDuration = routineSettings?.snoozeDuration !== undefined ? routineSettings.snoozeDuration : (settings?.snoozeDuration || 10);
  const updateSnooze = (h: number, m: number, s: number) => setRoutineSettings({...routineSettings, snoozeDuration: h * 60 + m + s / 60});
  
  const [actionDialog, setActionDialog] = useState<{
    isOpen: boolean;
    action: 'done' | 'snooze' | 'skip';
    routineId?: string;
    time?: Date;
  }>({ isOpen: false, action: 'done' });
  const [actionNote, setActionNote] = useState("");

  // Theme effect
  useEffect(() => {
    if (isClient && settings) {
      const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
      if (isDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }
  }, [settings?.theme, isClient]);

  const toggleDay = (d: number) => {
    if (days.includes(d)) {
      setDays(days.filter(day => day !== d));
    } else {
      setDays([...days, d].sort());
    }
  };

  const handleAddRoutine = () => {
    if (!name.trim()) return;
    
    if (editingId) {
      editRoutine(editingId, { name, category, startTime, endTime, intervalMinutes, days, settings: routineSettings });
    } else {
      const newRoutine: Routine = {
        id: Math.random().toString(36).substring(7),
        name,
        category,
        startTime,
        endTime,
        intervalMinutes,
        days,
        enabled: true,
        events: [],
        settings: routineSettings
      };
      addRoutine(newRoutine);
    }
    
    setShowForm(false);
    setEditingId(null);
    setName("");
    setCategory("Other");
    setRoutineSettings({});
    setActiveTab('routines');
  };

  const handleTabChange = (tab: 'dashboard' | 'routines' | 'history' | 'settings') => {
    initAudio();
    setActiveTab(tab);
  };

  const handleApplyPreset = (preset: typeof PRESETS[0]) => {
    initAudio();
    setName(preset.name);
    setCategory(preset.category);
    setStartTime(preset.start);
    setEndTime(preset.end);
    setIntervalMinutes(preset.interval);
    setDays([1, 2, 3, 4, 5]);
  };

  const handleAddBtnClick = () => {
    initAudio();
    if (showForm) {
      setShowForm(false);
      setEditingId(null);
      setName("");
    } else {
      setShowForm(true);
    }
  };
  
  const handleTestSound = () => {
    initAudio();
    playNotificationSound({ ...settings, ...routineSettings });
  };
  
  const handleEditBtnClick = (r: Routine) => {
    initAudio();
    setEditingId(r.id);
    setName(r.name);
    setCategory(r.category || 'Other');
    setStartTime(r.startTime);
    setEndTime(r.endTime);
    setIntervalMinutes(r.intervalMinutes);
    setDays(r.days);
    setRoutineSettings(r.settings || {});
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleActionClick = (id: string, action: 'done' | 'snooze' | 'skip', time: Date) => {
    setActionDialog({ isOpen: true, action, routineId: id, time });
  };

  if (!isClient) return <div className="min-h-[400px] flex items-center justify-center text-primary"><RotateCcw className="w-8 h-8 animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-12 px-2 md:px-0">
      
      {/* Header Section */}
      <div className="text-center space-y-2 mb-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-2">
          <Clock className="w-6 h-6 md:w-8 md:h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Tempo</h1>
        <p className="text-muted-foreground text-base md:text-lg">Your smart recurring routine engine</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap sm:flex-nowrap justify-center bg-muted/30 p-1 md:p-1.5 rounded-2xl md:rounded-full w-full sm:w-max mx-auto border border-border gap-1 md:gap-0">
        <Button 
          variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
          className="rounded-xl md:rounded-full px-3 md:px-6 transition-all text-xs md:text-sm flex-1 sm:flex-none" 
          onClick={() => handleTabChange('dashboard')}
        >
          <LayoutDashboard className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Dashboard
        </Button>
        <Button 
          variant={activeTab === 'routines' ? 'default' : 'ghost'} 
          className="rounded-xl md:rounded-full px-3 md:px-6 transition-all text-xs md:text-sm flex-1 sm:flex-none" 
          onClick={() => handleTabChange('routines')}
        >
          <Settings2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Routines
        </Button>
        <Button 
          variant={activeTab === 'history' ? 'default' : 'ghost'} 
          className="rounded-xl md:rounded-full px-3 md:px-6 transition-all text-xs md:text-sm flex-1 sm:flex-none" 
          onClick={() => handleTabChange('history')}
        >
          <History className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> History
        </Button>
        <Button 
          variant={activeTab === 'settings' ? 'default' : 'ghost'} 
          className="rounded-xl md:rounded-full px-3 md:px-6 transition-all text-xs md:text-sm flex-1 sm:flex-none" 
          onClick={() => handleTabChange('settings')}
        >
          <Settings2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" /> Settings
        </Button>
      </div>

      {permission !== 'granted' && (
        <Card className="bg-yellow-500/10 border-yellow-500/50 mb-6">
          <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-yellow-700 dark:text-yellow-500">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <p className="text-sm font-medium">Please enable notifications to run routines in the background.</p>
            </div>
            <Button size="sm" variant="outline" className="border-yellow-500/50 hover:bg-yellow-500/20" onClick={requestPermission}>
              Enable Notifications
            </Button>
          </CardContent>
        </Card>
      )}

      <AnimatePresence mode="wait">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <motion.section 
            key="dashboard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {isGloballyPaused && (
              <Card className="bg-primary/10 border-none shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Moon className="w-5 h-5 shrink-0" />
                    <p className="text-sm font-medium">All routines are paused until {new Date(globalPauseUntil!).toLocaleTimeString([], { hour12: settings.timeFormat === '12h', hour: '2-digit', minute: '2-digit' })}.</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-primary hover:bg-primary hover:text-primary-foreground transition-colors" onClick={resumeAll}>
                    <Sun className="w-4 h-4 mr-2" /> Resume Now
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="border-none shadow-xl bg-gradient-to-br from-primary/10 via-background to-background overflow-hidden relative">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                  <Bell className="w-6 h-6 text-primary" />
                  Up Next
                </CardTitle>
                <div className="flex gap-2">
                  {nextOccurrences.some(o => o.time.getTime() < currentTime.getTime()) && (
                    <Button variant="destructive" size="sm" onClick={dismissOverdue} className="shadow-sm">
                      Dismiss Overdue
                    </Button>
                  )}
                  {!isGloballyPaused && (
                    <Button variant="ghost" size="sm" onClick={() => pauseAll(1)} className="text-muted-foreground hover:text-primary" title="Pause notifications for 1 hour">
                      <Moon className="w-4 h-4 mr-2" /> Pause 1h
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {activeRoutine ? (
                    <motion.div 
                      key="active"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-primary text-primary-foreground p-6 sm:p-8 rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
                    >
                      {/* Subtly pulsating background for active alarm */}
                      <motion.div 
                        animate={{ opacity: [0.1, 0.25, 0.1] }} 
                        transition={{ repeat: Infinity, duration: 2 }} 
                        className="absolute inset-0 bg-white pointer-events-none" 
                      />
                      
                      <div className="relative z-10 text-center md:text-left space-y-2 w-full md:w-auto flex-1">
                        {activeRoutine.snoozed && <Badge variant="secondary" className="mb-2 text-primary font-bold">Snoozed</Badge>}
                        <h3 className="text-3xl md:text-4xl font-black break-words leading-tight">{activeRoutine.routineName}</h3>
                        <p className="opacity-90 flex items-center justify-center md:justify-start gap-2 text-sm md:text-base font-medium">
                          <Clock className="w-4 h-4" />
                          Time for action! ({activeRoutine.time.toLocaleTimeString([], { hour12: settings.timeFormat === '12h', hour: '2-digit', minute: '2-digit' })})
                        </p>
                      </div>
                      <div className="relative z-10 flex flex-col justify-center gap-3 w-full md:w-auto md:min-w-[320px]">
                        <Input 
                          placeholder="Add a note (optional)" 
                          value={actionNote} 
                          onChange={(e) => setActionNote(e.target.value)}
                          className="w-full bg-white/20 border-white/30 text-white placeholder:text-white/70 h-11 rounded-xl backdrop-blur-md focus-visible:ring-white/50 focus-visible:border-white/50"
                        />
                        <div className="flex flex-col sm:flex-row gap-2 w-full">
                          <Button size="lg" variant="secondary" className="flex-1 font-bold text-base text-primary hover:text-primary hover:bg-white/90 shadow-md h-12" onClick={() => { handleAction(activeRoutine.routineId, 'done', activeRoutine.time, actionNote.trim() || undefined); setActionNote(""); }}>
                            <CheckCircle2 className="w-5 h-5 mr-2" /> Done
                          </Button>
                          <Button size="lg" variant="outline" className="flex-1 bg-transparent border-white/40 hover:bg-white/10 text-white font-bold h-12" onClick={() => { handleAction(activeRoutine.routineId, 'snooze', activeRoutine.time, actionNote.trim() || undefined); setActionNote(""); }}>
                            Snooze
                          </Button>
                        </div>
                        <Button variant="ghost" className="w-full hover:bg-white/10 text-white/80 hover:text-white mt-1" onClick={() => { handleAction(activeRoutine.routineId, 'skip', activeRoutine.time, actionNote.trim() || undefined); setActionNote(""); }} title="Skip this occurrence">
                          Skip this time
                        </Button>
                      </div>
                    </motion.div>
                  ) : nextOccurrences.length > 0 ? (
                    <motion.div 
                      key="upcoming"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card rounded-2xl border border-border shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-muted p-4 rounded-full">
                          <Play className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Upcoming</p>
                          <h3 className="text-xl font-bold">{nextOccurrences[0].routineName}</h3>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-3xl font-black text-primary">
                          {nextOccurrences[0].time.toLocaleTimeString([], { hour12: settings.timeFormat === '12h', hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-sm font-medium text-muted-foreground bg-muted inline-block px-2 py-1 rounded-md mt-1">
                          {formatCountdown(nextOccurrences[0].time, currentTime)}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-muted-foreground"
                    >
                      <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">No active routines right now.</p>
                      <p className="text-sm mt-1">Head over to the Routines tab to build your schedule.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {nextOccurrences.length > 1 && (
              <div className="pt-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">Following Occurrences</h3>
                <div className="grid gap-3">
                  {nextOccurrences.slice(1).map((occ, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary/50" />
                        <span className="font-semibold">{occ.routineName}</span>
                        {occ.snoozed && <Badge variant="outline" className="text-[10px]">Snoozed</Badge>}
                      </div>
                      <div className="text-right">
                        <span className="font-mono">{occ.time.toLocaleTimeString([], { hour12: settings.timeFormat === '12h', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* ROUTINES TAB */}
        {activeTab === 'routines' && (
          <motion.section 
            key="routines"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                <Settings2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                Manage Routines
              </h2>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={exportData} title="Backup Routines" className="hidden sm:flex rounded-full bg-muted/50">
                  <Download className="w-4 h-4" />
                </Button>
                <div className="relative hidden sm:flex">
                  <input type="file" accept=".json" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) importData(e.target.files[0]);
                  }} title="Restore Routines" />
                  <Button variant="ghost" size="icon" className="rounded-full bg-muted/50 pointer-events-none">
                    <Upload className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={handleAddBtnClick} variant={showForm ? "outline" : "default"} className="rounded-full px-4 md:px-6 shadow-md transition-transform hover:scale-105 text-sm">
                  {showForm ? "Cancel" : <><Plus className="w-4 h-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Add Routine</span><span className="sm:hidden">Add</span></>}
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="border-primary/30 shadow-lg mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                      <Zap className="w-24 h-24 md:w-32 md:h-32 text-primary" />
                    </div>
                    <CardHeader>
                      <CardTitle className="text-lg md:text-xl">{editingId ? 'Edit Routine' : 'Create New Routine'}</CardTitle>
                      <CardDescription className="text-xs md:text-sm">Set the rules for your repetitive task or pick a preset.</CardDescription>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {PRESETS.map((preset, idx) => (
                          <Badge 
                            key={idx} 
                            variant="secondary" 
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-1 px-2 md:py-1.5 md:px-3 text-xs md:text-sm"
                            onClick={() => handleApplyPreset(preset)}
                          >
                            {preset.name}
                          </Badge>
                        ))}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6 relative z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-3">
                          <Label htmlFor="routine-name" className="text-base">What do you need to remember?</Label>
                          <Input 
                            id="routine-name" 
                            placeholder="e.g., Drink 200ml Water" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="text-lg p-6 bg-background/80"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-base">Category</Label>
                          <div className="flex flex-wrap gap-2">
                            {CATEGORIES.map((cat, idx) => (
                              <Badge
                                key={idx}
                                variant={category === cat ? "default" : "outline"}
                                className="cursor-pointer py-1.5 px-3 hover:bg-primary/20 hover:text-primary transition-colors text-sm"
                                onClick={() => setCategory(cat)}
                              >
                                {cat}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-muted/50 p-5 rounded-2xl border border-border/50">
                        <div className="space-y-2">
                          <Label htmlFor="start-time">Start Time</Label>
                          <Input 
                            id="start-time" 
                            type="time" 
                            value={startTime} 
                            onChange={(e) => setStartTime(e.target.value)}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="end-time">End Time</Label>
                          <Input 
                            id="end-time" 
                            type="time" 
                            value={endTime} 
                            onChange={(e) => setEndTime(e.target.value)}
                            className="bg-background"
                          />
                        </div>
                        <div className="space-y-2 col-span-2 md:col-span-1">
                          <Label>Interval</Label>
                          <div className="flex gap-1 items-center bg-background border rounded-md p-1 h-[42px]">
                            <Input 
                              type="number" min="0" placeholder="H"
                              value={intervalHours || ''} 
                              onChange={(e) => updateInterval(Number(e.target.value) || 0, intervalMins, intervalSecs)}
                              className="w-full h-8 border-none bg-transparent px-1 text-center font-mono text-sm shadow-none focus-visible:ring-0"
                            /><span className="text-xs text-muted-foreground mr-1">h</span>
                            <Input 
                              type="number" min="0" max="59" placeholder="M"
                              value={intervalMins || ''} 
                              onChange={(e) => updateInterval(intervalHours, Number(e.target.value) || 0, intervalSecs)}
                              className="w-full h-8 border-none bg-transparent px-1 text-center font-mono text-sm shadow-none focus-visible:ring-0"
                            /><span className="text-xs text-muted-foreground mr-1">m</span>
                            <Input 
                              type="number" min="0" max="59" placeholder="S"
                              value={intervalSecs || ''} 
                              onChange={(e) => updateInterval(intervalHours, intervalMins, Number(e.target.value) || 0)}
                              className="w-full h-8 border-none bg-transparent px-1 text-center font-mono text-sm shadow-none focus-visible:ring-0"
                            /><span className="text-xs text-muted-foreground pr-1">s</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label className="text-base">Repeat Days</Label>
                        <div className="flex flex-wrap gap-3">
                          {DAYS_OF_WEEK.map((day, idx) => (
                            <Button 
                              key={idx}
                              variant={days.includes(idx) ? "default" : "outline"}
                              className={`w-12 h-12 p-0 rounded-full text-lg transition-colors ${days.includes(idx) ? "font-bold shadow-md" : "text-muted-foreground hover:bg-muted"}`}
                              onClick={() => toggleDay(idx)}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3 pt-4 border-t border-border/50">
                        <Label className="text-base font-bold flex items-center justify-between">
                          <span>Alarm Configuration <span className="text-sm font-normal text-muted-foreground">(Overrides global defaults)</span></span>
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-muted/30 p-4 rounded-xl">
                          <div className="space-y-2 col-span-2 md:col-span-1">
                            <Label className="text-xs flex items-center justify-between">
                              <span>Sound</span>
                              <Button variant="ghost" size="sm" className="h-5 px-1 py-0 text-primary" onClick={handleTestSound} title="Test Sound">
                                <PlayCircle className="w-3.5 h-3.5" />
                              </Button>
                            </Label>
                            <select 
                              className="w-full bg-background border p-2 rounded-md text-sm"
                              value={routineSettings?.soundPreset || ''}
                              onChange={(e) => setRoutineSettings({...routineSettings, soundPreset: e.target.value as any || undefined})}
                            >
                              <option value="">Default</option>
                              <option value="digital">Digital</option>
                              <option value="chime">Chime</option>
                              <option value="bells">Bells</option>
                              <option value="radar">Radar</option>
                              <option value="soft">Soft</option>
                              <option value="mp3_harp">Harp (MP3)</option>
                              <option value="mp3_guitar">Guitar (MP3)</option>
                              <option value="mp3_synth">Synth (MP3)</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Vibrate</Label>
                            <select 
                              className="w-full bg-background border p-2 rounded-md text-sm"
                              value={routineSettings?.vibrate === undefined ? '' : routineSettings.vibrate.toString()}
                              onChange={(e) => {
                                const val = e.target.value;
                                setRoutineSettings({...routineSettings, vibrate: val === '' ? undefined : val === 'true'});
                              }}
                            >
                              <option value="">Default</option>
                              <option value="true">Yes</option>
                              <option value="false">No</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Volume ({routineSettings?.volume !== undefined ? Math.round(routineSettings.volume * 100) : Math.round(settings.volume * 100)}%)</Label>
                            <Input 
                              type="range" min="0" max="1" step="0.1" 
                              value={routineSettings?.volume !== undefined ? routineSettings.volume : settings.volume}
                              onChange={(e) => setRoutineSettings({...routineSettings, volume: parseFloat(e.target.value)})}
                              className="w-full h-8 cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Ring Duration</Label>
                            <div className="flex gap-1 items-center bg-background border rounded-md p-1 h-[38px]">
                              <Input 
                                type="number" min="0" placeholder="M"
                                value={Math.floor(ringDuration / 60) || ''} 
                                onChange={(e) => updateRing(0, Number(e.target.value) || 0, ringDuration % 60)}
                                className="w-full h-6 border-none bg-transparent px-0 text-center font-mono text-xs shadow-none focus-visible:ring-0"
                              /><span className="text-[10px] text-muted-foreground mr-1">m</span>
                              <Input 
                                type="number" min="0" max="59" placeholder="S"
                                value={ringDuration % 60 || ''} 
                                onChange={(e) => updateRing(0, Math.floor(ringDuration / 60), Number(e.target.value) || 0)}
                                className="w-full h-6 border-none bg-transparent px-0 text-center font-mono text-xs shadow-none focus-visible:ring-0"
                              /><span className="text-[10px] text-muted-foreground pr-1">s</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">Snooze</Label>
                            <div className="flex gap-1 items-center bg-background border rounded-md p-1 h-[38px]">
                              <Input 
                                type="number" min="0" placeholder="H"
                                value={Math.floor(snoozeDuration / 60) || ''} 
                                onChange={(e) => updateSnooze(Number(e.target.value) || 0, Math.floor(snoozeDuration % 60), Math.round((snoozeDuration * 60) % 60))}
                                className="w-full h-6 border-none bg-transparent px-0 text-center font-mono text-xs shadow-none focus-visible:ring-0"
                              /><span className="text-[10px] text-muted-foreground mr-1">h</span>
                              <Input 
                                type="number" min="0" max="59" placeholder="M"
                                value={Math.floor(snoozeDuration % 60) || ''} 
                                onChange={(e) => updateSnooze(Math.floor(snoozeDuration / 60), Number(e.target.value) || 0, Math.round((snoozeDuration * 60) % 60))}
                                className="w-full h-6 border-none bg-transparent px-0 text-center font-mono text-xs shadow-none focus-visible:ring-0"
                              /><span className="text-[10px] text-muted-foreground mr-1">m</span>
                              <Input 
                                type="number" min="0" max="59" placeholder="S"
                                value={Math.round((snoozeDuration * 60) % 60) || ''} 
                                onChange={(e) => updateSnooze(Math.floor(snoozeDuration / 60), Math.floor(snoozeDuration % 60), Number(e.target.value) || 0)}
                                className="w-full h-6 border-none bg-transparent px-0 text-center font-mono text-xs shadow-none focus-visible:ring-0"
                              /><span className="text-[10px] text-muted-foreground pr-1">s</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button onClick={handleAddRoutine} className="w-full h-14 text-lg font-bold rounded-xl shadow-lg" disabled={!name.trim()}>
                        {editingId ? 'Update Routine' : 'Save Routine'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {routines.map((routine) => (
                  <motion.div
                    key={routine.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className={`h-full transition-all duration-300 hover:shadow-lg ${routine.enabled ? 'border-l-4 border-l-primary shadow-sm' : 'opacity-60 bg-muted/50 border-transparent'}`}>
                      <CardContent className="p-5 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-xl line-clamp-1 mr-2">{routine.name}</h3>
                            {routine.category && (
                              <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-1">
                                {routine.category}
                              </Badge>
                            )}
                          </div>
                          <Switch 
                            checked={routine.enabled} 
                            onCheckedChange={() => toggleRoutine(routine.id)} 
                          />
                        </div>
                        
                        <div className="bg-muted/40 rounded-xl p-4 text-sm text-muted-foreground space-y-3 mb-4 flex-1 border border-border/50">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground flex items-center gap-1.5">
                              <RotateCcw className="w-3.5 h-3.5 text-primary" />
                              Every {formatInterval(routine.intervalMinutes)}
                            </span>
                            <span className="bg-background px-2 py-1 rounded-md text-xs border">{routine.startTime} - {routine.endTime}</span>
                          </div>
                          <div className="flex gap-1.5 pt-3 border-t border-border/50">
                            {DAYS_OF_WEEK.map((day, idx) => (
                              <span key={idx} className={`text-[10px] w-6 h-6 inline-flex items-center justify-center rounded-full ${routine.days.includes(idx) ? 'bg-primary/20 text-primary font-bold' : 'text-muted-foreground/30 font-medium'}`}>
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                          <Badge variant={routine.enabled ? "default" : "secondary"} className="text-xs px-3 py-1 shadow-sm">
                            {routine.enabled && getNextOccurrences(routine, currentTime, 1).length > 0 
                              ? `Next: ${getNextOccurrences(routine, currentTime, 1)[0].time.toLocaleTimeString([], { hour12: settings.timeFormat === '12h', hour: '2-digit', minute: '2-digit' })}`
                              : 'Inactive'}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => handleEditBtnClick(routine)} className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full h-9 w-9">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteRoutine(routine.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full h-9 w-9">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {routines.length === 0 && !showForm && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-muted-foreground/20 rounded-2xl bg-muted/5 text-muted-foreground"
                >
                  <Clock className="w-12 h-12 mb-4 text-muted-foreground/30" />
                  <p className="text-lg font-medium">Your routine list is empty.</p>
                  <p className="text-sm">Click "Add Routine" to start organizing your day.</p>
                </motion.div>
              )}
            </div>
          </motion.section>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <motion.section 
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <History className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold">Activity Log & Analytics</h2>
            </div>

            {stats.total > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card className="bg-primary/5 border-none shadow-sm">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <LineChart className="w-6 h-6 text-primary mb-2" />
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Completion</p>
                    <p className="text-2xl font-black text-primary">{stats.completionRate}%</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-500/5 border-none shadow-sm">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <CheckCircle2 className="w-6 h-6 text-green-500 mb-2" />
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Done</p>
                    <p className="text-2xl font-black text-green-600 dark:text-green-400">{stats.done}</p>
                  </CardContent>
                </Card>
                <Card className="bg-blue-500/5 border-none shadow-sm">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <Clock className="w-6 h-6 text-blue-500 mb-2" />
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Snoozed</p>
                    <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.snoozed}</p>
                  </CardContent>
                </Card>
                <Card className="bg-red-500/5 border-none shadow-sm">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <Ban className="w-6 h-6 text-red-500 mb-2" />
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Skipped</p>
                    <p className="text-2xl font-black text-red-600 dark:text-red-400">{stats.skipped}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            <Card className="border-border shadow-sm">
              <CardContent className="p-0">
                {allHistory.length > 0 ? (
                  <div className="divide-y divide-border">
                    {allHistory.map((entry, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${
                            entry.action === 'done' ? 'bg-green-500/10 text-green-500' :
                            entry.action === 'snooze' ? 'bg-blue-500/10 text-blue-500' :
                            'bg-red-500/10 text-red-500'
                          }`}>
                            {entry.action === 'done' && <CheckCircle2 className="w-5 h-5" />}
                            {entry.action === 'snooze' && <Clock className="w-5 h-5" />}
                            {entry.action === 'skip' && <Ban className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-base">{entry.routineName}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                              {entry.action}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm">{new Date(entry.time).toLocaleTimeString([], { hour12: settings.timeFormat === '12h', hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-xs text-muted-foreground">{new Date(entry.time).toLocaleDateString()}</p>
                          {entry.note && (
                            <p className="text-xs mt-1 text-primary italic">"{entry.note}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No history yet.</p>
                    <p className="text-sm">Complete, snooze, or skip routines to see them here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <motion.section
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Settings2 className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              <h2 className="text-xl md:text-2xl font-bold">Preferences</h2>
            </div>
            <Card className="border-border shadow-sm">
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider border-b pb-2">Timing & Display</h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Time Format</Label>
                      <p className="text-sm text-muted-foreground">12-hour or 24-hour clock</p>
                    </div>
                    <div className="flex gap-2">
                      {['12h', '24h'].map((fmt) => (
                        <Badge 
                          key={fmt}
                          variant={settings.timeFormat === fmt ? 'default' : 'outline'}
                          className="cursor-pointer capitalize px-3 py-1"
                          onClick={() => setSettings({ ...settings, timeFormat: fmt as '12h' | '24h' })}
                        >
                          {fmt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-semibold">Theme</Label>
                      <p className="text-sm text-muted-foreground">App appearance</p>
                    </div>
                    <div className="flex gap-2">
                      {['light', 'dark', 'system'].map((t) => (
                        <Badge 
                          key={t}
                          variant={settings.theme === t ? 'default' : 'outline'}
                          className="cursor-pointer capitalize px-3 py-1"
                          onClick={() => setSettings({ ...settings, theme: t as 'light'|'dark'|'system' })}
                        >
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        )}

      </AnimatePresence>

      <AnimatePresence>
        {actionDialog.isOpen && actionDialog.routineId && actionDialog.time && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.95, opacity: 0, y: 10 }} 
              className="bg-card text-card-foreground border border-border rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative"
            >
              <div className="p-6 space-y-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
                  actionDialog.action === 'done' ? 'bg-green-500/10 text-green-500' :
                  actionDialog.action === 'snooze' ? 'bg-blue-500/10 text-blue-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                  {actionDialog.action === 'done' && <CheckCircle2 className="w-6 h-6" />}
                  {actionDialog.action === 'snooze' && <Clock className="w-6 h-6" />}
                  {actionDialog.action === 'skip' && <Ban className="w-6 h-6" />}
                </div>
                <h3 className="text-2xl font-bold">
                  {actionDialog.action === 'done' ? 'Great job!' :
                   actionDialog.action === 'snooze' ? 'Take a break' :
                   'Skip for now?'}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {actionDialog.action === 'done' ? 'You completed this routine.' :
                   actionDialog.action === 'snooze' ? `We'll remind you again in ${settings.snoozeDuration} minutes.` :
                   'You are skipping this occurrence.'}
                </p>
                <div className="pt-2">
                  <Label className="text-xs font-semibold text-muted-foreground mb-2 block">ADD A NOTE (OPTIONAL)</Label>
                  <textarea 
                    autoFocus
                    placeholder="How did it go?" 
                    value={actionNote} 
                    onChange={(e) => setActionNote(e.target.value)}
                    className="w-full bg-background border border-border p-3 rounded-xl text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none shadow-inner"
                  />
                </div>
              </div>
              <div className="bg-muted/50 p-4 flex gap-2 border-t border-border">
                <Button variant="ghost" className="flex-1 rounded-xl" onClick={() => {
                  setActionDialog({ isOpen: false, action: 'done' });
                  setActionNote("");
                }}>
                  Cancel
                </Button>
                <Button className="flex-1 rounded-xl font-bold shadow-md" onClick={() => {
                  handleAction(actionDialog.routineId!, actionDialog.action, actionDialog.time!, actionNote.trim() || undefined);
                  setActionDialog({ isOpen: false, action: 'done' });
                  setActionNote("");
                }}>
                  Confirm
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
