// bump move parts towards the front of parts array
const mod = {
  partsComparator: function (a, b) {
      let partsOrder = [TOUGH, MOVE, CLAIM, WORK, CARRY, ATTACK, RANGED_ATTACK, HEAL ];
      let indexOfA = partsOrder.indexOf(a);
      let indexOfB = partsOrder.indexOf(b);
      return indexOfA - indexOfB;
  },
};
module.exports = mod;