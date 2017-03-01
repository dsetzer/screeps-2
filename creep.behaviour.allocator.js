let mod = {};
module.exports = mod;
mod.name = 'allocator';
mod.run = function(creep) {
    // Assign next Action
    let oldTargetId = creep.data.targetId;
    if( creep.action == null || creep.action.name == 'idle' ) {
        this.nextAction(creep);
    }
    
    // Do some work
    if( creep.action && creep.target ) {
        creep.action.step(creep);
    } else {
        logError('Creep without action/activity!\nCreep: ' + creep.name + '\ndata: ' + JSON.stringify(creep.data));
    }
};
mod.nextAction = function(creep){
    if( creep.pos.roomName != creep.data.homeRoom && Game.rooms[creep.data.homeRoom] && Game.rooms[creep.data.homeRoom].controller ) {
        Creep.action.travelling.assign(creep, Game.rooms[creep.data.homeRoom].controller);
        return;
    }
    let priority;
    if( creep.sum < creep.carryCapacity/2 ) {
        priority = [
            Creep.action.reallocating,
            Creep.action.storing,
            Creep.action.idle,
          ];
    }
    else {
        priority = [
            Creep.action.reallocating,
            Creep.action.storing,
            Creep.action.idle,
          ];

        if ( creep.sum > creep.carry.energy ||
            ( !creep.room.situation.invasion
            && SPAWN_DEFENSE_ON_ATTACK
            && creep.room.conserveForDefense && creep.room.relativeEnergyAvailable > 0.8)) {
                priority.unshift(Creep.action.storing);
        }
        if (creep.room.structures.urgentRepairable.length > 0 ) {
            priority.unshift(Creep.action.fueling);
        }
    }

    for(var iAction = 0; iAction < priority.length; iAction++) {
        var action = priority[iAction];
        // console.log((action);
        if(action.isValidAction(creep) &&
            action.isAddableAction(creep) &&
            action.assign(creep)) {
                return;
        }
    }
};


// Game.rooms['W86N9'].placeReactionOrder('58ac1e5ba349193e68977f91', RESOURCE_KEANIUM_ALKALIDE, 800);
// 
// Game.rooms['W86N9'].setStore('58ac1e5ba349193e68977f91', 'XGHO2', -3000);