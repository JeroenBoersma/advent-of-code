// read input from the browser
input = document.body.firstChild.innerHTML.split('\n').filter(l => l.length > 1);
// build rucksacks and divide in compartments
rucksacks = input.map(r => [r.substring(0, Math.floor(r.length /2)), r.substring(Math.floor(r.length /2))])
// search items which are in both compartments, build a regexp
commonItems = rucksacks.map(r => {const e = new RegExp(`[${r[0]}]`, 'g'); return r[1].match(e)[0]})
// create a helper for creating a score
// get the decimal value and standarize
priority = c => {const i = c.charCodeAt(), d = i < 97 ? 97 - 65 + 26:  0; return (i + d) % 96}
// calculate total
commonItems.map(c => priority(c)).reduce((c, v) => c + v, 0);