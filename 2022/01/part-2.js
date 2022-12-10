// continue part-1.js

// add a slice and reduce total
groupedElvesWithMeta.sort((a, b) => a.total - b.total).reverse().slice(0, 3).reduce((c, e) => c + e.total, 0)