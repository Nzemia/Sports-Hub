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
    Start: undefined

    Create: {
        taggedVenue?: Venue
        timeInterval?: string
    }
    TagVenue: undefined
    Time: undefined
    Play: undefined
    Game: {
        item: GameItem
    }
    Slot: {
        place: string
        sports: string[]
        date: string
        slot: string
        startTime: string
        endTime: string
        gameId: string
        bookings: Booking[]
    }
    Manage: {
        requests: RequestItem[]
        userId: string
        gameId: string
    }
    Players: {
        players: Player[]
    }
    Slot: {
        place: string
        sports: string[]
        date: string
        slot: string
        startTime: string
        endTime: string
        gameId: string
        bookings: Booking[]
    }
    Profile: undefined
}

export interface Venue {
    _id: string
    name: string
    image: string
    sportsAvailable: string[]
    bookings: Booking[]
}
export interface GameItem {
    _id: string
    adminName: string
    adminUrl: string
    area: string
    date: string
    time: string
    isUserAdmin: boolean
    matchFull: boolean
    requests: RequestItem[]
    players: Player[]
}

export interface RequestItem {
    userId: string
    comment: string
}

export interface Player {
    _id: string
    firstName: string
    lastName: string
    image: string
    skill?: string
    noOfGames?: number
    playpals?: number
    sports?: string[]
}

export interface Booking {
    courtNumber: string
    date: string
    time: string
    user: string
    game: string
}
