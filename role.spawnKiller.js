var roleSpawnKiller = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var targetRoom = 'E72S19';
        // var goTime = 16372999;
        // if (Game.time < goTime) {
        //     creep.moveTo(Game.flags.Flag1);
        //     return;
        // }
        creep.memory.hasArrived = false;
        // creep.moveTo(new RoomPosition(37, 47, bullyValley))
        //return;
        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(37, 47, targetRoom))
        } else {
            creep.memory.hasArrived = true;
        }
        if (creep.memory.hasArrived) {
            var spawns = creep.room.find(FIND_HOSTILE_SPAWNS);
            if (spawns.length) {
                if (creep.attack(spawns[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawns[0])
                }
            } else {
                var creeps = creep.room.find(FIND_HOSTILE_CREEPS);
                var closestCrp = creep.pos.findClosestByRange(creeps);
                if (creep.attack(closestCrp) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestCrp);
                }
            }

        }

    }
}

module.exports = roleSpawnKiller;