import FlightModel from "../models/flight.model";
import SkypickerGateway from "../gateways/skypicker.gateway";
import GatewayResponse from "../models/gateway-response.model";
import TripModel from "../models/trip.model";
import RouteModel from "../models/route.model";

export default class FlightsService {
    private skypickerGateway: SkypickerGateway = new SkypickerGateway();

    public async basicFlightsSearch(flightModel: FlightModel) : Promise<any[]> {
        const response = await this.skypickerGateway.basicFlightsSearch(flightModel);
        const result = this.mapTrips(response);
        return Promise.resolve([]); 
    }

    private mapTrips(response: GatewayResponse | null) : TripModel[] | null {
        if (!response || !response.data) {
            return null;
        }

        const trips : TripModel[] = [];

        for (let i = 0; i < response.data.data.length; i++) {
            let item = response.data.data[i];
            trips.push(
                {
                    flightDuration: item.fly_duration,
                    distance: item.distance,
                    cityFrom: item.cityFrom,
                    flyFrom: item.flyFrom,
                    countryFromCode: item.countryFrom.code,
                    countryFromName: item.countryFrom.name,
                    cityTo: item.cityTo,
                    flyTo: item.flyTo,
                    countryToCode: item.countryTo.code,
                    countryToName: item.countryTo.name,
                    pricePln: item.conversion.PLN,
                    priceEur: item.conversion.EUR,
                    bookingLink: item.deep_link,
                    route: this.mapRoute(item.route)
                });
        };
        return trips;
    }

    private mapRoute(tripRoute: any) : RouteModel[] {
        if (!tripRoute) {
            return [];
        }

        const route : RouteModel[] = [];
        for (let i = 0; i < tripRoute.length; i++) {
            route.push({
                airline: tripRoute[i].airline,
                cityFrom: tripRoute[i].cityFrom,
                cityTo: tripRoute[i].cityTo,
                flyFrom: tripRoute[i].flyFrom,
                flyTo: tripRoute[i].flyTo,
                arrivalTimeUTC: tripRoute[i].aTimeUTC,
                departureTimeUTC: tripRoute[i].dTimeUTC,
                flight_no: tripRoute[i].flight_no
            });
        }

        return route;
    }
}