"use client";

import { useState } from "react";
import MemoryGameClass from "../components/MemoryGameClass";
import MemoryGameFunctional from "../components/MemoryGameFunctional";

export default function Home() {
  const [gameVersion, setGameVersion] = useState<"class" | "functional">(
    "class"
  );

  return (
    <div className="min-h-screen">
      {/* Version Selector */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-sm font-semibold mb-2 text-gray-700">
            Game Version:
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setGameVersion("class")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                gameVersion === "class"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Class Component
            </button>
            <button
              onClick={() => setGameVersion("functional")}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                gameVersion === "functional"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Functional Component
            </button>
          </div>
        </div>
      </div>

      {/* Render the selected game version */}
      {gameVersion === "class" ? <MemoryGameClass /> : <MemoryGameFunctional />}
    </div>
  );
}
