var roleUpgrader = {
  run: function(creep) {
    var energyPickupLocation;
    var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
      filter: (i) => i.structureType == STRUCTURE_CONTAINER && 
        i.store[RESOURCE_ENERGY] > 0
    });
    if (containersWithEnergy.length) {
      if (creep.withdraw(energyPickupLocation, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(energyPickupLocation);
      }
    } else {
      var sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    }
    if(creep.memory.upgrading && creep.carry.energy == 0) {
      creep.memory.upgrading = false;
      creep.say('harvesting');
    }
    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say('upgrading');
    }

    if(creep.memory.upgrading) {
      if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  }
};

module.exports = roleUpgrader;