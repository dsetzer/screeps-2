var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
      var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
      if (energyPiles.length) {
        var closestEnergy = creep.pos.findClosestByRange(energyPiles);
        if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestEnergy);
        }
      } else {
        var sources = creep.room.find(FIND_SOURCES_ACTIVE);
        var harvesterSource = creep.pos.findClosestByPath(sources);
        if (creep.harvest(harvesterSource) == ERR_NOT_IN_RANGE) {
          creep.moveTo(harvesterSource);
        }
      }

    }
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
          }
        });
      if(targets.length > 0) {
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    }
  }
};

module.exports = roleHarvester;