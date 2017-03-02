const mod = {
  partsComparator: function (a, b) {
      let partsOrder = [TOUGH, MOVE, CLAIM, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL ];
      let indexOfA = partsOrder.indexOf(a);
      let indexOfB = partsOrder.indexOf(b);
      console.log(indexOfA - indexOfB);
      return indexOfA - indexOfB;
  },
};
module.exports = mod;