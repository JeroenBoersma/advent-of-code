
// Push two additional packages

const dividerPackets = [[[2]], [[6]]];

groups = input.map(g => g.split('\n').filter(j => j.length).map(j => JSON.parse(j))).flat();
groups.push(...dividerPackets);

decodedData = groups.sort((a, b) => isRightOrder(a, b));

(decodedData.indexOf(dividerPackets[0]) + 1) * (decodedData.indexOf(dividerPackets[1]) + 1)
