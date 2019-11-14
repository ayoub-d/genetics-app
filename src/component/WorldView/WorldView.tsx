import React from 'react';
import './style.css';
import SlotView from '../SlotView';
import {WorldSlot} from '../../space/WorldSlot';
import {World} from '../../space/World';
import {RandomGenerator} from '../../service/RandomGenerator';

const cellKey = (rowIndex: number, columnIndex: number) => `{rowIndex=${rowIndex}, columnIndex=${columnIndex}}`

const renderRows = (rowIndex: number, slotsRow: WorldSlot[]) => {
    return slotsRow.map((worldSlot, columnIndex) => 
        <SlotView worldSlot={worldSlot} key={cellKey(rowIndex, columnIndex)}/>
    )
}

const renderWorld = (world: World) => {
    return world.slots.map((slotsRow, rowIndex) => {
        return <div className="row" key={`row-${rowIndex}`}>{renderRows(rowIndex, slotsRow)}</div>
    })
}

type Props = {
    worldSize: number,
    random: RandomGenerator
}

type State = {
    world: World,
}

class WorldView extends React.Component<Props, State> {
    constructor(props: Props){
        super(props);
        const {worldSize, random} = this.props;
        const world = new World(worldSize, random);
        world.initSlots();
        world.putFood(40);
        world.spawnCreatures();
        this.state = {world};
    }
    componentDidMount(){
        setInterval(() => {
           this.moveCreatures();
        }, 500)
    }

    moveCreatures(){
        const {world} = this.state;
        world.play();
        this.forceUpdate();
    }
    render() {
        const {world} = this.state;
        return (
            <div className="world-container">
                {`Remaining Food: ${world.countRemainingFood()}`}
                {` , Days: ${world.simulationDays}`}
                {renderWorld(world)}
                <button onClick={() => this.moveCreatures()}>
                    {"Play"}
                </button>
            </div>
        )
    }
}


export default WorldView;
