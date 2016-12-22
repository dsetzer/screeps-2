module.exports = {
    run: function(creep) {
        var target = new RoomPosition(14, 30, 'E68S71');
        var home = 'E69S71';
        // console.log(`fMiner, ${creep.carry.energy} / ${creep.carryCapacity}, target: ${target}`)
    
        if ((creep.carry.energy < creep.carryCapacity) && (creep.memory.harvesting)) {
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
        
        if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.harvesting = false;
            var homeRoomWestGate = new RoomPosition(5, 35, 'E69S71');
            creep.moveTo(homeRoomWestGate);
        }
        
        if ((!creep.memory.harvesting) && (creep.room.name == home)) {
            if (creep.carry.energy > 0) {
           // put in spawn > extensions > container
                var returnTargets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                      return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                    }
                });
                var closestTarget = creep.pos.findClosestByPath(returnTargets);
                if(returnTargets.length > 0) {
                    if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestTarget);
                    }
                }  else {
                    // find closest container
                    let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                                     s.store[RESOURCE_ENERGY] > 0
                    });
                    if (container) {
                        if (creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                           creep.moveTo(container); 
                        }
                    }
                }
            } else {
                creep.memory.harvesting = true;
            }
        }
/*        
        console.log(creep.room.name, target, creep.carry.energy);
        if ((creep.room.name !== target) && (creep.carry.energy === 0)) {
            
        }
        console.log('trg', creep.room.find(target))
        if ((creep.carry.energy < creep.carryCapacity) && !creep.memory.harvesting) {
            if ((creep.room.name === target)) {
                
                console.log('b')
                // harvest source until full
                var allSources = creep.room.find(FIND_SOURCES_ACTIVE);
                var closestSource = creep.pos.findClosestByPath(allSources);
                if (creep.harvest(closestSource) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestSource);
                }
            } else {
                creep.moveTo(target);
            console.log('a')
            }
        } else {
            console.log('c')
            // full, return to base
            creep.memory.harvesting = false;
        }
        if (!creep.memory.harvesting) {
                if (creep.room.name !== home) {
                console.log(creep.room.name, home)
                var homeRoomWestGate = new RoomPosition(5, 35, 'E69S71');
                creep.moveTo(homeRoomWestGate);  
                console.log('d')
            } else {
                if (creep.carry.energy > 0) {
                    // put in spawn > extensions > container
                    var returnTargets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                          return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                    });
                    var closestTarget = creep.pos.findClosestByPath(returnTargets);
                    if(returnTargets.length > 0) {
                        console.log('f')
                        if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(closestTarget);
                        }
                    } 
                } else {
                    creep.memory.harvesting = true;
                }
            }
        }
        */
    }
};