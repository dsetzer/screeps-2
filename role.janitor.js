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
      creep.say('repairing');
      var targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => object.hits < object.hitsMax
      });
      
      targets.sort((a,b) => a.hits - b.hits);
      
      if(targets.length > 0) {
        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);    
        }
      }
    }
  }
};

module.exports = roleJanitor;