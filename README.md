# 🍳 NutriChef AI — Smart Calorie-Deficit & Allergy-Safe Recipe Studio

A modern, full-stack AI-powered culinary recipe platform built with **React**, **Express**, **Tailwind CSS**, and **Multi-Provider AI** (Ollama local Gemma/GPT-OSS, OpenAI GPT-4, and Smart Culinary Fallback Engine).

---

## ✨ Features

- 🥗 **Smart Calorie Deficit Engine**:
  - Calorie deficit presets (Strict `<380 kcal`, Moderate `~450 kcal`, Lean High-Protein `~550 kcal`, and custom slider `250 - 850 kcal`).
  - Automatically identifies high-calorie ingredients and substitutes them with volume-dense, nutrient-rich alternatives.
  - Generates estimated calorie counts and macro breakdowns (Protein, Net Carbs, Fats, Fiber).

- 🛡️ **Allergy & Dietary Shield**:
  - Quick-toggle allergen filters (Dairy, Gluten, Peanuts, Tree Nuts, Shellfish, Eggs, Soy, Sesame, Fish).
  - Dietary modes (Vegan, Vegetarian, Keto, Paleo).
  - Custom allergen write-in tags to strictly exclude and replace allergens with safe culinary substitutes.

- 🔄 **Alternative Ingredients & Deficit Matrix**:
  - Comparison tables showing **Original vs Smart Alternative**, reasons for the swap, and exact **Calories Saved**.
  - Integrated interactive matrix with 1-click "Add to Recipe Generator".

- 👨‍🍳 **Interactive Cooking Experience**:
  - **Live Streaming SSE Generation**: Real-time recipe rendering as the AI generates it.
  - **Interactive Ingredient Checklist**: Clickable checkboxes with strike-through states.
  - **Step-by-Step Cooking Mode**: Guided walkthrough with progress tracker and visual step cards.
  - **Active Kitchen Timer**: Built-in countdown timer with audio alerts and preset cooking times (5m, 10m, 15m, 25m, 40m).
  - **Recipe Book**: Save favorites to `localStorage`, search saved recipes, copy markdown, and print.

- 🤖 **Multi-Provider AI Support**:
  - **Ollama Local AI** (Automatically detects local models like `gemma3` or `gpt-oss`).
  - **OpenAI GPT-4** (Configurable via `OPENAI_API_KEY` in `.env`).
  - **Smart Culinary Engine** (Zero-downtime algorithmic fallback ensuring recipes always generate instantly).

---

## 🚀 Getting Started

### 1. Start the Backend Server

```bash
cd server
npm install
node server.js
```
The server runs on **http://localhost:3001** and provides:
- `GET /recipeStream` — Server-Sent Events (SSE) streaming endpoint.
- `GET /api/health` — Provider detection and health status.

### 2. Start the Frontend Client

```bash
cd client/recipe-generator
npm install
npm start
```
Open **http://localhost:3000** in your browser.

---

## 🛠️ Configuration (`server/.env`)

```env
PORT=3001
OLLAMA_HOST=http://localhost:11434
# Optional: OpenAI API Key (leave empty to use local Ollama or Smart Engine)
# OPENAI_API_KEY=sk-...
```
