
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";
import pool from "@/lib/mysql";

export async function POST(request: NextRequest) {
    let connection;

    try {
        const { username, email, password } = await request.json();

        if (!username || !email || !password) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { success: false, message: "Password must contain at least 8 characters" },
                { status: 400 }
            );
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        const hashedPassword = await bcrypt.hash(password, 12);

        const [userResult]: any = await connection.execute(
            `INSERT INTO users (username, email, password)
             VALUES (?, ?, ?)`,
            [username.trim(), email.trim().toLowerCase(), hashedPassword]
        );

        const userId = userResult.insertId;

        await connection.execute(
            `INSERT INTO players (user_id) VALUES (?)`,
            [userId]
        );

        const token = randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await connection.execute(
            `INSERT INTO sessions (user_id, token, expires_at)
             VALUES (?, ?, ?)`,
            [userId, token, expiresAt]
        );

        await connection.commit();

        const response = NextResponse.json({
            success: true,
            message: "Registration successful",
            username: username.trim(),
        });

        response.cookies.set("underwater_session", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
        });

        return response;

    } catch (error: any) {
        if (connection) {
            await connection.rollback();
        }

        if (error.code === "ER_DUP_ENTRY") {
            return NextResponse.json(
                { success: false, message: "Username or email already exists" },
                { status: 409 }
            );
        }

        console.error("Registration Error:", error);

        return NextResponse.json(
            { success: false, message: "Registration failed" },
            { status: 500 }
        );

    } finally {
        connection?.release();
    }
}
