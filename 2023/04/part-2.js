
const calculateInstancesOfScoredCards = cardWithScores => cardWithScores
    .map(card => ({...card, "instances": 1, "copies": 0}))
    .map((card, index, cardWithScores) => {

        // calculate copies
        for (let a = index + 1; a <= index + card.match; a++) {
            // console.log(`Card ${card.card} (${cardWithScores[a].card})`);
            cardWithScores[a].instances+=card.instances;
            cardWithScores[a].copies+=card.instances;
        }

        return card;
    });

const cardsWithInstance = calculateInstancesOfScoredCards(calculateScores(cards)),
    sum2 = cardsWithInstance.reduce((c, card) => c + card.instances, 0);