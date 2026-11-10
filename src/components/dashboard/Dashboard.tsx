
"use client";

import { useCallback, useEffect, useState } from "react";

interface DashboardProps {
    username: string;
    coins: number;
    xp: number;
    level: number;
    onPlay: () => void;
    onLogout: () => void;
}

interface LeaderboardPlayer {
    username: string;
    coins: number;
    xp: number;
    level: number;
    rank: number;
}

export default function Dashboard({
    username,
    coins,
    xp,
    level,
    onPlay,
    onLogout,
}: DashboardProps) {

    const totalLevels = 5;
    const completedLevels = Math.min(Math.max(level - 1, 0), totalLevels);
    const progress = (completedLevels / totalLevels) * 100;

    // Leaderboard states
    const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(true);
    const [leaderboardError, setLeaderboardError] = useState("");

    // Load leaderboard from SQLite database
    const loadLeaderboard = useCallback(async () => {
        try {
            setLeaderboardLoading(true);
            setLeaderboardError("");

            const response = await fetch("/api/leaderboard", {
                cache: "no-store",
            });

            if (!response.ok) {
                throw new Error("Unable to load leaderboard");
            }

            const data = await response.json();

            setPlayers(data.players || []);

        } catch (error) {
            console.error("Leaderboard Error:", error);
            setLeaderboardError("Unable to load leaderboard. Please try again.");
        } finally {
            setLeaderboardLoading(false);
        }
    }, []);

    useEffect(() => {
        loadLeaderboard();
    }, [loadLeaderboard]);

    // Adventure levels
    const levels = [
        { number: 1, title: "Coral Reef", icon: "🐠", color: "from-cyan-400 to-blue-500" },
        { number: 2, title: "Ocean Garden", icon: "🪸", color: "from-emerald-400 to-teal-600" },
        { number: 3, title: "Deep Sea", icon: "🐙", color: "from-violet-400 to-purple-700" },
        { number: 4, title: "Treasure Bay", icon: "💎", color: "from-yellow-300 to-orange-500" },
        { number: 5, title: "Ocean Kingdom", icon: "👑", color: "from-pink-400 to-rose-600" },
    ];

    const getRankIcon = (rank: number) => {
        if (rank === 1) return "🥇";
        if (rank === 2) return "🥈";
        if (rank === 3) return "🥉";
        return `#${rank}`;
    };

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#00152e] text-white">

            {/* Ocean Background */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-cyan-500/20 blur-[100px]" />

                <div className="absolute -right-40 top-40 h-80 w-80 rounded-full bg-blue-500/20 blur-[100px]" />

                <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-teal-400/10 blur-[100px]" />

                <div className="absolute left-[8%] top-[20%] h-5 w-5 animate-bounce rounded-full border-2 border-cyan-200/40 bg-cyan-300/10" />

                <div className="absolute left-[35%] top-[12%] h-3 w-3 animate-pulse rounded-full border border-white/50" />

                <div className="absolute right-[15%] top-[30%] h-8 w-8 animate-bounce rounded-full border-2 border-cyan-200/30 bg-white/5 [animation-delay:1s]" />

                <div className="absolute bottom-[20%] left-[20%] h-4 w-4 animate-pulse rounded-full border border-white/40" />

                <div className="absolute bottom-0 left-0 text-6xl opacity-30">
                    🌿
                </div>

                <div className="absolute bottom-0 right-0 text-6xl opacity-30">
                    🪸
                </div>

            </div>

            {/* Main Content */}
            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 sm:py-6 lg:px-8">

                {/* Header */}
                <header className="mb-5 flex shrink-0 items-center justify-between gap-3">

                    <div>
                        <h1 className="text-lg font-black tracking-wide text-cyan-200 sm:text-2xl">
                            🌊 UNDERWATER ADVENTURE
                        </h1>

                        <p className="text-[9px] tracking-[0.2em] text-cyan-100/50 sm:text-xs">
                            EXPLORE • DISCOVER • COLLECT
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onLogout}
                        className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md transition hover:border-red-300/50 hover:bg-red-500/20"
                    >
                        Logout ↗
                    </button>

                </header>

                {/* Welcome Hero */}
                <section className="relative mb-5 shrink-0 overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-[#063b67] via-[#075985] to-[#063b67] px-5 py-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] sm:px-8 sm:py-7">

                    <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

                    <div className="relative flex items-center justify-between gap-4">

                        <div className="min-w-0">

                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 sm:text-xs">
                                Welcome back, Explorer!
                            </p>

                            <h2 className="truncate text-2xl font-black sm:text-3xl lg:text-4xl">
                                Hello, {username}! 👋
                            </h2>

                            <p className="mt-2 max-w-lg text-xs text-cyan-100/70 sm:text-sm">
                                Explore the ocean, solve puzzles and collect amazing treasures!
                            </p>

                            <button
                                type="button"
                                onClick={onPlay}
                                disabled={level > totalLevels}
                                className="mt-5 rounded-xl border-b-4 border-yellow-700 bg-gradient-to-b from-yellow-300 to-orange-400 px-6 py-3 text-sm font-black text-blue-950 shadow-[0_8px_20px_rgba(251,191,36,0.2)] transition hover:-translate-y-1 hover:shadow-yellow-300/30 active:translate-y-1 active:border-b-0 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
                            >
                                {level > totalLevels
                                    ? "🏆 Adventure Completed"
                                    : `▶ PLAY LEVEL ${level}`}
                            </button>

                        </div>

                        {/* Dolphin */}
                        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center sm:h-32 sm:w-32 lg:h-36 lg:w-36">

                            <div className="absolute inset-2 rounded-full border border-cyan-200/20 bg-cyan-300/10 shadow-[0_0_50px_rgba(34,211,238,0.2)] backdrop-blur-sm" />

                            <div className="absolute inset-0 animate-pulse rounded-full border border-dashed border-cyan-200/30" />

                            <span className="relative z-10 text-6xl drop-shadow-[0_12px_12px_rgba(0,0,0,0.5)] transition duration-500 hover:scale-125 sm:text-7xl lg:text-8xl">
                                🐬
                            </span>

                            <span className="absolute right-1 top-1 text-xl">
                                ✨
                            </span>

                            <span className="absolute bottom-1 left-1 text-xl">
                                🫧
                            </span>

                        </div>

                    </div>

                </section>

                {/* Statistics */}
                <section className="mb-5 grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">

                    {/* Coins */}
                    <div className="relative overflow-hidden rounded-2xl border border-yellow-300/20 bg-gradient-to-br from-[#59400d] via-[#332b18] to-[#17243c] p-4 shadow-lg sm:p-5">

                        <div className="absolute -right-2 -top-3 text-6xl opacity-10">
                            🪙
                        </div>

                        <div className="relative flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-300/30 bg-yellow-300/10 text-3xl">
                                🪙
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-yellow-200/70">
                                    Total Coins
                                </p>

                                <h3 className="text-2xl font-black text-yellow-300">
                                    {coins}
                                </h3>
                            </div>

                        </div>

                    </div>

                    {/* XP */}
                    <div className="relative overflow-hidden rounded-2xl border border-purple-300/20 bg-gradient-to-br from-[#39205f] via-[#24203e] to-[#17243c] p-4 shadow-lg sm:p-5">

                        <div className="absolute -right-2 -top-3 text-6xl opacity-10">
                            ⭐
                        </div>

                        <div className="relative flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-300/30 bg-purple-300/10 text-3xl">
                                ⭐
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-purple-200/70">
                                    Total XP
                                </p>

                                <h3 className="text-2xl font-black text-purple-300">
                                    {xp}
                                </h3>
                            </div>

                        </div>

                    </div>

                    {/* Completed Levels */}
                    <div className="relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-[#07516a] via-[#12364f] to-[#17243c] p-4 shadow-lg sm:p-5">

                        <div className="absolute -right-2 -top-3 text-6xl opacity-10">
                            🏆
                        </div>

                        <div className="relative flex items-center gap-3">

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-3xl">
                                🏆
                            </div>

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-cyan-200/70">
                                    Levels Completed
                                </p>

                                <h3 className="text-2xl font-black text-cyan-300">
                                    {completedLevels}/{totalLevels}
                                </h3>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Journey Progress */}
                <section className="mb-6 shrink-0 rounded-2xl border border-cyan-200/20 bg-[#062746]/80 px-5 py-4 shadow-lg backdrop-blur-xl sm:px-6">

                    <div className="mb-3 flex items-center justify-between gap-3">

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                                Your Journey
                            </p>

                            <h2 className="text-base font-black sm:text-lg">
                                Ocean Exploration Progress
                            </h2>
                        </div>

                        <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-1.5 text-sm font-black text-cyan-200">
                            {Math.round(progress)}%
                        </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-black/30 p-[2px]">

                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-300 shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />

                    </div>

                    <p className="mt-2 text-xs text-cyan-100/50">
                        {completedLevels} of {totalLevels} underwater levels completed.
                    </p>

                </section>

                {/* Adventure Levels */}
                <section className="mb-8">

                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                                Choose Your Destination
                            </p>

                            <h2 className="text-2xl font-black sm:text-3xl">
                                🌊 Adventure Levels
                            </h2>
                        </div>

                        <p className="text-xs text-cyan-100/60">
                            Complete all 5 levels!
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

                        {levels.map((item) => {

                            const isCompleted = item.number <= completedLevels;
                            const isCurrent = item.number === level;
                            const isLocked = item.number > level;

                            return (
                                <div
                                    key={item.number}
                                    className={`group relative flex min-h-[210px] flex-col items-center justify-center overflow-hidden rounded-3xl border p-5 text-center shadow-[0_12px_25px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-2 ${isCompleted
                                        ? "border-emerald-300/40 bg-gradient-to-b from-emerald-900/90 to-[#092b3b]"
                                        : isCurrent
                                            ? "border-cyan-300/60 bg-gradient-to-b from-[#075985] to-[#082c4c] shadow-[0_0_25px_rgba(34,211,238,0.15)]"
                                            : "border-white/10 bg-gradient-to-b from-slate-700/70 to-slate-900/90 opacity-70"
                                        }`}
                                >

                                    <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

                                    <div className={`relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br ${item.color} text-5xl shadow-[0_8px_15px_rgba(0,0,0,0.4)] transition duration-500 group-hover:scale-110`}>
                                        {isLocked ? "🔒" : item.icon}
                                    </div>

                                    <p className="relative mt-4 text-[10px] font-bold uppercase tracking-widest text-cyan-200/70">
                                        Level {item.number}
                                    </p>

                                    <h3 className="relative mt-1 text-base font-black sm:text-lg">
                                        {item.title}
                                    </h3>

                                    <div className="relative mt-3">

                                        {isCompleted && (
                                            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-black text-emerald-300">
                                                ✓ COMPLETED
                                            </span>
                                        )}

                                        {isCurrent && (
                                            <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black text-cyan-200">
                                                ★ CURRENT
                                            </span>
                                        )}

                                        {isLocked && (
                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black text-white/50">
                                                🔒 LOCKED
                                            </span>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </section>

                {/* Leaderboard */}
                <section className="mb-8 rounded-3xl border border-yellow-300/20 bg-gradient-to-b from-[#102f4b] to-[#071c35] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] sm:p-6">

                    <div className="mb-5 flex items-center justify-between gap-3">

                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-300/70">
                                Top Explorers
                            </p>

                            <h2 className="text-2xl font-black text-yellow-200">
                                🏆 Leaderboard
                            </h2>

                            <p className="mt-1 text-xs text-cyan-100/50">
                                Compete with other underwater explorers!
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={loadLeaderboard}
                            disabled={leaderboardLoading}
                            className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {leaderboardLoading ? "Loading..." : "↻ Refresh"}
                        </button>

                    </div>

                    {leaderboardLoading ? (

                        <div className="py-10 text-center text-sm text-cyan-100/60">
                            🌊 Loading leaderboard...
                        </div>

                    ) : leaderboardError ? (

                        <div className="rounded-xl border border-red-300/20 bg-red-500/10 p-5 text-center">
                            <p className="text-sm text-red-200">
                                {leaderboardError}
                            </p>

                            <button
                                type="button"
                                onClick={loadLeaderboard}
                                className="mt-3 rounded-lg bg-red-400/20 px-4 py-2 text-xs font-bold text-red-200 hover:bg-red-400/30"
                            >
                                Try Again
                            </button>
                        </div>

                    ) : players.length === 0 ? (

                        <div className="py-10 text-center">
                            <p className="text-4xl">🐠</p>
                            <p className="mt-3 font-bold text-cyan-100">
                                No explorers yet!
                            </p>
                            <p className="mt-1 text-xs text-cyan-100/50">
                                Play the game to join the leaderboard.
                            </p>
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[500px] text-left">

                                <thead>
                                    <tr className="border-b border-white/10 text-[10px] uppercase tracking-widest text-cyan-100/50">
                                        <th className="px-4 py-3">Rank</th>
                                        <th className="px-4 py-3">Explorer</th>
                                        <th className="px-4 py-3 text-center">Level</th>
                                        <th className="px-4 py-3 text-center">Coins</th>
                                        <th className="px-4 py-3 text-right">Total XP</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {players.slice(0, 10).map((player) => {

                                        const isCurrentPlayer =
                                            player.username.toLowerCase() === username.toLowerCase();

                                        return (
                                            <tr
                                                key={player.username}
                                                className={`border-b border-white/5 transition ${isCurrentPlayer
                                                    ? "bg-cyan-400/10"
                                                    : "hover:bg-white/5"
                                                    }`}
                                            >

                                                <td className="px-4 py-4">
                                                    <span className="text-lg font-black">
                                                        {getRankIcon(player.rank)}
                                                    </span>
                                                </td>

                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xl">🐬</span>

                                                        <span className={`text-sm font-bold ${isCurrentPlayer
                                                            ? "text-cyan-200"
                                                            : "text-white"
                                                            }`}>
                                                            {player.username}
                                                        </span>

                                                        {isCurrentPlayer && (
                                                            <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[9px] font-black text-cyan-300">
                                                                YOU
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>

                                                <td className="px-4 py-4 text-center text-sm font-bold text-cyan-200">
                                                    {player.level}
                                                </td>

                                                <td className="px-4 py-4 text-center text-sm font-bold text-yellow-300">
                                                    🪙 {player.coins}
                                                </td>

                                                <td className="px-4 py-4 text-right text-sm font-black text-purple-300">
                                                    ⭐ {player.xp}
                                                </td>

                                            </tr>
                                        );
                                    })}

                                </tbody>

                            </table>

                        </div>

                    )}

                    <div className="mt-4 border-t border-white/10 pt-3 text-center">
                        <p className="text-[10px] font-bold tracking-wider text-cyan-100/40">
                            ⭐ PLAY MORE • EARN XP • CLIMB THE RANKS
                        </p>
                    </div>

                </section>

                {/* Footer */}
                <footer className="shrink-0 pb-3 text-center">
                    <p className="text-[10px] font-bold tracking-[0.15em] text-cyan-100/40">
                        🐬 KEEP EXPLORING THE OCEAN • BECOME THE UNDERWATER CHAMPION 🐠
                    </p>
                </footer>

            </div>

        </main>
    );
}
