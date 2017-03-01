// useful commands

// Recycle a creep
Creep.action.recycling.assign(Game.creeps['']);
Creep.action.building.assign(Game.creeps['']);
Creep.action.reallocating.assign(Game.creeps['remoteHauler-']);
/* rooms
NW:
W89N9
NE:
W86N9
S:
W88N7

private:
W7N3
*/
  
/* placeOrder
Game.rooms[''].placeOrder('id', RESOURCE_, count);

setStore
Game.rooms[''].setStore('id', RESOURCE_, count);

placeReactionOrder
Game.rooms['W89N9'].placeReactionOrder('id', RESOURCE_, count);
*/

// flush road construction traces
_.forEach(Memory.rooms, r => delete r.roadConstructionTrace);

// remove all construction Sites
_.forEach(Game.constructionSites, s => s.remove());

// spawn something...
Game.spawns['<spawnName>'].createCreepBySetup(Creep.setup.worker);
// or
Game.rooms['<roomName>'].spawnQueueLow.push({parts:[MOVE,WORK,CARRY],name:'max',setup:'worker'});
Game.rooms[''].spawnQueueHigh.push({parts:[MOVE,WORK,WORK,CARRY,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,WORK,WORK,CARRY,CARRY,MOVE,WORK,WORK,CARRY,CARRY,],name:'wk',setup:'worker'});

Game.rooms['W7N3'].spawnQueueHigh.push({parts:[TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,MOVE, MOVE, MOVE,MOVE, MOVE, MOVE,MOVE, MOVE, MOVE,MOVE, MOVE, MOVE,MOVE,MOVE, HEAL, HEAL,HEAL,HEAL,HEAL, HEAL,HEAL],name:'h',setup:'healer', destiny: {buddy:'dismantler-Flag1-2'}});

Game.rooms['W7N3'].spawnQueueHigh.push({parts:[TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE,MOVE, MOVE, MOVE,MOVE, MOVE, MOVE,MOVE, MOVE, MOVE,MOVE,MOVE,MOVE,MOVE, HEAL, HEAL,HEAL,HEAL,HEAL, HEAL,HEAL, HEAL],name:'h',setup:'healer', destiny: {buddy:'dismantler-Flag1-2'}});

// clear spawn queues for a room
// clear low priority queue
Memory.rooms['<roomName>'].spawnQueueLow = [0];
// clear medium priority queue
Memory.rooms['<roomName>'].spawnQueueMedium = [0];
// clear high priority queue 
Memory.rooms['<roomName>'].spawnQueueHigh = [0];

// move Creep
Game.creeps['<creepName>'].move(RIGHT);

// force recycle a Creep
Game.creeps['<creepName>'].data.creepType="recycler";

// To override a module file create a copy of an existing module and name it "custom.<originalModuleName>". Then call this method (without ".js"): 
getPath('<originalModuleName>', true);
// To completely re-evaluate all modules:
delete Memory.modules;

// create market order (replace [roomName] with target room or remove it for subscription tokens)
Game.market.createOrder(type, resourceType, price, totalAmount, roomName);

//accept market sell or buy order
Game.market.deal(orderId, amount, roomName);

//flush visuals heatmap
_.forEach(Memory.rooms, r => delete r.heatmap);