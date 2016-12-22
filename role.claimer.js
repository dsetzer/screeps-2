/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.claimer');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        var target = 'E67S71';
        creep.body.forEach((part) => {
            if (part.type === 'carry') {
                creep.memory.carrying = false;
            } else {
                if(part.type === 'claim') {
                    creep.memory.claimer = true;
                }
            }
        })
        if ((creep.room.name !== target)) {
            var exit = creep.pos.findClosestByPath(creep.room.findExitTo(target))
            creep.moveTo(exit);
        } else {
            // harvest shit if we can
            if((creep.room.controller) && (creep.memory.claimer)) {
                if (!creep.room.controller.sign) {
                    if(creep.signController(creep.room.controller, 'DEUS VULT') == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
                if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            } else {
                // attack shit
                creep.memory.attacking = true;
                var structures = creep.room.find(FIND_HOSTILE_STRUCTURES);
                var closestStr = creep.pos.findClosestByRange(structures);
                if ((creep.attack(closestStr) === ERR_NOT_IN_RANGE)) {
                  creep.moveTo(closestStr); 
                } else {
                    // no attack part, reserve controller instead
                    if (creep.attack(closestStr) === ERR_NO_BODYPART) {
                            if(creep.room.controller) {
                            if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.controller);    
                            }
                        }  
                    }
    
                } 
            }

            
            
        }
    }
};