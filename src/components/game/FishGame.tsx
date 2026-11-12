
"use client";

import { useCallback, useEffect, useState } from "react";
import { GameEngine } from "@/engine/GameEngine";
import { GameServer } from "@/engine/GameServer";

interface FishQuestion {
    question: string;
}

interface FishGameProps {
    onBack: () => void;
    onReward: (coins: number) => void;
    onXPReward: (xp: number) => void;
    onLevelComplete: () => void;
    level: number;
}

type GameRound = "fish" | "chest";

export default function FishGame({
    onBack,
    onReward,
    onXPReward,
    onLevelComplete,
    level,
}: FishGameProps) {

    const timeLimits = [30, 25, 20, 15, 10];
    const timeLimit = timeLimits[Math.min(Math.max(level - 1, 0), 4)];

    const [puzzle, setPuzzle] = useState<FishQuestion | null>(null);
    const [answer, setAnswer] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [completed, setCompleted] = useState(false);
    const [levelFinished, setLevelFinished] = useState(false);
    const [round, setRound] = useState<GameRound>("fish");
    const [timeLeft, setTimeLeft] = useState(timeLimit);

    const [gameEngine] = useState(() => new GameEngine());

    // Load puzzle from Fish API
    const loadPuzzle = useCallback(async () => {
        setLoading(true);
        setPuzzle(null);
        setAnswer("");
        setMessage("");
        setCompleted(false);
        setLevelFinished(false);
        setTimeLeft(timeLimit);

        try {
            const game = await GameServer.getNewGame();

            gameEngine.setCurrentGame(game);

            setPuzzle({
                question: game.getImage(),
            });

        } catch (error) {
            console.error("Game loading error:", error);
            setMessage("Unable to load the puzzle. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [gameEngine, timeLimit]);

    // Start level
    useEffect(() => {
        gameEngine.startLevel(level);
        setRound("fish");
        void loadPuzzle();
    }, [level, gameEngine, loadPuzzle]);

    // Countdown
    useEffect(() => {
        if (!puzzle || loading || completed || timeLeft <= 0) {
            return;
        }

        const timer = setTimeout(() => {
            setTimeLeft((previous) => Math.max(previous - 1, 0));
        }, 1000);

        return () => clearTimeout(timer);
    }, [puzzle, loading, completed, timeLeft]);

    // Timeout
    useEffect(() => {
        if (timeLeft === 0 && puzzle && !completed) {
            setCompleted(true);
            setMessage("⏰ Time is up! Restart the level and try again.");
        }
    }, [timeLeft, puzzle, completed]);

    // Change answer using + and - buttons
    const changeAnswer = (amount: number) => {
        const current = Number(answer || 0);
        const next = Math.max(0, current + amount);
        setAnswer(String(next));
    };

    // Submit answer
    const checkAnswer = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            !puzzle ||
            completed ||
            answer.trim() === "" ||
            timeLeft <= 0
        ) {
            return;
        }

        const submittedAnswer = Number(answer);

        if (!Number.isInteger(submittedAnswer) || submittedAnswer < 0) {
            setMessage("Please enter a valid number.");
            return;
        }

        // Fish round
        if (round === "fish") {
            if (gameEngine.completeFishRound(submittedAnswer)) {
                onReward(10);

                setRound("chest");
                setAnswer("");
                setMessage("🎉 Correct! You earned 10 Coins. Now count the treasure chests!");
                setTimeLeft(timeLimit);
            } else {
                setMessage("❌ Incorrect fish count! Try again.");
            }

            return;
        }

        // Chest round
        if (round === "chest") {
            if (gameEngine.completeChestRound(submittedAnswer)) {
                onXPReward(20);

                setCompleted(true);
                setLevelFinished(true);
                setMessage("🏆 Excellent! You earned 20 XP. Level completed!");
            } else {
                setMessage("❌ Incorrect chest count! Try again.");
            }
        }
    };

    // Restart level
    const restartLevel = () => {
        gameEngine.startLevel(level);
        setRound("fish");
        void loadPuzzle();
    };

    const progress = (timeLeft / timeLimit) * 100;

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#00152e] px-3 py-3 text-white sm:px-5 lg:h-screen lg:min-h-0 lg:overflow-hidden">

            {/* Ocean Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">

                <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-cyan-500/20 blur-[100px]" />

                <div className="absolute -right-32 top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-[100px]" />

                <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-teal-400/10 blur-[100px]" />

                {/* Bubbles */}
                <div className="absolute left-[8%] top-[20%] h-6 w-6 animate-bounce rounded-full border-2 border-cyan-200/40 bg-cyan-300/10" />

                <div className="absolute left-[25%] top-[65%] h-4 w-4 animate-pulse rounded-full border border-white/40" />

                <div className="absolute right-[12%] top-[20%] h-9 w-9 animate-bounce rounded-full border-2 border-cyan-200/30 bg-white/5 [animation-delay:1s]" />

                <div className="absolute right-[25%] top-[70%] h-5 w-5 animate-pulse rounded-full border border-white/40" />

                {/* Decorations */}
                <div className="absolute bottom-0 left-0 text-6xl opacity-30">
                    🌿
                </div>

                <div className="absolute bottom-0 right-0 text-6xl opacity-30">
                    🪸
                </div>

                <div className="absolute right-5 top-[45%] text-4xl opacity-20">
                    🐟
                </div>

            </div>

            {/* Main Layout */}
            <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col lg:h-full">

                {/* Compact Header */}
                <header className="mb-3 flex shrink-0 items-center justify-between gap-3">

                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-xl border border-cyan-200/20 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100 shadow-lg backdrop-blur-md transition hover:bg-cyan-400/20"
                    >
                        ← Dashboard
                    </button>

                    <div className="text-right">
                        <h1 className="text-base font-black tracking-wide text-cyan-200 sm:text-xl">
                            🌊 UNDERWATER ADVENTURE
                        </h1>
                        <p className="text-[10px] tracking-widest text-cyan-100/50">
                            EXPLORE • COUNT • COLLECT
                        </p>
                    </div>

                </header>

                {/* Game Heading and Stats */}
                <section className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-[#063b67] to-[#075985] px-4 py-3 shadow-lg sm:px-5">

                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                            Your Mission
                        </p>
                        <h2 className="text-xl font-black sm:text-2xl">
                            Ocean Challenge 🐬
                        </h2>
                    </div>

                    <div className="flex gap-2">

                        <div className="rounded-xl border border-cyan-200/20 bg-black/20 px-4 py-2 text-center">
                            <p className="text-[10px] font-bold text-cyan-200/60">
                                LEVEL
                            </p>
                            <p className="text-xl font-black text-white">
                                {level}/5
                            </p>
                        </div>

                        <div className={`rounded-xl border px-4 py-2 text-center ${timeLeft <= 5
                            ? "border-red-300/40 bg-red-500/20"
                            : "border-yellow-300/20 bg-yellow-500/10"
                            }`}>
                            <p className="text-[10px] font-bold text-yellow-200/70">
                                TIME LEFT
                            </p>
                            <p className={`text-xl font-black ${timeLeft <= 5 ? "text-red-300" : "text-yellow-300"
                                }`}>
                                {timeLeft}s
                            </p>
                        </div>

                    </div>

                </section>

                {/* Round Indicator */}
                <section className="mb-3 flex shrink-0 items-center justify-center gap-3">

                    <div className={`rounded-full border px-5 py-2 text-xs font-black transition sm:text-sm ${round === "fish"
                        ? "border-cyan-300/60 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                        : "border-emerald-300/40 bg-emerald-500/15 text-emerald-300"
                        }`}>
                        🐠 Fish Round {round === "chest" ? "✓" : ""}
                    </div>

                    <div className="h-1 w-6 rounded-full bg-cyan-300/30 sm:w-12" />

                    <div className={`rounded-full border px-5 py-2 text-xs font-black transition sm:text-sm ${round === "chest"
                        ? "border-cyan-300/60 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                        : "border-white/10 bg-white/5 text-white/40"
                        }`}>
                        💎 Chest Round
                    </div>

                </section>

                {/* Timer Progress */}
                <div className="mb-3 h-2 shrink-0 overflow-hidden rounded-full border border-white/10 bg-black/30 p-[2px]">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${timeLeft <= 5
                            ? "bg-gradient-to-r from-red-500 to-orange-400"
                            : "bg-gradient-to-r from-cyan-400 to-emerald-300"
                            }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Main Game Area */}
                <section className="grid min-h-0 flex-1 grid-cols-1 gap-3 rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-[#063451]/95 via-[#062746]/95 to-[#04182e]/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:p-4 lg:grid-cols-[1.35fr_0.85fr] lg:gap-5 lg:p-5">

                    {/* Puzzle Side */}
                    <div className="flex min-h-0 flex-col">

                        <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                                    Underwater Puzzle
                                </p>
                                <h3 className="text-lg font-black sm:text-xl">
                                    {round === "fish"
                                        ? "🐠 Find the Fish"
                                        : "💎 Find the Treasure"}
                                </h3>
                            </div>

                            <span className="text-2xl">🫧 🪸</span>
                        </div>

                        {/* Puzzle Image */}
                        <div className="flex min-h-[180px] flex-1 items-center justify-center overflow-hidden rounded-2xl border-4 border-cyan-300/40 bg-gradient-to-br from-cyan-100 to-blue-200 p-2 shadow-[0_12px_30px_rgba(0,0,0,0.4)] lg:min-h-0">

                            {loading && (
                                <div className="py-10 text-center text-blue-900">
                                    <div className="mb-3 animate-bounce text-5xl">
                                        🐬
                                    </div>
                                    <p className="font-bold">
                                        Loading Puzzle...
                                    </p>
                                </div>
                            )}

                            {!loading && puzzle && (
                                <img
                                    src={puzzle.question}
                                    alt="Underwater counting puzzle"
                                    width={640}
                                    height={400}
                                    className="mx-auto block max-h-[38vh] w-full max-w-2xl rounded-lg object-contain"
                                    onError={() => {
                                        setMessage(
                                            "Image failed to load. Please restart the level."
                                        );
                                        setCompleted(true);
                                    }}
                                />
                            )}

                            {!loading && !puzzle && (
                                <div className="py-8 text-center text-blue-900">
                                    <p className="text-5xl">🐠</p>
                                    <p className="mt-3 font-bold">
                                        Puzzle unavailable
                                    </p>
                                </div>
                            )}

                        </div>

                        <p className="mt-2 shrink-0 text-center text-xs font-semibold text-cyan-100/60">
                            Look carefully and count the {round === "fish" ? "fish" : "treasure chests"}!
                        </p>

                    </div>

                    {/* Answer Side */}
                    <div className="flex min-h-0 flex-col justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-[#0b4261] to-[#092640] p-4 shadow-inner sm:p-5">

                        <div className="mb-4 text-center">

                            <div className="mb-2 text-5xl">
                                {round === "fish" ? "🐠" : "💎"}
                            </div>

                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                                Your Challenge
                            </p>

                            <h3 className="mt-2 text-xl font-black sm:text-2xl">
                                {round === "fish"
                                    ? "How many fish?"
                                    : "How many chests?"}
                            </h3>

                            <p className="mt-2 text-xs text-cyan-100/50">
                                Select your answer below
                            </p>

                        </div>

                        {/* Answer Controls */}
                        <form
                            onSubmit={checkAnswer}
                            className="mx-auto flex w-full max-w-sm flex-col items-center gap-4"
                        >

                            <div className="flex w-full items-center justify-center gap-3">

                                <button
                                    type="button"
                                    disabled={completed || loading || !puzzle}
                                    onClick={() => changeAnswer(-1)}
                                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-b-4 border-blue-950 bg-gradient-to-b from-cyan-400 to-blue-600 text-3xl font-black text-white shadow-lg transition hover:-translate-y-1 active:translate-y-1 active:border-b-0 disabled:opacity-40"
                                >
                                    −
                                </button>

                                <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="0"
                                    disabled={completed || loading || !puzzle}
                                    required
                                    className="h-16 min-w-0 flex-1 rounded-2xl border-2 border-cyan-300/50 bg-[#001b35] text-center text-4xl font-black text-white outline-none transition placeholder:text-cyan-100/20 focus:border-cyan-200 focus:ring-4 focus:ring-cyan-300/10"
                                />

                                <button
                                    type="button"
                                    disabled={completed || loading || !puzzle}
                                    onClick={() => changeAnswer(1)}
                                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-b-4 border-blue-950 bg-gradient-to-b from-cyan-400 to-blue-600 text-3xl font-black text-white shadow-lg transition hover:-translate-y-1 active:translate-y-1 active:border-b-0 disabled:opacity-40"
                                >
                                    +
                                </button>

                            </div>

                            {!completed && (
                                <button
                                    type="submit"
                                    disabled={loading || !puzzle}
                                    className="w-full rounded-2xl border-b-4 border-blue-950 bg-gradient-to-b from-yellow-300 to-orange-400 px-6 py-4 text-base font-black text-blue-950 shadow-[0_10px_25px_rgba(0,0,0,0.3)] transition hover:-translate-y-1 hover:shadow-yellow-300/20 active:translate-y-1 active:border-b-0 disabled:opacity-40"
                                >
                                    SUBMIT ANSWER →
                                </button>
                            )}

                        </form>

                        {/* Rewards */}
                        <div className="mt-5 grid grid-cols-2 gap-2">

                            <div className="rounded-xl border border-yellow-300/20 bg-yellow-400/10 p-3 text-center">
                                <p className="text-xl">🪙</p>
                                <p className="mt-1 text-xs font-bold text-yellow-200">
                                    +10 Coins
                                </p>
                            </div>

                            <div className="rounded-xl border border-purple-300/20 bg-purple-400/10 p-3 text-center">
                                <p className="text-xl">⭐</p>
                                <p className="mt-1 text-xs font-bold text-purple-200">
                                    +20 XP
                                </p>
                            </div>

                        </div>

                        {/* Message */}
                        {message && (
                            <div className={`mt-4 rounded-xl border p-3 text-center text-sm font-bold ${levelFinished
                                ? "border-emerald-300/30 bg-emerald-400/10 text-emerald-300"
                                : message.includes("Incorrect") || message.includes("Time is up") || message.includes("failed")
                                    ? "border-red-300/30 bg-red-400/10 text-red-300"
                                    : "border-cyan-300/30 bg-cyan-400/10 text-cyan-200"
                                }`}>
                                {message}
                            </div>
                        )}

                        {/* Level Completed */}
                        {completed && levelFinished && (
                            <button
                                type="button"
                                onClick={onLevelComplete}
                                className="mt-4 w-full rounded-xl border-b-4 border-emerald-950 bg-gradient-to-b from-emerald-400 to-green-600 px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-1 active:translate-y-1 active:border-b-0"
                            >
                                NEXT LEVEL →
                            </button>
                        )}

                        {/* Retry */}
                        {completed && !levelFinished && (
                            <button
                                type="button"
                                onClick={restartLevel}
                                className="mt-4 w-full rounded-xl border-b-4 border-blue-950 bg-gradient-to-b from-cyan-400 to-blue-600 px-5 py-3 font-black text-white shadow-lg transition hover:-translate-y-1 active:translate-y-1 active:border-b-0"
                            >
                                ↻ RESTART LEVEL
                            </button>
                        )}

                        {/* API Retry */}
                        {!loading && !puzzle && (
                            <button
                                type="button"
                                onClick={restartLevel}
                                className="mt-4 w-full rounded-xl bg-gradient-to-b from-cyan-400 to-blue-600 px-5 py-3 font-black text-white shadow-lg"
                            >
                                TRY AGAIN
                            </button>
                        )}

                    </div>

                </section>

                {/* Footer */}
                <footer className="mt-2 shrink-0 pb-1 text-center">
                    <p className="text-[10px] font-bold tracking-[0.2em] text-cyan-100/40">
                        🐬 KEEP EXPLORING THE OCEAN 🐠
                    </p>
                </footer>

            </div>

        </main>
    );
}
