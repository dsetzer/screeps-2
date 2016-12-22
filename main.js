var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleJanitor = require('role.janitor');
var roleTransporter = require('role.transporter');
var roleMiner = require('role.miner');
var roleFlagMiner = require('role.flagMiner');
var roleClaimer = require('role.claimer');
var roleFighter = require('role.fighter');
var sp1 = Game.spawns.Spawn1;
var _ = require('lodash');

/*
todo
dynamic up all explicitly references spawns, sites etc
extend room prototype for stats
test Game.notify
cache common paths + reusePath 
reserve middle room for harvesting
customCreate()
do a better job of harvesting resources dropped by invaders
proper defenses
track sourceStats in global memory - room+locs, currHarvs, nrgRemining
track controllers in global memory for claiming * 2 in E67, *1 in E68 etc
separate / DRY out main
builders: dynamically build in constructionSites in other rooms
builder #s: reduce over all contructionSites for total Progress required, spawn num based on that
*/

var bodies = {
  WORKER: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  WORKER_FAST: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  MINER: [WORK, WORK, WORK, WORK, MOVE],
  BABBY: [WORK, CARRY, MOVE],
  CLAIMER: [CLAIM, MOVE],
  TRANSPORTER: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
  ARCHER: [RANGED_ATTACK, MOVE],
};

var minHarvesters = 12;
var minUpgraders = 5;
var minBuilders = 1;
var minJanitors = 2;
var minTransporters = 5;
var minMiners = 0;
var minFlagMiners = 1;
var minClaimers = 2;

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
    var rc = Game.getObjectById('5836b87c8b8b9619519f21e8');
    var rcTicks = (rc !== null ? rc.reservation.ticksToEnd : null);
    var hostiles = sp1.room.find(FIND_HOSTILE_CREEPS)
    if (hostiles.length > 0) {
        sp1.createCreep(bodies.ARCHER, `ARC${Game.time}`, {role: 'fighter'});
    }
    var lastEnergy = null;
    var lastTimeNeeded = null;
    var lastTimeRemaining = null;
    var lastSpawningName = null;
    var spawnStatus = sp1.spawning;
    if (spawnStatus !== null) {
        for (var property in spawnStatus) {
            if (spawnStatus.hasOwnProperty(property)) {
                if (property === 'needTime') {
                    lastTimeNeeded = spawnStatus[property];
                } else if (property === 'remainingTime') {
                    lastTimeRemaining = spawnStatus[property];
                } else if (property === 'name') {
                    lastSpawningName = spawnStatus[property];
                }
            }
        }
    }
    
    if (loopThrottle % 10 === 0) {
        var strg = sp1.room.storage.store[RESOURCE_ENERGY];
    console.log(`${sp1.room.energyAvailable} e + ${strg} strg`);
  
  
  if (spawnStatus) {
     console.log(`spwning ${lastSpawningName} ${lastTimeRemaining}/${lastTimeNeeded}`); 
  }
}

  
  var structures = sp1.room.find(FIND_MY_STRUCTURES);
  var currConstructions = Object.keys(Game.constructionSites).length;
  var loopThrottle = Game.time.toString().slice(5);
  // clear dead creeps from memory
  RIPTheBoys();
  // find current creeps & count
  var currentCreeps = Game.spawns.Spawn1.room.find(FIND_MY_CREEPS);
  var creepCount = currentCreeps.length;
  var currHarvesters = roleCount('harvester');
  var currUpgraders = roleCount('upgrader');
  var currBuilders = roleCount('builder');
  var currJanitors = roleCount('janitor');
  var currTransporters = roleCount('transporter');
  var currMiners = roleCount('miner');
  var currFlagMiners = roleCount('flagMiner');
  var currClaimers = roleCount('claimer');
  if (loopThrottle % 10 === 0) {
    console.log(
      `
      ${currHarvesters} / ${minHarvesters} HRV
      ${currUpgraders} / ${minUpgraders} UPG
      ${currBuilders} / ${minBuilders} BLD
      ${currJanitors} / ${minJanitors} JNT
      ${currTransporters} / ${minTransporters} TRN
      ${currMiners} / ${minMiners} MIN
      ${currFlagMiners} / ${minFlagMiners} FLG
      ${currClaimers} / ${minClaimers} CLM
      `);
  }
  // if (currMiners < minMiners) {
  //   var assignment;
  //   sp1.createCreep(bodies.MINER, `MIN${Game.time}`, {role: 'miner', assignment: assignment});
  // }
  if (currHarvesters < minHarvesters) {
    console.log('hrv');
    sp1.createCreep(bodies.WORKER_FAST, `HRV${Game.time}`, {role: 'harvester'});
  }
    else if ((currFlagMiners < minFlagMiners) && (currHarvesters >= minHarvesters) && (currUpgraders >= minUpgraders)) {
        console.log('flg');
        sp1.createCreep(bodies.MINER, `FLG${Game.time}`, {role: 'flagMiner', assignment: 'SOURCE_WEST'});
    }
  else if (currUpgraders < minUpgraders) {
    console.log('ugr');
    sp1.createCreep(bodies.WORKER, `UPG${Game.time}`, {role: 'upgrader', working: false});
  }
  else if ((currConstructions > 0) && (currBuilders < minBuilders)) {
    console.log('bld');
    sp1.createCreep(bodies.WORKER, `BLD${Game.time}`, {role: 'builder'});
  }
      else if ((currClaimers < minClaimers) && (rcTicks === null || rcTicks < 2000)) {
    console.log('clm');
    sp1.createCreep(bodies.CLAIMER, `CLM${Game.time}`, {role: 'claimer'});
  }
    else if (currJanitors < minJanitors) {
     console.log('jnt');
     sp1.createCreep(bodies.WORKER, `JNT${Game.time}`, {role: 'janitor'});
   }
   else if ((currFlagMiners >= minFlagMiners) && (currTransporters < minTransporters)) {
     console.log('trn');
     sp1.createCreep(
       bodies.TRANSPORTER,
       `TRN${Game.time}`,
       {role: 'transporter'}
     );
   }
   
    

      // hasty tower code
      var twr = Game.getObjectById('5856003c72ff937740610eae');
      if (twr) {
        var closestHostile = twr.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
          twr.attack(closestHostile);
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
    if(creep.memory.role == 'transporter') {
      roleTransporter.run(creep);
    }
    if(creep.memory.role == 'miner') {
      roleMiner.run(creep);
    }
    if(creep.memory.role == 'flagMiner') {
      roleFlagMiner.run(creep);
    }
    if(creep.memory.role == 'claimer') {
        roleClaimer.run(creep);
    }
        if(creep.memory.role == 'fighter') {
        roleFighter.run(creep);
    }
  }
}