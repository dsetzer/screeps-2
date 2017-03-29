let setup = new Creep.Setup('allocator');
module.exports = setup;
setup.minControllerLevel = 6;
setup.maxMulti = function(room) {
    let max = 7;
    if( room.minerals.length > 0 )
        max += 2;
    let contSum = _.sum(room.structures.container.in, 'sum');
    contSum += _.sum(room.droppedResources, 'amount');
    max += Math.floor(contSum / 1000);
    max += Creep.setup.upgrader.maxMulti(room);
    return Math.min(max, 16);
};
setup.maxCount = function(room){
  const count = 1;
    return count;
};
setup.maxWeight = function(room){
    return 600;
};
setup.default = {
    fixedBody: [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE],
    multiBody: [CARRY, CARRY, MOVE],
    minAbsEnergyAvailable: 600,
    minEnergyAvailable: 0.4,
    maxMulti: 3,
    maxCount: room => setup.maxCount(room),
    maxWeight: room => setup.maxWeight(room),
};
setup.RCL = {
    1: setup.none,
    2: setup.none,
    3: setup.none,
    4: setup.none,
    5: setup.none,
    6: setup.default,
    7: setup.default,
    8: setup.default
};