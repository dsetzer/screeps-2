var roleTransporter = {
  /** @param {Creep} creep **/
  run: function(creep) {
      var home = 'E72S18';
      var targetRoom;
      if (creep.memory.assignment === 'east') {
          targetRoom = 'E73S18';
          if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(49,22, 'E72S18'))
          return;  
          }
              
          } else
      if (creep.memory.assignment == 'south') {
          targetRoom = 'E72S19'
      }
      
      //console.log(creep.room.name, targetRoom, creep.memory.assignment, creep.memory.east)
      
      if (creep.room.name == targetRoom) {
         // console.log(creep.name, 'arrived')
      }
    //   if (creep.memory.assignment == 'east') {
    //       targetRoom = 'E73S18'
    //   }
    //   if (creep.memory.assignment) {
    //     if (creep.room.name !== targetRoom) {
    //         var move = new RoomPosition(6, 11, targetRoom)
    //           creep.moveTo(move)
    //           return;
    //     }  
    //   }
      
    var potentials = [];
    var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
    var worthEnergy = creep.room.find(FIND_DROPPED_ENERGY, {
        filter: (e) => {
            return (e.amount >= (creep.carryCapacity - creep.carry.energy))
        }
    });
    // var containers = creep.room.find(FIND_STRUCTURES, {
    //     filter: (structure) => {
    //         return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > creep.carryCapacity)
    //     }
    // });
        var containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_CONTAINER)
        }
    });
    var closestContainer = creep.pos.findClosestByRange(containers);
    if (creep.carry.energy < creep.carryCapacity && creep.memory.harvesting) {
        if (worthEnergy.length) {
            //console.log('wE.length')
            var closestEnergy = creep.pos.findClosestByRange(worthEnergy);
            //console.log('worth', closestEnergy.amount)
            if(creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnergy);
                //console.log('1 orr')
            } else if (creep.pickup(closestEnergy) == OK) {
                //console.log('energy picked up');
                creep.memory.quickDrop = true;
                //console.log('err', creep.pickup(closestEnergy))
            }
        } else {
            //console.log('!!!!wE.length')
            if (containers.length) {
                potentials.push(closestContainer);
                if(creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestContainer);
                }
            }
        }
        
        // console.log(`closest: container ${closestContainer} nrg ${closestEnergy}`)
        // decide which is preferable and withdraw/pickup from target
        // var best = creep.pos.findClosestByPath(potentials);
        // creep.moveTo(best);
        // if (closestEnergy.amount <= creep.carryCapacity) {
        //     console.log('1')
        //     if(creep.withdraw(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //       creep.moveTo(closestContainer);
        //     } else {
        //         console.log('err', creep.withdraw(closestContainer, RESOURCE_ENERGY))
        //     }
        // } else {
        //     console.log('2')
        //     var distanceToEnergy = creep.pos.getRangeTo(closestEnergy);
        //     var distanceToContainer = creep.pos.getRangeTo(closestContainer);
        //     if (distanceToEnergy <= distanceToContainer * 1.25) {
        //         if(creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(closestEnergy);
        //         } else {
        //             console.log('err', creep.pickup(closestEnergy))
        //         }
        //     }
        // }
    }
    
    if (creep.carry.energy == creep.carryCapacity) {
      creep.memory.harvesting = false;
    } else if (creep.carry.energy === 0) {
      creep.memory.harvesting = true;
    }
    
    if (creep.memory.quickDrop) {
      //console.log('qDrop')
      if (creep.carry.energy > 0) {
          if (creep.transfer(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(closestContainer)
          }
        creep.memory.quickDrop = false;
      }
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
              var towers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity);
          }
        });
        if (towers.length) {
            var closestTower = creep.pos.findClosestByPath(towers);
            if(creep.transfer(closestTower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestTower);
        }
        }
      if (stores.length > 0) {
        var closestStore = creep.pos.findClosestByPath(stores);
        if(creep.transfer(closestStore, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(closestStore);
        }
      } else {
          //console.log(`stores full, ${creep.name} ${stores[0]} moving to dropoint`)
        //   var storesX = stores[0].room.pos.x;
        //   var storesY = stores[0].room.pos.y - 1;
        //   var dropPoint = new RoomPosition(storesX, storesY, creep.room.name);
          //creep.moveTo(dropPoint);
/*          var dropPoint = new RoomPosition(34, 28, 'E7N76');
          if (creep.pos.x !== 34 || creep.pos.y !== 28) {
              creep.moveTo(dropPoint);
          } else {
              creep.drop(RESOURCE_ENERGY);
              creep.memory.harvesting = true;
          }*/

        // var roomStorage = creep.room.storage;
        // if(creep.transfer(roomStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(roomStorage);
        // }
      }
    }
  }
};

module.exports = roleTransporter;