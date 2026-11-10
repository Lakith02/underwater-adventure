
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("underwater_session")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        const { coins, xp, level } = await request.json();

        if (
            !Number.isInteger(coins) ||
            !Number.isInteger(xp) ||
            !Number.isInteger(level) ||
            coins < 0 ||
            xp < 0 ||
            level < 1 ||
            level > 6
        ) {
            return NextResponse.json(
                { success: false, message: "Invalid progress data" },
                { status: 400 }
            );
        }

        const [sessions]: any = await pool.execute(
            `SELECT user_id FROM sessions
             WHERE token = ? AND expires_at > NOW()`,
            [token]
        );

        if (sessions.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired session" },
                { status: 401 }
            );
        }

        await pool.execute(
            `UPDATE players
             SET coins = ?, xp = ?, level = ?
             WHERE user_id = ?`,
            [coins, xp, level, sessions[0].user_id]
        );

        return NextResponse.json({
            success: true,
            message: "Game progress saved successfully",
        });

    } catch (error) {
        console.error("Progress Save Error:", error);

        return NextResponse.json(
            { success: false, message: "Unable to save progress" },
            { status: 500 }
        );
    }
}
