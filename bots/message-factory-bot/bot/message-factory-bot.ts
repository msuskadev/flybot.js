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
                /*case 'Receipt Card': {
                    await context.sendActivity({ attachments: [this.createReceiptCard()] });
                    break;
                }*/                
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
            
            const message = MessageFactory.suggestedActions(['Animation Card', 'Audio Card', 'Hero Card', 'Thumbnail Card', 'Video Card', 'Message Factory Carousel', 'Message Factory List', 'Simple Text'], 'Select option');            
            await context.sendActivity(message);

            // Call the next continuation function from each handler to allow processing to continue. 
            // If next is not called, processing of the activity ends.
            await next();
        });


        this.onMembersAdded(async (context, next) => {
            const message = MessageFactory.suggestedActions(['Animation Card', 'Audio Card', 'Hero Card', 'Thumbnail Card', 'Video Card', 'Message Factory Carousel', 'Message Factory List', 'Simple Text'], 'Select option');            
                await context.sendActivities([ MessageFactory.text('Hello and welcome to Message And Card Factory Bot'), message]);

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
            'Trek Madone SLR9 2021',
            [{ url: 'https://sprint-rowery.pl/media/catalog/product/cache/eecd74defa3b5f8d0d4b60fa62f6a89b/r/o/rower-szosowy-trek-madone-slr9-niebieski-01_1.jpg' }],
            [{
                title: 'Buy now',
                type: 'openUrl',
                value: 'https://www.trekbikes.com/pl/pl_PL/'
            }],
            {
                subtitle: 'AERO BIKE',
                text: `Madone SLR 9 Disc eTap pairs the aerodynamics and ride quality of an all-new 800 Series OCLV Carbon frame with the smoothness of SRAM's most advanced electronic drivetrain, RED eTap AXS. It's the first-ever wireless electronic groupset with a 12-speed cassette. Saddle up for the quickest and smartest shifting of your life.`
            }
        );
    }

    private createVideoCard() {
        return CardFactory.videoCard(
            '2018 Imagine Cup World Championship Intro',
            [{ url: 'https://sec.ch9.ms/ch9/783d/d57287a5-185f-4df9-aa08-fcab699a783d/IC18WorldChampionshipIntro2.mp4' }],
            [{
                type: 'openUrl',
                title: 'Learn More',
                value: 'https://channel9.msdn.com/Events/Imagine-Cup/World-Finals-2018/2018-Imagine-Cup-World-Championship-Intro'
            }],
            {
                subtitle: 'by Microsoft',
                text: 'Microsoft\'s Imagine Cup has empowered student developers around the world to create and innovate on the world stage for the past 16 years. These innovations will shape how we live, work and play.'
            }
        );
    }
}