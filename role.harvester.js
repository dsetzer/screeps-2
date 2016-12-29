var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    //   var pos = creep.room.lookForAtArea(LOOK_TERRAIN, 25,7, 12, 14);
    //     console.log(pos);
    //     for (let p in pos) {
    //         console.log(pos)
    //     }
    // not full, need to harvest
    if(creep.carry.energy < creep.carryCapacity && creep.memory.harvesting) {
        var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
    //   if (energyPiles.length) {
    //       console.log(energyPiles.length)
    //       // todo fix hrvs moving to temporarily dropped energy piles, check it's closer && worth the journey?
    //     var closestEnergy = creep.pos.findClosestByRange(energyPiles);
    //     if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
    //       creep.moveTo(closestEnergy);
    //     }
    //   }
        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
        // var hardCodedHarvesterSource = sources[1];
        var harvesterSource = creep.pos.findClosestByPath(sources);
        if (creep.harvest(harvesterSource) == ERR_NOT_IN_RANGE) {
          creep.moveTo(harvesterSource);
        }
    } else {
      // full, go store energy
      creep.memory.harvesting = false;
      if (creep.carry.energy > 0 && creep.memory.harvesting == false) {
        // container
        var containers = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < (structure.storeCapacity))
            }
          });
        // standard
        var potentialTargets;
        var stores = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
          }
        });
        //console.log('containers', containers.length);
        if (containers.length) {
          var closestContainer = creep.pos.findClosestByRange(containers);
        }
        if (stores.length > 0) {
          var closestStore = creep.pos.findClosestByPath(stores);
        }
        potentialTargets = containers.concat(stores);
        if (potentialTargets.length) {
          var closestTarget = creep.pos.findClosestByPath(potentialTargets);
          if(creep.transfer(closestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestTarget);
          }
        } else {
            var roomStorage = creep.room.storage;
            if(creep.transfer(roomStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(roomStorage);
            }
        }
      } else {
        creep.memory.harvesting = true;
      }

    }
  }
};

module.exports = roleHarvester;