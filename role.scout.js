var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target = 'E71S18';
        if (creep.room.name !== target) {
            creep.moveTo(new RoomPosition(30, 3, target))
        } else {
            creep.move(5);
        }
    }
}

module.exports = roleScout;