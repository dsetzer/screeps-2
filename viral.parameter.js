const mod = {
  CHATTY: true,
  SAY_PUBLIC: false,
  GRAFANA: false,
  ROOM_VISUALS: true,
  ROOM_VISUALS_ALL: false,
  VISUALS: { // if ROOM_VISUALS is enabled, you can select what you want to display - All is a bit much for some people.
        ROOM: true, // displays basic info relative to the room
        ROOM_GLOBAL: true, // displays basic info relative to your account - requires ROOM: true
        CPU: true, // display a graph containing CPU used, CPU limit, and bucket
        ROOM_ORDERS: false, // display orders the room creates
        ROOM_OFFERS: false, // display what a room will offer another
        SPAWN: true, // displays creep name and spawn progress percentage when spawning
        CONTROLLER: true, // displays level, progress, and ticks to downgrade if active
        STORAGE: true, // displays storage contents
        TERMINAL: true, // displays terminal contents
        TRANSACTIONS: false, // displays 2 most recent transactions over room terminal
        LABS: true, // displays lab energy, mineral, or cooldown
        MINERAL: true, // displays mineral amount, or ticks to regen
        SOURCE: true, // displays energy amount, or ticks to regen
        CREEP: false, // draws creep paths
        WALL: true, // highlight weakest wall and display hits
        RAMPART: true, // highlight weakest rampart and display hits
        ROAD: false, // highlight weakest road and display hits
        HEATMAP: false, // collects creep positioning to display a heatmap
        HEATMAP_INTERVAL: 2, // intervals between collections
    },
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
  REMOTE_HAULER_ALLOW_OVER_CAPACITY: 2450,
  PLAYER_WHITELIST: [
      '2drai',
      'Helam',
        'Rajecz',
        'Dewey' ,
        'CrazyPilot' ,
        'Lamus' ,
        'Tirao' ,
        'Vervust',
        'McGnomington',
        'Dragnar',
        'Baldey',
        'Vultured',
        'Ransom',
        'Hive_',
        'Greenfox',
        'haaduken',
        'rouhet',
        'kraiik',
        'userwins',
        'PervyPenguin',
        'Violaman',
        'IFor',
        'QuickStrike'
    ],
  
};
module.exports = mod;