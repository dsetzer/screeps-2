var roleJanitor = {
  run: function(creep) {
      if (creep.carry.energy === 0) {
          creep.memory.repairing = false;
      }
    if ((creep.carry.energy < creep.carryCapacity) && (!creep.memory.repairing)) {

            // find closest container
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                             s.store[RESOURCE_ENERGY] > (creep.carryCapacity - creep.carry.energy)
            });
            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container);
                }
            }
            else {
                // find closest source
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(source);
                }
            let spawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_SPAWN) && s.energy > 0
            });
            if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
            }

    }
    else {
        creep.memory.repairing = true;
        var repairTarget;
/*        var ramparts = creep.room.find(FIND_STRUCTURES, {
            filter: s => ((s.structureType === STRUCTURE_RAMPART) && (s.hits < 35000) && (s.hits < s.hitsMax))
        });
        var walls = creep.room.find(FIND_STRUCTURES, {
            filter: s => ((s.structureType === STRUCTURE_WALL || STRUCTURE_RAMPART) && (s.hits < 35000) && (s.hits < s.hitsMax))
        });
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: s => ((s.structureType === STRUCTURE_CONTAINER) && (s.hits < 100000))
        });
        if (containers.length) {
            console.log('jnts cs')
            var cont = creep.pos.findClosestByRange(containers);
            if (creep.repair(cont) == ERR_NOT_IN_RANGE) {
                creep.moveTo(cont);
            }
        }
        if (ramparts.length) {
            var closestRampart = creep.pos.findClosestByRange(ramparts);
            if (creep.repair(closestRampart) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestRampart);
            }
            
        }
        if (walls.length) {
            var closestWall = creep.pos.findClosestByRange(walls);
            var sortedWalls = walls.sort((a,b) => a.hits - b.hits);
            if (creep.repair(sortedWalls[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sortedWalls[0]);
            }
            
        }*/
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: s => ((s.hits < 35000) && (s.hits < s.hitsMax))
        });
      
        targets.sort((a,b) => a.hits - b.hits);
      
      if(targets.length > 0) {
        // console.log(targets[0]);
        creep.memory.repairing = true;
        var closestTarget = creep.pos.findClosestByPath(targets);
        if(creep.repair(closestTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestTarget);
        }
      }
    }
  }
};

module.exports = roleJanitor;