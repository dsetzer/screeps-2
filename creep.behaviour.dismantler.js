let mod = {};
module.exports = mod;
mod.name = 'dismantler';
mod.run = function(creep) {
/*  if (creep.data.destiny.buddy) {
    // console.log('buddy!', creep.data.destiny.buddy);
    const buddy = Game.creeps[creep.data.destiny.buddy];
    // console.log(creep.pos.roomName, creep.pos.x, creep.pos.y);
    // console.log(buddy.pos.roomName, buddy.pos.x, buddy.pos.y);
    if (creep.pos.roomName === buddy.pos.roomName) {
      if ((creep.pos.x > buddy.pos.x + 1) || (creep.pos.x < buddy.pos.x - 1) || (creep.pos.y > buddy.pos.y + 1) || (creep.pos.y < buddy.pos.y - 1)) {
        console.log(creep, 'waiting for buddy to catch up <<<');
        return;
      }
    }
  }*/
//   Memory.population[creep.name].someVar = 'foo'
// console.log(Memory.population[creep.name].someVar);

  
    // Assign next Action
    let oldTargetId = creep.data.targetId;
    if( creep.action == null || creep.action.name == 'idle') {
        if( creep.data.destiny && creep.data.destiny.task && Task[creep.data.destiny.task] && Task[creep.data.destiny.task].nextAction ) 
            Task[creep.data.destiny.task].nextAction(creep);
        else this.nextAction(creep);
    }
    
    // Do some work
    if( creep.action && creep.target ) {
        creep.action.step(creep);
    } else {
        //logError('Creep without action/activity!\nCreep: ' + creep.name + '\ndata: ' + JSON.stringify(creep.data));
    }
};
mod.nextAction = function(creep) {
    var flag;
    if( creep.data.destiny ) flag = Game.flags[creep.data.destiny.flagName];
    
    if( flag ) {
        // not at target room
        if( !flag.room || flag.pos.roomName != creep.pos.roomName ){
            // travel to target room
            if( Creep.action.travelling.assign(creep, flag)) {
                Population.registerCreepFlag(creep, flag);
                return true;
            }
        } else {
          if (flag === undefined) {
            Creep.recycling.idle.assign(creep)
            return;
          }
        }
    }
    if (flag === undefined) {
      Creep.action.idle.assign(creep)
      return;
    } else {
      creep.moveTo(flag.pos)
      Creep.action.dismantling.assign(creep)
    }
    // else run as worker
    // Creep.behaviour.worker.nextAction(creep);
};
