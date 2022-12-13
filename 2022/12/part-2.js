
// Remove garbage
cleanupHeightMap(heightMap);
// This will remove a whole lot of a's

// Find shortest route from lowest point
routes = getAllHeightItems(heightMap, routeStart.height).map(start => {
    // reset score for each run
    heightMap.flat().map(mark => {
        mark.score.f =
            mark.score.g =
            mark.score.h = Infinity;

        mark.parent = null
    });

    const route = findShortestRoute(start, routeEnd)

    plotRoute(heightMap, route);
    return route;
});

shortestRoute = routes.sort((a, b) => a.length - b.length).filter(r => r.length).shift();

plotRoute(heightMap, shortestRoute);

