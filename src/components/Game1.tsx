"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Game1() {
  const holes = Array.from({ length: 9 });

  const [moleIndex, setMoleIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [time, setTime] = useState<number>(30);
  const [gameActive, setGameActive] = useState<boolean>(false);
  const [highScore, setHighScore] = useState<number>(0);

  // Load High Score from LocalStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("whack_highscore");
    if (savedHighScore) {
      setHighScore(Number(savedHighScore));
    }
  }, []);

  // Mole movement logic
useEffect(() => {
    if (!gameActive) return;

    const moleTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * holes.length);
    setMoleIndex(randomIndex);
    }, 700);

    return () => clearInterval(moleTimer);
}, [gameActive]);

// Timer and Game Over logic
useEffect(() => {
  if (!gameActive) return;

  if (time <= 0) {
    // Hentikan semua toast yang sedang berjalan untuk menghindari tabrakan memori
    toast.dismiss(); 
    
    setGameActive(false);
    toast.info("⏰ Waktu habis!", { autoClose: 1500 });

    if (score > highScore) {
      localStorage.setItem("whack_highscore", score.toString());
      setHighScore(score);
      toast.success("🎉 New High Score!", { autoClose: 1500 });
    }
    return;
  }

  const countdown = setInterval(() => {
    setTime((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(countdown);
}, [gameActive, time, score, highScore]);

  const hitMole = (index: number) => {
    if (index === moleIndex && gameActive) {
      setScore((prev) => prev + 1);
      setMoleIndex(null);
    }
  };

  const startGame = () => {
    setScore(0);
    setTime(30);
    setGameActive(true);

    toast.info("⏱️ Waktu dimulai! Kamu punya 30 detik!", {
      autoClose: 1500,
    });
  };

  return (
    <div className="game-container">
      <div className="game-panel">
        <h1 className="game-title">🎮 Tap the Mouse</h1>

        <div className="game-stats">
          <div className="score">🏆 Score: {score}</div>
          <div className="timer">⏱️ Time: {time}</div>
        </div>

        <div className="highscore">
          ⭐ High Score: {highScore}
        </div>

        {!gameActive && (
          <button className="start-btn" onClick={startGame}>
            🚀 Start Game
          </button>
        )}
      </div>

      <div className="game-grid">
        {holes.map((_, index) => (
          <div
            key={index}
            onClick={() => hitMole(index)}
            className="hole"
          >
            {moleIndex === index && (
              <div className="mole">🐹</div>
            )}
          </div>
        ))}
      </div>


    </div>
  );
}