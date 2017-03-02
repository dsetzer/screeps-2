const mod = {
  CHATTY: true,
  SAY_PUBLIC: false,
  GRAFANA: true,
  ROOM_VISUALS: true,
  MAX_STORAGE_MINERAL: 100000,
  MAX_FORTIFY_LIMIT: {
    1: 1000,
    2: 1000,
    3: 2000,
    4: 50000,
    5: 250000,
    6: 500000,
    7: 1000000,
    8: Infinity,
  },
  CONTROLLER_SIGN: true,
  CONTROLLER_SIGN_MESSAGE: "gastraph's demesne",
  CONTROLLER_SIGN_UPDATE: true,
  REMOTE_HAULER_REHOME: true,
  PLAYER_WHITELIST: ['2drai'],
};
module.exports = mod;