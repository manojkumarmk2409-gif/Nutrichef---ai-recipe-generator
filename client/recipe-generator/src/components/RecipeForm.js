import React, { useState } from "react";
import {
  Sparkles,
  ShieldAlert,
  Flame,
  Clock,
  ChefHat,
  Globe,
  Utensils,
  Plus,
  X,
  RotateCcw,
  Zap,
} from "lucide-react";

const COMMON_INGREDIENTS = [
  "Chicken Breast",
  "Salmon Fillet",
  "Extra Firm Tofu",
  "Eggs / Egg Whites",
  "Baby Spinach",
  "Zucchini",
  "Broccoli",
  "Mushrooms",
  "Cauliflower",
  "Sweet Potato",
  "Greek Yogurt",
  "Garlic & Lemon",
  "Avocado",
  "Quinoa",
];

const ALLERGY_OPTIONS = [
  { id: "dairy", label: "Dairy / Lactose 🥛", value: "Dairy / Lactose" },
  { id: "gluten", label: "Gluten / Wheat 🌾", value: "Gluten / Wheat" },
  { id: "peanuts", label: "Peanuts 🥜", value: "Peanuts" },
  { id: "tree_nuts", label: "Tree Nuts 🌰", value: "Tree Nuts (Almonds, Walnuts, Cashews)" },
  { id: "shellfish", label: "Shellfish 🦐", value: "Shellfish & Crustaceans" },
  { id: "eggs", label: "Eggs 🥚", value: "Eggs" },
  { id: "soy", label: "Soy 🫘", value: "Soy / Edamame" },
  { id: "sesame", label: "Sesame 🥯", value: "Sesame Seeds / Oil" },
  { id: "fish", label: "Fish 🐟", value: "Fish & Seafood" },
];

const DIETARY_OPTIONS = [
  { id: "vegan", label: "Vegan 🌱", value: "Strict Vegan (Plant-Based)" },
  { id: "vegetarian", label: "Vegetarian 🧀", value: "Vegetarian" },
  { id: "keto", label: "Keto / Low-Carb 🥑", value: "Keto / Ultra Low-Carb" },
  { id: "paleo", label: "Paleo 🥩", value: "Paleo" },
];

const CALORIE_PRESETS = [
  { label: "Strict Deficit (<380 kcal)", calories: 350, desc: "Aggressive fat loss, high volume greens" },
  { label: "Moderate Deficit (~450 kcal)", calories: 450, desc: "Sustainable everyday calorie cut" },
  { label: "High-Protein Lean (~550 kcal)", calories: 550, desc: "Muscle preservation, 40g+ protein" },
  { label: "Custom Target", calories: 500, desc: "Adjust target calorie slider" },
];

const QUICK_RECIPE_PRESETS = [
  {
    name: "Mediterranean Lean Skillet",
    ingredients: "Chicken breast, zucchini, baby spinach, cherry tomatoes, garlic, lemon",
    allergies: ["Dairy / Lactose", "Gluten / Wheat"],
    calorieGoal: "Moderate Deficit (~450 kcal)",
    targetCalories: 420,
    cuisine: "Mediterranean",
    mealType: "Dinner",
    cookingTime: "20 minutes",
    complexity: "Beginner",
  },
  {
    name: "Asian Cauliflower Fried Rice",
    ingredients: "Riced cauliflower, extra firm tofu, green peas, carrots, coconut aminos, sesame oil",
    allergies: ["Gluten / Wheat", "Soy / Edamame"],
    calorieGoal: "Strict Deficit (<380 kcal)",
    targetCalories: 340,
    cuisine: "Asian Fusion",
    mealType: "Lunch",
    cookingTime: "15 minutes",
    complexity: "Beginner",
  },
  {
    name: "High-Protein Guilt-Free Bowl",
    ingredients: "Salmon fillet, quinoa, broccoli florets, avocado, Dijon mustard, lemon juice",
    allergies: ["Dairy / Lactose"],
    calorieGoal: "High-Protein Lean (~550 kcal)",
    targetCalories: 520,
    cuisine: "American Healthy",
    mealType: "Dinner",
    cookingTime: "25 minutes",
    complexity: "Intermediate",
  },
];

