
"use client";

import { useEffect, useRef, useState } from "react";

import Login from "@/components/authentication/Login";
import Register from "@/components/authentication/Register";
import Dashboard from "@/components/dashboard/Dashboard";
import FishGame from "@/components/game/FishGame";

type PageType = "login" | "register" | "dashboard" | "game" | "completed";

interface PlayerProgress {
  coins: number;
  xp: number;
  level: number;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState<PageType>("login");
  const [username, setUsername] = useState("");
  const [coins, setCoins] = useState(0);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [musicOn, setMusicOn] = useState(false);

  // Load saved player when application starts
  useEffect(() => {
    const savedUsername = localStorage.getItem("underwaterCurrentPlayer");

    if (savedUsername) {
      setUsername(savedUsername);

      const savedProgress = localStorage.getItem(
        `underwaterProgress_${savedUsername}`
      );

      if (savedProgress) {
        try {
          const progress: PlayerProgress = JSON.parse(savedProgress);

          setCoins(progress.coins);
          setXp(progress.xp);
          setLevel(progress.level);
        } catch {
          console.error("Could not load player progress.");
        }
      }

      setCurrentPage("dashboard");
    }
  }, []);

  // Background music
  const toggleMusic = async () => {
    if (!audioRef.current) return;

    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      audioRef.current.volume = 0.12;

      try {
        await audioRef.current.play();
        setMusicOn(true);
      } catch {
        console.error("Could not play music.");
      }
    }
  };

  // Load player after login or registration
  const loadPlayer = (playerName: string) => {
    setUsername(playerName);

    const savedProgress = localStorage.getItem(
      `underwaterProgress_${playerName}`
    );

    if (savedProgress) {
      try {
        const progress: PlayerProgress = JSON.parse(savedProgress);

        setCoins(progress.coins);
        setXp(progress.xp);
        setLevel(progress.level);
      } catch {
        setCoins(0);
        setXp(0);
        setLevel(1);
      }
    } else {
      setCoins(0);
      setXp(0);
      setLevel(1);
    }

    localStorage.setItem("underwaterCurrentPlayer", playerName);
    setCurrentPage("dashboard");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("underwaterCurrentPlayer");

    setUsername("");
    setCoins(0);
    setXp(0);
    setLevel(1);
    setCurrentPage("login");
  };

  // Add coins after a correct fish answer
  const handleReward = (amount: number) => {
    setCoins((previousCoins) => previousCoins + amount);
  };

  // Add XP after a correct chest answer
  const handleXPReward = (amount: number) => {
    setXp((previousXP) => previousXP + amount);
  };

  // Complete current level
  const handleLevelComplete = () => {
    if (level >= 5) {
      setLevel(6);
      setCurrentPage("completed");
    } else {
      setLevel((previousLevel) => previousLevel + 1);
      setCurrentPage("dashboard");
    }
  };

  // Restart the entire game
  const handlePlayAgain = () => {
    setCoins(0);
    setXp(0);
    setLevel(1);
    setCurrentPage("dashboard");
  };

  // Save progress to localStorage
  useEffect(() => {
    if (!username) return;

    const progress: PlayerProgress = {
      coins,
      xp,
      level,
    };

    localStorage.setItem(
      `underwaterProgress_${username}`,
      JSON.stringify(progress)
    );
  }, [username, coins, xp, level]);

  // Save progress to SQLite leaderboard
  useEffect(() => {
    if (!username) return;

    const saveProgress = async () => {
      try {
        const response = await fetch("/api/leaderboard", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            coins,
            xp,
            level,
          }),
        });

        if (!response.ok) {
          console.error(
            "Failed to save leaderboard progress:",
            await response.text()
          );
        }
      } catch (error) {
        console.error("Leaderboard save error:", error);
      }
    };

    saveProgress();
  }, [username, coins, xp, level]);

  return (
    <main>
      <audio
        ref={audioRef}
        src="/music/ocean.mp3"
        loop
        preload="auto"
      />

      {/* Background Music Button */}
      <button
        type="button"
        onClick={toggleMusic}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-cyan-400 px-5 py-3 font-bold text-blue-950 shadow-lg hover:bg-cyan-300"
      >
        {musicOn ? "🔊 Music ON" : "🔇 Music OFF"}
      </button>

      {/* Login Page */}
      {currentPage === "login" && (
        <Login
          onLogin={loadPlayer}
          onShowRegister={() => setCurrentPage("register")}
        />
      )}

      {/* Register Page */}
      {currentPage === "register" && (
        <Register
          onRegister={loadPlayer}
          onShowLogin={() => setCurrentPage("login")}
        />
      )}

      {/* Dashboard Page */}
      {currentPage === "dashboard" && (
        <Dashboard
          username={username}
          coins={coins}
          xp={xp}
          level={level}
          onPlay={() => setCurrentPage("game")}
          onLogout={handleLogout}
        />
      )}

      {/* Game Page */}
      {currentPage === "game" && (
        <FishGame
          onBack={() => setCurrentPage("dashboard")}
          onReward={handleReward}
          onXPReward={handleXPReward}
          onLevelComplete={handleLevelComplete}
          level={level}
        />
      )}

      {/* Game Completed Screen */}
      {currentPage === "completed" && (
        <section className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#001b4d] via-[#006994] to-[#00b4d8] p-5">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-2xl">

            <div className="mb-4 text-7xl">
              🏆
            </div>

            <h1 className="mb-3 text-4xl font-extrabold text-blue-900">
              Game Completed!
            </h1>

            <p className="mb-8 text-gray-600">
              Congratulations! You completed all 5 underwater levels!
            </p>

            <div className="mb-8 grid grid-cols-2 gap-4">

              <div className="rounded-xl bg-yellow-100 p-5">
                <p className="text-3xl">🪙</p>

                <p className="mt-2 text-2xl font-bold text-yellow-700">
                  {coins}
                </p>

                <p className="font-semibold text-gray-700">
                  Total Coins
                </p>
              </div>

              <div className="rounded-xl bg-purple-100 p-5">
                <p className="text-3xl">⭐</p>

                <p className="mt-2 text-2xl font-bold text-purple-700">
                  {xp}
                </p>

                <p className="font-semibold text-gray-700">
                  Total XP
                </p>
              </div>

            </div>

            <p className="mb-6 font-bold text-green-600">
              🌊 You are an Underwater Champion!
            </p>

            <div className="space-y-3">

              <button
                onClick={handlePlayAgain}
                className="w-full rounded-xl bg-cyan-600 py-3 font-bold text-white hover:bg-cyan-700"
              >
                🔄 Play Again
              </button>

              <button
                onClick={() => setCurrentPage("dashboard")}
                className="w-full rounded-xl bg-blue-900 py-3 font-bold text-white hover:bg-blue-950"
              >
                ← Dashboard
              </button>

            </div>

          </div>
        </section>
      )}
    </main>
  );
}
