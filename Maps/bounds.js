water = {
    '~':[1, 4],
    '.':[0, 0],
    '#':[0, 3],
    'color':[0, 0, 255],
    weight: 10,
};

ground = {
    '.':[1, 4],
    '~':[0, 0],
    '#':[0, 3],
    'color':[0, 255, 0],
    weight: 10,
};

sand = {
    '~':[1, 3],
    '.':[1, 3],
    '#':[0, 2],
    'color':[240, 240, 100],
    weight: 1,
};

tiles = {
    '~':water,
    '.':ground,
    '#':sand,
};

const zeros = {
    '~':0,
    '.':0,
    '#':0,
};

const allTiles = Object.keys(tiles);