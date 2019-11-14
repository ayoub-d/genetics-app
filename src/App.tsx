import React from 'react';
import {RandomGenerator} from './service/RandomGenerator'
import WorldView from './component/WorldView'

const App: React.FC = () => {
  const worldSize = 10;
  const random = new RandomGenerator();
  return (
    <div className="App">
      <WorldView worldSize={worldSize} random={random}/>
    </div>
  );
}

export default App;
