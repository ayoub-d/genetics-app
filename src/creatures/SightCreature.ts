
import {Creature} from './Creature';
import {minBy, isEmpty} from 'lodash';

export class SightCreature extends Creature {
    color: string = 'purple';
    kind: string = 'Sight';


    selectSlotToMoveInto() {
        const adjucantSlots = this.world.kingSight(this.currentSlot).filter(slot => slot.isFree())
        const foodSlots = adjucantSlots.filter(slot => slot.hasFood);
        const noFilter = () => true;
        if(isEmpty(foodSlots)){
            const foodInSight = this.world.kingSightRange(this.currentSlot, 2).filter(slot => slot.hasFood)
            if (!isEmpty(foodInSight) && !isEmpty(adjucantSlots)){
                const closest = minBy(adjucantSlots, (slot) => slot.distanceTo(foodInSight[0]));
                return closest || null
            } else {
                return this.slotSelector(adjucantSlots, noFilter)
            }
        }
        return this.slotSelector(foodSlots, noFilter)
    }
    
}
