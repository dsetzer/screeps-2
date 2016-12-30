var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleJanitor = require('role.janitor');
var roleTransporter = require('role.transporter');
var roleMiner = require('role.miner');
var roleFlagMiner = require('role.flagMiner');
var roleClaimer = require('role.claimer');
var roleFighter = require('role.fighter');
var roleThief = require('role.thief');
var roleScout = require('role.scout');
var roleSpawnKiller = require('role.spawnKiller');
var sp1 = Game.spawns.Spawn1;
var _ = require('lodash');

// prototypes
require('create')();

Room.prototype.stats = function() {
    return {
        creepCount: this.find(FIND_MY_CREEPS).length,
        enemyCreepCount: this.find(FIND_HOSTILE_CREEPS).length,
        sources: this.find(FIND_SOURCES),
        activeSources: this.find(FIND_SOURCES_ACTIVE),
        nrg: this.energyAvailable,
        nrgCapacity: this.energyCapacityAvailable,
        /*
           FIND_DROPPED_ENERGY: 106,
    FIND_DROPPED_RESOURCES: 106,
    FIND_STRUCTURES: 107,
    FIND_MY_STRUCTURES: 108,
    FIND_HOSTILE_STRUCTURES: 109,
    FIND_FLAGS: 110,
    FIND_CONSTRUCTION_SITES: 111,
    FIND_MY_SPAWNS: 112,
    FIND_HOSTILE_SPAWNS: 113,
    FIND_MY_CONSTRUCTION_SITES: 114,
    FIND_HOSTILE_CONSTRUCTION_SITES: 115,
    FIND_MINERALS: 116,
    */
    };
};

/*
todo
dynamic up all explicitly references spawns, sites etc
extend room prototype for stats
test Game.notify
cache common paths + reusePath 
customCreate()
do a better job of harvesting resources dropped by invaders
track sourceStats in global memory - room+locs, currHarvs, nrgRemining
track controllers in global memory for claiming * 2 in E67, *1 in E68 etc
separate / DRY out main
builders: dynamically build in constructionSites in other rooms
builder #s: reduce over all contructionSites for total Progress required, spawn num based on that
*/

var minHarvesters = 0;
var minUpgraders = 2;
var minBuilders = 1;
var minJanitors = 2;
var minTransporters = 1;
var minMiners = 2;
var minFlagMiners = 0;
var minClaimers = 0;

// clear creeps stored in memory that have sinced died
function RIPTheBoys() {
  for (let i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }
}

function roleCount(role, scope = Game.creeps) {
  return _.sum(scope, (c) => c.memory.role === role);
};

var sourceData = {
    _sources: [],
    set: function(s) {
        this._sources.push(s);
        Memory.sourceData = this._sources;
    },
    get: function() {
        return this._sources;
    },
    update: function(index, payload) {
        this._sources.splice(index, 1, payload)
    },
}

function isEven(n) {
   return n % 2 == 0;
}

function isOdd(n) {
   return Math.abs(n % 2) == 1;
}

/*
sourceData shape for ref
sourceData = [
    { id: '234234', pos: pos, mineableSquares: 1, currMiners: 0, }
]
*/

