
import { NextResponse } from "next/server";
import pool from "@/lib/mysql";

export async function GET() {
    try {
        const [rows] = await pool.query(`
            SELECT
                RANK() OVER (
                    ORDER BY players.xp DESC, players.coins DESC
                ) AS player_rank,
                users.username,
                players.coins,
                players.xp,
                players.level
            FROM players
            INNER JOIN users
                ON players.user_id = users.id
            ORDER BY players.xp DESC, players.coins DESC
            LIMIT 100
        `);

        return NextResponse.json({
            success: true,
            players: rows,
        });

    } catch (error) {
        console.error("Leaderboard Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to load leaderboard",
            },
            { status: 500 }
        );
    }
}
