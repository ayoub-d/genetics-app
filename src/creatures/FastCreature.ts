import {Creature} from './Creature';

export class FastCreature extends Creature {
    color: string = 'green';
    kind: string = 'Fast';

    additionalEnergySpent(){
        return this.energySpentPerMove * .3;
    }

    move(){
        super.move()
        super.move()
    }
}
