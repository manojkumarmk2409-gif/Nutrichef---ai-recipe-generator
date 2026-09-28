import React from "react";
import { Sparkles, UtensilsCrossed, Bookmark, Flame, Cpu } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, serverStatus, savedCount }) {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("generator")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                Nutri<span className="text-emerald-400">Chef</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                AI Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Smart Calorie-Deficit & Allergy-Safe Culinary Generator
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            id="nav-tab-generator"
            onClick={() => setActiveTab("generator")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "generator"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Recipe Studio</span>
          </button>

          <button
            id="nav-tab-favorites"
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "favorites"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Recipes</span>
            {savedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-700">
                {savedCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-substitutions"
            onClick={() => setActiveTab("substitutions")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              activeTab === "substitutions"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-semibold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Swap & Deficit Matrix</span>
            <span className="md:hidden">Matrix</span>
          </button>
        </nav>

        {/* AI Backend Provider Badge */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                serverStatus.online ? "bg-emerald-400" : "bg-amber-400"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                serverStatus.online ? "bg-emerald-500" : "bg-amber-500"
              }`}
            ></span>
          </div>
          <span className="text-slate-400">AI Engine:</span>
          <span className="font-semibold text-emerald-300 flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
            {serverStatus.provider || "Checking..."}
          </span>
        </div>
      </div>
    </header>
  );
}
