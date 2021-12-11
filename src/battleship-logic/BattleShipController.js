import Player from './Player';
import Pubsub from './Pubsub';
import '../components/PreGame';

const humanPlayer = Player();
const computerPlayer = Player('Computer');
Pubsub.publish('loadPreGame', humanPlayer);
