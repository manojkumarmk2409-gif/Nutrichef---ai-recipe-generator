import React, { useState } from "react";
import { Bookmark, Trash2, ArrowRight, Search } from "lucide-react";

export default function FavoritesView({ savedRecipes, onLoadRecipe, onDeleteRecipe }) {
  const [search, setSearch] = useState("");

  const filtered = savedRecipes.filter((r) =>
    (r.title || r.text).toLowerCase().includes(search.toLowerCase())
  );

  if (savedRecipes.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center border border-slate-800 max-w-2xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto mb-4">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">No Saved Recipes Yet</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
          When you generate a recipe you love, click the <strong className="text-emerald-400">Save Bookmark</strong> icon on the top right to save it to your personal culinary collection.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header & Search */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-white">Your Saved Recipe Book</h2>
          <p className="text-slate-400 text-xs mt-1">
            {savedRecipes.length} personalized calorie-deficit recipes saved locally
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved recipes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => {
          // Extract first heading as title
          const title =
            item.title ||
            item.text.split("\n").find((l) => l.startsWith("# "))?.replace("# ", "") ||
            "Custom Calorie Deficit Recipe";

          const summary =
            item.text.split("\n").find((l) => l.startsWith("> "))?.replace("> ", "") ||
            item.text.slice(0, 120) + "...";

          return (
            <div
              key={item.id}
              className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    Saved {new Date(item.date).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onDeleteRecipe(item.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition"
                    title="Delete recipe"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h4 className="text-base font-bold text-white mb-2 line-clamp-2">{title}</h4>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {summary}
                </p>
              </div>

              <button
                onClick={() => onLoadRecipe(item)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/30 hover:border-emerald-500 transition flex items-center justify-center space-x-1.5"
              >
                <span>View & Cook Recipe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
