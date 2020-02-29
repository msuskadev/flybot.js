import { AttachmentLayoutTypes, CardFactory, MessageFactory, StatePropertyAccessor, TurnContext } from 'botbuilder';
import {
    ChoiceFactory,
    ChoicePrompt,
    ComponentDialog,
    DateTimePrompt,
    DateTimeResolution,
    NumberPrompt,
    DialogSet,
    DialogState,
    DialogTurnResult,
    DialogTurnStatus,
    PromptValidatorContext,
    TextPrompt,
    WaterfallDialog,
    WaterfallStepContext,
    ConfirmPrompt
} from 'botbuilder-dialogs';
import FlyBotService from "../services/flybot.service";
import FlightModel from '../models/flight.model';
import moment from 'moment';
import CardFormatter from '../utils/card-formatter';
import TripHelper from '../utils/trip-helper';

const SEARCH_FLIGHTS_DIALOG = 'SEARCH_FLIGHTS_DIALOG';
const WATERFALL_SEARCH_FLIGHTS_DIALOG = 'WATERFALL_SEARCH_FLIGHTS_DIALOG';
const FLY_FROM_TEXT = 'FLY_FROM_TEXT';
const FLY_TO_TEXT = 'FLY_TO_TEXT';
const TRAVEL_DATE_CHOICE = 'TRAVEL_DATE_CHOICE';
const TRAVEL_DATE = 'TRAVEL_DATE';
const TRAVEL_ALONE_OR_WITH_FF_CHOICE = 'TRAVEL_ALONE_OR_WITH_FF_CHOICE';
const NUMBER_OF_ADULTS = 'NUMBER_OF_ADULTS';
const NUMBER_OF_CHILDREN = 'NUMBER_OF_CHILDREN';
const CONFIRM_PROMPT = 'CONFIRM_PROMPT';

export class SearchFlightsDialog extends ComponentDialog {
    constructor() {
        super(SEARCH_FLIGHTS_DIALOG);

        this.addDialog(new TextPrompt(FLY_FROM_TEXT, this.airportCountryCodeValidator.bind(this)))
            .addDialog(new TextPrompt(FLY_TO_TEXT, this.airportCountryCodeValidator.bind(this)))        
            .addDialog(new ChoicePrompt(TRAVEL_DATE_CHOICE))
            .addDialog(new DateTimePrompt(TRAVEL_DATE, this.dateTimePromptValidator.bind(this)))
            .addDialog(new ChoicePrompt(TRAVEL_ALONE_OR_WITH_FF_CHOICE))
            .addDialog(new NumberPrompt(NUMBER_OF_ADULTS))
            .addDialog(new NumberPrompt(NUMBER_OF_CHILDREN))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new WaterfallDialog(WATERFALL_SEARCH_FLIGHTS_DIALOG, [
                this.getDepartureAirport.bind(this),
                this.getArrivalAirport.bind(this),
                this.choiceTravelDate.bind(this),
                this.getTravelDate.bind(this),
                this.isTravellingAlone.bind(this),
                this.getAdultsNumber.bind(this),
                this.getChildrenNumber.bind(this),
                this.summaryStep.bind(this),
                this.finalStep.bind(this),
            ]));
        
