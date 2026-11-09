
import { Game } from "./Game";

/**
 * Controls the main game logic.
 * Handles answer validation, rewards,
 * round completion and level progression.
 */
export class GameEngine {
    private currentGame: Game | null = null;

    private coins: number = 0;
    private xp: number = 0;

    private currentLevel: number = 1;

    private fishCompleted: boolean = false;
    private chestCompleted: boolean = false;

    // Set the current puzzle
    setCurrentGame(game: Game): void {
        this.currentGame = game;
    }

    getCurrentGame(): Game | null {
        return this.currentGame;
    }

    // Check fish answer
    checkFishAnswer(answer: number): boolean {
        if (!this.currentGame) {
            return false;
        }

        return answer === this.currentGame.getFishSolution();
    }

    // Check treasure chest answer
    checkChestAnswer(answer: number): boolean {
        if (!this.currentGame) {
            return false;
        }

        return answer === this.currentGame.getChestSolution();
    }

    // Complete fish round and award coins
    completeFishRound(answer: number): boolean {
        if (this.fishCompleted || !this.checkFishAnswer(answer)) {
            return false;
        }

        this.fishCompleted = true;
        this.addCoins(10);

        return true;
    }

    // Complete chest round and award XP
    completeChestRound(answer: number): boolean {
        if (this.chestCompleted || !this.checkChestAnswer(answer)) {
            return false;
        }

        this.chestCompleted = true;
        this.addXP(20);

        return true;
    }

    // Check whether both rounds are completed
    isLevelCompleted(): boolean {
        return this.fishCompleted && this.chestCompleted;
    }

    // Start a new level
    startLevel(level: number): void {
        this.currentLevel = Math.max(1, level);

        this.fishCompleted = false;
        this.chestCompleted = false;
    }

    // Move to the next level
    advanceLevel(): boolean {
        if (!this.isLevelCompleted()) {
            return false;
        }

        this.currentLevel += 1;

        this.fishCompleted = false;
        this.chestCompleted = false;

        return true;
    }

    // Get current level
    getCurrentLevel(): number {
        return this.currentLevel;
    }

    // Get round completion status
    isFishCompleted(): boolean {
        return this.fishCompleted;
    }

    isChestCompleted(): boolean {
        return this.chestCompleted;
    }

    // Add coins
    addCoins(amount: number): void {
        if (amount > 0) {
            this.coins += amount;
        }
    }

    // Add XP
    addXP(amount: number): void {
        if (amount > 0) {
            this.xp += amount;
        }
    }

    // Get total coins
    getCoins(): number {
        return this.coins;
    }

    // Get total XP
    getXP(): number {
        return this.xp;
    }
}
