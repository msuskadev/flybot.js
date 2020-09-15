import TripModel  from '../models/trip.model'; 

export default class TripHelper {
    public static getFastestFlights(trips: TripModel[]) : TripModel[] {
        return trips.sort((a, b) => a.flightDurationNumber > b.flightDurationNumber ? 1 : a.flightDurationNumber < b.flightDurationNumber? -1 : 0).slice(0, 3);
    }

    public static getCheapestFlights(trips: TripModel[]) : TripModel[] {
        return trips.sort((a, b) => a.pricePln > b.pricePln ? 1 : a.pricePln < b.pricePln? -1 : 0).slice(0, 3);
    } 
}