

const unfoldPaper = paper => paper.map(line => ({"group": (new Array(5)).fill(line.group).join('?'), "numbers": (new Array(5)).fill(line.numbers).reduce((c, l) => [...c, ...l], [])}));

// slow solution
const unfoldedPaper = unfoldPaper(paper),
    solutions2 = createASolutionList(unfoldedPaper),
    sum2 = solutions2.length;