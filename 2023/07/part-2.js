const scoreHand2 = hand => {
        const cards = hand.split(''),
            pointMap = {
                "A": 14,
                "K": 13,
                "Q": 12,
                "J": 0,
                "T": 10
            },
            point = card => pointMap[card] ?? parseInt(card),
            points = cards.map(c => point(c)),
            same = points => points.reduce((c, p) => (p & c), points[0]) === points[0],
            highs = points => [...points].reverse().reduce((c, p, i) => c + p * Math.pow(14, i), 0),
            score = points => {
                // calculate score
                const diff = highs((new Array(5)).fill(14)); // max hand score based on cards

                high = highs(points);

                // console.log(diff, high);

                // minumum for specials + high card makes sorting easy
                switch (true) {
                    // 5 of a kind
                    // binary compare against first should result in the same number
                    case same(points): // 5
                        type = '5k';
                        return diff * 6 + high;

                    // 4 of a kind
                    case same(points.slice(0, 4)): // 41
                    case same(points.slice(-4)):   // 14
                        type = '4k';
                        return diff * 5 + high;

                    // full-house (2/3)
                    case (same(points.slice(0, 3)) && same(points.slice(-2))): // 32
                    case (same(points.slice(0, 2)) && same(points.slice(-3))): // 23
                        type = 'fh';
                        return diff * 4 + high;
                    
                    // 3 of a kind
                    case same(points.slice(0, 3)): // 311
                    case same(points.slice(1, 4)): // 131
                    case same(points.slice(-3)):   // 113
                        type = '3k';
                        return diff * 3 + high;

                    // 2 pair (2/2)
                    case (same(points.slice(0, 2)) && same(points.slice(-2))):   // 212
                    case (same(points.slice(1, 3)) && same(points.slice(-2))):   // 122
                    case (same(points.slice(0, 2)) && same(points.slice(2, 4))): // 221
                        type = '2p';
                        return diff * 2 + high;
                    
                    // 1 pair (2)
                    case same(points.slice(0, 2)): // 2111
                    case same(points.slice(1, 3)): // 1211
                    case same(points.slice(2, 4)): // 1121
                    case same(points.slice(-2)):   // 1112
                        type = '1p';
                        return diff * 1 + high;
                }

                // high card
                return high; // 11111
            },
            result = {
                "high": 0,
                "points": [...points],
                "total": 0,
                "type": "hc"
            };

        let type = 'hc', 
            high = points[0],
            total = 0;

        // calculate
        // try joker combinations
        if (points.sort((a, b) => b - a).indexOf(0) > 0) {
            const combinations = [];
            points.filter(n => n).forEach((jokerPoint, i, points) => {
                const withJoker = [...points];
                while (withJoker.length < 5) {
                    withJoker.push(jokerPoint);
                }

                combinations.push([withJoker.sort((a, b) => b - a), score(withJoker.sort((a, b) => b - a))]);
            });

            // get best combination
            const best = [...combinations].sort((a, b) => a[1] - b[1]).pop();
            total = score(best[0]);

        } else {
            total = score(points.sort((a, b) => b - a));
        }

        // High card
        result.high = high;

        // score
        result.total = total;

        // type
        result.type = type;

        // console.log(cards, points, result);

        return result;
    };

const hands2 = createHands(input, scoreHand2),
    sum2 = totalScore(rankHandsNaive(hands2));