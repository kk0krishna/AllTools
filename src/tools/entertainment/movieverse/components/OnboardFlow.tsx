import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, ChevronLeft, Popcorn, ArrowRight, Check } from "lucide-react";
import { GENRE_LIST } from "../lib/types";

const GENRE_EMOJIS: Record<number, string> = {
  28: "💥", 12: "🌍", 16: "🎨", 35: "😂", 80: "🔫",
  99: "📽️", 18: "🎭", 10751: "👨‍👩‍👧‍👦", 14: "✨", 36: "📜",
  27: "😱", 10402: "🎵", 9648: "🕵️", 10749: "💕", 878: "🧠",
  53: "🔥", 10752: "⚔️", 37: "🤠"
};

export function OnboardView({ 
  onSignIn, onSignInGuest, onBack 
}: any) {
  const [isAuthLoading, setIsAuthLoading] = React.useState(false);

  const handleSignIn = async () => {
    setIsAuthLoading(true);
    try {
      await onSignIn();
    } catch (e) {
      setIsAuthLoading(false);
    }
  };

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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="w-full flex flex-col gap-4 relative">
          
          <Button size="lg" disabled={isAuthLoading} onClick={handleSignIn} className="w-full rounded-2xl py-7 text-lg font-bold bg-white text-black hover:bg-white/90 shadow-xl group">
            {isAuthLoading ? (
              <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <><LogIn className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" /> Sign in to start</>
            )}
          </Button>
          
          <Button variant="ghost" disabled={isAuthLoading} onClick={onSignInGuest} className="w-full text-white/60 hover:text-white hover:bg-white/10 rounded-2xl py-6 font-bold mt-1">
            Continue as Guest
          </Button>
          
          <Button variant="ghost" disabled={isAuthLoading} onClick={onBack} className="text-white/40 hover:text-white/70 mt-2">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Clinikkit
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export function SetupView({ onComplete }: any) {
  const [step, setStep] = React.useState(1);
  const [name, setName] = React.useState("");
  const [genres, setGenres] = React.useState<number[]>([]);

  const handleNext = () => {
    if (step === 1 && name.trim()) setStep(2);
    else if (step === 2 && genres.length > 0) onComplete(name.trim(), genres);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0a0a0a] text-white flex flex-col p-6 overflow-y-auto">
      <div className="max-w-md w-full mx-auto py-12 flex flex-col min-h-[80vh]">
        
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-12">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-pink-500' : 'bg-white/10'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-pink-500' : 'bg-white/10'}`} />
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="flex-1"
            >
              <h1 className="text-4xl font-black mb-3">What's your name?</h1>
              <p className="text-white/50 mb-12 text-sm leading-relaxed">Let's start by personalizing your Taste Passport.</p>
              
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && name.trim() && handleNext()}
                placeholder="Enter your name" 
                className="bg-white/5 border-white/10 text-white rounded-2xl h-16 px-6 text-xl mb-8 focus:border-pink-500 transition-colors" 
                autoFocus
              />
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }}
              className="flex-1"
            >
              <button onClick={() => setStep(1)} className="flex items-center text-white/40 hover:text-white/80 text-sm font-bold mb-8">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </button>
              
              <h1 className="text-4xl font-black mb-3">Select your core genres</h1>
              <p className="text-white/50 mb-8 text-sm leading-relaxed">Pick a few to seed your initial DNA signature.</p>
              
              <div className="flex flex-wrap gap-2.5">
                {GENRE_LIST.map(g => {
                  const sel = genres.includes(g.id);
                  const emoji = GENRE_EMOJIS[g.id] || "🍿";
                  return (
                    <button 
                      key={g.id} 
                      onClick={() => setGenres(prev => sel ? prev.filter(x => x !== g.id) : [...prev, g.id])}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all border flex items-center gap-2 ${sel ? "bg-white text-black border-white scale-105 shadow-xl shadow-white/10" : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white"}`}
                    >
                      <span>{emoji}</span>
                      <span>{g.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-8 border-t border-white/10">
          <Button 
            size="lg" 
            disabled={(step === 1 && !name.trim()) || (step === 2 && genres.length === 0)} 
            onClick={handleNext}
            className="w-full rounded-2xl py-7 text-lg font-bold bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-30 disabled:hover:bg-pink-500 transition-all shadow-xl shadow-pink-500/20 flex items-center justify-center"
          >
            {step === 1 ? (
              <>Continue <ArrowRight className="w-5 h-5 ml-2" /></>
            ) : (
              <>Initialize Feed <Check className="w-5 h-5 ml-2" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
