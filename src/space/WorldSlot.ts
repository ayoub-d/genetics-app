import {Creature} from '../creatures/Creature';
export class WorldSlot {
    x: number;
    y: number;
    worldSize: number;
    hasFood: boolean = false;
    creatureInSlot?: Creature;

    constructor(x: number, y: number, worldSize: number){
        this.x = x;
        this.y = y;
        this.worldSize = worldSize;
    }

    hasACreature(): boolean {
        return !!this.creatureInSlot;
    }

    isFree(): boolean {
        return !this.hasACreature();
    }

    isOnEdge() {
        return  this.x === 0 || this.y === 0 || this.x === this.worldSize - 1 || this.y === this.worldSize - 1;
    }

    distanceTo(slot: WorldSlot): number {
        return Math.abs((this.x - slot.x) + (this.y - slot.y)) / 2
    }

    hasCreature(kind: String): boolean {
        return this.creatureInSlot != null && this.creatureInSlot.kind === kind
    }

    isSpawnCandidate(): boolean {
        return this.isOnEdge() && !this.hasACreature();
    }

    creatureEnergy(): number {
        if(this.creatureInSlot != null){
            return this.creatureInSlot.currentEnergy
        }
        return 0.0
    }
}