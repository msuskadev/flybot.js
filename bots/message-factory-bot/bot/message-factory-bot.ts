import { ActivityHandler, CardFactory, MessageFactory, AttachmentLayoutTypes } from 'botbuilder';

export class MessageFactoryBot extends ActivityHandler {
    constructor() {
        super();
        
        this.onMessage(async (context, next) => {
            switch (context.activity.text) {
                case 'Animation Card': {
                    await context.sendActivity({ attachments: [this.createAnimationCard()] });
                    break;
                }
                case 'Audio Card': {
                    await context.sendActivity({ attachments: [this.createAudioCard()] });
                    break;
                }
                case 'Hero Card': {
                    await context.sendActivity({ attachments: [this.createHeroCard()] });
                    break;
                }
                case 'Receipt Card': {
                    await context.sendActivity({ attachments: [this.createReceiptCard()] });
                    break;
                }                
                case 'Thumbnail Card': {
                    await context.sendActivity({ attachments: [this.createThumbnailCard()] });
                    break;
                }
                case 'Video Card': {
                    await context.sendActivity({ attachments: [this.createVideoCard()] });
                    break;
                }
                case 'Message Factory Carousel': {                
                    const carousel = MessageFactory.carousel(this.prepareHeroCards());
                    await context.sendActivity(carousel);
                    break;
                }
                case 'Message Factory List': {                
                    const carousel = MessageFactory.list(this.prepareHeroCards());
                    await context.sendActivity(carousel);
                    break;
                }
                case 'Simple Text': {                
                    const message = `# This is simple text with **MARKDOWN** formatting.`;
                    await context.sendActivity(MessageFactory.text(message));
                    break;
                }
            }
            
            const message = MessageFactory.suggestedActions(['Animation Card', 'Audio Card', 'Hero Card', 'Receipt Card', 'Thumbnail Card', 'Video Card', 'Message Factory Carousel', 'Message Factory List', 'Simple Text'], 'Select option');            
            await context.sendActivity(message);

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

    private prepareHeroCards() {
        return [CardFactory.heroCard(
            `Trek Madone SLR9 2021`,
            CardFactory.images(['https://sprint-rowery.pl/media/catalog/product/cache/eecd74defa3b5f8d0d4b60fa62f6a89b/r/o/rower-szosowy-trek-madone-slr9-niebieski-01_1.jpg']),
            CardFactory.actions([
                {
                    title: 'Buy now',
                    type: 'openUrl',
                    value: 'https://www.trekbikes.com/pl/pl_PL/'
                }
            ])
        ), 
        CardFactory.heroCard(
            `Canyon Ultimate CF SLX Disc 9.0 ETAP`,
            CardFactory.images(['https://media-cdn.canyon.com/dw/image/v2/BCML_PRD/on/demandware.static/-/Sites-canyon-master/default/dw5f1a6a3e/images/full/full_2020_/2020/full_2020_ultimate-cf-slx-disc-9-0-etab_2413_bu-bk_P5.png?sw=486&sh=273&sm=fit&sfrm=png']),
            CardFactory.actions([
                {
                    title: 'Buy now',
                    type: 'openUrl',
                    value: 'https://www.canyon.com/pl-pl'
                }
            ])),
            CardFactory.heroCard(
                `Giant Propel Advanced Pro 0 Disc`,
                CardFactory.images(['https://images.giant-bicycles.com/b_white,c_pad,h_400,q_60,w_600/widrj5xtxawg2mn5upoe/MY21PropelADPRO0D_ColorAChrysocolla.jpg']),
                CardFactory.actions([
                    {
                        title: 'Buy now',
                        type: 'openUrl',
                        value: 'https://www.giant-bicycles.com/pl'
                    }
                ])),
                CardFactory.heroCard(
                    `BMC Roadmachine 01 DISC`,
                    CardFactory.images(['https://zdjecia.bikeworld.pl/produkty/medium/rowery_szosowe_bmc_roadmachine_01_one_7316b.jpg']),
                    CardFactory.actions([
                        {
                            title: 'Buy now',
                            type: 'openUrl',
                            value: 'https://bmc-switzerland.pl/'
                        }
                    ])),
                    CardFactory.heroCard(
                        `Rondo HVRT CF0`,
                        CardFactory.images(['http://rondo.cc/images/glowne/203-2068.jpg']),
                        CardFactory.actions([
                            {
                                title: 'Buy now',
                                type: 'openUrl',
                                value: 'http://rondo.cc/hvrt-cf0,203,pl'
                            }
                        ]))
        ];
    }    

    private createAnimationCard() {
        return CardFactory.animationCard(
            'Animation Card Example',
            [
                { url: 'https://media.giphy.com/media/l41lYNASsqlUOt9Xq/giphy.gif' }
            ],
            [],
            {
                subtitle: 'Subtitle of the card'
            }
        );
    }

    private createAudioCard() {
        return CardFactory.audioCard(
            'Fuel - Song',
            ['https://upload.wikimedia.org/wikipedia/en/7/78/Metallica_-_Fuel.ogg'],
            CardFactory.actions([
                {
                    title: 'Read more',
                    type: 'openUrl',
                    value: 'https://en.wikipedia.org/wiki/Fuel_(song)'
                },                
                {
                    title: 'Open Spotify',
                    type: 'openApp',
                    value: 'spotify'
                },
            ]),
            {                
                subtitle: 'Album: Reload',
                text: '**"Fuel"** is a song by American heavy metal band **Metallica**. The song was written by James Hetfield, Lars Ulrich, and Kirk Hammett, and was released as the third single from their seventh album, Reload. The song was nominated for a Grammy Award for Best Hard Rock Performance in 1999 but lost to Jimmy Page and Robert Plant for the song "Most High".'
            }
        );
    }

    private createHeroCard() {
        return CardFactory.heroCard(
            `Trek Madone SLR9 2021`,
            CardFactory.images(['https://sprint-rowery.pl/media/catalog/product/cache/eecd74defa3b5f8d0d4b60fa62f6a89b/r/o/rower-szosowy-trek-madone-slr9-niebieski-01_1.jpg']),
            CardFactory.actions([
                {
                    title: 'Buy now',
                    type: 'openUrl',
                    value: 'https://www.trekbikes.com/pl/pl_PL/'
                }
            ])
        )
    }

    private createReceiptCard() {
        return CardFactory.receiptCard({
            buttons: CardFactory.actions([
                {
                    title: 'More information',
                    type: 'openUrl',
                    value: 'https://azure.microsoft.com/en-us/pricing/details/bot-service/'
                }
            ]),
            facts: [
                {
                    key: 'Order Number',
                    value: '1234'
                },
                {
                    key: 'Payment Method',
                    value: 'VISA 5555-****'
                }
            ],
            items: [
                {
                    image: { url: 'https://github.com/amido/azure-vector-icons/raw/master/renders/traffic-manager.png' },
                    price: '$38.45',
                    quantity: '368',
                    subtitle: '',
                    tap: { text: '', title: '', type: '', value: '' },
                    text: '',
                    title: 'Data Transfer'
                },
                {
                    image: { url: 'https://github.com/amido/azure-vector-icons/raw/master/renders/cloud-service.png' },
                    price: '$45.00',
                    quantity: '720',
                    subtitle: '',
                    tap: { text: '', title: '', type: '', value: '' },
                    text: '',
                    title: 'App Service'
                }
            ],
            tap: { text: '', title: '', type: '', value: '' },
            tax: '$7.50',
            title: 'John Doe',
            total: '$90.95',
            vat: '$0.02'
        });
    }


    private createThumbnailCard() {
        return CardFactory.thumbnailCard(
            'BotFramework Thumbnail Card',
            [{ url: 'https://sec.ch9.ms/ch9/7ff5/e07cfef0-aa3b-40bb-9baa-7c9ef8ff7ff5/buildreactionbotframework_960.jpg' }],
            [{
                title: 'Get started',
                type: 'openUrl',
                value: 'https://docs.microsoft.com/en-us/azure/bot-service/'
            }],
            {
                subtitle: 'Your bots — wherever your users are talking.',
                text: 'Build and connect intelligent bots to interact with your users naturally wherever they are, from text/sms to Skype, Slack, Office 365 mail and other popular services.'
            }
        );
    }

    private createVideoCard() {
        return CardFactory.videoCard(
            'Downhill mountain biking',
            [{ url: 'https://vod-progressive.akamaized.net/exp=1600734906~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F3671%2F17%2F443359663%2F1941961370.mp4~hmac=af8da16e927f2c8cb9f0e68a65b1ec0d93c078ef97f2ec24ac899a3e5c032a04/vimeo-prod-skyfire-std-us/01/3671/17/443359663/1941961370.mp4?filename=GH010345.mp4' }],
            [{
                title: 'Lean More',
                type: 'openUrl',
                value: 'https://en.wikipedia.org/wiki/Downhill_mountain_biking'
            }],
            {
                subtitle: 'from Wikipedia',
                text: 'Downhill mountain biking (DH) is a genre of mountain biking practiced on steep, rough terrain that often features jumps, drops, rock gardens and other obstacles.'
            }
        );
    }
}