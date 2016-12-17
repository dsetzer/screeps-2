var roleMiner = {
  /** @param {Creep} creep **/
run: function(creep) {
    var sources = creep.room.find(FIND_SOURCES);
    var sourceToHarvest;
    var rallyPoint;
    switch (creep.memory.assignment) {
      case 'NORTH': {
        sourceToHarvest = sources[0];
        rallyPoint = Game.flags.RallyNorth;
        break;
      }
      case 'SOUTH': {
        sourceToHarvest = sources[1];
        rallyPoint = Game.flags.RallySouth;
        break;
      }
      default: {
        sourceToHarvest = creep.pos.findClosestByPath(sources);
        break;
      }
    }
    if (creep.harvest(sourceToHarvest) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sourceToHarvest);
    } else {
      if (creep.harvest(sourceToHarvest) == ERR_NOT_ENOUGH_RESOURCES) {
        creep.moveTo(rallyPoint);
      }
    }
  }
};

module.exports = roleMiner;