var roleJanitor = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.carry.energy < creep.carryCapacity) {
      var sources = creep.room.find(FIND_SOURCES);
      var harvesterSource = sources[1];
      if (creep.harvest(harvesterSource) == ERR_NOT_IN_RANGE) {
        creep.moveTo(harvesterSource);
      }
    }
    else {
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits <= object.hitsMax * 0.66
      });
      
      targets.sort((a,b) => a.hits - b.hits);
      
      if(targets.length > 0) {
        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);    
        }
      } else {
          var buildTargets = creep.room.find(FIND_CONSTRUCTION_SITES);
          if (buildTargets.length) {
            if(creep.build(buildTargets[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(buildTargets[0]);
          }
        }
      }
    }
  }
};

module.exports = roleJanitor;