const mod = {
  nextAction: function(creep){
      let priority = [
          Creep.action.defending,
          Creep.action.dismantling,
          Creep.action.invading,
          Creep.action.guarding,
          Creep.action.idle
      ];
      for(var iAction = 0; iAction < priority.length; iAction++) {
          var action = priority[iAction];
          if(action.isValidAction(creep) &&
              action.isAddableAction(creep) &&
              action.assign(creep)) {
                  return;
          }
      }
  },
};
module.exports = mod;