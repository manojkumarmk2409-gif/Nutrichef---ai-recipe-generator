import React, { useState } from "react";
import { Search, Flame, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

const SUBSTITUTION_DATA = [
  {
    category: "Dairy & Fats",
    original: "Heavy Cream / Sour Cream",
    alternative: "0% Fat Greek Yogurt / Blended Silken Tofu",
    calorieDiff: "-140 kcal / 100g",
    allergyFree: "Dairy-Free (if Tofu/Oat), Low Fat",
    benefits: "High protein, thick velvety texture, gut-friendly probiotics",
    tags: ["Dairy", "Calorie Deficit", "High Protein"],
  },
  {
    category: "Dairy & Fats",
    original: "Butter / Vegetable Oil (1 tbsp)",
    alternative: "Extra Virgin Olive Oil Spray (3 spritzes) / Unsweetened Applesauce (in baking)",
    calorieDiff: "-100 to -115 kcal",
    allergyFree: "Dairy-Free, Nut-Free",
    benefits: "Dramatically cuts hidden cooking calories while maintaining moisture",
    tags: ["Dairy", "Calorie Deficit", "Baking"],
  },
  {
    category: "Dairy & Fats",
    original: "Parmesan / Cheddar Cheese",
    alternative: "Nutritional Yeast / Grated Reduced-Fat Goat Cheese",
    calorieDiff: "-70 kcal / tbsp",
    allergyFree: "Dairy-Free (Nutritional Yeast), Vegan",
    benefits: "Deep cheesy umami flavor, packed with B-vitamins, zero saturated dairy fat",
    tags: ["Dairy", "Vegan", "Calorie Deficit"],
  },
  {
    category: "Carbs & Grains",
    original: "White Rice / Jasmine Rice (1 cup)",
    alternative: "Riced Cauliflower / Shirataki Rice / Konjac Mix",
    calorieDiff: "-180 kcal / cup",
    allergyFree: "Gluten-Free, Grain-Free",
    benefits: "High dietary fiber, large eating volume, low glycemic spike",
    tags: ["Gluten", "Keto", "Calorie Deficit"],
  },
  {
    category: "Carbs & Grains",
    original: "Traditional Wheat Pasta (100g dry)",
    alternative: "Zucchini Noodles (Zoodles) / Hearts of Palm Pasta / Edamame Pasta",
    calorieDiff: "-280 kcal / serving",
    allergyFree: "Gluten-Free, Wheat-Free",
    benefits: "Loaded with potassium and antioxidants; edible in massive portions",
    tags: ["Gluten", "Calorie Deficit", "Low Carb"],
  },
  {
    category: "Carbs & Grains",
    original: "All-Purpose Wheat Flour",
    alternative: "Almond Flour / Chickpea (Gram) Flour / Oat Flour",
    calorieDiff: "Higher fiber, lower glycemic index",
    allergyFree: "Gluten-Free (Oat/Chickpea), Grain-Free (Almond)",
    benefits: "Rich in micronutrients, complex slow-release carbohydrates",
    tags: ["Gluten", "Baking"],
  },
  {
    category: "Proteins & Meats",
    original: "Ground Beef 80/20 (150g)",
    alternative: "96/4 Lean Ground Turkey / Extra-Lean Grass-Fed Beef / Tempeh",
    calorieDiff: "-160 kcal / serving",
    allergyFree: "Soy-Free (Turkey), Red Meat-Free (Poultry/Tempeh)",
    benefits: "Lean pure protein with minimum saturated fats for optimal muscle preservation in a deficit",
    tags: ["High Protein", "Calorie Deficit"],
  },
  {
    category: "Proteins & Meats",
    original: "Whole Eggs (3 eggs)",
    alternative: "1 Whole Egg + 3 Liquid Egg Whites",
    calorieDiff: "-110 kcal, +12g protein",
    allergyFree: "Non-Dairy Protein",
    benefits: "High volume scramble with yolk flavor and pure lean albumin protein",
    tags: ["High Protein", "Calorie Deficit"],
  },
  {
    category: "Baking & Sweeteners",
    original: "Granulated Sugar / Maple Syrup (2 tbsp)",
    alternative: "Erythritol / Monk Fruit Sweetener / Allulose",
    calorieDiff: "-95 kcal",
    allergyFree: "Sugar-Free, Diabetic Safe",
    benefits: "Zero net carbs, 0 glycemic impact, identical sweetness profile",
    tags: ["Keto", "Sugar-Free", "Calorie Deficit"],
  },
  {
    category: "Allergen Swaps",
    original: "Peanut Butter / Tree Nut Paste",
    alternative: "Sunflower Seed Butter (SunButter) / Tahini (Sesame)",
    calorieDiff: "Nutrient dense allergen alternative",
    allergyFree: "100% Peanut & Tree Nut Free",
    benefits: "Rich in Vitamin E, magnesium, safe for nut-free schools & households",
    tags: ["Peanuts", "Tree Nuts", "Allergy Safe"],
  },
  {
    category: "Allergen Swaps",
    original: "Soy Sauce / Tamari",
    alternative: "Coconut Aminos",
    calorieDiff: "Lower sodium, sweeter profile",
    allergyFree: "100% Soy-Free, Gluten-Free",
    benefits: "Naturally brewed from fermented coconut sap, zero soy allergens",
    tags: ["Soy", "Gluten", "Allergy Safe"],
  },
  {
    category: "Allergen Swaps",
    original: "Eggs in Baking (Binding Agent)",
    alternative: "Aquafaba (Chickpea Brine) / Ground Flaxseed Egg (1 tbsp flax + 3 tbsp water)",
    calorieDiff: "-50 kcal",
    allergyFree: "100% Egg-Free, Vegan",
    benefits: "Whips like meringue, adds soluble omega-3 fibers",
    tags: ["Eggs", "Vegan", "Allergy Safe"],
  },
];

export default function SubstitutionGuide({ onSelectIngredient }) {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const allTags = ["All", "Calorie Deficit", "Dairy", "Gluten", "Peanuts", "Soy", "Eggs", "High Protein", "Keto", "Vegan"];

  const filtered = SUBSTITUTION_DATA.filter((item) => {
    const matchesSearch =
      item.original.toLowerCase().includes(search.toLowerCase()) ||
      item.alternative.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase()) ||
      item.benefits.toLowerCase().includes(search.toLowerCase());

    const matchesTag =
      selectedTag === "All" || item.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Culinary Science</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            Alternative Ingredients & Calorie Deficit Matrix
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            Discover precision swaps engineered by nutritionists to slash 100-300+ hidden calories per meal while keeping authentic textures and protecting against all major food allergens.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ingredients, swaps, or benefits..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                selectedTag === tag
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-950/20 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category & Calories Saved Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">
                  {item.category}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <Flame className="w-3 h-3 mr-1 text-emerald-400" />
                  {item.calorieDiff}
                </span>
              </div>

              {/* Substitution Flow */}
              <div className="space-y-2 mb-4">
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-[10px] uppercase font-bold text-rose-400/80 block mb-0.5">
                    Original Ingredient:
                  </span>
                  <p className="text-sm font-semibold text-slate-300 line-through decoration-rose-500/60">
                    {item.original}
                  </p>
                </div>

                <div className="flex justify-center -my-1">
                  <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-700/60 flex items-center justify-center text-emerald-400">
                    <ArrowRight className="w-3.5 h-3.5 rotate-90" />
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-0.5">
                    Smart Healthy Alternative:
                  </span>
                  <p className="text-sm font-bold text-white flex items-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 inline mr-1.5 shrink-0" />
                    {item.alternative}
                  </p>
                </div>
              </div>

              {/* Allergy note & Benefits */}
              <div className="text-xs text-slate-400 space-y-1.5 mb-4">
                <p>
                  <strong className="text-slate-200">Allergen Shield:</strong> {item.allergyFree}
                </p>
                <p>
                  <strong className="text-slate-200">Culinary Advantage:</strong> {item.benefits}
                </p>
              </div>
            </div>

            {/* Use Button */}
            {onSelectIngredient && (
              <button
                onClick={() => onSelectIngredient(item.alternative)}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-emerald-600/90 text-slate-200 hover:text-white text-xs font-bold border border-slate-700/80 hover:border-emerald-500 transition flex items-center justify-center space-x-1"
              >
                <span>Add to Recipe Generator</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass-panel p-12 rounded-2xl text-center">
          <p className="text-slate-400 text-sm">No substitutions match your search filter.</p>
        </div>
      )}
    </div>
  );
}
