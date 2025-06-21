// Hint function - briefly shows all cards
  const showHint = () => {
    if (hintUsed) return;
    
    setHintUsed(true);
    const allFlippedCards = cards.map(card => ({ ...card, isFlipped: true }));
    setCards(allFlippedCards);
    
    setTimeout(() => {
      setCards(cards.map(card => 
        card.isMatched ? card : { ...card, isFlipped: false }
      ));
    }, 2000);
  };import React, { useState, useEffect } from 'react';

const KidsMatchingGame = () => {
  // Sound functions
  const playSound = (frequency, duration, type = 'sine') => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  };

  const playFlipSound = () => {
    playSound(800, 0.2, 'triangle');
  };

  const playMatchSound = () => {
    // Play a pleasant chord
    playSound(523, 0.5, 'sine'); // C
    setTimeout(() => playSound(659, 0.5, 'sine'), 100); // E
    setTimeout(() => playSound(784, 0.5, 'sine'), 200); // G
  };

  const playNoMatchSound = () => {
    // Gentle descending sound
    playSound(400, 0.3, 'sine');
    setTimeout(() => playSound(350, 0.3, 'sine'), 150);
  };
  // Game symbols - using emojis that kids love (4 pairs for even number)
  const symbols = ['🐶', '🐱', '🐸', '🌟'];
  
  // Create pairs of cards (8 cards total - 4 pairs for even number)
  const createCards = () => {
    const cards = [];
    // Create 4 pairs (8 cards)
    symbols.forEach((symbol, index) => {
      cards.push({ id: index * 2, symbol, isFlipped: false, isMatched: false });
      cards.push({ id: index * 2 + 1, symbol, isFlipped: false, isMatched: false });
    });
    return cards.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(createCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [tipShown, setTipShown] = useState(false);

  // Handle card click
  const handleCardClick = (clickedCard) => {
    if (flippedCards.length === 2 || clickedCard.isFlipped || clickedCard.isMatched) {
      return;
    }

    // Play flip sound
    playFlipSound();

    const newCards = cards.map(card =>
      card.id === clickedCard.id ? { ...card, isFlipped: true } : card
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, clickedCard]);
  };

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(moves + 1);
      
      if (flippedCards[0].symbol === flippedCards[1].symbol) {
        // Match found!
        playMatchSound();
        setTimeout(() => {
          setCards(cards.map(card =>
            card.symbol === flippedCards[0].symbol
              ? { ...card, isMatched: true }
              : card
          ));
          setScore(score + 10);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        playNoMatchSound();
        setTimeout(() => {
          setCards(cards.map(card =>
            flippedCards.some(flipped => flipped.id === card.id)
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1500);
      }
    }
  }, [flippedCards]);

  // Check if game is won
  useEffect(() => {
    if (cards.every(card => card.isMatched) && cards.length > 0) {
      setGameWon(true);
    }
  }, [cards]);

  // Reset game
  const resetGame = () => {
    setCards(createCards());
    setFlippedCards([]);
    setScore(0);
    setMoves(0);
    setGameWon(false);
    setHintUsed(false);
    setTipShown(false);
  };

  // Tip player function - shows a helpful tip
  const showTip = () => {
    if (tipShown) return;
    
    setTipShown(true);
    // Find an unmatched pair to highlight
    const unmatchedCards = cards.filter(card => !card.isMatched && !card.isFlipped);
    if (unmatchedCards.length >= 2) {
      const firstSymbol = unmatchedCards[0].symbol;
      const matchingCard = unmatchedCards.find(card => card.symbol === firstSymbol && card.id !== unmatchedCards[0].id);
      
      if (matchingCard) {
        // Briefly highlight the matching pair
        const highlightCards = cards.map(card => 
          (card.id === unmatchedCards[0].id || card.id === matchingCard.id)
            ? { ...card, isFlipped: true }
            : card
        );
        setCards(highlightCards);
        
        setTimeout(() => {
          setCards(cards.map(card => 
            card.isMatched ? card : { ...card, isFlipped: false }
          ));
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-yellow-300 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            🎮 Match Master 🎮
          </h1>
          <div className="flex justify-center items-center gap-6 text-white text-lg font-semibold">
            <div className="bg-blue-500 px-4 py-2 rounded-full shadow-lg">
              Score: {score}
            </div>
            <div className="bg-green-500 px-4 py-2 rounded-full shadow-lg">
              Moves: {moves}
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={resetGame}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            🔄 New Game
          </button>
          <button
            onClick={showHint}
            disabled={hintUsed}
            className={`font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 ${
              hintUsed 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
            }`}
          >
            💡 {hintUsed ? 'Hint Used' : 'Show All'}
          </button>
          <button
            onClick={showTip}
            disabled={tipShown}
            className={`font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 ${
              tipShown 
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            🎯 {tipShown ? 'Tip Used' : 'Tip Player'}
          </button>
        </div>

        {/* Game Board - 4x2 Grid for 8 cards */}
        <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`
                aspect-square rounded-2xl shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105
                ${card.isFlipped || card.isMatched
                  ? 'bg-white border-4 border-yellow-400'
                  : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500'
                }
                ${card.isMatched ? 'ring-4 ring-green-400 ring-opacity-75' : ''}
              `}
            >
              <div className="w-full h-full flex items-center justify-center text-7xl">
                {card.isFlipped || card.isMatched ? (
                  <span className="animate-bounce">
                    {card.symbol}
                  </span>
                ) : (
                  <span className="text-white text-8xl font-bold">?</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Win Message */}
        {gameWon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 text-center shadow-2xl animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-purple-600 mb-4">
                Congratulations! 🌟
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                You won with a score of {score} in {moves} moves!
              </p>
              <button
                onClick={resetGame}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold px-8 py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                🎮 Play Again
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white bg-opacity-90 rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-xl font-bold text-purple-600 mb-2">How to Play Match Master:</h3>
          <p className="text-gray-700">
            Click on cards to flip them over. Find matching pairs to score points! 
            Use "Show All" to peek at all cards, or "Tip Player" to see one matching pair! 🎯
          </p>
        </div>
      </div>
    </div>
  );
};

export default KidsMatchingGame;
