input = document.body.firstChild.innerText.split('\n\n').filter(l => l.length);

groups = input.map(g => g.split('\n').filter(j => j.length).map(j => JSON.parse(j)));

const isRightOrder = (a, b) => {
    const aIsNumber = typeof a === 'number',
        bIsNumber = typeof b === 'number';

    if (aIsNumber && !bIsNumber) {
        return isRightOrder([a], b);
    }
    if (!aIsNumber && bIsNumber) {
        return isRightOrder(a, [b]);
    }

    if (aIsNumber && bIsNumber) {
        // console.log(`Compare ${a} vs ${b}`);
        switch (true) {
            case a < b:
                console.log('Left side is smaller, so inputs are in the right order');
                return -1;
            case b < a:
                console.log('Right side is smaller, so inputs are not in the right order');
                return 1;
            default:
                return 0;
        }
    }

    if (b === undefined) {
        console.log('Right side ran out of items, so inputs are not in the right order');
        return 1;
    }

    const sub = a.map((a, i) => isRightOrder(a, b[i])).filter(c => c !== 0);
    if (sub.length) {
        return sub[0];
    }

    return isRightOrder(a.length, b.length);
}

rightOrder = groups.reduce((c, g, i) => c + (isRightOrder(...g) === -1 ? i + 1 : 0), 0);
