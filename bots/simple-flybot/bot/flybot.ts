import { ActivityHandler, MessageFactory, EndOfConversationCodes, Activity } from 'botbuilder';
import DataExtractor from '../utils/data-extractor';
import FlyBotService from '../services/flybot.service';
import TripModel from '../models/trip.model';
import FlightModel from '../models/flight.model';
import MessageFormatter from '../utils/message-formatter';

export class FlyBot extends ActivityHandler {
    private flybotService: FlyBotService; 
    
    constructor() {
        super();    
        this.flybotService = new FlyBotService();

        this.onMessage(async (context, next) => {
            const flight = DataExtractor.extract(context.activity.text);
            if (flight) {            
                // for debugging purpose only
                console.log(JSON.stringify(flight));

                if (!(await this.flybotService.validatePlace(flight.flyFrom))) {
                    await context.sendActivity(MessageFactory.text(this.preparePlacenotFoundAnswer(flight.flyFrom)));
                } else if (!(await this.flybotService.validatePlace(flight.flyTo))) {
                    await context.sendActivity(MessageFactory.text(this.preparePlacenotFoundAnswer(flight.flyTo)));
                } else {
                    
                    await context.sendActivities([
                        { type: 'typing' }]);
                    await context.sendActivities([
                        ...await this.searchFlights(flight)
                    ]);
                }            
            } else {
                await context.sendActivity(MessageFactory.text('Cannot find flights. Invalid parameters'));
            }
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            if (!membersAdded) {
                return;
            }

            const welcomeText = 'Welcome! Enjoy using Simple Flybot!';
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    private preparePlacenotFoundAnswer(place: string) : string {        
        return `${place.length === 2? 'Country' : 'Airport'} ${place} doesn't exist.`;
    }

    private async searchFlights(flight: FlightModel): Promise<Partial<Activity>[]> {
        const allFlights = await this.flybotService.searchFlights(flight);

        return [MessageFactory.text("# **FASTEST FLIGHTS:** " + MessageFormatter.format(this.getFastestFlights(allFlights))),
                MessageFactory.text("# **CHEAPEST FLIGHTS:** " + MessageFormatter.format(this.getCheapestFlights(allFlights)))];
    }

    private getFastestFlights(trips: TripModel[]) : TripModel[] {
        return trips.sort((a, b) => a.flightDurationNumber > b.flightDurationNumber ? 1 : a.flightDurationNumber < b.flightDurationNumber? -1 : 0).slice(0, 5);
    }
    
    private getCheapestFlights(trips: TripModel[]) : TripModel[] {
        return trips.sort((a, b) => a.pricePln > b.pricePln ? 1 : a.pricePln < b.pricePln? -1 : 0).slice(0, 5);
    }

}