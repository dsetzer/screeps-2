var roleMiner = {
  /** @param {Creep} creep **/
run: function(creep) {
    var sources = creep.room.find(FIND_SOURCES_ACTIVE);
    var targetRoom = 'E73S18';
    if (creep.memory.assignment == 'north') {
        targetRoom = 'E72S17'
    }
     if (creep.memory.assignment == 'east') {
        targetRoom = 'E73S18'
    }
    
        if (creep.memory.assignment && creep.room.name !== targetRoom) {
            creep.memory.repositioning = true;
            var trg = new RoomPosition(25, 25, targetRoom);
            creep.moveTo(trg);
            return;
        }
        
        if (creep.memory.assignment && creep.room.name == targetRoom) {
            creep.memory.repositioning = false;
        }
    
    if (!creep.memory.reassigning) {
        var sourceToHarvest = creep.pos.findClosestByPath(sources);
        if (creep.harvest(sourceToHarvest) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sourceToHarvest);
        }   
    }
  }
};

module.exports = roleMiner;