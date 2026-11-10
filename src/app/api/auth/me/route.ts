
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("underwater_session")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, user: null },
                { status: 401 }
            );
        }

        const [rows]: any = await pool.execute(
            `SELECT users.id, users.username, players.coins,
                    players.xp, players.level
             FROM sessions
             JOIN users ON sessions.user_id = users.id
             JOIN players ON players.user_id = users.id
             WHERE sessions.token = ?
             AND sessions.expires_at > NOW()`,
            [token]
        );

        if (rows.length === 0) {
            const response = NextResponse.json(
                { success: false, user: null },
                { status: 401 }
            );

            response.cookies.set("underwater_session", "", {
                httpOnly: true,
                path: "/",
                maxAge: 0,
            });

            return response;
        }

        return NextResponse.json({
            success: true,
            user: rows[0],
        });

    } catch (error) {
        console.error("Session Error:", error);

        return NextResponse.json(
            { success: false, message: "Session verification failed" },
            { status: 500 }
        );
    }
}
