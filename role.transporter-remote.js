var roleTransporter = {
  run: function(creep) {
      var home = 'E69S71';
        var target = new RoomPosition(18, 30, 'E68S71');
        
        // if full
        if ((creep.carry.energy === creep.carryCapacity) && (creep.room.name !== home)) {
            creep.memory.pickup = false;
            var hmPos = new RoomPosition(30, 22, 'E69S71');
            creep.moveTo(hmPos);
        } else if ((creep.room.name === home) && (creep.carry.energy > 0)) {
                var roomStorage = creep.room.storage;
                if(creep.transfer(roomStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(roomStorage);
                }
            }
        // if empty
        if (creep.carry.energy === 0) {
            creep.moveTo(target);
            creep.memory.pickup = true;
        } else {
            // console.log(creep.name, 'carrying', creep.carry.energy);
        }
        if (creep.memory.pickup && creep.room.name !== home) {
            var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
            if (energyPiles.length) {
                var closestEnergy = creep.pos.findClosestByRange(energyPiles);
                if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestEnergy);
                }
              }
            var cnts = creep.room.find(FIND_STRUCTURES, {
                filter: { structureType: STRUCTURE_CONTAINER }
            });
            if (cnts.length) {
                if ((creep.withdraw(cnts[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)) {
                    creep.moveTo(cnts[0]);
                }  
            }

        }
            
  }
};
module.exports = roleTransporter;