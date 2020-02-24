import FlightModel from "../models/flight.model";
import SkypickerGateway from "../gateways/skypicker.gateway";
import GatewayResponse from "../models/gateway-response.model";
import TripModel from "../models/trip.model";
import RouteModel from "../models/route.model";
import AirlineService from "./airlines.service";

export default class FlightsService {
    private skypickerGateway: SkypickerGateway = new SkypickerGateway();

    public async flightsSearch(flightModel: FlightModel) : Promise<TripModel[]> {
        const response = await this.skypickerGateway.flightsSearch(flightModel);        
        return Promise.resolve(this.mapTrips(response)); 
    }    

    private mapTrips(response: GatewayResponse | null) : TripModel[] {
        if (!response || !response.data) {
            return [];
        }

        const trips : TripModel[] = [];

        for (let i = 0; i < response.data.data.length; i++) {
            let item = response.data.data[i];
            trips.push(
                {
                    flightDuration: item.fly_duration,
                    flightDurationNumber: item.aTimeUTC - item.dTimeUTC,
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
        const airlineService = new AirlineService();
        const route : RouteModel[] = [];
        for (let i = 0; i < tripRoute.length; i++) {
            route.push({
                airlineCode: tripRoute[i].airline,
                airlineName: airlineService.getAirlineDetails(tripRoute[i].airline)?.name,
                airlineLogo: `https://images.kiwi.com/airlines/64/${tripRoute[i].airline}.png`,
                airlineLogoSmall: `https://images.kiwi.com/airlines/32x32/${tripRoute[i].airline}.png`,
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