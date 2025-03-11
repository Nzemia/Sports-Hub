export type RootStackParamList = {
    // Auth-related routes
    Login: undefined
    Register: undefined
    Name: undefined
    Email: undefined
    Password: undefined
    Image: undefined
    PreFinal: undefined
    MainStack: undefined
    Start: undefined

    // Game-related routes
    Create: {
        taggedVenue?: Venue
        timeInterval?: string
    }
    Play: { initialOption?: string; refresh?: boolean }
    Game: {
        item: GameItem
    }
    Manage: {
        requests: RequestItem[]
        userId: string
        gameId: string
    }
    Players: {
        players: Player[]
    }

    // Venue-related routes
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
    TagVenue: undefined
    Time: undefined
    Payment: {
        selectedCourt: string
        selectedSport: string
        price: number
        selectedTime: string
        selectedDate: string
        place: string
        gameId?: string
    }

    // Slot-related routes
    Slot: {
        place: string
        sports: string[]
        date: string
        gameId: string
        bookings: Booking[]
    }

    // Profile routes
    Profile: undefined
}

export interface Venue {
    _id: string
    name: string
    image: string
    sportsAvailable: string[]
    bookings: Booking[]
}

interface UpComingGameProps {
    item: {
        _id: string
        area: string
        adminName: string
        adminUrl: string
        date: string
        time: string
        players: any[]
        courtNumber?: string
        isBooked?: boolean
    }
}

export interface Court {
    name: string
    available: boolean
}

export interface Sport {
    name: string
    icon: string
    price: number
    courts: Court[]
}

export interface GameItem {
    _id: string
    adminName: string
    adminUrl: string
    area: string
    date: string
    //time: string
    isUserAdmin: boolean
    matchFull: boolean
    requests: RequestItem[]
    players: Player[]
    isBooked?: boolean
    sport?: string
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

export interface RequestUser {
    userId: string
    firstName: string
    lastName: string
    image: string
    comment: string
    skill?: string
    noOfGames?: number
}

export interface Booking {
    courtNumber: string
    date: string
    time: string
    user: string
    game: string
}

export interface SlotScreenParams {
    place: string
    sports: Sport[]
    date?: string
    slot?: string
    startTime?: string
    endTime?: string
    gameId?: string
    bookings: Booking[]
}
