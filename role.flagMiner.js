module.exports = {
    run: function(creep) {
        var targetRoom = Game.flags.CLAIM.pos.roomName;
        if (creep.room.name !== targetRoom) {
            creep.moveTo(Game.flags.CLAIM);
        } else {
            creep.memory.harvesting = true;
            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            if (sources.length) {
                if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0]);
                } else {
                    console.log(creep.harvest(sources[0]))
                }
            } 
        }
    }
};