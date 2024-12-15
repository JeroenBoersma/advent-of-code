const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

const safe = input.map(r => r.split(/\s+/)).map(r => {
    const direction = [];
    for (let a = 1; a < r.length; a++) {
        direction.push(r[a-1] - r[a]);
    }

    return direction.filter(r => r < 0 && r >= -3).length === direction.length || direction.filter(r => r > 0 && r <= 3).length === direction.length;
});

safe.filter(r => r).length; 