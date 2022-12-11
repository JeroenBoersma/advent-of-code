input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

// creat a forest
forest = input.map(r => r.split(''));

const createSlope = (addX, addY) => (x, y) => [x + addX, y + addY];

const tobogganForest = (forest, slope) => {
    let trees = 0, x = 0, y = 0;
    while (y < forest.length) {
        // repeat pattern
        x = x % forest[0].length;

        trees += forest[y][x] === '#' ? 1 : 0;

        // update
        [x, y] = slope(x, y);
    }

    return trees;
}

tobogganForest(forest, createSlope(3, 1));
