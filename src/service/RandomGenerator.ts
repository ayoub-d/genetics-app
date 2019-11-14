import {get} from 'lodash';
export class RandomGenerator {
    between(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    of<T>(elements: T[]): T | null {
        const size = elements.length;
        if(size === 0) {
            return null;
        }
        const index = this.between(0, size - 1);
        return get(elements, index, null);
    }

    chance(value: number): boolean {
        if(value <= 0) return false;
        return this.between(0, 100) < value
    }

    decide(): boolean {
        return this.chance(50);
    }
}