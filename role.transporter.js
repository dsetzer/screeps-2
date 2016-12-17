var roleTransporter = {
  run: function(creep) {
    // keep ref to Spawn1
    var spawns = creep.room.find(FIND_MY_SPAWNS);
    var sp1 = spawns[0];
    // find extensions that aren't full
    var emptyExtensions = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return ((structure.structureType == STRUCTURE_EXTENSION) && (structure.energy < structure.energyCapacity))
      }
    });
    // if extensions need filling, find closest & energy required
    if (emptyExtensions.length) {
      var closestEmptyExt = creep.pos.findClosestByRange(emptyExtensions);
      var amount = closestEmptyExt.energyCapacity - closestEmptyExt.energy;
      // withdraw energy from spawn until required amount met
      if (creep.carry.energy < amount) {
        if (creep.withdraw(sp1, RESOURCE_ENERGY, amount) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sp1);
        }
      }
      // deposit energy into extension
      if (creep.transfer(closestEmptyExt, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(closestEmptyExt);
      }
    } else {
      // deposit back in spawn if enough was already transferred
      if (creep.transfer(sp1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sp1);
      }
    }
    
    // var targets = creep.room.find(FIND_STRUCTURES, {
    //   filter: (structure) => {
    //     return (structure.structureType == STRUCTURE_EXTENSION ||
    //       structure.structureType == STRUCTURE_SPAWN ||
    //       structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
    //     }
    //   });
    // if(targets.length > 0) {
    //   if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    //     creep.moveTo(targets[0]);
    //   }
    // }
    
  }
};
module.exports = roleTransporter;