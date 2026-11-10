
"use client";

import { useState, type FormEvent } from "react";

interface LoginProps {
    onLogin: (username: string) => void;
    onShowRegister: () => void;
}

export default function Login({
    onLogin,
    onShowRegister,
}: LoginProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Invalid username or password!");
                return;
            }

            onLogin(data.user.username);

        } catch (error) {
            console.error("Login Error:", error);
            setError("Unable to connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-950 via-blue-800 to-cyan-600 p-6">
            <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg border border-white/20">
                <h1 className="text-4xl font-bold text-center text-white mb-2">
                    🌊 Underwater Adventure
                </h1>

                <p className="text-center text-cyan-100 mb-8">
                    Welcome back, Ocean Explorer!
                </p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-white mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                            className="w-full rounded-lg p-3 bg-white/90 text-gray-900 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                            className="w-full rounded-lg p-3 bg-white/90 text-gray-900 outline-none"
                        />
                    </div>

                    {error && (
                        <p className="text-red-200 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-cyan-400 py-3 font-bold text-blue-950 hover:bg-cyan-300 transition disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-white mt-6">
                    Don&apos;t have an account?{" "}
                    <button
                        onClick={onShowRegister}
                        className="font-bold text-cyan-300 hover:text-white"
                    >
                        Register
                    </button>
                </p>
            </div>
        </div>
    );
}
