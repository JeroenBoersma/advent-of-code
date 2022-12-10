// create another calculator
ribbons = (l, w, h) => (l*w*h) + ([l, w, h].sort((a,b) => a - b).slice(0, 2).reduce((c, s) => c + s, 0) * 2);

// get total size
input.map(l => ribbons(...l.split('x').map(i => parseInt(i)))).reduce((s, f) => s+f, 0)
