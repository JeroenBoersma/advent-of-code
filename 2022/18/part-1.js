input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

reducedMaxSides = input.map(l => l.split(',').map(i => parseInt(i)).sort((a,b) => a - b))
    .reduce((c, b) => c.map((i, d) => Math.max(i, b[d])), [0, 0, 0]);

// final sides = (x*y*2+x*z*2+y*z*2)
(reducedMaxSides[0] * reducedMaxSides[1] * 2) +
(reducedMaxSides[1] * reducedMaxSides[2] * 2) +
(reducedMaxSides[0] * reducedMaxSides[2] * 2);
