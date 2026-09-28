import React, { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import RecipeForm from "./components/RecipeForm";
import RecipeView from "./components/RecipeView";
import FavoritesView from "./components/FavoritesView";
import SubstitutionGuide from "./components/SubstitutionGuide";
import { AlertCircle } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("generator");
  const [recipeData, setRecipeData] = useState(null);
  const [recipeText, setRecipeText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState({ online: false, provider: "Connecting..." });
  const [errorMessage, setErrorMessage] = useState("");
  const [currentProvider, setCurrentProvider] = useState("");
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [appendedIngredient, setAppendedIngredient] = useState("");

  const eventSourceRef = useRef(null);

  // Load saved recipes from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("nutrichef_saved_recipes");
      if (stored) {
        setSavedRecipes(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Could not load favorites from localStorage", e);
    }
  }, []);

  const checkServerHealth = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:3001/api/health");
      const data = await res.json();
      if (data.status === "ok") {
        let providerName = "Smart Engine";
        if (data.ollama && data.ollama.available) {
          providerName = `Ollama (${data.ollama.models[0] || "Local"})`;
        } else if (data.openai && data.openai.available) {
          providerName = "OpenAI GPT-4";
        }
        setServerStatus({ online: true, provider: providerName, details: data });
      }
    } catch (e) {
      setServerStatus({ online: false, provider: "Offline / Standby" });
    }
  }, []);

  // Check server health
  useEffect(() => {
    checkServerHealth();
    const interval = setInterval(checkServerHealth, 30000);
    return () => clearInterval(interval);
  }, [checkServerHealth]);

  // Close SSE stream
  const closeEventStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsLoading(false);
  }, []);

  const initializeEventStream = useCallback((inputs) => {
    setIsLoading(true);
    setRecipeText("");
    setErrorMessage("");

    const queryParams = new URLSearchParams(inputs).toString();
    const url = `http://localhost:3001/recipeStream?${queryParams}`;

    try {
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.action === "start") {
            if (data.provider) setCurrentProvider(data.provider);
          } else if (data.action === "chunk") {
            setRecipeText((prev) => prev + data.chunk);
          } else if (data.action === "error") {
            setErrorMessage(data.error || "An error occurred during recipe generation.");
            closeEventStream();
          } else if (data.action === "close") {
            closeEventStream();
          }
        } catch (err) {
          console.error("Error parsing SSE chunk:", err);
        }
      };

      eventSource.onerror = (err) => {
        console.warn("EventSource encountered an error or closed:", err);
        closeEventStream();
      };
    } catch (err) {
      console.error("Error creating EventSource:", err);
      setErrorMessage("Could not connect to the recipe server. Ensure server is running on port 3001.");
      setIsLoading(false);
    }
  }, [closeEventStream]);

  useEffect(() => {
    return () => {
      closeEventStream();
    };
  }, [closeEventStream]);

  // Initialize SSE connection on recipeData change
  useEffect(() => {
    if (recipeData) {
      closeEventStream();
      initializeEventStream(recipeData);
    }
  }, [recipeData, closeEventStream, initializeEventStream]);

  const handleFormSubmit = (data) => {
    setRecipeText("");
    setRecipeData({ ...data, timestamp: Date.now() });
    setActiveTab("generator");
  };

  // Save recipe to favorites
  const handleSaveFavorite = () => {
    if (!recipeText) return;

    // Check if already saved
    const exists = savedRecipes.some((r) => r.text === recipeText);
    let updated;
    if (exists) {
      updated = savedRecipes.filter((r) => r.text !== recipeText);
    } else {
      const firstLine = recipeText.split("\n").find((l) => l.startsWith("# "))?.replace("# ", "") || "Calorie Deficit Recipe";
      const newFav = {
        id: "rec_" + Date.now(),
        title: firstLine,
        text: recipeText,
        date: new Date().toISOString(),
      };
      updated = [newFav, ...savedRecipes];
    }

    setSavedRecipes(updated);
    try {
      localStorage.setItem("nutrichef_saved_recipes", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleDeleteFavorite = (id) => {
    const updated = savedRecipes.filter((r) => r.id !== id);
    setSavedRecipes(updated);
    try {
      localStorage.setItem("nutrichef_saved_recipes", JSON.stringify(updated));
    } catch (e) {}
  };

  const handleLoadFavorite = (item) => {
    setRecipeText(item.text);
    setActiveTab("generator");
  };

  const handleSelectSubIngredient = (ing) => {
    setAppendedIngredient(ing);
    setActiveTab("generator");
  };

  const isCurrentRecipeSaved = savedRecipes.some((r) => r.text === recipeText);

  return (
    <div className="min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white pb-12">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        serverStatus={serverStatus}
        savedCount={savedRecipes.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-sm flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="px-3 py-1 bg-rose-900/60 hover:bg-rose-800 text-xs font-bold rounded-lg transition"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab 1: Recipe Studio */}
        {activeTab === "generator" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Input Form (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 shadow-2xl">
                <div className="mb-4">
                  <h2 className="text-xl font-display font-extrabold text-white tracking-tight">
                    Culinary Customizer
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Set your pantry ingredients, allergy exclusions, and calorie deficit targets.
                  </p>
                </div>

                <RecipeForm
                  onSubmit={handleFormSubmit}
                  isLoading={isLoading}
                  onCancel={closeEventStream}
                  externalAddIngredient={appendedIngredient}
                />
              </div>
            </div>

            {/* Right Column: Recipe Output Canvas (7 cols on lg) */}
            <div className="lg:col-span-7">
              <RecipeView
                recipeText={recipeText}
                isLoading={isLoading}
                currentProvider={currentProvider}
                onSaveFavorite={handleSaveFavorite}
                isSaved={isCurrentRecipeSaved}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Saved Favorites */}
        {activeTab === "favorites" && (
          <FavoritesView
            savedRecipes={savedRecipes}
            onLoadRecipe={handleLoadFavorite}
            onDeleteRecipe={handleDeleteFavorite}
          />
        )}

        {/* Tab 3: Alternative Ingredients & Deficit Matrix */}
        {activeTab === "substitutions" && (
          <SubstitutionGuide onSelectIngredient={handleSelectSubIngredient} />
        )}
      </main>
    </div>
  );
}

export default App;
