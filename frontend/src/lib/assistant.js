function parseBudget(text) {
  const match = text.match(/(?:under|below|budget|within|rs|rupees?)\s*([0-9]{2,5})/i);
  return match ? Number(match[1]) : null;
}

function normalizeCatalog(catalog = {}) {
  const restaurants = Array.isArray(catalog.restaurants) ? catalog.restaurants : [];
  const items = Array.isArray(catalog.items) ? catalog.items : [];
  return { restaurants, items };
}

function scoreItem(item, query) {
  const lower = query.toLowerCase();
  let score = 0;

  if (lower.includes("veg") && item.isVeg) score += 3;
  if ((lower.includes("sweet") || lower.includes("dessert")) && item.category?.toLowerCase().includes("dessert")) score += 4;
  if ((lower.includes("cold") || lower.includes("drink") || lower.includes("coffee")) && /coffee|chai|kulfi|dessert/i.test(item.name)) score += 4;
  if ((lower.includes("healthy") || lower.includes("light")) && (item.isVeg || /dosa|sadya|prawn/i.test(item.name))) score += 3;
  if (lower.includes("spicy") && /biryani|chicken|tikka|chaat/i.test(item.name)) score += 3;
  if (lower.includes("combo") && item.category?.toLowerCase().includes("combo")) score += 4;

  const tokens = lower.split(/\s+/).filter((token) => token.length > 2);
  tokens.forEach((token) => {
    if (item.name?.toLowerCase().includes(token)) score += 2;
    if (item.category?.toLowerCase().includes(token)) score += 1;
    if (item.restaurantName?.toLowerCase().includes(token)) score += 1;
  });

  return score;
}

function formatItems(items) {
  if (!items.length) return "I couldn't find an exact match, but I can still suggest something if you tell me veg/non-veg, spicy, sweet, or your budget.";

  return items
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} from ${item.restaurantName || "CafeFlow"} - Rs${item.price}`
    )
    .join("\n");
}

export function getBudgetRecommendations(maxBudget, catalog) {
  const { items } = normalizeCatalog(catalog);
  const filtered = items
    .filter((item) => item.price <= maxBudget)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0) || a.price - b.price)
    .slice(0, 4);

  if (!filtered.length) {
    return `I couldn't find anything under Rs${maxBudget}. Try a slightly higher budget and I'll suggest better options.`;
  }

  return `Here are good picks under Rs${maxBudget}:\n${formatItems(filtered)}`;
}

export function analyzeUploadedPhoto(file, catalog) {
  const { items } = normalizeCatalog(catalog);
  const lowerName = file.name.toLowerCase();

  const guessedMatches = items.filter((item) => {
    const name = (item.name || "").toLowerCase();
    return (
      lowerName.includes(name.split(" ")[0]) ||
      lowerName.includes((item.category || "").toLowerCase()) ||
      (/biryani|chai|coffee|kulfi|dosa|prawn|paneer|chicken/.test(lowerName) &&
        /biryani|chai|coffee|kulfi|dosa|prawn|paneer|chicken/.test(name))
    );
  });

  const best = guessedMatches.slice(0, 3);

  if (!best.length) {
    return `Photo uploaded: ${file.name}. I saved the preview. I can't fully recognize the image locally, but if you tell me what it is, I can recommend matching dishes or combos.`;
  }

  return `Photo uploaded: ${file.name}. This looks closest to:\n${formatItems(best)}`;
}

export function generateAssistantReply(query, catalog) {
  const { restaurants, items } = normalizeCatalog(catalog);
  const trimmed = query.trim();
  if (!trimmed) return "Ask me about dishes, budgets, sweet items, healthy food, combos, or restaurant suggestions.";

  const budget = parseBudget(trimmed);
  if (budget) {
    return getBudgetRecommendations(budget, { restaurants, items });
  }

  const lower = trimmed.toLowerCase();

  if (lower.includes("restaurant") || lower.includes("where should i order")) {
    const restaurantText = restaurants
      .slice(0, 5)
      .map((restaurant, index) => `${index + 1}. ${restaurant.name} - ${(restaurant.cuisine || []).join(", ")}`)
      .join("\n");
    return `Here are strong restaurant picks right now:\n${restaurantText}`;
  }

  if (lower.includes("combo")) {
    const combos = items.filter((item) => item.category?.toLowerCase().includes("combo"));
    return combos.length
      ? `Best combo-style picks:\n${formatItems(combos.slice(0, 3))}`
      : "I can build combos for you from a restaurant menu. Open a restaurant and check the combo section there.";
  }

  const ranked = items
    .map((item) => ({ item, score: scoreItem(item, trimmed) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || (b.item.rating || 0) - (a.item.rating || 0) || a.item.price - b.item.price)
    .slice(0, 4)
    .map((entry) => entry.item);

  if (ranked.length) {
    return `Here are the best matches for "${trimmed}":\n${formatItems(ranked)}`;
  }

  const fallback = items
    .slice()
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 4);

  return `I didn't find an exact match for "${trimmed}", but these are popular picks:\n${formatItems(fallback)}`;
}



