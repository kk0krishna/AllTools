import React from "react";
import { User } from "firebase/auth";
import { Movie, UserPreferences, UserProfile } from "../lib/types";
import { MatchEngine } from "../lib/matchEngine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share, Users, X, Heart, Plane, Home, Users as UsersIcon, ChevronRight, Activity } from "lucide-react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MatchPanelProps {
  user: User | null;
  profile: UserProfile | null;
  prefs: UserPreferences;
  onGoToOnboard: () => void;
  onDetails: (movie: Movie) => void;
}

export function MatchPanel({ user, profile, prefs, onGoToOnboard, onDetails }: MatchPanelProps) {
  const [activeGroupCode, setActiveGroupCode] = React.useState<string | null>(null);
  const [groupDetails, setGroupDetails] = React.useState<any>(null);
  const [groupMembers, setGroupMembers] = React.useState<any[]>([]);
  
  const [detectedRoomCode, setDetectedRoomCode] = React.useState<string | null>(null);

  const [copied, setCopied] = React.useState(false);
  const [joinCode, setJoinCode] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  
  const [matchResult, setMatchResult] = React.useState<{ movie: Movie, reason: string } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  
  const [view, setView] = React.useState<'menu' | 'create' | 'join' | 'room'>('menu');
  const [newRoomName, setNewRoomName] = React.useState("");
  const [newRoomType, setNewRoomType] = React.useState<'partner' | 'family' | 'trip' | 'group'>('group');

  // Detect room code from URL hash unconditionally
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.startsWith("#room=")) {
        const codeFromHash = hash.replace("#room=", "").toUpperCase();
        if (codeFromHash) {
          setDetectedRoomCode(codeFromHash);
        }
      }
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      const cached = localStorage.getItem(`activeGroupCode_${user.uid}`);
      if (cached && !detectedRoomCode) {
        setActiveGroupCode(cached);
      }
    }
  }, [user, detectedRoomCode]);

  React.useEffect(() => {
    if (!activeGroupCode || !user) return;

    const unsubscribe = onSnapshot(doc(db, "movieverse_groups", activeGroupCode), async (d) => {
      if (d.exists()) {
        const details = d.data();
        setGroupDetails(details);
        setView('room');
        
        // Load member profiles and stats
        const membersData = await Promise.all(
          details.members.map(async (uid: string) => {
            const pDoc = await getDoc(doc(db, "user_movie_profiles", uid));
            const prefDoc = await getDoc(doc(db, "user_movie_preferences", uid));
            
            let statsCount = 0;
            if (prefDoc.exists()) {
              const interactions = (prefDoc.data() as UserPreferences).interactions || {};
              statsCount = Object.keys(interactions).length;
            }
            
            if (pDoc.exists()) {
              return { uid, statsCount, ...pDoc.data() };
            }
            return { uid, statsCount, name: "Unknown" };
          })
        );
        setGroupMembers(membersData);
      } else {
        localStorage.removeItem(`activeGroupCode_${user.uid}`);
        setActiveGroupCode(null);
        setView('menu');
      }
    });

    return () => unsubscribe();
  }, [activeGroupCode, user]);

  const handleCreateRoom = async () => {
    if (!user || !newRoomName.trim()) return;
    setLoading(true);
    try {
      const code = await MatchEngine.createGroup(newRoomName.trim(), newRoomType, user.uid);
      localStorage.setItem(`activeGroupCode_${user.uid}`, code);
      setActiveGroupCode(code);
    } catch (e) {
      console.error(e);
      setError("Failed to create room.");
    }
    setLoading(false);
  };

  const handleJoinRoom = async (codeToJoin?: string) => {
    if (!user) return;
    const code = (codeToJoin || joinCode).trim().toUpperCase();
    if (!code) return;

    setLoading(true);
    setError(null);
    try {
      const success = await MatchEngine.joinGroup(code, user.uid);
      if (success) {
        localStorage.setItem(`activeGroupCode_${user.uid}`, code);
        setActiveGroupCode(code);
        setDetectedRoomCode(null);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", window.location.pathname);
        }
      } else {
        setError("Invalid Room Code.");
      }
    } catch(e) {
      console.error(e);
      setError("Something went wrong.");
    }
    setLoading(false);
  };

  const handlePickForRoom = async () => {
    if (!groupDetails) return;
    setLoading(true);
    setError(null);
    try {
      const prefsList = await Promise.all(
        groupDetails.members.map(async (uid: string) => {
          const d = await getDoc(doc(db, "user_movie_preferences", uid));
          if (d.exists()) return d.data() as UserPreferences;
          return { interactions: {} } as UserPreferences;
        })
      );
      
      const pick = await MatchEngine.pickForGroupPrefs(prefsList, "movie");
      if (pick) {
        setMatchResult(pick);
      } else {
        setError("Not enough overlap in the room yet! Members need to swipe more.");
      }
    } catch(e) {
      console.error(e);
      setError("Failed to generate pick.");
    }
    setLoading(false);
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'partner': return <Heart className="w-6 h-6 text-pink-400" />;
      case 'family': return <Home className="w-6 h-6 text-blue-400" />;
      case 'trip': return <Plane className="w-6 h-6 text-green-400" />;
      default: return <UsersIcon className="w-6 h-6 text-purple-400" />;
    }
  };

  if (detectedRoomCode) {
    return (
      <div className="p-5 sm:p-8 max-w-lg mx-auto pb-32 animate-in zoom-in-95 duration-500">
        <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 p-8 rounded-[2rem] text-center border border-pink-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-pink-500/30 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-20 h-20 bg-black/40 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl">
            <UsersIcon className="w-10 h-10 text-pink-400" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2 leading-tight">Room Invite Detected!</h2>
          <p className="text-white/70 mb-6 text-sm">You have been invited to join room <span className="font-mono text-pink-400 font-bold tracking-widest">{detectedRoomCode}</span>.</p>
          
          <div className="space-y-3">
            {user ? (
              <Button onClick={() => handleJoinRoom(detectedRoomCode)} disabled={loading} className="w-full bg-white text-black font-black text-lg h-14 rounded-2xl shadow-xl hover:scale-105 transition-all">
                {loading ? "Joining..." : "Join Room"}
              </Button>
            ) : (
              <Button onClick={onGoToOnboard} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-black text-lg h-14 rounded-2xl shadow-xl hover:scale-105 transition-all">
                Sign in to Join
              </Button>
            )}
            
            <Button variant="ghost" onClick={() => {
              setDetectedRoomCode(null);
              if (typeof window !== "undefined") window.history.replaceState(null, "", window.location.pathname);
            }} className="w-full text-white/50 hover:text-white h-14 rounded-2xl">
              Explore Instead
            </Button>
          </div>
          {error && <p className="text-red-400 text-sm mt-4 font-semibold">{error}</p>}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-5 sm:p-8 max-w-lg mx-auto pb-32">
        <h2 className="text-3xl font-black mb-2 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Movie Rooms</h2>
        <p className="text-white/50 mb-8 text-sm">Share and discover movies with friends, family, or your partner.</p>
        <div className="bg-white/5 p-8 rounded-[2rem] mb-8 text-center border border-white/10 shadow-2xl backdrop-blur-sm">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UsersIcon className="w-8 h-8 text-white/50" />
          </div>
          <p className="text-lg font-bold text-white/90 mb-2">Sign in to join or create Rooms</p>
          <p className="text-sm text-white/40 mb-6 leading-relaxed max-w-[250px] mx-auto">You'll need a Taste Passport to match with others.</p>
          <Button onClick={onGoToOnboard} className="bg-white text-black font-bold rounded-2xl px-8 py-6 shadow-xl hover:scale-105 transition-transform w-full">Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-8 max-w-lg mx-auto pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">Movie Rooms</h2>
          <p className="text-white/50 text-sm mt-1">Watch together, without the arguing.</p>
        </div>
        {view === 'room' && (
          <Button variant="ghost" size="sm" onClick={() => { setActiveGroupCode(null); setView('menu'); localStorage.removeItem(`activeGroupCode_${user.uid}`); }} className="text-white/50 hover:text-white">
            Leave
          </Button>
        )}
      </div>

      {view === 'menu' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => setView('create')} className="w-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-white/10 rounded-3xl p-6 text-left transition-all hover:scale-[1.02] group shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <UsersIcon className="w-6 h-6 text-pink-400" />
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Create a Room</h3>
            <p className="text-white/50 text-sm">Start a new group for your trip, family, or partner.</p>
          </button>

          <button onClick={() => setView('join')} className="w-full bg-white/5 hover:bg-white/10 border border-white/5 rounded-3xl p-6 text-left transition-all hover:scale-[1.02] group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Share className="w-6 h-6 text-white/60" />
              </div>
              <ChevronRight className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Join a Room</h3>
            <p className="text-white/50 text-sm">Have an invite code? Enter it here.</p>
          </button>
        </div>
      )}

      {view === 'create' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <Button variant="ghost" className="mb-4 text-white/50 -ml-4" onClick={() => setView('menu')}>← Back</Button>
          
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold mb-6">New Room Setup</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2 block">Room Name</label>
                <Input placeholder="e.g. Hawaii Trip 2026" value={newRoomName} onChange={e => setNewRoomName(e.target.value)} className="bg-black/40 border-white/10 rounded-2xl h-14 text-lg" />
              </div>

              <div>
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3 block">Room Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'partner', icon: Heart, label: 'Partner', color: 'text-pink-400' },
                    { id: 'family', icon: Home, label: 'Family', color: 'text-blue-400' },
                    { id: 'trip', icon: Plane, label: 'Trip', color: 'text-green-400' },
                    { id: 'group', icon: UsersIcon, label: 'Friends', color: 'text-purple-400' }
                  ].map(t => (
                    <button 
                      key={t.id}
                      onClick={() => setNewRoomType(t.id as any)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${newRoomType === t.id ? 'bg-white/10 border-white/30' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}
                    >
                      <t.icon className={`w-6 h-6 mb-2 ${newRoomType === t.id ? t.color : 'text-white/40'}`} />
                      <span className={`text-sm font-bold ${newRoomType === t.id ? 'text-white' : 'text-white/40'}`}>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleCreateRoom} disabled={loading || !newRoomName.trim()} className="w-full h-14 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold text-lg shadow-xl shadow-pink-500/20">
                {loading ? "Creating..." : "Create Room"}
              </Button>
              {error && <p className="text-red-400 text-center text-sm">{error}</p>}
            </div>
          </div>
        </div>
      )}

      {view === 'join' && (
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          <Button variant="ghost" className="mb-4 text-white/50 -ml-4" onClick={() => setView('menu')}>← Back</Button>
          
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Join a Room</h3>
            <p className="text-white/50 text-sm mb-6">Enter the 6-character room code from your invite link.</p>
            
            <div className="space-y-4">
              <Input placeholder="GRP-XXXXXX" value={joinCode} onChange={e => setJoinCode(e.target.value)} className="bg-black/40 border-white/10 rounded-2xl h-14 text-center text-2xl tracking-[0.2em] uppercase font-mono placeholder:text-white/10" />
              <Button onClick={() => handleJoinRoom()} disabled={loading || !joinCode.trim()} className="w-full h-14 rounded-2xl bg-white text-black font-bold text-lg shadow-xl">
                {loading ? "Joining..." : "Join"}
              </Button>
              {error && <p className="text-red-400 text-center text-sm">{error}</p>}
            </div>
          </div>
        </div>
      )}

      {view === 'room' && groupDetails && (
        <div className="animate-in fade-in zoom-in-95 duration-500">
          <div className="bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-[2rem] mb-6 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-4 mb-6 relative">
              <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                {getIconForType(groupDetails.type)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-black text-white leading-tight truncate">{groupDetails.name}</h3>
                <p className="text-white/50 text-sm capitalize">{groupDetails.type} Room · Live</p>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs font-bold text-white/50 uppercase">Members</span>
                <span className="text-2xl font-black text-white">{groupMembers.length}</span>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/5 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Share Invite Code</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl sm:text-2xl font-mono text-white tracking-widest truncate mr-2">{activeGroupCode}</p>
                <div className="flex gap-2 shrink-0">
                  <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 rounded-xl w-10 h-10" onClick={() => navigator.clipboard.writeText(activeGroupCode || "")}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="bg-white/10 hover:bg-white/20 rounded-xl w-10 h-10" onClick={async () => {
                    const url = `${typeof window !== "undefined" ? window.location.origin + window.location.pathname : ""}#room=${activeGroupCode}`;
                    try {
                      if (navigator.share) await navigator.share({ title: `Join ${groupDetails.name} on MovieVerse`, url });
                      else throw new Error();
                    } catch {
                      navigator.clipboard.writeText(url);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }
                  }}>
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Member Contributions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {groupMembers.map((m, i) => (
                  <div key={m.uid} className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 p-3 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg">
                      {m.name?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{m.name || "Unknown Member"} {m.uid === user.uid ? "(You)" : ""}</p>
                      <div className="flex items-center gap-1 text-[10px] font-medium text-white/40">
                        <Activity className="w-3 h-3" />
                        <span>{m.statsCount} {m.statsCount === 1 ? 'rating' : 'ratings'}</span>
                      </div>
                    </div>
                    {m.statsCount === 0 && (
                      <span className="text-[10px] font-bold px-2 py-1 bg-white/5 text-white/40 rounded-full">Needs Swipes</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button onClick={handlePickForRoom} disabled={loading || groupMembers.length < 1} className="w-full h-16 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-[length:200%_auto] animate-gradient hover:scale-[1.02] transition-all text-white font-black text-xl shadow-2xl shadow-purple-500/30">
            {loading ? "Calculating Match..." : "Pick for Room"}
          </Button>
          {error && <p className="text-red-400 text-center text-sm mt-4 bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
        </div>
      )}

      {/* Tonight's Pick Overlay */}
      {matchResult && (
        <div className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <Button variant="ghost" size="icon" onClick={() => setMatchResult(null)} className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
            <X className="w-6 h-6" />
          </Button>
          <div className="w-24 h-24 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-3xl flex items-center justify-center mb-8 border border-white/10 shadow-2xl rotate-3">
            <UsersIcon className="w-12 h-12 text-pink-400 -rotate-3" />
          </div>
          <h2 className="text-4xl font-black mb-3 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Room Pick</h2>
          <p className="text-white/80 text-sm font-bold mb-10 uppercase tracking-[0.2em] bg-white/5 py-2 px-4 rounded-full border border-white/5">{matchResult.reason}</p>
          
          <div onClick={() => { setMatchResult(null); onDetails(matchResult.movie); }} className="w-full max-w-[280px] aspect-[2/3] bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl relative cursor-pointer border border-white/10 hover:border-white/30 transition-all hover:scale-105 group">
            <img src={`https://image.tmdb.org/t/p/w500${matchResult.movie.poster_path}`} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h3 className="text-3xl font-black leading-tight mb-2 drop-shadow-xl">{matchResult.movie.title || matchResult.movie.name}</h3>
              <div className="flex items-center justify-center gap-3 text-white/80 text-sm font-medium">
                <span className="bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-md">{matchResult.movie.release_date?.substring(0,4)}</span>
                <span className="flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded-md backdrop-blur-md">⭐ {Math.round(matchResult.movie.vote_average * 10)}%</span>
              </div>
            </div>
          </div>
          <p className="text-white/40 text-xs mt-8 font-medium">Tap poster for details</p>
        </div>
      )}
    </div>
  );
}
