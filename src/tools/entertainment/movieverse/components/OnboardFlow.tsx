import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, ChevronLeft, Popcorn } from "lucide-react";
import { GENRE_LIST } from "../lib/types";

export function OnboardView({ 
  onSignIn, onSignInGuest, onSignInAlt, onBack 
}: any) {
  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
      <div className="max-w-md w-full flex flex-col items-center">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-28 h-28 bg-gradient-to-br from-red-600 to-purple-700 rounded-3xl flex items-center justify-center mb-10 shadow-2xl shadow-red-600/30"
        >
          <Popcorn className="w-14 h-14 text-white" />
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl font-black mb-3 tracking-tight">MovieVerse</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-white/50 mb-14 text-lg leading-relaxed max-w-sm">
          Swipe through cinema. Teach it your taste. Match with friends for the perfect movie night.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="w-full flex flex-col gap-4">
          <Button size="lg" onClick={onSignIn} className="w-full rounded-2xl py-7 text-lg font-bold bg-white text-black hover:bg-white/90 shadow-xl">
            <LogIn className="w-5 h-5 mr-3" /> Sign in to start
          </Button>
          <Button variant="ghost" onClick={onSignInGuest} className="w-full text-white/60 hover:text-white hover:bg-white/10 rounded-2xl py-6 font-bold mt-1">
            Continue as Guest
          </Button>
          <Button variant="ghost" onClick={onSignInAlt} className="text-white/30 text-xs hover:text-white/60">
            Trouble signing in? Use alternate method
          </Button>
          <Button variant="ghost" onClick={onBack} className="text-white/40 hover:text-white/70 mt-2">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Clinikkit
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export function SetupView({ onComplete }: any) {
  const [name, setName] = React.useState("");
  const [genres, setGenres] = React.useState<number[]>([]);

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] text-white flex flex-col p-6 overflow-y-auto">
      <div className="max-w-md w-full mx-auto py-12">
        <h1 className="text-4xl font-black mb-3">Create your Taste Passport</h1>
        <p className="text-white/50 mb-12 text-sm leading-relaxed">This DNA will be used to curate your feed and match you with friends.</p>
        
        <div className="mb-10">
          <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">What should we call you?</label>
          <Input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            placeholder="Your name" 
            className="bg-white/5 border-white/10 text-white rounded-2xl h-14 px-5 text-lg" 
          />
        </div>

        <div className="mb-12">
          <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-3">Select your core genres</label>
          <div className="flex flex-wrap gap-2">
            {GENRE_LIST.map(g => {
              const sel = genres.includes(g.id);
              return (
                <button 
                  key={g.id} 
                  onClick={() => setGenres(prev => sel ? prev.filter(x => x !== g.id) : [...prev, g.id])}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all border ${sel ? "bg-white text-black border-white scale-105" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"}`}
                >
                  {g.name}
                </button>
              );
            })}
          </div>
        </div>

        <Button 
          size="lg" 
          disabled={!name.trim() || genres.length === 0} 
          onClick={() => onComplete(name.trim(), genres)}
          className="w-full rounded-2xl py-7 text-lg font-bold bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-30 disabled:hover:bg-pink-500 transition-all shadow-xl shadow-pink-500/20"
        >
          Initialize Feed
        </Button>
      </div>
    </div>
  );
}
