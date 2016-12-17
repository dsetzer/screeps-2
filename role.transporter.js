var roleTransporter = {
  run: function(creep) {
    // if it's empty
    if (creep.carry.energy === 0) {
      var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
      if (energyPiles.length) {
        var closestEnergy = creep.pos.findClosestByRange(energyPiles);
        if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestEnergy);
        }
      } else {
        var sp1 = Game.spawns.Spawn1;
        if (creep.withdraw(sp1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sp1);
        }
      }
    } else {
      // if it's carrying energy
      var emptyStructures = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
        }
      });
      var closestEmptyStruct = creep.pos.findClosestByRange(emptyStructures);
      if (creep.transfer(closestEmptyStruct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closestEmptyStruct);
      }
      // deposit back in spawn if enough was already transferred
      if (creep.transfer(closestEmptyStruct, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closestEmptyStruct);
      }
    }
  }
};
module.exports = roleTransporter;