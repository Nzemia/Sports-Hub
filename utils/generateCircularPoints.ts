interface Coordinate {
    latitude: number
    longitude: number
}

export const generateCircularPoints = (
    center: Coordinate,
    radius: number,
    numPoints: number
) => {
    const points = []
    const angleStep = (2 * Math.PI) / numPoints

    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep
        const latitude =
            center.latitude +
            (radius / 111) * Math.cos(angle)
        const longitude =
            center.longitude +
            (radius /
                (111 *
                    Math.cos(
                        (center.latitude * Math.PI) / 180
                    ))) *
                Math.sin(angle)
        points.push({ latitude, longitude })
    }

    return points
}
