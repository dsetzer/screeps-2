// ignore source keepers
const mod = {
  isValidTarget: function(target){
    const validity = (target && target.hits != null && target.hits > 0 && target.my == false && target.owner.username !== 'Source Keeper' );
    console.log('sk detected, not valid trg', target, validity);
    return validity;  
  },
  newTarget: function(creep){
    var nonSKHostiles = creep.room.hostiles.filter((c) => c.owner.username !== 'Source Keeper');
      var closestHostile = creep.pos.findClosestByRange(nonSKHostiles, {
          function(hostile){ return _.some(hostile.body, {'type': HEAL}); }
      });
      if(!closestHostile) {
          closestHostile = creep.pos.findClosestByRange(nonSKHostiles);
      }
      return closestHostile;
  },
  run: {
      ranger: function(creep) {
          let range = creep.pos.getRangeTo(creep.target);
          if( !creep.flee ){
              if( range > 3 ){
                  let path = creep.room.findPath(creep.pos, creep.target.pos, {ignoreCreeps: false});
                  if( path && path.length > 0 ) {
                      let isRampart = COMBAT_CREEPS_RESPECT_RAMPARTS && _.some( creep.room.lookForAt(LOOK_STRUCTURES, path[0].x, path[0].y), {'structureType': STRUCTURE_RAMPART });
                      if(!isRampart){
                          creep.move(path[0].direction);
                      }
                  } else {
                      // no path -> try to move by direction
                      let direction = creep.pos.getDirectionTo(creep.target);
                      if( direction ) creep.move(direction);
                  }
              }
/*              if( range < 3 ){
                
                  let direction = creep.target.pos.getDirectionTo(creep);
                  if( direction ) creep.move(direction);
              }*/
          }

          // attack ranged
          let targets = creep.pos.findInRange(creep.room.hostiles, 3);
          if(targets.length > 2) { // TODO: precalc damage dealt
              if(CHATTY) creep.say('MassAttack');
              creep.attackingRanged = creep.rangedMassAttack() == OK;
              return;
          }
          if( range < 4 ) {
              creep.attackingRanged = creep.rangedAttack(creep.target) == OK;
              return;
          }
          if(targets.length > 0){
              creep.attackingRanged = creep.rangedAttack(targets[0]) == OK;
          }
      },
  },
};
module.exports = mod;