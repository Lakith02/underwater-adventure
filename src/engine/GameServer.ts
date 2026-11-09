
import { Game } from "./Game";

export class GameServer {
    private static readonly API_URL = "/api/fish";

    static async getNewGame(): Promise<Game> {
        try {
            console.log("Calling Fish API:", this.API_URL);

            const response = await fetch(this.API_URL, {
                method: "GET",
                cache: "no-store",
            });

            console.log("API Status:", response.status);

            if (!response.ok) {
                throw new Error(
                    `Fish API request failed: ${response.status}`
                );
            }

            const data = await response.json();

            console.log("Fish API Data:", data);

            return new Game(
                data.question,
                data.fish,
                data.chest
            );
        } catch (error) {
            console.error("GameServer Error:", error);
            throw error;
        }
    }
}
