
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import Login from "@/components/authentication/Login";
import Register from "@/components/authentication/Register";
import Dashboard from "@/components/dashboard/Dashboard";
import FishGame from "@/components/game/FishGame";

type PageType = "login" | "register" | "dashboard" | "game" | "completed";

interface PlayerProgress {
  id: number;
  username: string;
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

  const [checkingSession, setCheckingSession] = useState(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [musicOn, setMusicOn] = useState(false);

  // Load logged-in user's session and progress
  const loadSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok && data.success && data.user) {
        const user: PlayerProgress = data.user;

        setUsername(user.username);
        setCoins(user.coins);
        setXp(user.xp);
        setLevel(user.level);
        setCurrentPage("dashboard");

        return true;
      }

      return false;
    } catch (error) {
      console.error("Session Loading Error:", error);
      return false;
    }
  }, []);

  // Check session when application starts
  useEffect(() => {
    const checkSession = async () => {
      await loadSession();
      setCheckingSession(false);
    };

    checkSession();
  }, [loadSession]);

  // Login and registration success
  const loadPlayer = async (playerName: string) => {
    const loaded = await loadSession();

    if (!loaded) {
      setUsername(playerName);
      setCoins(0);
      setXp(0);
      setLevel(1);
      setCurrentPage("dashboard");
    }
  };

  // Save player progress to MySQL
  const saveProgress = useCallback(async () => {
    if (!username) return;

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coins,
          xp,
          level,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Progress Save Error:", data.message);
      }
    } catch (error) {
      console.error("Progress Save Error:", error);
    }
  }, [username, coins, xp, level]);

  // Save progress whenever coins, XP or level changes
  useEffect(() => {
    if (
      checkingSession ||
      !username ||
      currentPage === "login" ||
      currentPage === "register"
    ) {
      return;
    }

    saveProgress();
  }, [
    checkingSession,
    username,
    coins,
    xp,
    level,
    currentPage,
    saveProgress,
  ]);

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout Error:", error);
    }

    setUsername("");
    setCoins(0);
    setXp(0);
    setLevel(1);
    setCurrentPage("login");
  };

  // Play game
  const handlePlay = () => {
    setCurrentPage("game");
  };

  // Reward coins
  const handleReward = (rewardCoins: number) => {
    setCoins((previous) => previous + rewardCoins);
  };

  // Reward XP
  const handleXPReward = (rewardXP: number) => {
    setXp((previous) => previous + rewardXP);
  };

  // Complete level
  const handleLevelComplete = () => {
    setLevel((previous) => {
      const nextLevel = previous + 1;

      if (nextLevel > 5) {
        setCurrentPage("completed");
        return 6;
      }

      setCurrentPage("dashboard");
      return nextLevel;
    });
  };

  // Play again
  const handlePlayAgain = () => {
    setCoins(0);
    setXp(0);
    setLevel(1);
    setCurrentPage("dashboard");
  };

  // Background music
  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (musicOn) {
      audioRef.current.pause();
      setMusicOn(false);
    } else {
      audioRef.current.play()
        .then(() => setMusicOn(true))
        .catch((error) => {
          console.error("Music Error:", error);
        });
    }
  };

  if (checkingSession) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-lg">Loading Underwater Adventure...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <audio
        ref={audioRef}
        src="/music/ocean.mp3"
        loop
      />

      {currentPage === "login" && (
        <Login
          onLogin={loadPlayer}
          onShowRegister={() => setCurrentPage("register")}
        />
      )}

      {currentPage === "register" && (
        <Register
          onRegister={loadPlayer}
          onShowLogin={() => setCurrentPage("login")}
        />
      )}

      {currentPage === "dashboard" && (
        <Dashboard
          username={username}
          coins={coins}
          xp={xp}
          level={level}
          onPlay={handlePlay}
          onLogout={handleLogout}
        />
      )}

      {currentPage === "game" && (
        <FishGame
          onBack={() => setCurrentPage("dashboard")}
          onReward={handleReward}
          onXPReward={handleXPReward}
          onLevelComplete={handleLevelComplete}
          level={level}
        />
      )}

      {currentPage === "completed" && (
        <div className="min-h-screen flex flex-col items-center justify-center text-center text-white bg-gradient-to-b from-blue-950 to-slate-950 p-6">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Adventure Completed!
          </h1>

          <p className="text-xl mb-4">
            Congratulations, {username}!
          </p>

          <p className="text-lg mb-2">
            Total Coins: {coins}
          </p>

          <p className="text-lg mb-8">
            Total XP: {xp}
          </p>

          <button
            onClick={handlePlayAgain}
            className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition"
          >
            Play Again
          </button>

          <button
            onClick={handleLogout}
            className="mt-4 px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition"
          >
            Logout
          </button>
        </div>
      )}

      <button
        onClick={toggleMusic}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-cyan-500 p-4 text-white shadow-lg hover:bg-cyan-400 transition"
        aria-label="Toggle background music"
      >
        {musicOn ? "🔊" : "🔇"}
      </button>
    </main>
  );
}