        this.initialDialogId = WATERFALL_SEARCH_FLIGHTS_DIALOG;
    }

    public async run(context: TurnContext, accessor: StatePropertyAccessor<DialogState>) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id);
        }
    }

    private async getDepartureAirport(step: WaterfallStepContext) : Promise<DialogTurnResult> {
        return await step.prompt(FLY_FROM_TEXT, 'Please enter departure airport (like WRO, JFK) or country code (PL, DE)');
    }

    private async getArrivalAirport(step: WaterfallStepContext) : Promise<DialogTurnResult> {
        const flight = step.options as FlightModel;
        flight.flyFrom = step.result.toUpperCase();

        return await step.prompt(FLY_FROM_TEXT, 'Where would you like to arrive at? (IATA Airport Code or Country Code)');
    }

    private async choiceTravelDate(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        const flight = step.options as FlightModel;
        flight.flyTo = step.result.toUpperCase();

        return await step.prompt(TRAVEL_DATE_CHOICE, {
            choices: ChoiceFactory.toChoices(['Today', 'Tomorrow', 'Other Date']),
            prompt: 'When do you want to travel?'
        });
    }

    private async getTravelDate(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        let date = moment();
        if (step.result.value === 'Today') {
            return step.next([{value: date }]);
        }

        if (step.result.value === 'Tomorrow') {
            return step.next([{ value: date.add(1, 'days') }]);
        }

        return await step.prompt(TRAVEL_DATE, 'On what date would you like to travel?');
    }

    private async isTravellingAlone(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        const flight = step.options as FlightModel;
        flight.dateFrom = flight.dateTo = moment(step.result[0].value).format('DD/MM/YYYY');

        return await step.prompt(TRAVEL_ALONE_OR_WITH_FF_CHOICE, {
            choices: ChoiceFactory.toChoices(['Alone', 'With Family']),
            prompt: 'Do you travel alone or with friends or family?'
        });
    }

    private async getAdultsNumber(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        if (step.result.value === 'Alone') {
            return step.next(1);
        }

        return await step.prompt(NUMBER_OF_ADULTS, 'How many adults will fly with you? (including you)');
    }

    private async getChildrenNumber(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        const flight = step.options as FlightModel;
        flight.adults = step.result;
        
        if (flight.adults === 1) {
            return step.next(0);
        }

        return await step.prompt(NUMBER_OF_CHILDREN, 'How many children will fly with you?');
    }

    private async summaryStep(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        const flight = step.options as FlightModel;
        flight.children = step.result;        

        return await step.prompt(CONFIRM_PROMPT, this.prepareConfirmationText(flight));
    }

    private async finalStep(step: WaterfallStepContext) : Promise<DialogTurnResult>{
        if (step.result) {
            await step.context.sendActivities([
                { type: 'typing' }]);

            const allFlights = await new FlyBotService().searchFlights(step.options as FlightModel);        
            await step.context.sendActivity({
                attachmentLayout: AttachmentLayoutTypes.Carousel,
                attachments: [
                    CardFactory.animationCard("Fastest flights", ["https://media.giphy.com/media/PkLrYFJT9KVwkkvpjO/giphy.gif"]),
                    ...CardFormatter.format(TripHelper.getFastestFlights(allFlights))
                ]
            });

            await step.context.sendActivity({
                attachmentLayout: AttachmentLayoutTypes.Carousel,
                attachments: [
                    CardFactory.animationCard("Cheapest flights", ["https://media3.giphy.com/media/GmaV9oet9MAmI/giphy.gif?cid=790b7611bfa93e75268721dd0d1f7c1645b7f292098a1983&rid=giphy.gif"]),
                    ...CardFormatter.format(TripHelper.getCheapestFlights(allFlights))
                ]
            });
        }
        
        await step.context.sendActivities([
            MessageFactory.text('Enjoy your trip! Safe flight!')
        ]);

        //this.conversationData.activeDialog = '';
        return await step.endDialog();
    }

    private async airportCountryCodeValidator(promptContext: PromptValidatorContext<string>) : Promise<boolean> {
        let result: boolean = false;
        if (promptContext.recognized.value?.length === 2 || promptContext.recognized.value?.length === 3) {
            result = await new FlyBotService().validatePlace(promptContext.recognized.value.toUpperCase());            
        }
        if (!result) {
            promptContext.options.prompt = "Incorrect value! Please enter IATA airport code ex. WRO, JFK or country code ex. PL, DE or US";
            return false;    
        }

        return true;
    }

    private async dateTimePromptValidator(promptContext: PromptValidatorContext<DateTimeResolution[]>): Promise<boolean> {
        let result: boolean = false;
        if (promptContext.recognized.succeeded && promptContext.recognized.value) {                        
            result = moment(promptContext.recognized.value[0].value).isValid();
        }
        
        if (!result) {
            promptContext.options.prompt = "Incorrect date format! Please reenter travel date? (YYYY-MM-DD)";
            return false;    
        }

        return true;        
    }

    private prepareConfirmationText(flight: FlightModel) : string {
        let message = `Please confirm you want to travel from ${flight.flyFrom.toUpperCase()} to ${flight.flyTo.toUpperCase()} on ${flight.dateTo}.`;
        
        if (flight.adults && flight.adults > 1) {
            message += ` You need ${flight.adults + (flight.children ? flight.children : 0) } tickets for ${flight.adults} adults and ${flight.children} children`;  
        }
        
        return message;
    }

    
}