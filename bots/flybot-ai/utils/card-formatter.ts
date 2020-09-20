import AdaptiveCard from '../assets/adaptive-card.json';
import AdaptiveCardRoute from '../assets/adaptive-card-route.json';
import TripModel from "../models/trip.model";
import RouteModel from "../models/route.model";
import { Attachment, CardFactory } from 'botbuilder';
import moment from 'moment';

export default class CardFormatter {
    public static format(trips: TripModel[]) : Attachment[] {
        let result: Attachment[] = [];
        trips.forEach(t => {
            let adaptiveCard = JSON.stringify(AdaptiveCard);
            adaptiveCard = adaptiveCard.replace('{cityFrom}', t.cityFrom)
                    .replace('{countryFromName}', t.countryFromName)
                    .replace('{flyFrom}', t.flyFrom)
                    .replace('{cityTo}', t.cityTo)
                    .replace('{countryToName}', t.countryToName)
                    .replace('{flyTo}', t.flyTo)
                    .replace('{flightDuration}', t.flightDuration)
                    .replace('{distance}', t.distance.toString())
                    .replace('{numberOfStops}', t.route.length.toString() + " stops")
                    .replace('{pricePln}', t.pricePln.toString())
                    .replace('{priceEur}', t.priceEur.toString())
                    .replace('{bookingLink}', t.bookingLink)
                    .replace('[]', `[${this.formatRoute(t.route)}]`);
            
            result.push(CardFactory.adaptiveCard(JSON.parse(adaptiveCard)));
        });         

        return result;
    }

    private static formatRoute(route: RouteModel[]) : string {
        let result: string[] = [];

        route.forEach(r => {
            let adaptiveCardRoute = JSON.stringify(AdaptiveCardRoute);            

            adaptiveCardRoute = adaptiveCardRoute.replace('{departureCityFrom}', r.cityFrom)
                        .replace('{departureFlyFrom}', r.flyFrom)
                        .replace('{departureTime}', new Date(r.departureTimeUTC * 1000).toLocaleTimeString())
                        .replace('{arrivalCityTo}', r.cityTo)
                        .replace('{arrivalFlyTo}', r.flyTo)
                        .replace('{arrivalTime}', new Date(r.arrivalTimeUTC * 1000).toLocaleTimeString())
                        .replace('{airlineCode}', r.airlineCode)
                        .replace('{flight_no}', r.flight_no)
                        .replace('{airlineLogo}', r.airlineLogo);
            result.push(adaptiveCardRoute);            
        });

        const separator = `,{
            "type": "TextBlock",
            "text": "...",
            "horizontalAlignment": "center"
        },`;

        return result.join(separator);
    }
}