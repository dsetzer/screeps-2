var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleJanitor = require('role.janitor');
var sp1 = Game.spawns.Spawn1;
var _ = require('lodash');

// helper data for role, bodies, creep role counts
var roles = [
  'harvester',
  'upgrader',
  'builder',
  'janitor',
];

var bodies = {
  worker: [WORK, WORK, CARRY, MOVE],
  fastWorker: [WORK, CARRY, MOVE, MOVE],
};

var minHarvesters = 4;
var minUpgraders = 5;
var minBuilders = 5;
var minJanitors = 1;

// clear creeps stored in memory that have sinced died
function RIPTheBoys() {
  for (let i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }
}

function roleCount(role) {
  return _.sum(Game.creeps, (c) => c.memory.role === role);
};

module.exports.loop = function () {
  var loopThrottle = Game.time.toString().slice(5);
  // clear dead creeps from memory
  RIPTheBoys();
  // find current creeps & count
  // var currentCreeps = Game.spawns.Spawn1.room.find(FIND_MY_CREEPS);
  // var creepCount = currentCreeps.length;
  var currHarvesters = roleCount('harvester');
  var currUpgraders = roleCount('upgrader');
  var currBuilders = roleCount('builder');
  var currJanitors = roleCount('janitor');
  if (loopThrottle % 10 === 0) {
    console.log(
      `
      ${currHarvesters} hrvs,
      ${currUpgraders} upgs,
      ${currBuilders} blds,
      ${currJanitors} janitors
      `);
  }
  if ((sp1.energy >= 300)) {
    if (currHarvesters < minHarvesters) {
      sp1.createCreep(bodies.fastWorker, null, {role: 'harvester'});
      console.log('spawning harvester');
    } else if (currUpgraders < minUpgraders) {
      sp1.createCreep(bodies.fastWorker, null, {role: 'upgrader'});
      console.log('spawning upgrader');
    } else if (currJanitors < minJanitors) {
      sp1.createCreep(bodies.worker, null, {role: 'janitor'});
      console.log('spawning janitor');
    } else {
      sp1.createCreep(bodies.worker, null, {role: 'builder'});
      console.log('spawning builder');
    }
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
    if(creep.memory.role == 'janitor') {
      roleJanitor.run(creep);
    }
  }
}