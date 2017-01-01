module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
    //   var home = 'E72S18';
    //   var targetRoom;
    //   if (creep.memory.assignment == 'east') {
    //       targetRoom = 'E73S18';
    //       if (creep.room.name !== targetRoom) {
    //         creep.moveTo(new RoomPosition(49,22, 'E72S18'))
    //       return;  
    //       }
              
    //       }
      

        
        
        // if creep is bringing energy to the controller but has no energy left
        if (creep.memory.working == true && creep.carry.energy == 0) {
            
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to transfer energy to the controller
        if (creep.memory.working == true) {
            
            // instead of upgraderController we could also use:
            // if (creep.transfer(creep.room.controller, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

            // try to upgrade the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                // if not in range, move towards the controller
                creep.moveTo(creep.room.controller);
            }
        }
            // if creep is supposed to get energy
        else {
            
            // var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
            // var worthEnergy = creep.room.find(FIND_DROPPED_ENERGY, {
            //     filter: (e) => {
            //         return (e.amount >= (creep.carryCapacity))
            //     }
            // });
            
            
            // find closest container
            let container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) &&
                             s.store[RESOURCE_ENERGY] > creep.carryCapacity
            });
            // if one was found
            if (container != undefined) {
                // try to withdraw energy, if the container is not in range
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(container);
                }
            }
            else {
                // find closest source
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(source);
                }
            let spawn = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: s => (s.structureType == STRUCTURE_SPAWN) && s.energy > creep.carryCapacity
            });
            if (creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spawn);
            }
            }
            // end energy hrv
        }
    }
};