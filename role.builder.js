var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('building');
        }

        if(creep.memory.building) {
            // if creep spawned in with assignment in memory, go to target room before building
            if((creep.memory.assignment !== undefined) && (creep.room.name !== creep.memory.assignment)) {
                var targetRoom = creep.memory.assignment;
                var trg = new RoomPosition(25, 25, targetRoom);
                creep.moveTo(trg);
                // creep.room.findExitTo(E68S71)
            } else {
                // else build in this room
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                var closestTarget = creep.pos.findClosestByPath(targets);
                if(targets) {
                    // console.log(targets);
                    if(creep.build(closestTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestTarget);
                    }
                }
            }
            // todo take into account sites in other rooms
            // var globalSites;
            // for (var thisRoom in Game.rooms) {
            //     var roomSites = Game.rooms[thisRoom].find(FIND_CONSTRUCTION_SITES);
            //     if (roomSites) {
            //         console.log(roomSites, typeof(roomSites));
            //         var targets = roomSites;
            //         for (let i = 0; i < roomSites.length; i++) {
            //             console.log(roomSites[i]);
            //             console.log(roomSites.length);
            //             console.log(roomSites[i].pos.x, roomSites[i].pos.y)
            //         }
            //     }
            // }
        }
        else {
            var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
                        if (energyPiles.length) {
                var closestEnergy = creep.pos.findClosestByRange(energyPiles);
                if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestEnergy);
                }
              } else {
                 var sources = creep.room.find(FIND_SOURCES);
            var closestSource = creep.pos.findClosestByPath(sources);
            if(creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestSource);
            } 
              }
            
        }
    }
};

module.exports = roleBuilder;