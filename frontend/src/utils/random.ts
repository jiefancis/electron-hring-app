export class RandomUtil {

    public randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export const randomUtil = new RandomUtil();
