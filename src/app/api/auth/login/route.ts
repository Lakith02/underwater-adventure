
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import pool from "@/lib/mysql";

export async function POST(request: NextRequest) {
    let connection;

    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { success: false, message: "Username and password are required" },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();

        const [users]: any = await connection.execute(
            `SELECT id, username, password
             FROM users
             WHERE username = ?`,
            [username.trim()]
        );

        if (users.length === 0) {
            return NextResponse.json(
                { success: false, message: "Invalid username or password" },
                { status: 401 }
            );
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return NextResponse.json(
                { success: false, message: "Invalid username or password" },
                { status: 401 }
            );
        }

        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await connection.execute(
            `INSERT INTO sessions (user_id, token, expires_at)
             VALUES (?, ?, ?)`,
            [user.id, token, expiresAt]
        );

        const response = NextResponse.json({
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
            },
        });

        response.cookies.set("underwater_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;

    } catch (error) {
        console.error("Login Error:", error);

        return NextResponse.json(
            { success: false, message: "Login failed" },
            { status: 500 }
        );

    } finally {
        connection?.release();
    }
}
