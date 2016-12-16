var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var sp1 = Game.spawns.Spawn1;
var _ = require('lodash');

// helper data for role, bodies, creep role counts
var roles = [
  'harvester',
  'upgrader',
  'builder',
];

var bodies = {
  worker: [WORK, WORK, CARRY, MOVE],
  fastWorker: [WORK, CARRY, MOVE, MOVE],
};

var minHarvesters = 5;
var minUpgraders = 4;
var minBuilders = 3;

// clear creeps stored in memory that have sinced died
function RIPTheBoys() {
  for (var i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }
}

module.exports.loop = function () {
  // clear dead creeps from memory
  RIPTheBoys();
  // find current creeps & count
  // var currentCreeps = Game.spawns.Spawn1.room.find(FIND_MY_CREEPS);
  // var creepCount = currentCreeps.length;
  var currHarvesters = _.sum(Game.creeps, (c) => c.memory.role === 'harvester');
  var currUpgraders = _.sum(Game.creeps, (c) => c.memory.role === 'upgrader');
  var currBuilders = _.sum(Game.creeps, (c) => c.memory.role === 'builder');
  if (currHarvesters < minHarvesters) {
    sp1.createCreep(bodies.fastWorker, null, {role: 'harvester'});
    console.log('spawning harvester');
  } else if (currUpgraders < minUpgraders) {
    sp1.createCreep(bodies.fastWorker, null, {role: 'upgrader'});
    console.log('spawning upgrader');
  } else {
    sp1.createCreep(bodies.worker, null, {role: 'builder'});
    console.log('spawning builder');
  }

  // tut tower code
  var tower = Game.getObjectById('TOWER_ID');
  if(tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax
    });
    if(closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      tower.attack(closestHostile);
    }
  }
    // run role modules
  for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    if(creep.memory.role == 'harvester') {
      roleHarvester.run(creep);
    }
    if(creep.memory.role == 'upgrader') {
      roleUpgrader.run(creep);
    }
    if(creep.memory.role == 'builder') {
      roleBuilder.run(creep);
    }
  }
}