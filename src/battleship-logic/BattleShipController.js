import Player from './Player';
import Pubsub from './Pubsub';

const humanPlayer = Player();
const computerPlayer = Player('Computer');
Pubsub.publish('loadPreGame', humanPlayer);
