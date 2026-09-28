import React, { useState } from "react";
import {
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Printer,
  Clock,
  ChefHat,
  CheckSquare,
  Square,
  Play,
  ArrowRight,
  ArrowLeft,
  Globe,
} from "lucide-react";
import confetti from "canvas-confetti";
import CookingTimer from "./CookingTimer";

export default function RecipeView({
  recipeText,
  isLoading,
  currentProvider,
  onSaveFavorite,
  isSaved,
}) {
  const [copied, setCopied] = useState(false);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [cookingMode, setCookingMode] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showTimer, setShowTimer] = useState(false);

  // Copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(recipeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  // Save Favorite with celebratory confetti
  const handleSave = () => {
    onSaveFavorite();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ["#10b981", "#34d399", "#f59e0b"],
      });
    } catch (e) {}
  };

  const toggleCheckIngredient = (index) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Extract cooking steps for Cooking Mode
  const extractSteps = (text) => {
    const lines = text.split("\n");
    const steps = [];
    let inStepsSection = false;

    for (const line of lines) {
      if (line.includes("Step-by-Step Cooking Instructions") || line.includes("Cooking Instructions")) {
        inStepsSection = true;
        continue;
      }
      if (inStepsSection && line.startsWith("###")) {
        break; // Next section reached
      }
      if (inStepsSection) {
        const match = line.match(/^(\d+)\.\s+(.*)/);
        if (match) {
          steps.push(match[2]);
        }
      }
    }
    return steps;
  };

  const stepsList = extractSteps(recipeText);

  // Render raw markdown cleanly with custom structured styling
  const renderFormattedMarkdown = (text) => {
    if (!text) return null;

    const sections = text.split("\n");
    let ingredientIndex = 0;

    return sections.map((line, idx) => {
      const trimmed = line.trim();

      // Heading 1 (Recipe Title)
      if (trimmed.startsWith("# ")) {
        return (
          <h1
            key={idx}
            className="text-2xl sm:text-3xl font-display font-extrabold text-white tracking-tight mt-2 mb-1 text-emerald-300"
          >
            {trimmed.replace("# ", "")}
          </h1>
        );
      }

      // Heading 3 Native Name or Subheading
      if (trimmed.startsWith("### *") && trimmed.endsWith("*")) {
        return (
          <div
            key={idx}
            className="text-sm font-medium text-emerald-400/90 italic tracking-wide mb-3 flex items-center"
          >
            <Globe className="w-3.5 h-3.5 mr-1.5 inline text-emerald-400" />
            {trimmed.replace("### *", "").replace("*", "")}
          </div>
        );
      }

      // Heading 3 Section Header
      if (trimmed.startsWith("### ")) {
        const title = trimmed.replace("### ", "");
        return (
          <div key={idx} className="pt-4 pb-2 border-b border-slate-800/80 mb-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2">
              <span>{title}</span>
            </h3>
          </div>
        );
      }

      // Blockquotes
      if (trimmed.startsWith("> ")) {
        return (
          <blockquote
            key={idx}
            className="my-3 p-3.5 rounded-2xl bg-slate-900/80 border-l-4 border-emerald-500 text-slate-300 text-sm italic shadow-inner"
          >
            {trimmed.replace("> ", "")}
          </blockquote>
        );
      }

      // Ingredient Checklist items with interactive checkboxes
      if (trimmed.startsWith("- [ ]") || trimmed.startsWith("- []") || trimmed.startsWith("* [ ]")) {
        const ingText = trimmed.replace(/^[-*]\s*\[\s*\]\s*/, "");
        const currentIdx = ingredientIndex++;
        const isChecked = Boolean(checkedIngredients[currentIdx]);

        return (
          <div
            key={idx}
            onClick={() => toggleCheckIngredient(currentIdx)}
            className={`flex items-start space-x-2.5 py-1.5 px-3 rounded-xl cursor-pointer transition select-none my-1 ${
              isChecked
                ? "bg-emerald-950/20 text-slate-400 line-through"
                : "hover:bg-slate-900/60 text-slate-200"
            }`}
          >
            <div className="mt-0.5 text-emerald-400 shrink-0">
              {isChecked ? (
                <CheckSquare className="w-4 h-4 text-emerald-500" />
              ) : (
                <Square className="w-4 h-4 text-slate-500" />
              )}
            </div>
            <span className="text-sm leading-relaxed">{ingText}</span>
          </div>
        );
      }

      // Table formatting (Markdown table rows)
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const cells = trimmed
          .split("|")
          .filter((_, i, arr) => i !== 0 && i !== arr.length - 1)
          .map((c) => c.trim());

        // Skip divider line |---|---|
        if (cells.every((c) => c.startsWith("-"))) {
          return null;
        }

        const isHeader =
          cells.some((c) => c.toLowerCase().includes("original") || c.toLowerCase().includes("ingredient")) ||
          (idx < 25 && Boolean(sections[idx - 1]?.trim().startsWith("### 🔄")));

        return (
          <div
            key={idx}
            className={`grid grid-cols-1 sm:grid-cols-4 gap-2 p-2.5 rounded-xl my-1 text-xs sm:text-sm border ${
              isHeader
                ? "bg-slate-900/90 font-bold text-slate-300 border-slate-800"
                : "bg-slate-950/50 text-slate-200 border-slate-800/60 hover:bg-slate-900/40"
            }`}
          >
            {cells.map((c, cIdx) => (
              <div key={cIdx} className={`${cIdx === 1 ? "font-semibold text-emerald-300" : ""}`}>
                {c}
              </div>
            ))}
          </div>
        );
      }

      // Numbered Step lists
      if (trimmed.match(/^\d+\.\s+/)) {
        const stepNum = trimmed.match(/^\d+/)[0];
        const stepContent = trimmed.replace(/^\d+\.\s+/, "");
        return (
          <div key={idx} className="flex items-start space-x-3 my-2.5 p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60">
            <span className="w-6 h-6 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-600/40 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {stepNum}
            </span>
            <div className="text-sm text-slate-200 leading-relaxed font-normal">
              {stepContent}
            </div>
          </div>
        );
      }

      // Bullet points
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const content = trimmed.replace(/^[-*]\s+/, "");
        return (
          <li key={idx} className="text-sm text-slate-300 ml-4 list-disc my-1 leading-relaxed">
            {content}
          </li>
        );
      }

      // Horizontal rules
      if (trimmed === "---") {
        return <hr key={idx} className="border-slate-800/80 my-4" />;
      }

      // Normal paragraph
      if (trimmed.length > 0) {
        return (
          <p key={idx} className="text-sm text-slate-300 my-2 leading-relaxed">
            {line}
          </p>
        );
      }

      return null;
    });
  };

  // If no recipe generated yet and not loading
  if (!recipeText && !isLoading) {
    return (
      <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 text-center flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
          <ChefHat className="w-8 h-8 animate-bounce-soft" />
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">
          Your Personalized Kitchen Canvas
        </h3>
        <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
          Configure your ingredients, calorie deficit targets, and allergy filters on the left, then hit{" "}
          <strong className="text-emerald-400">"Generate Calorie-Deficit Recipe"</strong> to receive an AI-crafted culinary masterpiece.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left w-full max-w-lg">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-emerald-400 font-bold block mb-1">🔥 Calorie Deficit</span>
            <span className="text-slate-400">Smart low-calorie swaps to preserve fullness</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-amber-400 font-bold block mb-1">🛡️ Allergy Shield</span>
            <span className="text-slate-400">Guaranteed 100% free of target allergens</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
            <span className="text-teal-400 font-bold block mb-1">⏱️ Interactive Prep</span>
            <span className="text-slate-400">Step tracker, checklist & countdown timer</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Top Action Toolbar */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        {/* Live Streaming Indicator */}
        <div className="flex items-center space-x-2 text-xs">
          {isLoading ? (
            <div className="flex items-center space-x-2 text-emerald-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-bold animate-pulse">Streaming Recipe Live...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-slate-400">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Recipe Ready</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1.5">
          {stepsList.length > 0 && (
            <button
              onClick={() => setCookingMode(!cookingMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 transition ${
                cookingMode
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800"
              }`}
            >
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>{cookingMode ? "Exit Cooking Mode" : "Step Cooking Mode"}</span>
            </button>
          )}

          <button
            onClick={() => setShowTimer(!showTimer)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 flex items-center space-x-1 transition"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Kitchen Timer</span>
          </button>

          <button
            onClick={handleSave}
            className={`p-2 rounded-xl text-xs font-semibold border transition flex items-center space-x-1 ${
              isSaved
                ? "bg-emerald-950 text-emerald-400 border-emerald-500/50 shadow-sm"
                : "bg-slate-900 text-slate-300 hover:text-white border-slate-800 hover:bg-slate-800"
            }`}
            title={isSaved ? "Saved in Favorites" : "Save Recipe"}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-emerald-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleCopy}
            className="p-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 transition"
            title="Copy Recipe"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl text-xs font-semibold bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:bg-slate-800 transition no-print"
            title="Print Recipe"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Kitchen Timer if enabled */}
      {showTimer && (
        <div className="animate-fadeIn">
          <CookingTimer initialMinutes={20} onClose={() => setShowTimer(false)} />
        </div>
      )}

      {/* Interactive Cooking Mode Walkthrough */}
      {cookingMode && stepsList.length > 0 ? (
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl bg-slate-900/90 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ChefHat className="w-5 h-5 text-emerald-400" />
              <span className="font-display font-bold text-white text-base">
                Interactive Cooking Mode
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Step {activeStepIndex + 1} of {stepsList.length}
            </span>
          </div>

          {/* Step Progress Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
              style={{ width: `${((activeStepIndex + 1) / stepsList.length) * 100}%` }}
            />
          </div>

          {/* Current Step Card */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 min-h-[160px] flex flex-col justify-center">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
              Active Instruction:
            </div>
            <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
              {stepsList[activeStepIndex]}
            </p>
          </div>

          {/* Step Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={activeStepIndex === 0}
              onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" /> <span>Previous Step</span>
            </button>

            <button
              disabled={activeStepIndex === stepsList.length - 1}
              onClick={() => {
                if (activeStepIndex === stepsList.length - 2) {
                  try {
                    confetti({ particleCount: 40, spread: 50 });
                  } catch (e) {}
                }
                setActiveStepIndex((prev) => Math.min(stepsList.length - 1, prev + 1));
              }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1.5 transition"
            >
              <span>{activeStepIndex === stepsList.length - 1 ? "Finished!" : "Next Step"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Standard Structured Recipe Card */
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden bg-slate-900/60">
          <div className="recipe-content max-w-none">
            {renderFormattedMarkdown(recipeText)}
          </div>

          {isLoading && (
            <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold mt-4 pt-4 border-t border-slate-800 animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              <span>Streaming next culinary insights...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
