import RouteModel from "./route.model";

export default interface TripModel {
    flightDuration: string,
    flightDurationNumber: number,
    flyFrom: string,
    cityFrom: string,
    countryFromCode: string,
    countryFromName: string,
    flyTo: string,
    cityTo: string,
    countryToCode: string,
    countryToName: string,
    distance: number,
    pricePln: number,
    priceEur: number,
    bookingLink: string,
    route: RouteModel[]
}