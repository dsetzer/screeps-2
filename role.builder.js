var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
      var home = 'E72S18';
      var targetRoom;
      if (creep.memory.assignment == 'south') {
          targetRoom = 'E72S19'
      }
      if (creep.memory.assignment == 'east') {
          targetRoom = 'E73S18'
      }
/*
    // not full, need to harvest
    if (creep.memory.assignment !== undefined) {
        
        if (creep.room.name !== targetRoom) {
            var move = new RoomPosition(6, 11, targetRoom)
              creep.moveTo(move)
              console.log(creep.name, move)
              return;
        }
    }*/
        
        
        if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }
        
        if (creep.memory.assignment && creep.room.name !== targetRoom) {
            creep.memory.repositioning = true;
            var trg = new RoomPosition(25, 25, targetRoom);
            creep.moveTo(trg);
        }
        
        if (creep.memory.assignment && creep.room.name == targetRoom) {
            creep.memory.repositioning = false;
        }
            
        if(creep.memory.building && !creep.memory.repositioning) {
            // if creep spawned in with assignment in memory, go to target room before building
                // else build in this room
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                var closestTarget = creep.pos.findClosestByPath(targets);
                if(targets) {
                    // console.log(targets);
                    if(creep.build(closestTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(closestTarget);
                    }
                }
            }
            // todo take into account sites in other rooms
            // var globalSites;
            // for (var thisRoom in Game.rooms) {
            //     var roomSites = Game.rooms[thisRoom].find(FIND_CONSTRUCTION_SITES);
            //     if (roomSites) {
            //         console.log(roomSites, typeof(roomSites));
            //         var targets = roomSites;
            //         for (let i = 0; i < roomSites.length; i++) {
            //             console.log(roomSites[i]);
            //             console.log(roomSites.length);
            //             console.log(roomSites[i].pos.x, roomSites[i].pos.y)
            //         }
            //     }
            // }
        else {
            var withdrawTarget;
            if (creep.memory.assignment !== undefined) {
                var energyPiles = creep.room.find(FIND_DROPPED_ENERGY);
                var worthEnergy = creep.room.find(FIND_DROPPED_ENERGY, {
                    filter: (e) => {
                        return (e.amount >= (creep.carryCapacity - creep.carry.energy))
                    }
                });
                var closestEnergy = creep.pos.findClosestByPath(worthEnergy);
                if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestEnergy);
                }
                return;
            }
            // remove from containers
            var cnts = creep.room.find(FIND_STRUCTURES, {
              filter: (s) => {
                return ((s.structureType == STRUCTURE_CONTAINER) && (s.store[RESOURCE_ENERGY] >= 50))
                }
             });
            var blds = creep.room.find(FIND_STRUCTURES, {
              filter: (s) => {
                return ((s.structureType == STRUCTURE_SPAWN || s.structureType == STRUCTURE_EXTENSION) && (s.energy >= 50))
                }
              });
            if (cnts.length) {
                withdrawTarget = creep.pos.findClosestByRange(cnts);
                if(creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(withdrawTarget);
            }
            } else if (blds.length) {
              withdrawTarget = creep.pos.findClosestByRange(blds);
              if(creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(withdrawTarget);
            }
            } else {
                // find closest source
                var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // try to harvest energy, if the source is not in range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(source);
                }
                // withdrawTarget = creep.room.storage;
        //                 var sources = creep.room.find(FIND_SOURCES_ACTIVE);
        // // var hardCodedHarvesterSource = sources[1];
        // var harvesterSource = creep.pos.findClosestByPath(sources);
        // if (creep.harvest(harvesterSource) == ERR_NOT_IN_RANGE) {
        //   creep.moveTo(harvesterSource);
        // }
            }
        }
    }
};

module.exports = roleBuilder;