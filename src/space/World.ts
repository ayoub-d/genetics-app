import {RandomGenerator} from '../service/RandomGenerator';
import {range, until} from '../service/ArrayUtils';
import {WorldSlot} from './WorldSlot';
import {Creature} from '../creatures/Creature';
import {NormalCreature} from '../creatures/NormalCreature';
import {FastCreature} from '../creatures/FastCreature';
import {SightCreature} from '../creatures/SightCreature';
import {remove} from 'lodash';

export class World {
    worldSize: number;
    random: RandomGenerator;
    slots: WorldSlot[][] = [];
    creatures: Creature[] = [];
    
    simulationDays = 0;

    constructor(worldSize: number, random: RandomGenerator) {
        this.worldSize = worldSize;
        this.random = random;
    }

    initSlots(){
        range(this.worldSize).forEach(xIndex => {
            this.slots[xIndex] = []
            range(this.worldSize).forEach(yIndex => {
                this.slots[xIndex][yIndex] = new WorldSlot(xIndex, yIndex, this.worldSize);
            })
        })
    }

    slotsList(): WorldSlot[] {
        return this.slots.flatMap(e => e)
    }

    shouldHaveFood(remainingFoodCount: number): Boolean {
        if (remainingFoodCount <= 0)
            return false
        return this.random.chance(35)
    }

    putFood(foodToPut: number) {
        var foodCount = foodToPut;
        this.slotsList().filter(slot => slot.isFree() && !slot.hasFood && !slot.isOnEdge())
            .forEach(slot => {
                if (this.shouldHaveFood(foodCount)){
                    slot.hasFood = true
                    foodCount--
                }
        })
    }

    replicate(creature: Creature){
        if(creature.shouldReplicate()){
            this.spawn(creature.kind);
        }
    }

    play(){
        this.creatures.forEach(creature => {
            console.log("moving creature: ", creature.status())
            creature.move();
            //this.replicate(creature);
        });
        this.simulationDays++;

        if(this.simulationDays % 10 === 0) {
            this.putFood(10);
        }
    }

    randomEdgeSlot(): WorldSlot | null {
        const edgeSlots = this.slotsList().filter(slot => slot.isOnEdge() && !slot.hasACreature());
        return this.random.of(edgeSlots);
    }

    spawnCreatures(): void {
        //this.spawn('Normal');
        //this.spawn('Fast');
        this.spawn('Sight');
    }

    spawn(kind: string){
        var creature;
        const slot = this.randomEdgeSlot();
        const index = this.creatures.length;
        if(slot){
            switch(kind){
                case 'Fast':
                    creature = new FastCreature(index, 'fast', slot, this, this.random);
                    break;
                case 'Sight':
                    creature = new SightCreature(index, 'Sight', slot, this, this.random);
                    break;
                default:
                    creature = new NormalCreature(index, 'normal', slot, this, this.random);
            }
            this.creatures.push(creature);
        }
    }

    kill(creature: Creature): void {
        remove(this.creatures, {'index': creature.index})
    }

    crossSight(slot: WorldSlot): WorldSlot[] {
        return [
            {'x': slot.x - 1, 'y': slot.y},
            {'x': slot.x + 1, 'y': slot.y},
            {'x': slot.x, 'y': slot.y - 1},
            {'x': slot.x, 'y': slot.y + 1}   
        ].filter(({x, y}) => this.validSlotCoordinates(x, y))
            .map(({x, y}) => this.slots[x][y]);
    }

    countRemainingFood(): number {
        return this.slotsList().filter(slot => slot.hasFood).length;
    }

    kingSight(worldSlot: WorldSlot): WorldSlot[] {
        return this.kingSightRange(worldSlot, 1);
    }

    kingSightRange(worldSlot: WorldSlot, extent: number): WorldSlot[] {
        const currentX = worldSlot.x;
        const currentY = worldSlot.y;

        const coordinates = (xCoord: number, yCoord: number) => {
            return [
                    {'x': currentX - xCoord , 'y': currentY - yCoord},
                    {'x': currentX + xCoord , 'y': currentY + yCoord},
                    {'x': currentX - xCoord , 'y': currentY + yCoord},
                    {'x': currentX + xCoord , 'y': currentY - yCoord}
                ].filter(({x, y}) => this.validSlotCoordinates(x, y));
        };
       

        const possibilities = until(extent).map(xRange => {
            return until(extent).filter(val => !(val === 0 && xRange === 0))
                    .map(yRange => coordinates(xRange, yRange))
                    .flatMap(e => e)
                });
       return possibilities.flatMap(e => e)
                .map(({x, y}) => this.slots[x][y]);
        
    }

    validSlotCoordinates(x: number, y: number): boolean {
        return x >= 0 && x <= this.worldSize - 1 && y >= 0 && y <= this.worldSize -1
    }
}