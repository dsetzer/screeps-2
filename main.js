var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleJanitor = require('role.janitor');
var roleTransporter = require('role.transporter');
var roleMiner = require('role.miner');
var sp1 = Game.spawns.Spawn1;
var _ = require('lodash');

// helper data for role, bodies, creep role counts
var roles = [
  'harvester',
  'upgrader',
  'builder',
  'janitor',
  'transporter',
  'miner',
];

var bodies = {
  WORKER: [WORK, WORK, WORK, CARRY, CARRY, MOVE], // 450
  WORKER_FAST: [WORK, WORK, CARRY, CARRY, MOVE, MOVE], // 400
  TRANSPORTER: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], // 400
  MINER: [WORK, WORK, WORK, WORK, MOVE], // 450
};

var minHarvesters = 4;
var minUpgraders = 4;
var minBuilders = 5;
var minJanitors = 2;
var minTransporters = 4;
var minMiners = 4;

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
  // Memory.someData = { foo: 'bar' };
  // console.log(Memory.someData.foo);
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
  var currTransporters = roleCount('transporter');
  var currMiners = roleCount('miner');
  if (loopThrottle % 10 === 0) {
    console.log(
      `
      ${currHarvesters} HRV
      ${currUpgraders} UPG
      ${currBuilders} BLD
      ${currJanitors} JNT
      ${currTransporters} TRN
      ${currMiners} MIN
      `);
  }
  if (currMiners < minMiners) {
    sp1.createCreep(bodies.MINER, `MIN${Game.time}`, {role: 'miner', assignment: 'SOUTH'});
  }
  if (currHarvesters < minHarvesters) {
    sp1.createCreep(bodies.WORKER_FAST, `HRV${Game.time}`, {role: 'harvester'});
  }
  if (currUpgraders < minUpgraders) {
    sp1.createCreep(bodies.WORKER_FAST, `UPG${Game.time}`, {role: 'upgrader'});
  }
  if (currBuilders < minBuilders) {
    sp1.createCreep(bodies.WORKER, `BLD${Game.time}`, {role: 'builder'});
  }
  if (currJanitors < minJanitors) {
    sp1.createCreep(bodies.WORKER, `JNT${Game.time}`, {role: 'janitor'});
  }
  if (currTransporters < minTransporters) {
    sp1.createCreep(
      bodies.TRANSPORTER,
      `TRN${Game.time}`,
      {role: 'transporter', assignment: 'SOUTH'}
    );
  }


  // tut tower code
/*  var tower = Game.getObjectById('TOWER_ID');
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
  }*/
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
    if(creep.memory.role == 'transporter') {
      roleTransporter.run(creep);
    }
    if(creep.memory.role == 'miner') {
      roleMiner.run(creep);
    }
  }
}