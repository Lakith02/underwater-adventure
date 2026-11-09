
"use client";

interface DashboardProps {
    username: string;
    coins: number;
    xp: number;
    level: number;
    onPlay: () => void;
    onLogout: () => void;
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

    const levels = [
        { number: 1, title: "Coral Reef", icon: "🐠", color: "from-cyan-400 to-blue-500" },
        { number: 2, title: "Ocean Garden", icon: "🪸", color: "from-emerald-400 to-teal-600" },
        { number: 3, title: "Deep Sea", icon: "🐙", color: "from-violet-400 to-purple-700" },
        { number: 4, title: "Treasure Bay", icon: "💎", color: "from-yellow-300 to-orange-500" },
        { number: 5, title: "Ocean Kingdom", icon: "👑", color: "from-pink-400 to-rose-600" },
    ];

    return (
        <main className="relative min-h-screen overflow-x-hidden bg-[#00152e] text-white lg:h-screen lg:min-h-0 lg:overflow-hidden">

            {/* Ocean Background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">

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
            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-3 sm:px-6 lg:h-full lg:min-h-0 lg:px-8 lg:py-3">

                {/* Header */}
                <header className="mb-3 flex shrink-0 items-center justify-between gap-3">

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
                <section className="relative mb-3 shrink-0 overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-[#063b67] via-[#075985] to-[#063b67] px-5 py-4 shadow-[0_15px_40px_rgba(0,0,0,0.4)] sm:px-7 lg:py-3">

                    <div className="absolute -right-10 -top-20 h-48 w-48 rounded-full bg-cyan-300/10 blur-3xl" />

                    <div className="relative flex items-center justify-between gap-4">

                        <div className="min-w-0">

                            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300 sm:text-xs">
                                Welcome back, Explorer!
                            </p>

                            <h2 className="truncate text-2xl font-black sm:text-3xl lg:text-4xl">
                                Hello, {username}! 👋
                            </h2>

                            <p className="mt-1 max-w-lg text-xs text-cyan-100/70 sm:text-sm">
                                Explore the ocean, solve puzzles and collect amazing treasures!
                            </p>

                            <button
                                type="button"
                                onClick={onPlay}
                                disabled={level > totalLevels}
                                className="mt-3 rounded-xl border-b-4 border-yellow-700 bg-gradient-to-b from-yellow-300 to-orange-400 px-6 py-2.5 text-sm font-black text-blue-950 shadow-[0_8px_20px_rgba(251,191,36,0.2)] transition hover:-translate-y-1 hover:shadow-yellow-300/30 active:translate-y-1 active:border-b-0 disabled:cursor-not-allowed disabled:opacity-50 sm:px-8"
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
                <section className="mb-3 grid shrink-0 grid-cols-3 gap-2 sm:gap-4">

                    {/* Coins */}
                    <div className="relative overflow-hidden rounded-2xl border border-yellow-300/20 bg-gradient-to-br from-[#59400d] via-[#332b18] to-[#17243c] p-3 shadow-lg sm:p-4">

                        <div className="absolute -right-2 -top-3 text-6xl opacity-10">
                            🪙
                        </div>

                        <div className="relative flex flex-col items-center gap-1 sm:flex-row sm:gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-300/30 bg-yellow-300/10 text-2xl sm:h-12 sm:w-12 sm:text-3xl">
                                🪙
                            </div>

                            <div className="text-center sm:text-left">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-yellow-200/70 sm:text-xs">
                                    Total Coins
                                </p>

                                <h3 className="text-xl font-black text-yellow-300 sm:text-2xl">
                                    {coins}
                                </h3>
                            </div>

                        </div>

                    </div>

                    {/* XP */}
                    <div className="relative overflow-hidden rounded-2xl border border-purple-300/20 bg-gradient-to-br from-[#39205f] via-[#24203e] to-[#17243c] p-3 shadow-lg sm:p-4">

                        <div className="absolute -right-2 -top-3 text-6xl opacity-10">
                            ⭐
                        </div>

                        <div className="relative flex flex-col items-center gap-1 sm:flex-row sm:gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-300/30 bg-purple-300/10 text-2xl sm:h-12 sm:w-12 sm:text-3xl">
                                ⭐
                            </div>

                            <div className="text-center sm:text-left">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-purple-200/70 sm:text-xs">
                                    Total XP
                                </p>

                                <h3 className="text-xl font-black text-purple-300 sm:text-2xl">
                                    {xp}
                                </h3>
                            </div>

                        </div>

                    </div>

                    {/* Completed Levels */}
                    <div className="relative overflow-hidden rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-[#07516a] via-[#12364f] to-[#17243c] p-3 shadow-lg sm:p-4">

                        <div className="absolute -right-2 -top-3 text-6xl opacity-10">
                            🏆
                        </div>

                        <div className="relative flex flex-col items-center gap-1 sm:flex-row sm:gap-3">

                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-2xl sm:h-12 sm:w-12 sm:text-3xl">
                                🏆
                            </div>

                            <div className="text-center sm:text-left">
                                <p className="text-[9px] font-bold uppercase tracking-wider text-cyan-200/70 sm:text-xs">
                                    Levels Completed
                                </p>

                                <h3 className="text-xl font-black text-cyan-300 sm:text-2xl">
                                    {completedLevels}/{totalLevels}
                                </h3>
                            </div>

                        </div>

                    </div>

                </section>

                {/* Journey Progress */}
                <section className="mb-3 shrink-0 rounded-2xl border border-cyan-200/20 bg-[#062746]/80 px-4 py-3 shadow-lg backdrop-blur-xl sm:px-5">

                    <div className="mb-2 flex items-center justify-between gap-3">

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                                Your Journey
                            </p>

                            <h2 className="text-sm font-black sm:text-base">
                                Ocean Exploration Progress
                            </h2>
                        </div>

                        <span className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-xs font-black text-cyan-200">
                            {Math.round(progress)}%
                        </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full border border-white/10 bg-black/30 p-[2px]">

                        <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-300 shadow-[0_0_15px_rgba(34,211,238,0.6)] transition-all duration-700"
                            style={{ width: `${progress}%` }}
                        />

                    </div>

                    <p className="mt-1 text-[10px] text-cyan-100/50">
                        {completedLevels} of {totalLevels} underwater levels completed.
                    </p>

                </section>

                {/* Adventure Levels */}
                <section className="mb-3 flex min-h-0 flex-1 flex-col">

                    <div className="mb-2 flex shrink-0 items-center justify-between gap-2">

                        <div>
                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                                Choose Your Destination
                            </p>

                            <h2 className="text-xl font-black sm:text-2xl">
                                🌊 Adventure Levels
                            </h2>
                        </div>

                        <p className="text-[10px] text-cyan-100/60 sm:text-xs">
                            Complete all 5 levels!
                        </p>

                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:min-h-0 lg:flex-1 lg:grid-cols-5 lg:gap-3">

                        {levels.map((item) => {

                            const isCompleted = item.number <= completedLevels;
                            const isCurrent = item.number === level;
                            const isLocked = item.number > level;

                            return (
                                <div
                                    key={item.number}
                                    className={`group relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border p-3 text-center shadow-[0_12px_25px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1 ${isCompleted
                                        ? "border-emerald-300/40 bg-gradient-to-b from-emerald-900/90 to-[#092b3b]"
                                        : isCurrent
                                            ? "border-cyan-300/60 bg-gradient-to-b from-[#075985] to-[#082c4c] shadow-[0_0_25px_rgba(34,211,238,0.15)]"
                                            : "border-white/10 bg-gradient-to-b from-slate-700/70 to-slate-900/90 opacity-70"
                                        }`}
                                >

                                    <div className="absolute -right-5 -top-5 h-20 w-20 rounded-full bg-white/10 blur-2xl" />

                                    <div className={`relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br ${item.color} text-3xl shadow-[0_8px_15px_rgba(0,0,0,0.4)] transition duration-500 group-hover:scale-110 sm:h-16 sm:w-16 sm:text-4xl`}>
                                        {isLocked ? "🔒" : item.icon}
                                    </div>

                                    <p className="relative mt-2 text-[9px] font-bold uppercase tracking-widest text-cyan-200/70">
                                        Level {item.number}
                                    </p>

                                    <h3 className="relative mt-1 text-sm font-black sm:text-base">
                                        {item.title}
                                    </h3>

                                    <div className="relative mt-2">

                                        {isCompleted && (
                                            <span className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[9px] font-black text-emerald-300">
                                                ✓ COMPLETED
                                            </span>
                                        )}

                                        {isCurrent && (
                                            <span className="rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-1 text-[9px] font-black text-cyan-200">
                                                ★ CURRENT
                                            </span>
                                        )}

                                        {isLocked && (
                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-black text-white/50">
                                                🔒 LOCKED
                                            </span>
                                        )}

                                    </div>

                                </div>
                            );
                        })}

                    </div>

                </section>

                {/* Compact Footer */}
                <footer className="shrink-0 pb-1 text-center">
                    <p className="text-[10px] font-bold tracking-[0.15em] text-cyan-100/40">
                        🐬 KEEP EXPLORING THE OCEAN • BECOME THE UNDERWATER CHAMPION 🐠
                    </p>
                </footer>

            </div>

        </main>
    );
}
