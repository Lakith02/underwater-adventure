
import { NextResponse } from "next/server";
import db from "@/lib/db";




// Get leaderboard players
export async function GET() {
    try {
        const players = db.prepare(`
            SELECT
                username,
                coins,
                xp,
                level,
                RANK() OVER (
                    ORDER BY xp DESC
                ) AS rank
            FROM players
            ORDER BY xp DESC, coins DESC
            LIMIT 100
        `).all();

        return NextResponse.json({ players });
    } catch (error) {
        console.error("Leaderboard Error:", error);

        return NextResponse.json(
            { error: "Unable to load leaderboard" },
            { status: 500 }
        );
    }
}

// Save player progress
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const username = String(body.username || "").trim();
        const coins = Number(body.coins);
        const xp = Number(body.xp);
        const level = Number(body.level);

        if (
            !username ||
            username.length > 30 ||
            !Number.isSafeInteger(coins) ||
            !Number.isSafeInteger(xp) ||
            !Number.isSafeInteger(level) ||
            coins < 0 ||
            xp < 0 ||
            level < 1
        ) {
            return NextResponse.json(
                { error: "Invalid player data" },
                { status: 400 }
            );
        }

        db.prepare(`
            INSERT INTO players (username, coins, xp, level)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(username) DO UPDATE SET
                coins = excluded.coins,
                xp = excluded.xp,
                level = excluded.level,
                updated_at = CURRENT_TIMESTAMP
        `).run(username, coins, xp, level);

        return NextResponse.json({
            success: true,
            message: "Player progress saved"
        });
    } catch (error) {
        console.error("Save Progress Error:", error);

        return NextResponse.json(
            { error: "Unable to save player progress" },
            { status: 500 }
        );
    }
}
