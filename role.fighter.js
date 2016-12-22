var roleFighter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // HOOOOOOLD
        if (creep.memory.hold) {
            return;
        }
        // remember if ranged or melee attacks for ref
        if (!creep.memory.attackType) {
          creep.body.forEach(part => {
            if (part.type === 'ranged_attack') {
              creep.memory.attackType = 'ranged';
            } else {
              creep.memory.attackType = 'melee';
            }
          });
        }
        if (creep.pos.roomName !== 'E69S71') {
            var atkTarg = new RoomPosition(28, 10, 'E69S71');
            creep.moveTo(atkTarg);
            //console.log('fighter moving rooms', creep.pos.roomName)
        } else {
            // 
            //console.log('arrived, batt0l')
          var hostileTowers = creep.room.find(FIND_HOSTILE_STRUCTURES, {
          filter: (structure) => {
            return ((structure.structureType == STRUCTURE_TOWER))
          }
        });
        var hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
        var targets = hostileTowers.length ? hostileTowers : hostileCreeps;
        //console.log(targets.length, 'targets')
        var closestTarget = creep.pos.findClosestByPath(targets);
        if(targets.length) {
            //console.log('fighter role runs attacking')
            if (creep.attackType === 'melee') {
              if(creep.attack(closestTarget) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(closestTarget);
              }
            } else {
              if(creep.rangedAttack(closestTarget) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(closestTarget);
              }
            }
        } else {
            // kill spawn
            var structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
            var nearest = creep.pos.findClosestByRange(structures);
            if (creep.attackType === 'melee') {
              if(creep.attack(nearest) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(nearest);
              }
            } else {
              if(creep.rangedAttack(nearest) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(nearest);
              }
            }
        }
        }
    }
};

module.exports = roleFighter;