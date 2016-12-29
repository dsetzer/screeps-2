var roleFighter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var bullyValley = 'E71S17';
        creep.memory.hasArrived = false;
        if (creep.memory.bully !== undefined) {
            // creep.moveTo(new RoomPosition(37, 47, bullyValley))
            //return;
            if (creep.room.name !== bullyValley) {
                creep.moveTo(new RoomPosition(37, 47, bullyValley))
            } else {
                // return;
            }
        }
        var creeps = creep.room.find(FIND_HOSTILE_CREEPS);
        var closestCrp = creep.pos.findClosestByRange(creeps);
        if (creep.attack(closestCrp) == ERR_NOT_IN_RANGE) {
            console.log(creep.name, 'moving to attack')
            creep.moveTo(closestCrp);
        }
    }
}

module.exports = roleFighter;