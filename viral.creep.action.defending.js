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
};
module.exports = mod;