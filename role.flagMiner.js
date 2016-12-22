module.exports = {
    run: function(creep) {
        var targetRoom = 'E68S71';
        var target = new RoomPosition(14, 30, targetRoom);
        var home = 'E69S71';
        if (creep.room.name !== targetRoom) {
            creep.moveTo(target);
        } else {
            creep.memory.harvesting = true;
            creep.moveTo(Game.flags.SOURCE_WEST);
            if (creep.room.name !== home) {
                var src = Game.flags.SOURCE_WEST.pos.lookFor(LOOK_SOURCES);
                if (src.length) {
                    if (creep.harvest(src[0]) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(src[0]);
                    }
                } 
            }
        }
        // console.log(`fMiner, ${creep.carry.energy} / ${creep.carryCapacity}, target: ${target}`)
        if ((creep.carry.energy < creep.carryCapacity) && (creep.memory.harvesting))
        {
            // console.log('flg should be hrv')
            // creep.moveTo(Game.flags.SOURCE_WEST);
            // if (creep.room.name !== home) {
            //     var src = Game.flags.SOURCE_WEST.pos.lookFor(LOOK_SOURCES);
            //     if (src.length) {
            //         if (creep.harvest(src[0]) === ERR_NOT_IN_RANGE) {
            //             creep.moveTo(src[0]);
            //         }
            //     } 
            // }

        }
        
        if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.harvesting = false;
        } else if (creep.carry.energy === 0) {
            // creep.memory.harvesting = true;
        }
        // } else {
        //   var homeRoomWestGate = new RoomPosition(5, 35, 'E69S71');
        //     creep.moveTo(homeRoomWestGate); 
        // }
            
        if (!creep.memory.harvesting) {
            var cnts = creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });
            //console.log('cnts', cnts.length);
            if (cnts.length) {
                var nearest = creep.pos.findClosestByRange(cnts);
                creep.moveTo(nearest);
                if (nearest.hits < (nearest.hitsMax * 0.66)) { 
                    creep.repair(nearest);
                }
                if(creep.transfer(nearest, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(nearest);
                } else if(creep.transfer(cnts[0], RESOURCE_ENERGY) == ERR_FULL) {
                    creep.drop(RESOURCE_ENERGY);
                }
                
            }
        }
    }
};