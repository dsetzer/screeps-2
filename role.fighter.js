var roleFighter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
/*        var targetRoom = Game.flags.FIGHTERS.pos.roomName;
        var targetX  = Game.flags.FIGHTERS.pos.x
        var targetY = Game.flags.FIGHTERS.pos.y
        creep.moveTo(new RoomPosition(targetX,targetY,targetRoom))
        return;
        
        if (creep.memory.assignment !== undefined && creep.room.name != targetRoom) {
            creep.memory.hasArrived = false;
            creep.moveTo(new RoomPosition(targetX,targetY,targetRoom))
            return;
        }*/
        
        if (creep.memory.assignment !== undefined && creep.room.name === targetRoom) {
            creep.memory.hasArrived = true;
        }
        var creeps = creep.room.find(FIND_HOSTILE_CREEPS);
        var closestCrp = creep.pos.findClosestByRange(creeps);
        if (creep.attack(closestCrp) == ERR_NOT_IN_RANGE) {
            console.log(creep.name, 'moving to attack')
            creep.moveTo(closestCrp);
        } else {
            if (creep.rangedAttack(closestCrp) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestCrp);
            }
        }
    }
}

module.exports = roleFighter;