# Mind Flip - Memory Game

A React-based memory matching game that demonstrates both class components with lifecycle methods and functional components with hooks.

## Features

- **Dual Implementation**: Switch between class component (with `componentDidMount`) and functional component (with `useEffect`)
- **Memory Matching Game**: Match pairs of animal cards
- **Game Mechanics**:
  - Lives system (6 lives)
  - Score tracking (10 points per match)
  - Move counter
  - Win/Lose conditions
- **Beautiful UI**: Modern design with Tailwind CSS
- **Responsive Design**: Works on different screen sizes

## Game Rules

1. Click on cards to flip them over
2. Try to match pairs of identical animals
3. You have 6 lives - lose a life for each wrong match
4. Win by matching all pairs before running out of lives
5. Score 10 points for each successful match

## Component Lifecycle Learning

### Class Component Version

- Uses `componentDidMount()` to initialize the game state
- Uses `componentWillUnmount()` for cleanup
- Demonstrates traditional React class component patterns

### Functional Component Version

- Uses `useEffect()` with empty dependency array (equivalent to `componentDidMount`)
- Uses `useEffect()` with dependencies for game logic
- Uses `useState()` for state management
- Uses `useCallback()` for performance optimization

## Tech Stack

- **React 19** with TypeScript
- **Next.js 15.3.3** for the framework
- **Tailwind CSS 4** for styling
- **Animal Emojis** for card graphics

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── page.tsx          # Main page with version selector
│   ├── layout.tsx        # App layout
│   └── globals.css       # Global styles
├── components/
│   ├── MemoryGameClass.tsx      # Class component version
│   └── MemoryGameFunctional.tsx # Functional component version
├── data/
│   └── index.ts          # Animal cards data
└── public/               # Static assets
```

## Learning Objectives

This project demonstrates:

- Class component lifecycle methods (`componentDidMount`, `componentWillUnmount`)
- Functional component hooks (`useEffect`, `useState`, `useCallback`)
- State management patterns
- Event handling
- Game logic implementation
- TypeScript with React
- Modern CSS with Tailwind

## Assignment Completion

✅ **Built memory game app using React**  
✅ **Started with class component**  
✅ **Implemented `componentDidMount` method**  
✅ **Refactored to functional component**  
✅ **Used `useEffect` hook**  
✅ **Complete game functionality with matching pairs**
