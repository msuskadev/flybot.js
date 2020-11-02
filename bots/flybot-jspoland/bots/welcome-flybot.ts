import { ActivityHandler, MessageFactory } from 'botbuilder';

export class WelcomeFlyBot extends ActivityHandler {    
    constructor() {
        super();    

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            if (!membersAdded) {
                return;
            }

            const welcomeText = 'Welcome! Enjoy using Flybot! How can I help you?';
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText));
                }
            }

            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
}