var roleTransporter = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // not full, need to harvest
    if(creep.carry.energy < creep.carryCapacity) {
      creep.memory.harvesting = true;
        var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
      if (energyPiles.length) {
          // todo fix hrvs moving to temporarily dropped energy piles, check it's closer && worth the journey?
        var closestEnergy = creep.pos.findClosestByRange(energyPiles);
        if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestEnergy);
        }
      } else {
        // remove from containers that are at least half full, put into nearest structure, if full put in storage
        var containers = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > (structure.storeCapacity * 0.5))
            }
          });
          var closestContainer = creep.pos.findClosestByRange(containers);
          if(creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestContainer);
          }
      }

    } else {
      // full, go store energy
      creep.memory.harvesting = false;
      // standard
      var potentialTargets;
      var stores = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
          }
        });
      if (stores.length > 0) {
        var closestStore = creep.pos.findClosestByPath(stores);
      }
      if(creep.transfer(closestStore, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closestStore);
      }
      //  else {
      //   var roomStorage = creep.room.storage;
      //   if(creep.transfer(roomStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      //     creep.moveTo(roomStorage);
      //   }
      // }
    }
  }
};

module.exports = roleTransporter;