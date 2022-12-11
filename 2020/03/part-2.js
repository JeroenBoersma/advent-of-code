const slopes = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
];

slopes.map(s => {

    const slope = createSlope(...s),
    trees = tobogganForest(forest, slope);

    console.log(`Slope run and see ${trees}`, s);

    return trees;
}).reduce((c, t) => c * t, 1);
