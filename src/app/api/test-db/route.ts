import { NextResponse } from "next/server";
import pool from "@/lib/mysql";

export async function GET() {
    try {
        const [rows] = await pool.query(
            "SELECT DATABASE() AS databaseName"
        );

        return NextResponse.json({
            success: true,
            message: "MySQL connected successfully!",
            database: rows,
        });
    } catch (error) {
        console.error("MySQL Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "MySQL connection failed",
            },
            { status: 500 }
        );
    }
}