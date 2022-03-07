// water = {'~':(1, 4), '.':(0, 0), '#':(0, 3), 'color':(0, 0, 255), 'weight':10}
// ground = {'~':(0, 0), '.':(1, 4), '#':(0, 3), 'color':(0, 255, 0), 'weight':10}
// sand = {'~':(1, 3), '.':(1, 3), '#':(0, 2), 'color':(240, 240, 100), 'weight':1}
// tiles = {'~':water, '.':ground, '#':sand}

water = {
    '~_min':1,
    '~_max':4,
    '._min':0,
    '._max':0,
    '#_min':0,
    '#_max':3,
    'color':[0, 0, 255],
    weight: 10,
};

ground = {
    '~_min':0,
    '~_max':0,
    '._min':1,
    '._max':4,
    '#_min':0,
    '#_max':3,
    'color':[0, 255, 0],
    weight: 10,
};

sand = {
    '~_min':1,
    '~_max':3,
    '._min':1,
    '._max':3,
    '#_min':0,
    '#_max':2,
    'color':[240, 240, 100],
    weight: 1,
};

tiles = {
    '~':water,
    '.':ground,
    '#':sand,
};