module.exports = {
    run: function(creep) {
        var targetRoom = 'E69S71';
        var target = new RoomPosition(42, 9, targetRoom);
        if (creep.room.name !== targetRoom) {
            creep.moveTo(target);
        } else {
            creep.memory.harvesting = true;
            creep.moveTo(Game.flags.SOURCE_WEST);
            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if (sources.length) {
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                }
            } 
        }
    }
};