module.exports.loop = function () {
  if (Game.time === 16397489) {
      Game.notify('500 ticks until south claim')
  }
    var thisRoom;
    var thisSpawn;
    var rooms = [];
    for(let name in Game.rooms) {
        thisRoom = Game.rooms[name]
        thisSpawn = thisRoom.find(FIND_MY_SPAWNS)[0];
        console.log(thisRoom, thisSpawn)
        rooms.push({thisRoom, thisSpawn})
    }
    

/*
    // check if we need more miners at a source
    Memory.sourceData.forEach((s) => {
        // console.log(s.id);
        if (s.currentMiners < s.mineableSquares) {
            // console.log(`need ${s.mineableSquares - s.currentMiners} more miners at ${s.id}`)
        }
    });*/
    // cache room name
    var r = Game.rooms[sp1.room.name];
    
    if (r.stats().nrg === r.stats().nrgCapacity) {
        Memory.fullCounter++;
    } else {
        Memory.fullCounter = 0;
    }
    // stats
    console.log(`>>>>>> energystats: ${r.stats().nrg}/${r.stats().nrgCapacity} full: ${Memory.fullCounter}`)
/*    // add source data to memory if not already set (to throttled loop later)
    if (Memory.sourceData === undefined) {
        console.log('source data needed')
        var sources = sp1.room.find(FIND_SOURCES);
        sources.forEach((s) => {
            var mineableSquares = 0;
            // console.log(`=== ${s} ===`);
            let x = s.pos.x;
            let y = s.pos.y;
            // console.log(`x: ${x}, y: ${y}`)
            let minX = x-1;
            let maxX = x+1;
            let minY = y-1;
            let maxY = y+1;
            for (let i = minY; i <= maxY; i++) {
                for(let j = minX; j <= maxX; j++) {
                    let terrainAtTarget = Game.rooms['E72S18'].lookForAt('terrain', j, i);
                    if (terrainAtTarget == 'plain' || terrainAtTarget == 'swamp') {
                        mineableSquares++;
                    }
                }   
            }
            var source = {
                id: s.id,
                pos: s.pos,
                mineableSquares: mineableSquares,
                currentMiners: 0,
                currentMineParts: 0,
            };
            
            console.log(source);
            sourceData.set(source);
        });
    }
*/
    // var rc = Game.getObjectById('5836b87c8b8b9619519f21e8');
    // //var rcTicks = (rc !== null ? rc.reservation.ticksToEnd : null);
    // var hostiles = sp1.room.find(FIND_HOSTILE_CREEPS)
    // if (hostiles.length > 0) {
    //     // Game.notify()
    // }

  
  var structures = sp1.room.find(FIND_MY_STRUCTURES);
  var currConstructions = Object.keys(Game.constructionSites).length;
  var loopThrottle = Game.time.toString().slice(5);
  // clear dead creeps from memory
  RIPTheBoys();
  // find current creeps & count
  var currentCreeps = Game.spawns.Spawn1.room.find(FIND_MY_CREEPS);
  var creepCount = currentCreeps.length;
  var currHarvesters = roleCount('harvester', currentCreeps);
  var currUpgraders = roleCount('upgrader', currentCreeps);
  var currBuilders = roleCount('builder', currentCreeps);
  var currJanitors = roleCount('janitor', currentCreeps);
  var currTransporters = roleCount('transporter', currentCreeps);
  var currMiners = roleCount('miner', currentCreeps);
  var currFlagMiners = roleCount('flagMiner', currentCreeps);
  var currClaimers = roleCount('claimer', currentCreeps);
  if (loopThrottle % 10 === 0) {
    console.log(
      `
      ${currHarvesters} / ${minHarvesters} HRV
      ${currUpgraders} / ${minUpgraders} UPG
      ${currBuilders} / ${minBuilders} BLD
      ${currJanitors} / ${minJanitors} JNT
      ${currTransporters} / ${minTransporters} TRN
      ${currMiners} / ${minMiners} MIN
      ${currClaimers} / ${minClaimers} CLM
      `);
  }
  
    if (currMiners < minMiners) {
        console.log('+mn');
        sp1.create(r.stats().nrg, `MN${Game.time}`, 'miner');
    }
    else if (currUpgraders < minUpgraders) {
        console.log('+ug');
        sp1.create(r.stats().nrg, `UG${Game.time}`, 'upgrader');
    }
    else if (currTransporters < minTransporters) {
        console.log('+tr');
        sp1.create(r.stats().nrg, `TR${Game.time}`, 'transporter');
    }
    else if ((currConstructions > 0) && (currBuilders < minBuilders)) {
        console.log('+bd');
        sp1.create(r.stats().nrg, `BD${Game.time}`, 'builder');
    }
    else if (currJanitors < minJanitors) {
        console.log('+jt');
        sp1.create(r.stats().nrg, `JT${Game.time}`, 'janitor');
    }
    else if (Memory.fullCounter >= 20) {
        // if (currConstructions > 0) {
        //     console.log('+bd++');
        //     sp1.create(r.stats().nrg, `BD${Game.time}`, 'builder');
        // }
        // else if (currUpgraders < currJanitors) {
        //     console.log('+ug++');
            sp1.create(r.stats().nrg, `UG${Game.time}`, 'upgrader'); 
        // } else if (currJanitors < currUpgraders) {
        //     console.log('+jt++');
        //     sp1.create(r.stats().nrg, `JT${Game.time}`, 'janitor');
        // }
        
    }

    

  
//       else if ((currClaimers < minClaimers)) {
//     console.log('clm');
//     sp1.createCreep(bodies.CLAIMER, `CLM${Game.time}`, {role: 'claimer'});
//   }
//   if (currHarvesters < minHarvesters) {
//     console.log('hrv');
//     sp1.createCreep(bodies.WORKER_FAST, `HRV${Game.time}`, {role: 'harvester'});
//   }
//     else if ((currFlagMiners < minFlagMiners) && (currHarvesters >= minHarvesters) && (currUpgraders >= minUpgraders)) {
//         console.log('flg');
//         sp1.createCreep(bodies.MINER, `FLG${Game.time}`, {role: 'flagMiner', assignment: 'SOURCE_WEST'});
//     }

//   if (creepCount < 10) {
//       console.log('final case')
//       Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], `HV${Game.time}`, {role:'harvester'})
//   }
   
    

      // hasty tower code
      var twr = Game.getObjectById('5856003c72ff937740610eae');
      if (twr) {
        var closestHostile = twr.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
          twr.attack(closestHostile);
        }
      }
      
    var roles = [
        'miner',
        'transporter',
        'upgrader',
        'builder',
        'claimer',
        'fighter',
        'harvester',
        'flagMiner',
    ];

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
        if(creep.memory.role == 'thief') {
      roleThief.run(creep);
    }
            if(creep.memory.role == 'scout') {
      roleScout.run(creep);
    }
            if(creep.memory.role == 'spawnKiller') {
      roleSpawnKiller.run(creep);
    }
  }
}