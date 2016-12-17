var roleJanitor = {
  run: function(creep) {
    if ((creep.carry.energy < creep.carryCapacity) && (!creep.memory.repairing)) {
      var energySource;
      var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
      var sources = creep.room.find(FIND_SOURCES);
      if (energyPiles.length) {
        var closestEnergy = creep.pos.findClosestByRange(energyPiles);
        if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestEnergy);
        }
      } else {
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
        }
      }
    }
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
      });
      
      targets.sort((a,b) => a.hits - b.hits);
      
      if(targets.length > 0) {
        // console.log(targets[0]);
        creep.memory.repairing = true;
        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    }
  }
};

module.exports = roleJanitor;