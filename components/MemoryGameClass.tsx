import React, { Component } from "react";
import { cardCategories, CardCategory } from "../data";

interface Card {
  id: number;
  name: string;
  image: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameState {
  cards: Card[];
  flippedCards: number[];
  matchedPairs: number;
  score: number;
  lives: number;
  gameOver: boolean;
  gameWon: boolean;
  moves: number;
  gameStarted: boolean;
  showingPreview: boolean;
  previewCountdown: number;
  selectedCategory: CardCategory;
}

class MemoryGameClass extends Component<{}, GameState> {
  private flipTimeout: NodeJS.Timeout | null = null;
  private previewTimer: NodeJS.Timeout | null = null;
  constructor(props: {}) {
    super(props);
    this.state = {
      cards: [],
      flippedCards: [],
      matchedPairs: 0,
      score: 0,
      lives: 6,
      gameOver: false,
      gameWon: false,
      moves: 0,
      gameStarted: false,
      showingPreview: false,
      previewCountdown: 5,
      selectedCategory: "animals",
    };
  }
  componentDidMount() {
    console.log("Component mounted - preparing game");
    this.prepareGame();
  }

  componentWillUnmount() {
    if (this.flipTimeout) {
      clearTimeout(this.flipTimeout);
    }
    if (this.previewTimer) {
      clearTimeout(this.previewTimer);
    }
  }
  prepareGame = () => {
    // Create pairs of cards but don't start the game yet
    const { selectedCategory } = this.state;
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
    const shuffledCards = this.shuffleArray(gameCards);

    this.setState({
      cards: shuffledCards,
      flippedCards: [],
      matchedPairs: 0,
      score: 0,
      lives: 6,
      gameOver: false,
      gameWon: false,
      moves: 0,
      gameStarted: false,
      showingPreview: false,
      previewCountdown: 5,
    });
  };
  startGame = () => {
    // Show all cards for 5 seconds
    this.setState({
      showingPreview: true,
      previewCountdown: 5,
    });

    // Start countdown
    const countdownInterval = setInterval(() => {
      this.setState((prevState) => {
        const newCountdown = prevState.previewCountdown - 1;
        if (newCountdown <= 0) {
          clearInterval(countdownInterval);
          return {
            showingPreview: false,
            gameStarted: true,
            previewCountdown: 0,
          };
        }
        return {
          previewCountdown: newCountdown,
          showingPreview: true,
          gameStarted: false,
        };
      });
    }, 1000);
  };

  initializeGame = () => {
    this.prepareGame();
  };

  shuffleArray = (array: Card[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };
  handleCardClick = (cardId: number) => {
    const {
      cards,
      flippedCards,
      gameOver,
      gameWon,
      gameStarted,
      showingPreview,
    } = this.state;

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

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );

    const newFlippedCards = [...flippedCards, cardId];

    this.setState({
      cards: newCards,
      flippedCards: newFlippedCards,
      moves: this.state.moves + 1,
    });

    if (newFlippedCards.length === 2) {
      this.flipTimeout = setTimeout(() => {
        this.checkForMatch(newFlippedCards);
      }, 1000);
    }
  };

  checkForMatch = (flippedCardIds: number[]) => {
    const { cards } = this.state;
    const [firstId, secondId] = flippedCardIds;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    if (firstCard && secondCard && firstCard.name === secondCard.name) {
      // Match found
      const newCards = cards.map((c) =>
        c.id === firstId || c.id === secondId
          ? { ...c, isMatched: true, isFlipped: true }
          : { ...c, isFlipped: false }
      );
      const newMatchedPairs = this.state.matchedPairs + 1;
      const newScore = this.state.score + 10;
      const categoryData = cardCategories[this.state.selectedCategory];
      const gameWon = newMatchedPairs === categoryData.cards.length;

      this.setState({
        cards: newCards,
        flippedCards: [],
        matchedPairs: newMatchedPairs,
        score: newScore,
        gameWon,
      });
    } else {
      // No match
      const newCards = cards.map((c) => ({ ...c, isFlipped: false }));
      const newLives = this.state.lives - 1;
      const gameOver = newLives <= 0;

      this.setState({
        cards: newCards,
        flippedCards: [],
        lives: newLives,
        gameOver,
      });
    }
  };
  resetGame = () => {
    if (this.previewTimer) {
      clearTimeout(this.previewTimer);
    }
    this.prepareGame();
  };

  handleCategoryChange = (category: CardCategory) => {
    this.setState({ selectedCategory: category }, () => {
      this.prepareGame();
    });
  };
  render() {
    const {
      cards,
      score,
      lives,
      gameOver,
      gameWon,
      moves,
      gameStarted,
      showingPreview,
      previewCountdown,
      selectedCategory,
    } = this.state;
    const currentCategory = cardCategories[selectedCategory];
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${currentCategory.color} p-2 sm:p-4`}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white mb-3 sm:mb-6">
            Memory Game (Class Component)
          </h1>
          {/* Category Selector */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-gray-800 text-center">
              Choose Category
            </h3>
            <div className="flex justify-center gap-2">
              {Object.entries(cardCategories).map(([key, category]) => (
                <button
                  key={key}
                  onClick={() => this.handleCategoryChange(key as CardCategory)}
                  disabled={gameStarted || showingPreview}
                  className={`
                    px-4 py-2 rounded-lg font-medium transition-all
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
          </div>
          {/* Game Stats */}
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-gray-600">Lives</span>
                <div className="text-2xl font-bold text-red-500">{lives}/6</div>
              </div>
              <div>
                <span className="text-gray-600">Score</span>
                <div className="text-2xl font-bold text-green-500">{score}</div>
              </div>
              <div>
                <span className="text-gray-600">Correct</span>
                <div className="text-2xl font-bold text-blue-500">
                  {this.state.matchedPairs}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Moves</span>
                <div className="text-2xl font-bold text-purple-500">
                  {moves}
                </div>
              </div>
            </div>
          </div>
          {/* Start Game Screen */}
          {!gameStarted && !showingPreview && (
            <div className="text-center mb-6">
              <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  Ready to Start?
                </h2>
                <p className="text-gray-600 mb-6">
                  Click "Start Game" to see all cards for 5 seconds, then try to
                  match the pairs!
                </p>
                <button
                  onClick={this.startGame}
                  className="bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors text-xl"
                >
                  🎮 START GAME
                </button>
              </div>
            </div>
          )}
          {/* Preview Countdown */}
          {showingPreview && (
            <div className="text-center mb-6">
              <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
                <h2 className="text-2xl font-bold text-yellow-800 mb-2">
                  Memorize the cards!
                </h2>
                <div className="text-4xl font-bold text-yellow-600">
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
                        !gameStarted || showingPreview
                          ? "cursor-not-allowed"
                          : ""
                      }
                    `}
                    onClick={() => this.handleCardClick(card.id)}
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
                  onClick={this.resetGame}
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
              onClick={this.resetGame}
              className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
            >
              🔄 RESET GAME
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default MemoryGameClass;
