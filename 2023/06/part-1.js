const input = document.body.firstChild.innerText.split('\n').filter(l => l.length);


const normalizeInput = input => input.map(row => row.split(':')[1])
        .map(row => row.split(/\s+/).filter(e => e.length).map(e => parseInt(e))),
        
        
        beatTheRecord = (times, distances) => {
            const results = [];

            times.forEach((time, index) => {

                const recordBeaatingButtonTimes = [];

                const record = distances[index];

                // game on
                for (let t = 1; t < time; t++) {
                    
                    // time and speed are bound
                    const speed = t;

                    const distance = (time - t) * speed;

                    if (distance > record) {
                        recordBeaatingButtonTimes.push([speed, distance]);
                    }
                }

                results.push(recordBeaatingButtonTimes);
            });

            return results;
        };

const gameData = normalizeInput(input),
    records = beatTheRecord(gameData[0], gameData[1]),
    sum = records.reduce((c, r) => c *r.length, 1);