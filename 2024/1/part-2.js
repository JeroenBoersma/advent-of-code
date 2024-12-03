
const sorted2 = input.map(r => r.split('   ')).reduce((c, r, i) => {c[0].push(parseInt(r[0]));c[1].push(parseInt(r[1])); return c}, [[], []])

sorted2[0].map((r, i) => r * sorted2[1].filter(r2 => r2 === r).length).reduce((c, r) => c + r, 0) 

