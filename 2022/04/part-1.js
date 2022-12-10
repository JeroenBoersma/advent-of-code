// input
input = document.body.firstChild.innerText.split('\n').filter(l => l.length > 0);

// get sections
sections = input.map(l => l.split(',').map(g => g.split('-').map(i => parseInt(i))))
// create helper filter
checkOverlap = (s) => s[0][0] <= s[1][0] && s[0][1] >= s[1][1] || s[1][0] <= s[0][0] && s[1][1] >= s[0][1];

// get overlapping itms
overlapping = sections.filter(checkOverlap);
overlapping.length;