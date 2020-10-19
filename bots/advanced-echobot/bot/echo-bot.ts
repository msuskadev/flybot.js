import { ActivityHandler, MessageFactory } from 'botbuilder';

export class EchoBot extends ActivityHandler {
    constructor() {
        super();
        
        this.onMessage(async (context, next) => {            
            const replyText = `Echo: ${ context.activity.text.replace('Advanced Echo Bot', '') }`;
            await context.sendActivity(MessageFactory.text(replyText));
            // Call the next continuation function from each handler to allow processing to continue. 
            // If next is not called, processing of the activity ends.
            await next();
        });

        this.onReactionsAdded(async (context, next) => {
            const reactions = context.activity.reactionsAdded;
            if (!reactions) {
                return; 
            }

            const message = `You've added a \r\n` +  
            `# *_${reactions[0].type.toUpperCase()}_* \r\n` +
            `reaction to message with id: ${context.activity.id}`;
            await context.sendActivity(MessageFactory.text(message));
            await next();
        });

        this.onReactionsRemoved(async (context, next) => {
            const reactions = context.activity.reactionsRemoved;
            if (!reactions) {
                return;
            }

            const message = `You've removed a \r\n` +  
            `# *_${reactions[0].type.toUpperCase()}_* \r\n` +
            `reaction from message with id: ${context.activity.id}`;
            await context.sendActivity(MessageFactory.text(message));
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            if (!membersAdded) {
                return;
            }
            const welcomeText = `New user just joined our team!!!
                                Hello and welcome to TechTalk Special Edition!`;
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText));
                }
            }

            // Call the next continuation function from each handler to allow processing to continue. 
            // If next is not called, processing of the activity ends.
            await next();
        });

        this.onMembersRemoved(async (context, next) => {
            const membersRemoved = context.activity.membersRemoved;
            if (!membersRemoved) {
                return;
            }
            
            const farewellMessage = `User left our team :-(`;
                                
            for (const member of membersRemoved) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(farewellMessage));
                }
            }

            // Call the next continuation function from each handler to allow processing to continue. 
            // If next is not called, processing of the activity ends.
            await next();
        });
    }
}