export const generateRandomPoints = (
    center: { latitude: number; longitude: number },
    radius: number,
    numPoints: number
): { latitude: number; longitude: number }[] => {
    const points: {
        latitude: number
        longitude: number
    }[] = []

    for (let i = 0; i < numPoints; i++) {
        const randLat =
            center.latitude +
            (Math.random() * 2 - 1) * (radius / 111)
        const randLon =
            center.longitude +
            (Math.random() * 2 - 1) *
                (radius / (111 * Math.cos(center.latitude)))

        points.push({
            latitude: randLat,
            longitude: randLon
        })
    }

    return points
}
