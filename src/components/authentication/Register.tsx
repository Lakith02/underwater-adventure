
"use client";

import { useState } from "react";


interface RegisterProps {
    onRegister: (username: string) => void;
    onShowLogin: () => void;
}

export default function Register({
    onRegister,
    onShowLogin,
}: RegisterProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        const players = JSON.parse(
            localStorage.getItem("underwaterPlayers") || "[]"
        );

        const existingPlayer = players.find(
            (player: { username: string }) =>
                player.username.toLowerCase() === username.trim().toLowerCase()
        );

        if (existingPlayer) {
            setError("This username is already registered!");
            return;
        }

        const newPlayer = {
            username: username.trim(),
            password,
        };

        players.push(newPlayer);

        localStorage.setItem("underwaterPlayers", JSON.stringify(players));

        onRegister(newPlayer.username);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-950 via-blue-800 to-cyan-600 p-6">
            <div className="w-full max-w-md rounded-2xl bg-white/10 p-8 shadow-2xl backdrop-blur-lg border border-white/20">
                <h1 className="text-4xl font-bold text-center text-white mb-2">
                    🌊 Join the Adventure
                </h1>

                <p className="text-center text-cyan-100 mb-8">
                    Create your underwater explorer account!
                </p>

                <form onSubmit={handleRegister} className="space-y-5">
                    <div>
                        <label className="block text-white mb-2">
                            Username
                        </label>

                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Choose a username"
                            required
                            minLength={3}
                            className="w-full rounded-lg p-3 bg-white/90 text-gray-900 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Create a password"
                            required
                            className="w-full rounded-lg p-3 bg-white/90 text-gray-900 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-white mb-2">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Enter password again"
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
                        className="w-full rounded-lg bg-cyan-400 py-3 font-bold text-blue-950 hover:bg-cyan-300 transition"
                    >
                        Create Account
                    </button>
                </form>

                <p className="text-center text-white mt-6">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={onShowLogin}
                        className="font-bold text-cyan-300 hover:text-white"
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}
