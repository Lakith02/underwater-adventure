
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("underwater_session")?.value;

        if (token) {
            await pool.execute(
                "DELETE FROM sessions WHERE token = ?",
                [token]
            );
        }

        const response = NextResponse.json({
            success: true,
            message: "Logout successful",
        });

        response.cookies.set("underwater_session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 0,
        });

        return response;

    } catch (error) {
        console.error("Logout Error:", error);

        return NextResponse.json(
            { success: false, message: "Logout failed" },
            { status: 500 }
        );
    }
}
