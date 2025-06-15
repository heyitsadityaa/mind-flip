import React, { useState, useEffect, useCallback } from "react";
import { cardCategories, CardCategory } from "../data";

interface Card {
  id: number;
  name: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGameFunctional: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(6);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showingPreview, setShowingPreview] = useState(false);
  const [previewCountdown, setPreviewCountdown] = useState(5);
  const [selectedCategory, setSelectedCategory] =
    useState<CardCategory>("animals");

  const shuffleArray = useCallback((array: Card[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }, []);
  const prepareGame = useCallback(() => {
    console.log("Preparing game with useEffect");
    // Create pairs of cards
    const categoryData = cardCategories[selectedCategory];
    const gameCards: Card[] = [];

    categoryData.cards.forEach((item, index) => {
      // Add two cards for each item
      gameCards.push({
        id: index * 2,
        name: item.name,
        image: item.image,
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: index * 2 + 1,
        name: item.name,
        image: item.image,
        isFlipped: false,
        isMatched: false,
      });
    });

    // Shuffle the cards
    const shuffledCards = shuffleArray(gameCards);

    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setScore(0);
    setLives(6);
    setGameOver(false);
    setGameWon(false);
    setMoves(0);
    setGameStarted(false);
    setShowingPreview(false);
    setPreviewCountdown(5);
  }, [shuffleArray, selectedCategory]);

  const startGame = useCallback(() => {
    setShowingPreview(true);
    setPreviewCountdown(5);

    const countdownInterval = setInterval(() => {
      setPreviewCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          setShowingPreview(false);
          setGameStarted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const initializeGame = useCallback(() => {
    prepareGame();
  }, [prepareGame]);
  // useEffect equivalent to componentDidMount
  useEffect(() => {
    prepareGame();
  }, [prepareGame]);

  // useEffect to handle card matching logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      const timer = setTimeout(() => {
        const [firstId, secondId] = flippedCards;
        const firstCard = cards.find((c) => c.id === firstId);
        const secondCard = cards.find((c) => c.id === secondId);

        if (firstCard && secondCard && firstCard.name === secondCard.name) {
          // Match found
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.id === firstId || c.id === secondId
                ? { ...c, isMatched: true, isFlipped: true }
                : { ...c, isFlipped: false }
            )
          );
          setMatchedPairs((prev) => prev + 1);
          setScore((prev) => prev + 10);
          setFlippedCards([]);
        } else {
          // No match
          setCards((prevCards) =>
            prevCards.map((c) => ({ ...c, isFlipped: false }))
          );
          setLives((prev) => prev - 1);
          setFlippedCards([]);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [flippedCards, cards]);
  // useEffect to check win/lose conditions
  useEffect(() => {
    const categoryData = cardCategories[selectedCategory];
    if (matchedPairs === categoryData.cards.length) {
      setGameWon(true);
    }
  }, [matchedPairs, selectedCategory]);

  useEffect(() => {
    if (lives <= 0) {
      setGameOver(true);
    }
  }, [lives]);
  const handleCardClick = (cardId: number) => {
    if (
      !gameStarted ||
      showingPreview ||
      gameOver ||
      gameWon ||
      flippedCards.length >= 2
    )
      return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards((prevCards) =>
      prevCards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    setFlippedCards((prev) => [...prev, cardId]);
    setMoves((prev) => prev + 1);
  };
  const resetGame = () => {
    prepareGame();
  };

  const handleCategoryChange = (category: CardCategory) => {
    setSelectedCategory(category);
  };

  // useEffect to reset game when category changes
  useEffect(() => {
    prepareGame();
  }, [selectedCategory, prepareGame]);
  const currentCategory = cardCategories[selectedCategory];
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${currentCategory.color} p-2 sm:p-4`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-3 sm:mb-6">
          Memory Game (Functional Component)
        </h1>{" "}
        {/* Category Selector */}
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 mb-3 sm:mb-6">
          <h3 className="text-sm sm:text-lg font-semibold mb-2 sm:mb-3 text-gray-800 text-center">
            Choose Category
          </h3>
          <div className="flex justify-center gap-1 sm:gap-2">
            {Object.entries(cardCategories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key as CardCategory)}
                disabled={gameStarted || showingPreview}
                className={`
                  px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-all
                  ${
                    selectedCategory === key
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }
                  ${
                    gameStarted || showingPreview
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>{" "}
        {/* Game Stats */}
        <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 mb-3 sm:mb-6">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
            <div>
              <span className="text-xs sm:text-sm text-gray-600">Lives</span>
              <div className="text-lg sm:text-2xl font-bold text-red-500">
                {lives}/6
              </div>
            </div>
            <div>
              <span className="text-xs sm:text-sm text-gray-600">Score</span>
              <div className="text-lg sm:text-2xl font-bold text-green-500">
                {score}
              </div>
            </div>
            <div>
              <span className="text-xs sm:text-sm text-gray-600">Correct</span>
              <div className="text-lg sm:text-2xl font-bold text-blue-500">
                {matchedPairs}
              </div>
            </div>
            <div>
              <span className="text-xs sm:text-sm text-gray-600">Moves</span>
              <div className="text-lg sm:text-2xl font-bold text-purple-500">
                {moves}
              </div>
            </div>
          </div>
        </div>{" "}
        {/* Start Game Screen */}
        {!gameStarted && !showingPreview && (
          <div className="text-center mb-6">
            <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800">
                Ready to Start?
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                Click "Start Game" to see all cards for 5 seconds, then try to
                match the pairs!
              </p>
              <button
                onClick={startGame}
                className="bg-green-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-lg sm:text-xl"
              >
                🎮 START GAME
              </button>
            </div>
          </div>
        )}
        {/* Preview Countdown */}
        {showingPreview && (
          <div className="text-center mb-4">
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-3 sm:p-4">
              <h2 className="text-lg sm:text-2xl font-bold text-yellow-800 mb-2">
                Memorize the cards!
              </h2>
              <div className="text-3xl sm:text-4xl font-bold text-yellow-600">
                {previewCountdown}
              </div>
            </div>
          </div>
        )}{" "}
        {/* Game Board */}
        {(gameStarted || showingPreview) && (
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-1 sm:gap-2 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className={`
                    aspect-square bg-white rounded-lg shadow-lg cursor-pointer
                    transform transition-all duration-300 hover:scale-105
                    ${
                      card.isMatched
                        ? "bg-green-100 border-2 border-green-400"
                        : ""
                    }
                    ${
                      card.isFlipped || card.isMatched || showingPreview
                        ? ""
                        : "hover:bg-gray-50"
                    }
                    ${
                      !gameStarted || showingPreview ? "cursor-not-allowed" : ""
                    }
                  `}
                  onClick={() => handleCardClick(card.id)}
                >
                  <div className="w-full h-full flex items-center justify-center text-xl sm:text-2xl lg:text-4xl">
                    {card.isFlipped || card.isMatched || showingPreview
                      ? card.image
                      : "❓"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Game Over / Win Message */}
        {(gameOver || gameWon) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 text-center max-w-md">
              <h2
                className={`text-3xl font-bold mb-4 ${
                  gameWon ? "text-green-500" : "text-red-500"
                }`}
              >
                {gameWon ? "🎉 Congratulations!" : "💔 Game Over"}
              </h2>
              <p className="text-gray-600 mb-4">
                {gameWon
                  ? `You won with ${score} points in ${moves} moves!`
                  : "Better luck next time!"}
              </p>
              <button
                onClick={resetGame}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                🔄 RESET GAME
              </button>
            </div>
          </div>
        )}
        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetGame}
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          >
            🔄 RESET GAME
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoryGameFunctional;
