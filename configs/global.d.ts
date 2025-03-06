export type RootStackParamList = {
    Venue: {
        id: string
        name: string
        image: string
        sportsAvailable: string
        rating: number
        timings: string
        address: string
        location: string
        bookings: number
    }
    Login: undefined
    Register: undefined
    Name: undefined
    Email: undefined
    Password: undefined
    Image: undefined
    PreFinal: undefined
    MainStack: undefined

    //Create: undefined
    Create: { taggedVenue?: string; timeInterval?: string }
    TagVenue: undefined
    Time: undefined
}
