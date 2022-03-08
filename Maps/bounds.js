water = {
    '~':[1, 4],
    '.':[0, 0],
    '#':[0, 3],
};

ground = {
    '.':[1, 4],
    '~':[0, 0],
    '#':[0, 3],
};

sand = {
    '~':[1, 3],
    '.':[1, 3],
    '#':[0, 2],
};

water = [
    [1, 4],
    [0, 0],
    [0, 3],
];

ground = [
    [0, 0],
    [1, 4],
    [0, 3],
];

sand = [
    [1, 3],
    [1, 3],
    [0, 2],
];

// tiles = {
//     '~':water,
//     '.':ground,
//     '#':sand,
// };

const tiles2 = [
    water,
    ground,
    sand,
];

// const zeros = [0, 0, 0];

const weights = {
    '~':10,
    '.':10,
    '#':1,
};

const tileColors = {
    '~':[0, 0, 255],
    '.':[0, 255, 0],
    '#':[240, 240, 100],
};

const fromNumber = ['~', '.', '#'];
const allTiles = fromNumber;