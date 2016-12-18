var roleMiner = {
  /** @param {Creep} creep **/
run: function(creep) {
    var sources = creep.room.find(FIND_SOURCES_ACTIVE);
    var sourceToHarvest = creep.pos.findClosestByPath(sources);
    var rallyPoint;
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