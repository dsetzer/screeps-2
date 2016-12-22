var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
/*        var resourcePiles = creep.room.find(FIND_DROPPED_RESOURCES);
        var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
      if (resourcePiles.length || energyPiles.length) {
          // todo fix hrvs moving to temporarily dropped energy piles, check it's closer && worth the journey?
        var closestEnergy = creep.pos.findClosestByRange(resourcePiles || energyPiles);
        if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestEnergy);
        }
      }*/
        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
        // var hardCodedHarvesterSource = sources[1];
        var harvesterSource = creep.pos.findClosestByPath(sources);
        if (creep.harvest(harvesterSource) == ERR_NOT_IN_RANGE) {
          creep.moveTo(harvesterSource);
        }

    // }
    }
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
          }
        });
      if(targets.length > 0) {
        var nearestTarget = creep.pos.findClosestByPath(targets);
        if(creep.transfer(nearestTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(nearestTarget);
        }
      } else {
        var roomStorage = creep.room.storage;
        if(creep.transfer(roomStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(roomStorage);
        }
      }
    }
  }
};

module.exports = roleHarvester;