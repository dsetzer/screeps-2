var roleMiner = {
  /** @param {Creep} creep **/
run: function(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    var sourceToHarvest;
    switch (creep.memory.assignment) {
      case 'NORTH': {
        sourceToHarvest = sources[0]
        break;
      }
      case 'SOUTH': {
        sourceToHarvest = sources[1]
        break;
      }
      default: {
        sourceToHarvest = creep.pos.findClosestByPath(sources);
        break;
      }
    }
    if (creep.harvest(sourceToHarvest) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sourceToHarvest);
    }
  }
};

module.exports = roleMiner;