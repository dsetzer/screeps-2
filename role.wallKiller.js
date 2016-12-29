var roleWallKiller = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // if (Game.flags.ARC_ATK !== undefined) {
        //     creep.rangedAttack(Game.flags.ARC_ATK);
        // }
         //console.log(creep.rangedAttack(Game.flags.ARC_ATK))
        if (Game.flags.ARC_RALLY) {
            console.log('rallying to flag')
            creep.moveTo(Game.flags.ARC_RALLY)
            console.log(Game.flags.ARC_RALLY.pos.x, Game.flags.ARC_RALLY.pos.y)
            console.log(creep.pos.x, creep.pos.y);
            return;
        }
        
        //   var hostileTowers = creep.room.find(FIND_HOSTILE_STRUCTURES, {
        //   filter: (structure) => {
        //     return ((structure.structureType == STRUCTURE_TOWER))
        //   }
        // });
        //           var hostileStr = creep.room.find(FIND_HOSTILE_STRUCTURES);
        //var hostileCreeps = creep.room.find(FIND_HOSTILE_CREEPS);
        // var targets = hostileStr;
        // //console.log(targets.length, 'targets')
        // var closestTarget = creep.pos.findClosestByPath(hostileStr);
        // if(targets.length) {
        //     console.log(targets.length)
        //     console.log('fighter role runs attacking')
        //       if(creep.rangedAttack(closestTarget) == ERR_NOT_IN_RANGE) {
        //           creep.moveTo(closestTarget);
        //       } else {
/*        if (hostileCreeps.length) {
            console.log('atk hostile crps')
            var nearestCreep = creep.pos.findClosestByRange(hostileCreeps);
            if (creep.rangedAttack(nearestCreep) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearestCreep)
            }
        } else {
            console.log('atk hostile str')
            var structures = creep.room.find(FIND_STRUCTURES);
            var nearest = creep.pos.findClosestByRange(structures);
                //console.log(creep.attackType);
              if(creep.rangedAttack(nearest) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(nearest);
              } 
        }*/
        //                       // kill spawn

    //}
}

module.exports = roleWallKiller;