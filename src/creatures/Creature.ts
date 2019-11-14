import {World} from '../space/World';
import {WorldSlot} from '../space/WorldSlot';
import {RandomGenerator} from '../service/RandomGenerator';

export const INITIAL_ENERGY_VALUE = 20.0
export const DEFAULT_MUTATION_CHANCE = 5
export const DEFAULT_REPLICATION_CHANCE = 5
export const DEFAULT_ENERGY_SPENT_PER_MOVE = 1.0
export const MAX_ENERGY = 50.0
export const MAX_LIFE_TIME = 60

export abstract class Creature {
    index: number;
    name: string;
    
    abstract color: string;
    abstract kind: string;
     
    chanceToReplicate = DEFAULT_REPLICATION_CHANCE;
    energySpentPerMove = DEFAULT_ENERGY_SPENT_PER_MOVE;
    energyGainPerFood = INITIAL_ENERGY_VALUE / 2;
    priority = 1.0
    
    currentEnergy: number = INITIAL_ENERGY_VALUE;
    currentSlot: WorldSlot;
    world: World;
    daysSurvived: number = 0;
    random: RandomGenerator;

    movement = {'x': 0, 'y': 0};
    
    constructor(index: number, name: string, currentSlot: WorldSlot, world: World, random: RandomGenerator) {
        this.index = index;
        this.name = name;
        this.currentSlot = currentSlot;
        this.currentSlot.creatureInSlot = this;
        this.world = world;
        this.random = random;
    }

    additionalEnergySpent(): number {
        return 0;
    }

    makeMove(newSlot: WorldSlot): void {
        this.eat(newSlot)
        newSlot.creatureInSlot = this
        this.currentSlot.creatureInSlot = undefined;
        this.currentSlot = newSlot
    }

    move() {
        if (this.daysSurvived > MAX_LIFE_TIME || this.outOfEnergy()) {
            this.die()
        } else {
            const slotToMoveInto = this.selectSlotToMoveInto();
            this.currentEnergy -= this.energySpentPerMove + this.additionalEnergySpent();
            if (slotToMoveInto) {
                //this.movement = this.translateAnimation(this.currentSlot, slotToMoveInto);
                //setTimeout(() => {
                    this.preMove(slotToMoveInto)
                    this.makeMove(slotToMoveInto)
                //}, 500);

               // this.movement = {'x': 0, 'y': 0};
            }
        }
    }

    translateAnimation(from: WorldSlot, to: WorldSlot) {
        return {
            'x': (from.x - to.x) * 75,
            'y': (from.y - to.y) * 75
        }
    }

    eat(slot: WorldSlot): void {
        if (slot.hasFood) {
            this.grantEnergy(this.energyGainPerFood)
            slot.hasFood = false
        }
    }

    outOfEnergy(): boolean {return this.currentEnergy < this.energySpentPerMove;}

    grantEnergy(grantValue: number): void {
        if (this.currentEnergy < MAX_ENERGY){
            this.currentEnergy += grantValue;
        }
    }

    survived(): void {
        this.daysSurvived++
    }

    status(): string {
        return this.kind[0] + this.currentEnergy.toFixed(1);
    }

    preMove(slotToMoveInto: WorldSlot): void {
        this.daysSurvived++;
    }
    mutate(): void {}

    replicateInto() {
        return {
            "mutation": this.kind,
            "chance": 100
        }
    }

    die(): void {
        this.currentSlot.creatureInSlot = undefined;
        this.world.kill(this);
    }

    randomSlot(availableSlot: WorldSlot[]) {
        return this.random.of(availableSlot);
    }

    selectSlotToMoveInto() {
        const adjucantSlots = this.world
            .crossSight(this.currentSlot)
            .filter((slot) => !slot.hasACreature());
        if (adjucantSlots.length !== 0) {
            return this.randomSlot(adjucantSlots)
        }
        return null
    }
    
    slotSelector(slots: WorldSlot[], slotFilter: (slot: WorldSlot) => Boolean) {
        if (slots.length === 0) {
            return null;
        }
        const filtredSlots = slots.filter(slotFilter)
        if (filtredSlots.length === 1) {
            return filtredSlots[0]
        } else if (filtredSlots.length === 0) {
            return this.randomSlot(slots)
        } else {
            return this.randomSlot(filtredSlots)
        }
    }

    shouldReplicate(): boolean {
        const chance = (this.chanceToReplicate * 2 * this.currentEnergy / MAX_ENERGY)
        return this.random.chance(chance)
    }
    
}