export default function RecipeForm({ onSubmit, isLoading, onCancel }) {
  const [ingredients, setIngredients] = useState("Chicken breast, baby spinach, garlic, lemon");
  const [mealType, setMealType] = useState("Dinner");
  const [cuisine, setCuisine] = useState("Mediterranean");
  const [cookingTime, setCookingTime] = useState("25 minutes");
  const [complexity, setComplexity] = useState("Beginner");

  // Allergy & Dietary State
  const [selectedAllergies, setSelectedAllergies] = useState(["Dairy / Lactose"]);
  const [customAllergyInput, setCustomAllergyInput] = useState("");
  const [customAllergies, setCustomAllergies] = useState([]);

  // Calorie Deficit State
  const [calorieGoal, setCalorieGoal] = useState("Moderate Deficit (~450 kcal)");
  const [targetCalories, setTargetCalories] = useState(450);
  const [servings, setServings] = useState(2);

  // Toggle allergy tag
  const toggleAllergy = (val) => {
    setSelectedAllergies((prev) =>
      prev.includes(val) ? prev.filter((item) => item !== val) : [...prev, val]
    );
  };

  // Add custom allergy
  const handleAddCustomAllergy = (e) => {
    e.preventDefault();
    if (customAllergyInput.trim() && !customAllergies.includes(customAllergyInput.trim())) {
      setCustomAllergies([...customAllergies, customAllergyInput.trim()]);
      setCustomAllergyInput("");
    }
  };

  const removeCustomAllergy = (tag) => {
    setCustomAllergies(customAllergies.filter((t) => t !== tag));
  };

  // Append quick ingredient
  const handleAddIngredient = (item) => {
    if (!ingredients.toLowerCase().includes(item.toLowerCase())) {
      const updated = ingredients.trim() ? `${ingredients.trim()}, ${item}` : item;
      setIngredients(updated);
    }
  };

  // Load preset recipe
  const applyPreset = (preset) => {
    setIngredients(preset.ingredients);
    setSelectedAllergies(preset.allergies);
    setCalorieGoal(preset.calorieGoal);
    setTargetCalories(preset.targetCalories);
    setCuisine(preset.cuisine);
    setMealType(preset.mealType);
    setCookingTime(preset.cookingTime);
    setComplexity(preset.complexity);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allAllergiesCombined = [...selectedAllergies, ...customAllergies].join(", ");

    onSubmit({
      ingredients,
      mealType,
      cuisine,
      cookingTime,
      complexity,
      allergies: allAllergiesCombined || "None",
      calorieGoal,
      targetCalories,
      servings,
    });
  };

  const handleReset = () => {
    setIngredients("");
    setSelectedAllergies([]);
    setCustomAllergies([]);
    setTargetCalories(450);
    setCalorieGoal("Moderate Deficit (~450 kcal)");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preset Quick Inspiration Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-300 flex items-center">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
            Quick Inspiration Presets:
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center transition"
          >
            <RotateCcw className="w-3 h-3 mr-1" /> Reset All
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_RECIPE_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-xs px-3 py-1 rounded-xl bg-slate-950/80 hover:bg-emerald-950/50 text-slate-300 hover:text-emerald-300 border border-slate-800 hover:border-emerald-500/40 transition flex items-center space-x-1"
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. Primary Ingredients */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-white flex items-center" htmlFor="ingredients-input">
            <Utensils className="w-4 h-4 text-emerald-400 mr-2" />
            Available / Target Ingredients
          </label>
          <span className="text-[11px] text-slate-400">Comma separated</span>
        </div>

        <textarea
          id="ingredients-input"
          rows={3}
          className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none leading-relaxed"
          placeholder="e.g. Chicken breast, baby spinach, garlic, riced cauliflower, lemon..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
        />

        {/* Quick Add Pill Chips */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
            + Quick Add Pantry Staples:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {COMMON_INGREDIENTS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleAddIngredient(item)}
                className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-900 text-slate-300 hover:text-emerald-300 hover:bg-emerald-950/40 border border-slate-800 hover:border-emerald-500/30 transition flex items-center space-x-1"
              >
                <Plus className="w-2.5 h-2.5 text-emerald-400" />
                <span>{item}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ALLERGY & DIETARY SHIELD (Key Requirement) */}
      <div className="glass-card p-5 rounded-2xl border border-amber-500/20 bg-slate-900/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center">
              <ShieldAlert className="w-4 h-4 text-amber-400 mr-2" />
              Allergies & Dietary Shield
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Strictly excluded from recipe & replaced with smart allergen-free alternatives
            </p>
          </div>
          {selectedAllergies.length > 0 && (
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              {selectedAllergies.length + customAllergies.length} Excluded
            </span>
          )}
        </div>

        {/* Common Allergens Toggles */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 block">Food Allergens to Exclude:</span>
          <div className="flex flex-wrap gap-1.5">
            {ALLERGY_OPTIONS.map((item) => {
              const isSelected = selectedAllergies.includes(item.value);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleAllergy(item.value)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition border flex items-center space-x-1.5 ${
                    isSelected
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm shadow-amber-500/20"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span>{item.label}</span>
                  {isSelected && <X className="w-3 h-3 text-amber-400 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dietary Regimens */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 block">Dietary Preference:</span>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY_OPTIONS.map((item) => {
              const isSelected = selectedAllergies.includes(item.value);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleAllergy(item.value)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium transition border flex items-center space-x-1.5 ${
                    isSelected
                      ? "bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm shadow-teal-500/20"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700"
                  }`}
                >
                  <span>{item.label}</span>
                  {isSelected && <X className="w-3 h-3 text-teal-400 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Allergy Add */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Add other allergy / ingredient to avoid (e.g. Mushrooms, Cilantro)..."
              value={customAllergyInput}
              onChange={(e) => setCustomAllergyInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCustomAllergy(e);
              }}
              className="flex-1 bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddCustomAllergy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              + Add
            </button>
          </div>

          {customAllergies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {customAllergies.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-500/30 flex items-center space-x-1 font-medium"
                >
                  <span>🚫 {tag}</span>
                  <button type="button" onClick={() => removeCustomAllergy(tag)}>
                    <X className="w-3 h-3 ml-1 hover:text-white" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 3. CALORIE DEFICIT & FITNESS GOAL (Key Requirement) */}
      <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center">
              <Flame className="w-4 h-4 text-emerald-400 mr-2" />
              Calorie Deficit & Macro Target
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Engineered with high volume swaps and lean cooking methods
            </p>
          </div>
          <div className="text-right">
            <span className="text-lg font-mono font-extrabold text-emerald-400">
              ~{targetCalories}
            </span>
            <span className="text-xs text-slate-400 ml-1">kcal / serving</span>
          </div>
        </div>

        {/* Preset Deficit Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {CALORIE_PRESETS.map((p) => {
            const isSelected = calorieGoal === p.label;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setCalorieGoal(p.label);
                  setTargetCalories(p.calories);
                }}
                className={`p-2.5 rounded-xl text-left border transition ${
                  isSelected
                    ? "bg-emerald-950/40 border-emerald-500/60 shadow-md shadow-emerald-950/30"
                    : "bg-slate-950/80 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold ${
                      isSelected ? "text-emerald-300" : "text-slate-200"
                    }`}
                  >
                    {p.label}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{p.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Target Calories Slider */}
        <div className="pt-2">
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-medium">
            <span>Aggressive Deficit (250 kcal)</span>
            <span className="text-emerald-400 font-bold">{targetCalories} kcal</span>
            <span>Fuel / Maintain (850 kcal)</span>
          </div>
          <input
            type="range"
            min="250"
            max="850"
            step="25"
            value={targetCalories}
            onChange={(e) => setTargetCalories(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* 4. Meal Type, Cuisine, Cooking Time & Servings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Meal Type */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center" htmlFor="mealType-select">
            <ChefHat className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Meal Type
          </label>
          <select
            id="mealType-select"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          >
            <option value="Breakfast">Breakfast (Energizing)</option>
            <option value="Lunch">Lunch (Light & Satiating)</option>
            <option value="Dinner">Dinner (Satisfying Deficit)</option>
            <option value="Post-Workout">Post-Workout (High Protein)</option>
            <option value="Healthy Snack">Healthy Snack</option>
            <option value="Guilt-Free Dessert">Guilt-Free Dessert</option>
          </select>
        </div>

        {/* Cuisine Preference */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center" htmlFor="cuisine-select">
            <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Cuisine Style
          </label>
          <select
            id="cuisine-select"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          >
            <option value="Mediterranean">Mediterranean (Herb & Lemon)</option>
            <option value="Italian">Italian (Clean & Rustic)</option>
            <option value="Mexican">Mexican (Fiesta & Spiced)</option>
            <option value="Japanese">Japanese (Clean Umami)</option>
            <option value="Indian">Indian (Curry & Aromatic Spices)</option>
            <option value="Thai">Thai (Zesty & Fragrant)</option>
            <option value="Middle Eastern">Middle Eastern (Shawarma & Tahini Spices)</option>
            <option value="American Clean">American Clean Fitness</option>
            <option value="French Bistro">French Bistro Style</option>
          </select>
        </div>

        {/* Cooking Time */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center" htmlFor="cookingTime-select">
            <Clock className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Max Cooking Time
          </label>
          <select
            id="cookingTime-select"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          >
            <option value="15 minutes">Under 15 minutes (Express)</option>
            <option value="25 minutes">20 - 30 minutes (Standard)</option>
            <option value="45 minutes">30 - 45 minutes</option>
            <option value="60+ minutes">Slow Cook / Gourmet (1+ Hour)</option>
          </select>
        </div>

        {/* Servings */}
        <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center">
            <Utensils className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Servings Count
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 4, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setServings(num)}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition border ${
                  servings === num
                    ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                    : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                }`}
              >
                {num} {num === 1 ? "person" : "people"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <button
              type="button"
              disabled
              className="flex-1 py-3.5 px-6 rounded-2xl font-display font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-500 opacity-90 cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25"
            >
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Crafting Personalized Recipe & Macro Swaps...</span>
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="py-3.5 px-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold transition"
              >
                Stop
              </button>
            )}
          </div>
        ) : (
          <button
            type="submit"
            id="generate-recipe-btn"
            className="w-full py-3.5 px-6 rounded-2xl font-display font-extrabold text-white text-base tracking-wide bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 active:scale-[0.99] transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl shadow-emerald-600/30 glow-emerald"
          >
            <Sparkles className="w-5 h-5 text-white animate-bounce-soft" />
            <span>Generate Calorie-Deficit Recipe</span>
          </button>
        )}
      </div>
    </form>
  );
}
