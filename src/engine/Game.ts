
/**
 * Represents one Fish Game puzzle.
 * Stores the puzzle image and its correct answers.
 */

export class Game {
    private image: string;
    private fishSolution: number;
    private chestSolution: number;

    constructor(
        image: string,
        fishSolution: number,
        chestSolution: number
    ) {
        this.image = image;
        this.fishSolution = fishSolution;
        this.chestSolution = chestSolution;
    }

    getImage(): string {
        return this.image;
    }

    getFishSolution(): number {
        return this.fishSolution;
    }

    getChestSolution(): number {
        return this.chestSolution;
    }
}
