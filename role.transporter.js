var roleTransporter = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // not full, need to harvest
    if(creep.carry.energy < creep.carryCapacity && creep.memory.harvesting) {
        var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
      if (energyPiles.length) {
          // todo fix hrvs moving to temporarily dropped energy piles, check it's closer && worth the journey?
        var closestEnergy = creep.pos.findClosestByRange(energyPiles);
        if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestEnergy);
        }
      } else {
        var withdrawTarget;
        // remove from containers, put into nearest structure, if full put in storage
        var fullContainers = creep.room.find(FIND_STRUCTURES, {
          filter: (c) => {
            return (c.structureType == STRUCTURE_CONTAINER && c.store[RESOURCE_ENERGY] === c.storeCapacity);
          }
        });
        var containers = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0)
            }
          });
        if (fullContainers.length) {
          withdrawTarget = fullContainers[0];
        } else {
          withdrawTarget = creep.pos.findClosestByRange(containers);
        }
        containers.forEach((c) => {
          //console.log(c.store[RESOURCE_ENERGY])
        })
        var sortedConts = _.sortBy(containers)
        //containers.sort((a,b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY])
        if(creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(withdrawTarget);
        }
      }
    }
    
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.harvesting = false;
    } else if (creep.carry.energy === 0) {
      creep.memory.harvesting = true;
    }
    
    if (!creep.memory.harvesting) {
      // full, go store energy
      // standard
      var potentialTargets;
      var stores = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
          }
        });
      if (stores.length > 0) {
        var closestStore = creep.pos.findClosestByPath(stores);
        if(creep.transfer(closestStore, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestStore);
        }
      } else {
        var roomStorage = creep.room.storage;
        if(creep.transfer(roomStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(roomStorage);
        }
      }
    }
  }
};

module.exports = roleTransporter;