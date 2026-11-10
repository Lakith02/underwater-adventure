
import { NextResponse, connection } from "next/server";

export async function GET() {
    await connection();

    try {
        const response = await fetch(
            "http://marcconrad.com/uob/fish/api.php?out=json",
            {
                cache: "no-store",
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Fish API request failed" },
                { status: 502 }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            question: data.question,
            fish: data.fish,
            chest: data.chest,
        });
    } catch (error) {
        console.error("Fish API Error:", error);

        return NextResponse.json(
            { error: "Unable to connect to Fish API" },
            { status: 500 }
        );
    }
}
