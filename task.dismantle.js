// This task will react on yellow/yellow flags, sending a dismantleing creep to the flags position.
let mod = {};
module.exports = mod;
mod.minControllerLevel = 3;
// hook into events
mod.register = () => {
    // when a new flag has been found (occurs every tick, for each flag)
    Flag.found.on( flag => Task.dismantle.handleFlagFound(flag) );
    // a creep starts spawning
    Creep.spawningStarted.on( params => Task.dismantle.handleSpawningStarted(params) );
    // a creep completed spawning
    Creep.spawningCompleted.on( creep => Task.dismantle.handleSpawningCompleted(creep) );
    // a creep will die soon
    Creep.predictedRenewal.on( creep => Task.dismantle.handleCreepDied(creep.name) );
    // a creep died
    Creep.died.on( name => Task.dismantle.handleCreepDied(name) );
};
// for each flag
mod.handleFlagFound = flag => {
    // if it is a yellow/yellow flag
    if( flag.color == FLAG_COLOR.destroy.dismantle.color && flag.secondaryColor == FLAG_COLOR.destroy.dismantle.secondaryColor ){
        // check if a new creep has to be spawned
        Task.dismantle.checkForRequiredCreeps(flag);
    }
};
mod.creep = {
    dismantle: {
        fixedBody: [
          TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
          WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
          MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
          MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
          MOVE, MOVE, MOVE, MOVE
        ],
        // fixedBody: [WORK, MOVE],
        multiBody: [TOUGH, WORK, MOVE, MOVE],
        maxMulti: 12,
        name: "dismantler", 
        behaviour: "dismantler", 
        queue: 'High'
    },
    healer: {
        fixedBody: [
          TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
          HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
          MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
          MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
          MOVE, MOVE, MOVE, MOVE
        ],
        // fixedBody: [HEAL, MOVE],
        multiBody: [TOUGH, HEAL, MOVE, MOVE],
        maxMulti: 12,
        name: "healer", 
        behaviour: "healer", 
        queue: 'High'
    },
    
    
};
// check if a new creep has to be spawned
mod.checkForRequiredCreeps = (flag) => {
    // get task memory
    let memory = Task.dismantle.memory(flag);
    // count creeps assigned to task
    let count = memory.queued.length + memory.spawning.length + memory.running.length;
    // if creep count below requirement spawn a new creep creep
    if( count < 1 ) {
        Task.spawn(
            Task.dismantle.creep.dismantle, // creepDefinition
            { // destiny
                task: 'dismantle', // taskName
                targetName: flag.name, // targetName
                flagName: flag.name, // custom
                buddy: `healer-${flag.name}-${count + 1}`,
            }, 
            { // spawn room selection params
                targetRoom: flag.pos.roomName, 
                minEnergyCapacity: 200, 
                rangeRclRatio: 1.8 // stronger preference of higher RCL rooms
            },
            creepSetup => { // callback onQueued
                let memory = Task.dismantle.memory(Game.flags[creepSetup.destiny.targetName]);
                memory.queued.push({
                    room: creepSetup.queueRoom,
                    name: creepSetup.name,
                    targetName: flag.name
                });
            }
        );
        Task.spawn(
            Task.dismantle.creep.healer, // creepDefinition
            { // destiny
                task: 'dismantle', // taskName
                targetName: flag.name, // targetName
                flagName: flag.name, // custom
                buddy: `dismantler-${flag.name}-${count + 1}`,
            }, 
            { // spawn room selection params
                targetRoom: flag.pos.roomName, 
                minEnergyCapacity: 200, 
                rangeRclRatio: 1.8 // stronger preference of higher RCL rooms
            },
            creepSetup => { // callback onQueued
                let memory = Task.dismantle.memory(Game.flags[creepSetup.destiny.targetName]);
                memory.queued.push({
                    room: creepSetup.queueRoom,
                    name: creepSetup.name,
                    targetName: flag.name
                });
            }
        );
    }
};
// when a creep starts spawning
mod.handleSpawningStarted = params => { // params: {spawn: spawn.name, name: creep.name, destiny: creep.destiny}
    // ensure it is a creep which has been queued by this task (else return)
    if ( !params.destiny || !params.destiny.task || params.destiny.task != 'dismantle' )
        return;
    // get flag which caused queueing of that creep
    let flag = Game.flags[params.destiny.flagName];
    if (flag) {
        // get task memory
        let memory = Task.dismantle.memory(flag);
        // save spawning creep to task memory
        memory.spawning.push(params);
        // clean/validate task memory queued creeps
        let queued = []
        let validateQueued = o => {
            let room = Game.rooms[o.room];
            if(room.spawnQueueMedium.some( c => c.name == o.name)){
                queued.push(o);
            }
        };
        memory.queued.forEach(validateQueued);
        memory.queued = queued;
    }
};
// when a creep completed spawning
mod.handleSpawningCompleted = creep => {
    // ensure it is a creep which has been requested by this task (else return)
    if (!creep.data || !creep.data.destiny || !creep.data.destiny.task || creep.data.destiny.task != 'dismantle')
        return;
    // get flag which caused request of that creep
    let flag = Game.flags[creep.data.destiny.flagName];
    console.log('handleSpawningCompleted', flag, flag.pos.roomName);
    if (flag) {
        // calculate & set time required to spawn and send next substitute creep
        // TODO: implement better distance calculation
        creep.data.predictedRenewal = creep.data.spawningTime + (routeRange(creep.data.homeRoom, flag.pos.roomName)*50);

        // get task memory
        let memory = Task.dismantle.memory(flag);
        // save running creep to task memory
        memory.running.push(creep.name);
        // clean/validate task memory spawning creeps
        let spawning = []
        let validateSpawning = o => {
            let spawn = Game.spawns[o.spawn];
            if( spawn && ((spawn.spawning && spawn.spawning.name == o.name) || (spawn.newSpawn && spawn.newSpawn.name == o.name))) {
                count++;
                spawning.push(o);
            }
        };
        memory.spawning.forEach(validateSpawning);
        memory.spawning = spawning;
    }
};
// when a creep died (or will die soon)
mod.handleCreepDied = name => {
    // get creep memory
    let mem = Memory.population[name];
    // ensure it is a creep which has been requested by this task (else return)
    if (!mem || !mem.destiny || !mem.destiny.task || mem.destiny.task != 'dismantle')
        return;
    // get flag which caused request of that creep
    let flag = Game.flags[mem.destiny.flagName];
    if (flag) {
        // get task memory
        let memory = Task.dismantle.memory(flag);
        // clean/validate task memory running creeps
        let running = []
        let validateRunning = o => {
            // invalidate dead or old creeps for predicted spawning
            let creep = Game.creeps[o];
            if( !creep || !creep.data ) return
            // invalidate old creeps for predicted spawning
            // TODO: better distance calculation
            let prediction;
            if( creep.data.predictedRenewal ) prediction = creep.data.predictedRenewal;
            else if( creep.data.spawningTime ) prediction = (creep.data.spawningTime + (routeRange(creep.data.homeRoom, flag.pos.roomName)*50));
            else prediction = (routeRange(creep.data.homeRoom, flag.pos.roomName)+1) * 50;
            if( creep.name != name && creep.ticksToLive > prediction ) {
                running.push(o);
            }
        };
        memory.running.forEach(validateRunning);
        memory.running = running;
    }
};
// get task memory
mod.memory = (flag) => {
    if( !flag.memory.tasks ) 
        flag.memory.tasks = {};
    if( !flag.memory.tasks.dismantle ) {
        flag.memory.tasks.dismantle = {
            queued: [], 
            spawning: [],
            running: []
        }
    }
    return flag.memory.tasks.dismantle;
};
