input = document.body.firstChild.innerText.split('\n').filter(l => l.length);

// Search of all digits in
// https://regex101.com/
// 
input.map(i => i.replace(/^([^\d]*(\d).*(\d)[^\d]*|[^\d]*(\d)[^\d]*)$/, '$2$3$4$4'))
    .map(i => isNaN(i) ? 0 : parseInt(i))
    .reduce((c, i) => c + i, 0);
