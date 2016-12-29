// extend StructureSpawn prototype with custom create method for dynamic creep bodies
module.exports =  function() {
    StructureSpawn.prototype.create = function(energy, name, role) {
      console.log(`creating... ${energy}, ${role}`);
      var body = [];
      var COST_WORK = 100;
      var COST_PART = 50;
      var creepCost = 0;
      if (role === 'miner') {
          if (energy > 550) {
              body = [WORK, WORK, WORK, WORK, WORK, MOVE]
          } else {
                       var maxWork = 5;
          body.push(MOVE);
          creepCost += COST_PART;
          console.log(`move pushed, remaining: ${energy - creepCost}`)
            for (let i = 0; i <= maxWork && creepCost <= (energy - creepCost); i++) {
            body.push(WORK);
            creepCost += COST_WORK;
            console.log(`work pushed, remaining: ${energy} - ${creepCost} = ${energy - creepCost}`)
        } 
          }

        
      }
      else if (role === 'transporter') {
        var numberOfParts = Math.floor(energy / 200);
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
      }
        else {
        // create a balanced body as big as possible with the given energy
        var numberOfParts = Math.floor(energy / 200);
        var body = [];
        for (let i = 0; i < numberOfParts; i++) {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++) {
            body.push(MOVE);
        }
      }
      console.log(`body: ${body} cost: ${creepCost}`)
      return this.createCreep(body, name, {role: role, working: false});
    }
};