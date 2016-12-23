var roleJanitor = {
  run: function(creep) {
      if (creep.carry.energy === 0) {
          creep.memory.repairing = false;
      }
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
          var closestSource = creep.pos.findClosestByRange(sources);
        if (creep.harvest(closestSource) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestSource);
        }
      }
    }
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => ((object.hits < 75000) && (object.hits < (object.hitsMax * 0.66)))
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