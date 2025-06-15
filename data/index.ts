export const animalCards = [
  { name: "dog", image: "🐶" },
  { name: "pig", image: "🐷" },
  { name: "lion", image: "🦁" },
  { name: "tiger", image: "🐯" },
  { name: "bear", image: "🐻" },
  { name: "panda", image: "🐼" },
  { name: "polar-bear", image: "🐻‍❄️" },
  { name: "monkey", image: "🐵" },
];

export const foodCards = [
  { name: "pizza", image: "🍕" },
  { name: "burger", image: "🍔" },
  { name: "apple", image: "🍎" },
  { name: "banana", image: "🍌" },
  { name: "cake", image: "🍰" },
  { name: "donut", image: "🍩" },
  { name: "ice-cream", image: "🍦" },
  { name: "taco", image: "🌮" },
];

export const symbolCards = [
  { name: "star", image: "⭐" },
  { name: "heart", image: "❤️" },
  { name: "diamond", image: "💎" },
  { name: "crown", image: "👑" },
  { name: "fire", image: "🔥" },
  { name: "lightning", image: "⚡" },
  { name: "flower", image: "🌸" },
  { name: "rocket", image: "🚀" },
];

export const cardCategories = {
  animals: {
    name: "Animals",
    cards: animalCards,
    color: "from-purple-400 to-pink-400",
  },
  food: { name: "Food", cards: foodCards, color: "from-orange-400 to-red-400" },
  symbols: {
    name: "Symbols",
    cards: symbolCards,
    color: "from-blue-400 to-indigo-600",
  },
} as const;

export type CardCategory = keyof typeof cardCategories;
