import { ActivityHandler, MessageFactory } from 'botbuilder';

export class EchoBot extends ActivityHandler {
    constructor() {
        super();
        
        this.onMessage(async (context, next) => {
            const replyText = `Advanced echo: ${ context.activity.text }`;
            await context.sendActivity(MessageFactory.text(replyText));
            // Call the next continuation function from each handler to allow processing to continue. 
            // If next is not called, processing of the activity ends.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            if (!membersAdded) {
                return;
            }
            const welcomeText = 'Hello and welcome to TechTalk Special Edition!';
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }

            // Call the next continuation function from each handler to allow processing to continue. 
            // If next is not called, processing of the activity ends.
            await next();
        });
    }
}