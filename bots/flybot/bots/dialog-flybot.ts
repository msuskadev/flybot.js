import { ActivityHandler, BotState, ConversationState, StatePropertyAccessor, UserState } from 'botbuilder';
import { Dialog, DialogState } from 'botbuilder-dialogs';
import { SearchFlightsDialog } from '../dialogs/search-flights-dialog';
import { SearchDomesticFlightsDialog } from '../dialogs/search-domestic-flights-dialog';
import DialogPropertiesModel  from '../models/dialog-properties.model';

export class DialogFlyBot extends ActivityHandler {    
    private conversationState: BotState;
    private userState: BotState;
    private dialog: Dialog;
    private domesticDialog: Dialog;
    private dialogState: StatePropertyAccessor<DialogState>;
    private dialogProperties: StatePropertyAccessor<DialogPropertiesModel>;

    constructor(conversationState: BotState, userState: BotState) {
        super();

        this.conversationState = conversationState as ConversationState;
        this.userState = userState as UserState;
        this.dialog = new SearchFlightsDialog();
        this.domesticDialog = new SearchDomesticFlightsDialog();
        this.dialogState = this.conversationState.createProperty<DialogState>('DialogState');
        this.dialogProperties = this.conversationState.createProperty('DialogProperties');

        this.onMessage(async (context, next) => {     
            if (context.activity.text.includes('domestic')) {
                await (this.domesticDialog as SearchDomesticFlightsDialog).run(context, this.dialogState, this.dialogProperties);    
            } else {
                await (this.dialog as SearchFlightsDialog).run(context, this.dialogState, this.dialogProperties);    
            }
            await next();
        });

        this.onDialog(async (context, next) => {
            await this.conversationState.saveChanges(context, false);
            await this.userState.saveChanges(context, false);
            await next();
        });
    }
}