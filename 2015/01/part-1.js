input = document.body.firstChild.innerText.split('\n').filter(l => l.length)[0];

// sort and match
sorted = input.split('').sort().join('').match(/(^\(+)(\)+)$/)

// floor
sorted[1].length - sorted[2].length