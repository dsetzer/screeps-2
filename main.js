var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var sp1 = Game.spawns.Spawn1;

var roles = [
  // 'harvester',
  'upgrader',
  'builder',
];

var bodies = {
  generic: [WORK, CARRY, MOVE],
};

module.exports.loop = function () {
  
  var creepCount = Object.keys(Game.creeps).length;
  var randomNumber = Math.round(Math.random());
  var randomRole = roles[randomNumber];
  if (creepCount < 15) {
    if ((sp1.canCreateCreep(bodies.generic, null) === OK) && (sp1.energy >= 200)) {
      sp1.createCreep(bodies.generic, null, {role: randomRole});
      console.log('spawning', randomRole);
    }
  }

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