import React from 'react';
import './style.css';
import {WorldSlot} from '../../space/WorldSlot';

type Props = {
    worldSlot: WorldSlot
}

/*
const translateAnimation = (from: WorldSlot, to: WorldSlot) => {
    return {
        'x': (to.x - from.x) * 75,
        'y': (to.y - from.y) * 75
    }
}
*/

const style = (color: string, {x, y}: any) => {
    return {
        'backgroundColor': color,
        'transform': `translate(${x}px,${y}px)`,
        'zIndex': 99,
        'transition': 'all 0.5s 0s'
    }
}

const SlotView = ({worldSlot}: Props) => (
    <div className="cell">
        {worldSlot.hasFood && <div className="food centered" />}
        {worldSlot.creatureInSlot && 
            <div className="creature centered" style={style(worldSlot.creatureInSlot.color, worldSlot.creatureInSlot.movement)}>
                <div className="centered creature-label">{worldSlot.creatureInSlot.status()}</div>
            </div>
        }
    </div>
);

export default SlotView;
