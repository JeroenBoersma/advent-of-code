input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

// create calculator
calculator = (l, w, h) => 2*l*w + 2*w*h + 2*h*l + [l, w, h].sort((a,b) => a - b).slice(0, 2).reduce((c, s) => c * s, 1);

// get total size
input.map(l => calculator(...l.split('x').map(i => parseInt(i)))).reduce((s, f) => s+f, 0)