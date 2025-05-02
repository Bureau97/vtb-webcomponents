import { parse_participant, parse_media, parse_marker, parse_extra_field, parse_element, parse_segment } from './transformer.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import duration from 'dayjs/plugin/duration.js';
import 'dayjs/locale/nl';
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.locale('nl');
const segment = {
    carRentalElements: [],
    content: "<p>Reis je naar het zuiden dan kom je meestal met de nachttrein vanuit Surat Thani. Natuurlijk staat daar een chauffeur klaar om je op te halen; je herkent 'm aan een bordje met je naam erop. Per minibus reis je naar de westkust en ondanks dat je nog wel zo'n drie uur onderweg bent is het zeker geen straf. Langzaam trekt het Thaise leven aan je voorbij. Khao Lak is bij veel reizigers nog niet zo bekend. Het ligt aan de westkust van Thailand en heeft ongerepte stranden en heerlijk rustgevend sfeertje. &nbsp;</p><p>De stranden zijn hier relatief rustig, hier vind je geen bruisende strandtenten en feestende toeristen. Perfect dus voor de reizigers die op zoek zijn naar dat paradijsjes.</p><p>En toch hoef je je hier ook zeker niet te vervelen: maak een lange wandelingen langs het gouden zand of neem een verfrissende duik in het heldere water. De zee is vaak kalm, wat het perfect maakt voor snorkelen en zwemmen. Bezoek James Bond Eiland, waar delen van de film The man with the golden gun zijn gefilmd. Volg een surfles bij de lokale surfschool of ga met een gids op zoek naar apen en tapirs.&nbsp;</p>",
    date: '2025-08-03',
    day: 13,
    droppedIndex: true,
    elements: [
        {
            TSOrderline: {
                extraFieldValues: [],
                locked: 0
            },
            TSProduct: {
                bookableDays: [],
                disabledForPurchase: false,
                id: 859
            },
            additionalText: "<p>De nachttrein naar Surat Thani is een beleving op zich waar de kinderen nog lang over zullen napraten. Want wie slaapt er nou in een trein? En hoe tof is het dat je bankje door een persoonlijke steward ‘s avonds wordt omgetoverd tot stapelbed?! De faciliteiten zijn ‘basic’ maar je hobbelend vanzelf in slaap. 's Morgens word je gewekt door de Thaise variant van 'koffie, thee, gevulde koeken!\" en dan heb je dus nog de hele dag voor je.</p><p><br></p><p>Tip: koop voordat je vertrekt nog even wat te eten en drinken. Op wat perronverkopers na is er niet echt wat te koop onderweg. En een oogmasker kan ook geen kwaad. ;-)</p>",
            arrSuppliers: [],
            bookableDays: [],
            categories: [],
            dataType: 'elementSegment',
            date: '2025-08-03',
            day: 13,
            elements: [],
            endDate: '2025-08-04',
            externalInfo: [],
            flightInfo: [],
            hasPreviousElementParticipantOverlap: true,
            insuranceData: {
                price: null,
                type: null
            },
            insuranceLocked: false,
            itemType: 'element',
            lastRecalc: null,
            linkedParty: 'party 1',
            manual_calc: false,
            maps: {
                enabled: true,
                latitude: 0,
                longitude: 0,
                zoom: 14
            },
            marginLocked: false,
            media: [
                {
                    sourceId: '3ad9ec8c2661b8e6f0eea933a47c22c6',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-nachttrein-Bangkok (1).jpg'
                },
                {
                    sourceId: '837caf8199b1fc6701e66d800daac447',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/nachttrein-Thailand.jpg'
                },
                {
                    sourceId: '385af938a690f4d95daa86c5bbaafad0',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-nachttrein-6c0c55c1.jpg'
                }
            ],
            missingBookableDays: [],
            newElement: true,
            nights: 1,
            not_calculated: true,
            offset: 0,
            olPrices: {
                costPrice: '0.000',
                exchangeRate: '1.000000000',
                margin: '0.00000',
                participants: {
                    '2': {
                        costPrice: null,
                        id: '2',
                        salesPrice: null
                    },
                    '3': {
                        costPrice: null,
                        id: '3',
                        salesPrice: null
                    },
                    '4': {
                        costPrice: null,
                        id: '4',
                        salesPrice: null
                    },
                    '5': {
                        costPrice: null,
                        id: '5',
                        salesPrice: null
                    }
                },
                purchaseCurrency: 'EUR',
                salesTotal: '0.000'
            },
            optional: false,
            orderlineExtrafields: [],
            pastMatrixLineIsUsed: false,
            pricematrixInternalText: null,
            roomTypeMatchesParticipants: true,
            roomTypes: [
                {
                    defaultPrice: null,
                    description: 'Slaaptrein 1e klasse',
                    from: 'Invalid date',
                    internal_info: null,
                    maxPerson: 10,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: null,
                    supplierinfo: null,
                    to: 'Invalid date'
                },
                {
                    defaultPrice: null,
                    description: 'Slaaptrein 2e klasse',
                    from: '2024-11-04',
                    internal_info: null,
                    maxPerson: 10,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: 'unit',
                    supplierinfo: null,
                    to: '2026-11-04'
                }
            ],
            subAdditionalText: null,
            subTitle: 'Slaaptrein 2e klasse',
            supplierId: null,
            supplierName: '',
            title: 'Vervoer Surat Thani - Nachttrein naar Surat Thani',
            typeId: 1,
            unitAmount: 1,
            unitAmountPriceError: false,
            unitId: 2,
            unitName: 'transfer_night ',
            vtbElementId: 'cehotk1yop9iz1o0hs4',
            vtbObjectId: '8x7c2udnzyvia1ba408x6s'
        },
        {
            TSOrderline: {
                extraFieldValues: [],
                locked: 0
            },
            TSProduct: {
                bookableDays: [],
                disabledForPurchase: false,
                id: 1128
            },
            additionalText: '<p>Aan het strand, lekker veel ruimte en grasveld om een balletje te trappen en een heerlijk zwembad. De kamers zijn ruim; van familiekamers tot appartementen met meerdere slaapkamers of eigen zwembad(je). En ook het ontbijtje is dikke prima.</p>',
            arrSuppliers: [],
            bookableDays: [],
            categories: [],
            dataType: 'elementSegment',
            date: '2025-08-04',
            day: 14,
            elements: [],
            endDate: '2025-08-10',
            externalInfo: [],
            flightInfo: [],
            hasPreviousElementParticipantOverlap: true,
            insuranceData: {
                price: null,
                type: null
            },
            insuranceLocked: false,
            itemType: 'element',
            lastRecalc: null,
            linkedParty: 'party 1',
            manual_calc: false,
            maps: {
                enabled: true,
                latitude: 8.612867303786189,
                longitude: 98.2395851612091,
                zoom: 14
            },
            marginLocked: false,
            media: [
                {
                    sourceId: '3b1f441ed86c6b01e992541bdf5ea7c5',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-uitzicht.jpg'
                },
                {
                    sourceId: '8803720a604890f3f90d44756a259198',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-zwembad.jpg'
                },
                {
                    sourceId: '7fca11be796aa2415a7fdb3a09e8b513',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-restaurant.jpg'
                },
                {
                    sourceId: '30b908d6031bfbd69d150371218d5d0a',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-8d17de4b.jpg'
                },
                {
                    sourceId: '768ef69416f9c0a18127554db74e7070',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-strand.jpg'
                },
                {
                    sourceId: '3b1f441ed86c6b01e992541bdf5e9973',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-familiekamer.jpg'
                }
            ],
            missingBookableDays: [],
            newElement: true,
            nights: 6,
            not_calculated: true,
            offset: 1,
            olPrices: {
                costPrice: '0.000',
                exchangeRate: '1.000000000',
                margin: '0.00000',
                participants: {
                    '2': {
                        costPrice: null,
                        id: '2',
                        salesPrice: null
                    },
                    '3': {
                        costPrice: null,
                        id: '3',
                        salesPrice: null
                    },
                    '4': {
                        costPrice: null,
                        id: '4',
                        salesPrice: null
                    },
                    '5': {
                        costPrice: null,
                        id: '5',
                        salesPrice: null
                    }
                },
                purchaseCurrency: 'EUR',
                salesTotal: '0.000'
            },
            optional: false,
            orderlineExtrafields: [],
            pastMatrixLineIsUsed: false,
            pricematrixInternalText: null,
            roomTypeMatchesParticipants: true,
            roomTypes: [
                {
                    defaultPrice: null,
                    description: 'Familiekamer met tuinzicht inclusief ontbijt',
                    from: 'Invalid date',
                    internal_info: null,
                    maxPerson: 4,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: null,
                    supplierinfo: null,
                    to: 'Invalid date'
                }
            ],
            subAdditionalText: null,
            subTitle: 'Familiekamer met tuinzicht inclusief ontbijt',
            supplierId: null,
            supplierName: '',
            title: 'Hotel Khao Lak - The Briza Beach Resort',
            typeId: 1,
            unitAmount: 6,
            unitAmountPriceError: false,
            unitId: 2,
            unitName: 'nights',
            vtbElementId: 'iv2ekdd8ft98491rr5kih',
            vtbObjectId: '2ugbajgai8k04qeydm6o048'
        },
        {
            TSOrderline: {
                extraFieldValues: [],
                locked: 0
            },
            TSProduct: {
                bookableDays: [],
                disabledForPurchase: false,
                id: 1128
            },
            additionalText: '<p>Aan het strand, lekker veel ruimte en grasveld om een balletje te trappen en een heerlijk zwembad. De kamers zijn ruim; van familiekamers tot appartementen met meerdere slaapkamers of eigen zwembad(je). En ook het ontbijtje is dikke prima.</p>',
            arrSuppliers: [],
            bookableDays: [],
            categories: [],
            dataType: 'elementSegment',
            date: '2025-08-04',
            day: 14,
            elements: [],
            endDate: '2025-08-10',
            externalInfo: [],
            flightInfo: [],
            hasPreviousElementParticipantOverlap: true,
            insuranceData: {
                price: null,
                type: null
            },
            insuranceLocked: false,
            isElementUpdated: true,
            itemType: 'element',
            lastRecalc: null,
            linkedParty: 'party 1',
            manual_calc: false,
            maps: {
                enabled: true,
                fieldofview: null,
                heading: null,
                latitude: 8.612867303786189,
                longitude: 98.2395851612091,
                pitch: null,
                zoom: 17
            },
            marginLocked: false,
            media: [
                {
                    sourceId: '3b1f441ed86c6b01e992541bdf5ea7c5',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-uitzicht.jpg'
                },
                {
                    sourceId: '8803720a604890f3f90d44756a259198',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-zwembad.jpg'
                },
                {
                    sourceId: '7fca11be796aa2415a7fdb3a09e8b513',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-restaurant.jpg'
                },
                {
                    sourceId: '30b908d6031bfbd69d150371218d5d0a',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-8d17de4b.jpg'
                },
                {
                    sourceId: '768ef69416f9c0a18127554db74e7070',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-strand.jpg'
                },
                {
                    sourceId: '3b1f441ed86c6b01e992541bdf5e9973',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Khao Lak',
                            name: 'Khao Lak'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Khao-lak-Briza-beach-resort-familiekamer.jpg'
                }
            ],
            missingBookableDays: [],
            newElement: true,
            nights: 6,
            not_calculated: true,
            offset: 1,
            olPrices: {
                costPrice: '0.000',
                exchangeRate: '1.000000000',
                margin: '100.00000',
                participants: {
                    '2': {
                        costPrice: null,
                        id: '2',
                        salesPrice: '16.250'
                    },
                    '3': {
                        costPrice: null,
                        id: '3',
                        salesPrice: '16.250'
                    },
                    '4': {
                        costPrice: null,
                        id: '4',
                        salesPrice: '16.250'
                    },
                    '5': {
                        costPrice: null,
                        id: '5',
                        salesPrice: '16.250'
                    }
                },
                purchaseCurrency: 'EUR',
                salesTotal: '65.000'
            },
            optional: true,
            orderlineExtrafields: [],
            pastMatrixLineIsUsed: false,
            pricematrixInternalText: null,
            roomTypeMatchesParticipants: true,
            roomTypes: [
                {
                    defaultPrice: null,
                    description: 'Familiekamer met tuinzicht inclusief ontbijt',
                    from: 'Invalid date',
                    internal_info: null,
                    maxPerson: 4,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: null,
                    supplierinfo: null,
                    to: 'Invalid date'
                },
                {
                    defaultPrice: null,
                    description: 'Twee deluxe kamers met tuinzicht en tussendeur, inclusief ontbijt',
                    from: '2025-03-20',
                    internal_info: null,
                    maxPerson: 4,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: 'unit',
                    supplierinfo: null,
                    to: '2027-03-20'
                }
            ],
            subAdditionalText: '',
            subTitle: 'Twee deluxe kamers met tuinzicht en tussendeur, inclusief ontbijt',
            supplierId: null,
            supplierInfo: null,
            supplierName: '',
            title: 'Hotel Khao Lak - The Briza Beach Resort',
            typeId: 1,
            unitAmount: 6,
            unitAmountPriceError: false,
            unitId: 2,
            unitName: 'nights',
            vtbElementId: '9mvj08lkcbam45oipo08p',
            vtbObjectId: 'gskk5wbnnyjqa89mwcgltt'
        },
        {
            TSOrderline: {
                extraFieldValues: [],
                id: null,
                liborderId: '901893723693940737',
                locked: 0
            },
            TSProduct: {
                bookableDays: [],
                disabledForPurchase: false,
                id: 129
            },
            additionalText: "<p>Vlakbij de bekende brug over de River Kwai en aan diezelfde rivier gelegen ligt het Royal River Kwai resort. Het is hier heerlijk vertoeven na de drukke dagen die je achter de rug hebt. Neem 's avonds een taxi naar het stadje of eet lekker bij het restaurant aan de rivier. </p>",
            arrSuppliers: [],
            date: '2025-07-29',
            day: 8,
            endDate: '2025-07-31',
            hasPreviousElementParticipantOverlap: true,
            insuranceData: {
                price: null,
                type: null
            },
            insuranceLocked: false,
            internalText: '',
            isElementUpdated: true,
            lastRecalc: null,
            linkedParty: 'party 1',
            manual_calc: false,
            maps: {
                enabled: true,
                fieldofview: null,
                heading: null,
                latitude: 14.056659482401928,
                longitude: 99.45716857910156,
                pitch: null,
                zoom: 16
            },
            marginLocked: false,
            marginType: null,
            marginTypeTotal: null,
            media: [
                {
                    sourceId: '4385a021f3b41b64001353f88796bc4a',
                    sourceType: 'mediaspirit',
                    tags: ['River Kwai', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/River-Kwai-Royal-River-Kwai-resort-schommel.jpeg'
                },
                {
                    sourceId: '181920615834a83abc634e186606ce37',
                    sourceType: 'mediaspirit',
                    tags: ['River Kwai', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/River-Kwai-Royal-River-Kwai-Resort-junior-Suite-542186bd.jpeg'
                },
                {
                    sourceId: '55f36e5c65222ac12bf19a34b4fded90',
                    sourceType: 'mediaspirit',
                    tags: ['River Kwai', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/River-Kwai-Royal-River-Kwai-Resort-junior-Suite-connecting.jpeg'
                },
                {
                    sourceId: '6ccc94c6d823d6745542e833a006a205',
                    sourceType: 'mediaspirit',
                    tags: ['River Kwai', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/River-Kwai-Royal-River-Kwai-Resort-balkon.jpeg'
                },
                {
                    sourceId: 'f504c7a5ce6b1ba5f82ee5afa9875b0d',
                    sourceType: 'mediaspirit',
                    tags: ['River Kwai', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/River-Kwai-Royal-River-Kwai-Resort-zwembad.jpeg'
                },
                {
                    sourceId: '36c942204ee683ac5e4624fd6204d8b6',
                    sourceType: 'mediaspirit',
                    tags: ['River Kwai', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/River-Kwai-Royal-River-Kwai-Resort-suppen.jpeg'
                },
                {
                    sourceId: '8226705e1c2e899b52b269a9f705adaf',
                    sourceType: 'mediaspirit',
                    tags: ['River Kwai', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/River-Kwai-Royal-River-Kwai-Resort-connecting-kamers.jpeg'
                }
            ],
            missingBookableDays: [],
            nights: 6,
            not_calculated: true,
            offset: 1,
            olPrices: {
                costPrice: '0.000',
                exchangeRate: '1.000000000',
                hasError: '',
                margin: '0.00000',
                participants: {
                    '2': {
                        costPrice: null,
                        id: '2',
                        salesPrice: 95
                    },
                    '3': {
                        costPrice: null,
                        id: '3',
                        salesPrice: 95
                    },
                    '4': {
                        costPrice: null,
                        id: '4',
                        salesPrice: 95
                    },
                    '5': {
                        costPrice: null,
                        id: '5',
                        salesPrice: 95
                    }
                },
                purchaseCurrency: 'EUR',
                salesTotal: '380.000'
            },
            optional: true,
            pastMatrixLineIsUsed: false,
            pricematrixInternalText: null,
            roomTypeMatchesParticipants: true,
            roomTypes: [
                {
                    defaultPrice: null,
                    description: '2x Tweepersoonskamer met tussendeur inclusief ontbijt ',
                    from: '2024-10-31',
                    internal_info: null,
                    maxPerson: 4,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: 'unit',
                    supplierinfo: null,
                    to: '2026-10-31'
                },
                {
                    defaultPrice: null,
                    description: 'Tweepersoonskamer inclusief ontbijt',
                    from: 'Invalid date',
                    internal_info: null,
                    maxPerson: 2,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: null,
                    supplierinfo: null,
                    to: 'Invalid date'
                }
            ],
            subAdditionalText: '',
            subTitle: '2x Tweepersoonskamer met tussendeur inclusief ontbijt ',
            supplierId: null,
            supplierInfo: '',
            supplierName: '',
            title: 'Hotel River Kwai - Royal River Kwai resort',
            unitAmount: 6,
            unitAmountPriceError: false,
            unitId: 2,
            vtbElementId: 'yzq0cu18dvls5c5upb1s',
            vtbObjectId: 'l8n0vxi5m5o97yahfiur3b'
        },
        {
            TSOrderline: {
                extraFieldValues: [],
                id: null,
                liborderId: '1022240151947313153',
                locked: 0
            },
            TSProduct: {
                bookableDays: [],
                disabledForPurchase: false,
                id: 914
            },
            additionalText: '<p>Je bent vandaag de hele dag op pad, samen met een gezellige groep andere reizigers en je gids verken je per fiets de buitenwijken rondom Ayutthaya en natuurlijk kom je ook langs de bekende tempelruïnes. </p>',
            arrSuppliers: [],
            date: '2025-08-02',
            day: 15,
            endDate: '2025-08-02',
            insuranceData: {
                price: null,
                type: null
            },
            insuranceLocked: false,
            internalText: '',
            lastRecalc: null,
            linkedParty: 'party 1',
            manual_calc: false,
            maps: {
                enabled: true,
                latitude: 0,
                longitude: 0,
                zoom: 16
            },
            marginLocked: false,
            marginType: null,
            marginTypeTotal: null,
            media: [
                {
                    sourceId: '8ec5e7e60bc135f83073dbdef2269b39',
                    sourceType: 'mediaspirit',
                    tags: [
                        {
                            className: 'tag_white',
                            id: 'Ayutthaya',
                            name: 'Ayutthaya'
                        },
                        {
                            className: 'tag_white',
                            id: 'Thailand',
                            name: 'Thailand'
                        }
                    ],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-tempel.jpg'
                }
            ],
            missingBookableDays: [],
            nights: 0,
            not_calculated: true,
            offset: 1,
            olPrices: {
                costPrice: '0.000',
                exchangeRate: '1.000000000',
                margin: '100.00000',
                participants: {
                    '2': {
                        costPrice: 'NaN',
                        id: '2',
                        salesPrice: '72.500'
                    },
                    '3': {
                        costPrice: 'NaN',
                        id: '3',
                        salesPrice: '72.500'
                    },
                    '4': {
                        costPrice: 'NaN',
                        id: '4',
                        salesPrice: '72.500'
                    },
                    '5': {
                        costPrice: 'NaN',
                        id: '5',
                        salesPrice: '72.500'
                    }
                },
                purchaseCurrency: 'EUR',
                salesTotal: '290.000'
            },
            optional: true,
            pastMatrixLineIsUsed: false,
            pricematrixInternalText: null,
            roomTypeMatchesParticipants: true,
            roomTypes: [
                {
                    defaultPrice: null,
                    description: 'Fietstour Ayutthaya ',
                    from: 'Invalid date',
                    internal_info: null,
                    maxPerson: 10,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: null,
                    supplierinfo: null,
                    to: 'Invalid date'
                }
            ],
            subAdditionalText: '',
            subTitle: 'Fietstour Ayutthaya ',
            supplierId: null,
            supplierInfo: '',
            supplierName: '',
            title: 'Excursie Ayutthaya - Ontdek Ayutthaya op de fiets (Incl. entreekosten en lunch)',
            unitAmount: 1,
            unitAmountPriceError: false,
            unitId: 10,
            vtbElementId: 'varp2s0cwiev2p90aers1l',
            vtbObjectId: 'zqbynyrotagfa8mynhhtd8'
        }
    ],
    elementsMapActive: '8x7c2udnzyvia1ba408x6s|2ugbajgai8k04qeydm6o048|gskk5wbnnyjqa89mwcgltt',
    elementsOrder: '8x7c2udnzyvia1ba408x6s|2ugbajgai8k04qeydm6o048|gskk5wbnnyjqa89mwcgltt',
    endDate: '2025-08-10',
    flightInfo: [],
    hasElementsOverlap: false,
    inViewport: false,
    isFlight: false,
    maps: {
        latitude: 5.741911535857459,
        longitude: 65.4930567741394,
        zoom: 2
    },
    media: [
        {
            cache_data: {
                _attachments: {
                    metadata: {
                        content_type: 'application/json',
                        digest: 'md5-S16f5At0MOAbgYCIPmAMrw==',
                        length: 165,
                        revpos: 2,
                        stub: true
                    }
                },
                _id: 'd9a781ff8e8320968002856143e09f11',
                _rev: '4-59ed4976520956618d9d99b9c557c357',
                fileSize: '69.01 kB',
                focusPoint: {
                    percentageX: 50,
                    percentageY: 50
                },
                height: 1021,
                imagecropresolution: {
                    '0ff51e9d41ff9731d649a816374f005a': 'wordpress/medium/Thailand-khao-Lak-fca3ba5f.avif',
                    '44156d17407666994ec38a1a3337c152': 'wordpress/large/Thailand-khao-Lak-fca3ba5f.avif',
                    '47ed568a3d143dd93f7a88d67a05df4f': 'original/lg/Thailand-khao-Lak-fca3ba5f.avif',
                    '6f8b205c2ded91244409689225477641': 'landscape/lg/Thailand-khao-Lak-fca3ba5f.avif',
                    '794ab62d2a0cc1fcd78c8b3a646f873e': 'wordpress/medium_large/Thailand-khao-Lak-fca3ba5f.avif',
                    '7fdb4d77bfc9cb6a60480e9ffa43fe0c': 'cognitive/recognition/Thailand-khao-Lak-fca3ba5f.jpg',
                    a3fcd7d18e56500db34b084015845a48: 'wordpress/thumbnail/Thailand-khao-Lak-fca3ba5f.avif',
                    a452da021dc8197655556998e103f20e: 'square/md/Thailand-khao-Lak-fca3ba5f.avif',
                    aca6a93402b62429018b6a11689bb612: 'landscape/md/Thailand-khao-Lak-fca3ba5f.avif',
                    aca6a93402b62429018b6a11689da296: 'header/lg/Thailand-khao-Lak-fca3ba5f.avif',
                    b96795adfe4e864c19b3cfe4d96e2cc1: 'vertical/lg/Thailand-khao-Lak-fca3ba5f.avif',
                    b96795adfe4e864c19b3cfe4d9747ce7: 'original/sm/Thailand-khao-Lak-fca3ba5f.avif',
                    ba0996eec00699abc43447cc475757f7: 'original/md/Thailand-khao-Lak-fca3ba5f.avif',
                    db5f213344aaf1cb83eeb3f51925d3f8: 'wordpress/full/Thailand-khao-Lak-fca3ba5f.avif',
                    ed7371c46f0e932c689531846b285194: 'original/original/Thailand-khao-Lak-fca3ba5f.avif'
                },
                lastProcessedFocusPoint: {
                    percentageX: 50,
                    percentageY: 50
                },
                lastProcessedTransformState: {
                    mirror: {
                        horizontal: false,
                        vertical: false
                    },
                    rotation: 0
                },
                name: 'Thailand-khao-Lak.avif',
                nlCleanUrl: '/Thailand-khao-Lak-fca3ba5f.avif',
                process: {
                    cognitive: {
                        pending: '2024-11-29 08:59:22'
                    },
                    crop: {
                        done: '2024-11-29 09:00:02',
                        pending: '2024-11-29 08:59:22'
                    },
                    upload: {
                        done: '2024-11-29 08:59:22',
                        pending: '2024-11-29 08:59:22'
                    }
                },
                tags: [
                    {
                        className: 'tag_white',
                        id: 'Khao Lak',
                        name: 'Khao Lak'
                    },
                    {
                        className: 'tag_white',
                        id: 'Thailand',
                        name: 'Thailand'
                    }
                ],
                transformState: {
                    mirror: {
                        horizontal: false,
                        vertical: false
                    },
                    rotation: 0
                },
                type: 'image',
                uploadedAt: '2024-11-29 08:59:22',
                width: 1531
            },
            sourceId: 'd9a781ff8e8320968002856143e09f11',
            sourceType: 'mediaspirit',
            tags: [
                {
                    className: 'tag_white',
                    id: 'Khao Lak',
                    name: 'Khao Lak'
                },
                {
                    className: 'tag_white',
                    id: 'Thailand',
                    name: 'Thailand'
                }
            ],
            url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-khao-Lak-fca3ba5f.avif'
        }
    ],
    missingBookableDays: false,
    nights: 7,
    pageBreak: false,
    subTitle: 'Verblijf in Khao Lak',
    title: 'Verborgen paradijs aan de westkust',
    typeId: 1,
    typeName: 'Default',
    vtbObjectId: '93otyvvlz878xntjv6yqb8',
    vtbSegmentId: 'nfi8y4odlla94x4ynn88p'
};
describe('transformer', () => {
    test('parse_participant', () => {
        const participant = {
            age_calc_type: 'Adult',
            birthdate: null,
            id: '2',
            name: 'Anton',
            partyName: 'party 1',
            passport_firstname: null,
            passport_surname: null,
            sex: null,
            surname: 'Tester',
            surname_prefix: 'de',
            title: 'Dhr.'
        };
        const _participant = parse_participant(participant);
        expect(_participant).toEqual({
            id: 2,
            title: 'Dhr.',
            name: 'Anton',
            prefix: 'de',
            surname: 'Tester',
            calc_type: 'Adult',
            birthdate: undefined
        });
        // expect(_participant.age).toBe(20);
    });
    test('parse_media', () => {
        const media = {
            cache_data: {
                _attachments: {
                    metadata: {
                        content_type: 'application/json',
                        digest: 'md5-50csyIx+LgrVogUVhe4Lvw==',
                        length: 192,
                        revpos: 2,
                        stub: true
                    }
                },
                _id: '385af938a690f4d95daa86c5bbaa5a1f',
                _rev: '5-f60e5fb1c26ef05b6d7093b0f9988618',
                fileSize: '24.07 MB',
                focusPoint: {
                    percentageX: 50,
                    percentageY: 50
                },
                height: 3840,
                imagecropresolution: {
                    '0ff51e9d41ff9731d649a816374f005a': 'wordpress/medium/Thailand-River-Kwai-trein.jpg',
                    '44156d17407666994ec38a1a3337c152': 'wordpress/large/Thailand-River-Kwai-trein.jpg',
                    '47ed568a3d143dd93f7a88d67a05df4f': 'original/lg/Thailand-River-Kwai-trein.jpg',
                    '6f8b205c2ded91244409689225477641': 'landscape/lg/Thailand-River-Kwai-trein.jpg',
                    '794ab62d2a0cc1fcd78c8b3a646f873e': 'wordpress/medium_large/Thailand-River-Kwai-trein.jpg',
                    '7fdb4d77bfc9cb6a60480e9ffa43fe0c': 'cognitive/recognition/Thailand-River-Kwai-trein.jpg',
                    a3fcd7d18e56500db34b084015845a48: 'wordpress/thumbnail/Thailand-River-Kwai-trein.jpg',
                    a452da021dc8197655556998e103f20e: 'square/md/Thailand-River-Kwai-trein.jpg',
                    aca6a93402b62429018b6a11689bb612: 'landscape/md/Thailand-River-Kwai-trein.jpg',
                    aca6a93402b62429018b6a11689da296: 'header/lg/Thailand-River-Kwai-trein.jpg',
                    b96795adfe4e864c19b3cfe4d96e2cc1: 'vertical/lg/Thailand-River-Kwai-trein.jpg',
                    b96795adfe4e864c19b3cfe4d9747ce7: 'original/sm/Thailand-River-Kwai-trein.jpg',
                    ba0996eec00699abc43447cc475757f7: 'original/md/Thailand-River-Kwai-trein.jpg',
                    db5f213344aaf1cb83eeb3f51925d3f8: 'wordpress/full/Thailand-River-Kwai-trein.jpg',
                    ed7371c46f0e932c689531846b285194: 'original/original/Thailand-River-Kwai-trein.jpg'
                },
                lastProcessedFocusPoint: {
                    percentageX: 50,
                    percentageY: 50
                },
                lastProcessedTransformState: {
                    mirror: {
                        horizontal: false,
                        vertical: false
                    },
                    rotation: 0
                },
                name: 'Thailand-River-Kwai-trein.jpg',
                nlCleanUrl: '/Thailand-River-Kwai-trein.jpg',
                process: {
                    cognitive: {
                        done: '2024-11-04 09:02:37',
                        pending: '2024-11-04 09:02:25'
                    },
                    crop: {
                        done: '2024-11-04 09:02:35',
                        pending: '2024-11-04 09:02:25'
                    },
                    upload: {
                        done: '2024-11-04 09:02:25',
                        pending: '2024-11-04 09:02:25'
                    }
                },
                recognition: [
                    {
                        images: [
                            {
                                classifiers: [
                                    {
                                        classes: [
                                            {
                                                class: 'Nature',
                                                score: 0.999972
                                            },
                                            {
                                                class: 'Outdoors',
                                                score: 0.999972
                                            },
                                            {
                                                class: 'Scenery',
                                                score: 0.999972
                                            },
                                            {
                                                class: 'Railway',
                                                score: 0.948983
                                            },
                                            {
                                                class: 'Train',
                                                score: 0.948983
                                            },
                                            {
                                                class: 'Vehicle',
                                                score: 0.948983
                                            },
                                            {
                                                class: 'Vegetation',
                                                score: 0.939042
                                            },
                                            {
                                                class: 'Water',
                                                score: 0.807281
                                            },
                                            {
                                                class: 'Tree',
                                                score: 0.765082
                                            },
                                            {
                                                class: 'Car',
                                                score: 0.761169
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                tags: [
                    {
                        className: 'tag_white',
                        id: 'River Kwai',
                        name: 'River Kwai'
                    },
                    {
                        className: 'tag_white',
                        id: 'Thailand',
                        name: 'Thailand'
                    }
                ],
                transformState: {
                    mirror: {
                        horizontal: false,
                        vertical: false
                    },
                    rotation: 0
                },
                type: 'image',
                uploadedAt: '2024-11-04 09:02:25',
                width: 5760
            },
            sourceId: '385af938a690f4d95daa86c5bbaa5a1f',
            sourceType: 'mediaspirit',
            tags: [
                {
                    className: 'tag_white',
                    id: 'River Kwai',
                    name: 'River Kwai'
                },
                {
                    className: 'tag_white',
                    id: 'Thailand',
                    name: 'Thailand'
                }
            ],
            url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-River-Kwai-trein.jpg'
        };
        const _media = parse_media(media);
        expect(_media).toEqual({
            src: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-River-Kwai-trein.jpg',
            id: '385af938a690f4d95daa86c5bbaa5a1f',
            tags: ['River Kwai', 'Thailand']
        });
    });
    test('parse_media_alt', () => {
        const media = {
            sourceId: '4385a021f3b41b64001353f88796bc4a',
            sourceType: 'mediaspirit',
            tags: ['River Kwai', 'Thailand'],
            url: 'https://media.reismetkinderen.nl/wordpress/large/River-Kwai-Royal-River-Kwai-resort-schommel.jpeg'
        };
        const _media = parse_media(media);
        expect(_media).toEqual({
            src: 'https://media.reismetkinderen.nl/wordpress/large/River-Kwai-Royal-River-Kwai-resort-schommel.jpeg',
            id: '4385a021f3b41b64001353f88796bc4a',
            tags: ['River Kwai', 'Thailand']
        });
    });
    test('parse_extra_field', () => {
        const field = {
            connectionType: 'vtb',
            displayAtTemplate: true,
            displayAtVtb: true,
            id: 1,
            layout: null,
            name: 'reisagent',
            oldValues: [],
            parent_id: 1,
            sortOrder: 1,
            translatedName: 'Dit ben ik',
            type: 'TextAreaEditor',
            value: '<p>Hoi! Ik ben Anton!</p>',
            vtbObjectId: 'vpzyfi0qvhnv737dhp5ca8'
        };
        const _field = parse_extra_field(field);
        expect(_field).toEqual({
            id: 'vpzyfi0qvhnv737dhp5ca8',
            name: 'reisagent',
            title: 'Dit ben ik',
            value: '<p>Hoi! Ik ben Anton!</p>',
            type: 'TextAreaEditor'
        });
    });
    test('parse_marker', () => {
        const marker = {
            enabled: true,
            fieldofview: null,
            heading: null,
            latitude: 13.762833057187954,
            longitude: 100.4994535446167,
            pitch: null,
            zoom: 16
        };
        const _marker = parse_marker(marker, 'Title');
        expect(_marker).toEqual({
            title: 'Title',
            content: '',
            lat: 13.762833057187954,
            lng: 100.4994535446167,
            zoom: 16
        });
    });
    // test('parse_element_unit', () => {
    //   const unit = {
    //     id: 'vpzyfi0qvhnv737dhp5ca8',
    //     name: 'reisagent',
    //     title: 'Dit ben ik',
    //     value: '<p>Hoi! Ik ben Anton!</p>',
    //     type: 'TextAreaEditor'
    //   };
    //   const _unit = parse_element_unit(unit);
    //   expect(_unit).toEqual({
    //     id: 'vpzyfi0qvhnv737dhp5ca8',
    //     name: 'reisagent',
    //     title: 'Dit ben ik',
    //     value: '<p>Hoi! Ik ben Anton!</p>',
    //     type: 'TextAreaEditor'
    //   });
    // });
    test('parse_element', () => {
        const element = {
            TSOrderline: {
                extraFieldValues: [],
                id: null,
                liborderId: '899341774278098945',
                locked: 0
            },
            TSProduct: {
                bookableDays: [],
                disabledForPurchase: false,
                id: 123
            },
            additionalText: '<p>this is some additional text</p>',
            arrSuppliers: [],
            date: '2025-07-25',
            day: 4,
            endDate: '2025-07-29',
            hasPreviousElementParticipantOverlap: true,
            insuranceData: {
                price: null,
                type: null
            },
            insuranceLocked: false,
            isElementUpdated: true,
            lastRecalc: null,
            linkedParty: 'party 1',
            manual_calc: false,
            maps: {
                enabled: true,
                fieldofview: null,
                heading: null,
                latitude: 13.762833057187954,
                longitude: 100.4994535446167,
                pitch: null,
                zoom: 16
            },
            marginLocked: false,
            marginType: null,
            marginTypeTotal: null,
            media: [
                {
                    sourceId: '1f5374599194dd9e50f2c8f09a05876c',
                    sourceType: 'mediaspirit',
                    tags: ['Bangkok', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Bangkok-Nouvo_city-Rooftoppool.jpg'
                },
                {
                    sourceId: '55f36e5c65222ac12bf19a34b4fa713d',
                    sourceType: 'mediaspirit',
                    tags: ['Bangkok', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Bangkok-Nouvo_city-rooftoppool-bar.JPG'
                },
                {
                    sourceId: '1f5374599194dd9e50f2c8f09a058086',
                    sourceType: 'mediaspirit',
                    tags: ['Bangkok', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Bangkok-Nouvo_city-Lobby.jpg'
                },
                {
                    sourceId: 'f504c7a5ce6b1ba5f82ee5afa9853319',
                    sourceType: 'mediaspirit',
                    tags: ['Bangkok', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Bangkok-Nouvo_city-Grand-Deluxe-room.jpg'
                },
                {
                    sourceId: '1f5374599194dd9e50f2c8f09a05758c',
                    sourceType: 'mediaspirit',
                    tags: ['Bangkok', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Bangkok-Nouvo_city-Speelhoekje.jpg'
                },
                {
                    sourceId: '1f5374599194dd9e50f2c8f09a059f2a',
                    sourceType: 'mediaspirit',
                    tags: ['Bangkok', 'Thailand'],
                    url: 'https://media.reismetkinderen.nl/wordpress/large/Thailand-Bangkok-Nouvo_city-Restaurant.jpg'
                }
            ],
            missingBookableDays: [],
            nights: 4,
            not_calculated: true,
            offset: 0,
            olPrices: {
                costPrice: '0.000',
                exchangeRate: '1.000000000',
                margin: '0.00000',
                participants: {
                    '2': {
                        costPrice: null,
                        id: '2',
                        salesPrice: null
                    },
                    '3': {
                        costPrice: null,
                        id: '3',
                        salesPrice: null
                    },
                    '4': {
                        costPrice: null,
                        id: '4',
                        salesPrice: null
                    },
                    '5': {
                        costPrice: null,
                        id: '5',
                        salesPrice: null
                    }
                },
                purchaseCurrency: 'EUR',
                salesTotal: '0.000'
            },
            optional: false,
            pastMatrixLineIsUsed: false,
            pricematrixInternalText: null,
            roomTypeMatchesParticipants: true,
            roomTypes: [
                {
                    defaultPrice: null,
                    description: '2x tweepersoonskamer met tussendeur inclusief ontbijt',
                    from: '2024-11-04',
                    internal_info: null,
                    maxPerson: 4,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: 'unit',
                    supplierinfo: null,
                    to: '2026-11-04'
                },
                {
                    defaultPrice: null,
                    description: 'Familiekamer inclusief ontbijt',
                    from: 'Invalid date',
                    internal_info: null,
                    maxPerson: 4,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: null,
                    supplierinfo: null,
                    to: 'Invalid date'
                },
                {
                    defaultPrice: null,
                    description: 'Tweepersoonskamer inclusief ontbijt',
                    from: '2024-10-31',
                    internal_info: null,
                    maxPerson: 2,
                    maxUnit: null,
                    minPerson: 1,
                    minUnit: null,
                    note: '',
                    per: 'unit',
                    supplierinfo: null,
                    to: '2026-10-31'
                }
            ],
            subAdditionalText: '',
            subTitle: '2x tweepersoonskamer met tussendeur inclusief ontbijt',
            supplierId: null,
            supplierInfo: null,
            supplierName: '',
            title: 'Hotel Bangkok - Nouvo City hotel',
            unitAmount: 4,
            unitAmountPriceError: false,
            unitId: 2,
            vtbElementId: 'v966cgponaobov60iam3',
            vtbObjectId: '74oq98k8qwij7cnzihabxf'
        };
        const _element = parse_element(element, 'Segment title');
        expect(_element.day).toBe(4);
        expect(_element.title).toBe('Hotel Bangkok - Nouvo City hotel');
        expect(_element.subtitle).toBe('2x tweepersoonskamer met tussendeur inclusief ontbijt');
        expect(_element.price).toEqual(0.0);
        expect(_element.location).toEqual({
            title: 'Hotel Bangkok - Nouvo City hotel',
            content: '',
            lat: 13.762833057187954,
            lng: 100.4994535446167,
            zoom: 16
        });
        expect(_element.optional).toBe(false);
        expect(_element.days).toBe(5);
        expect(_element.nights).toBe(4);
        const _unit = _element.units[0];
        expect(_unit.title).toBe('2x tweepersoonskamer met tussendeur inclusief ontbijt');
        expect(_unit.optional).toBe(false);
    });
    test('parse_segment', () => {
        const element_group = parse_segment(segment);
        expect(element_group.title).toBe('Verborgen paradijs aan de westkust');
        expect(element_group.subtitle).toBe('Verblijf in Khao Lak');
        expect(element_group.elements).toHaveLength(4); // er zitten 5! elementen in de groep
    });
    test('filter_elements', () => {
        const element_group = parse_segment(segment);
        expect(element_group.elements).toHaveLength(4);
        expect(element_group.filter_elements({})).toHaveLength(4);
        // filter all acco elements
        const _acco_elements = element_group.filter_elements({
            element_unit_ids: [2]
        });
        // there should be 3
        expect(_acco_elements).toHaveLength(3);
        // there is a train (which has no optional units)
        expect(_acco_elements[0].ts_product_id).toBe(859);
        expect(_acco_elements[0].optional).toBe(false);
        expect(_acco_elements[0].price).toBe(0);
        expect(_acco_elements[0].price_diff).toBe(0);
        // and an accommodation (hotel)
        // which has an optional and a non-optional unit
        expect(_acco_elements[1].ts_product_id).toBe(1128);
        expect(_acco_elements[1].optional).toBe(false);
        expect(_acco_elements[1].price).toBe(0);
        // TODO: check if this is going to be a problem
        // when there is no specification for optional or
        // non-optional units
        expect(_acco_elements[1].price_diff).toBe(65);
        // and an accommidation (hotel)
        // which has a optional unit
        expect(_acco_elements[2].ts_product_id).toBe(129);
        expect(_acco_elements[2].price).toBe(0);
        expect(_acco_elements[2].price_diff).toBe(380);
        expect(_acco_elements[2].optional).toBe(true);
        // filtering non-optional elements
        const _non_optional_acco_elements = element_group.filter_elements({
            element_unit_ids: [2],
            optional: false
        });
        // should give two elements (train and hotel)
        expect(_non_optional_acco_elements).toHaveLength(2);
        expect(_non_optional_acco_elements[0].ts_product_id).toBe(859);
        expect(_non_optional_acco_elements[0].price).toBe(0);
        expect(_non_optional_acco_elements[0].optional).toBe(false);
        expect(_non_optional_acco_elements[1].ts_product_id).toBe(1128);
        expect(_non_optional_acco_elements[1].price).toBe(0);
        expect(_non_optional_acco_elements[1].optional).toBe(false);
        // filtering opional elements
        const _optional_acco_elements = element_group.filter_elements({
            element_unit_ids: [2],
            optional: true
        });
        // should give 2 elements (the hotels)
        expect(_optional_acco_elements).toHaveLength(2);
        expect(_optional_acco_elements[0].ts_product_id).toBe(1128);
        expect(_optional_acco_elements[0].price).toBe(0);
        expect(_optional_acco_elements[0].price_diff).toBe(65);
        expect(_optional_acco_elements[0].optional).toBe(true);
        expect(_optional_acco_elements[1].ts_product_id).toBe(129);
        expect(_optional_acco_elements[1].price).toBe(0);
        expect(_optional_acco_elements[1].price_diff).toBe(380);
        expect(_optional_acco_elements[1].optional).toBe(true);
        // test acco elements for participants
        // not filtering on optional or non-optional elements
        console.info('#### PARTICIPANTS TESTS ####');
        const _participant_elements = element_group.filter_elements({
            element_unit_ids: [2],
            participant_ids: [2, 3]
        });
        expect(_participant_elements).toHaveLength(3);
        // non optional element
        expect(_participant_elements[0].ts_product_id).toBe(859);
        expect(_participant_elements[0].optional).toBe(false);
        expect(_participant_elements[0].price).toBe(0);
        expect(_participant_elements[0].price_diff).toBe(0);
        // element with non optional and optional unit
        expect(_participant_elements[1].ts_product_id).toBe(1128);
        expect(_participant_elements[1].optional).toBe(false);
        expect(_participant_elements[1].price).toBe(0);
        expect(_participant_elements[1].price_diff).toBe(32.5);
        // optional element
        expect(_participant_elements[2].ts_product_id).toBe(129);
        expect(_participant_elements[2].optional).toBe(true);
        expect(_participant_elements[2].price).toBe(0);
        expect(_participant_elements[2].price_diff).toBe(190);
        console.info('#### END PARTICIPANTS TESTS ####');
        // test for activity elements
        // filter all elements with unit id 10,
        // wheter optional or non-optional
        const _activity_elements = element_group.filter_elements({
            element_unit_ids: [10]
        });
        // there should be 1 element
        expect(_activity_elements).toHaveLength(1);
        // filter elements that are not optional
        const _non_optional_activity_elements = element_group.filter_elements({
            element_unit_ids: [10],
            optional: false
        });
        // this shoudl be 0
        expect(_non_optional_activity_elements).toHaveLength(0);
        // filter elements that are optional
        const _optional_activity_elements = element_group.filter_elements({
            element_unit_ids: [10],
            optional: true
        });
        // this should be 1
        expect(_optional_activity_elements).toHaveLength(1);
        //
        const _activity_element = _activity_elements[0];
        // console.info(_activity_element);
        expect(_activity_element.title).toBe('Excursie Ayutthaya - Ontdek Ayutthaya op de fiets (Incl. entreekosten en lunch)');
        expect(_activity_element.price).toBe(290);
        expect(_activity_element.price_diff).toBe(0);
        expect(_activity_element.optional).toBe(true);
        const _activities_for_participant_4 = element_group.filter_elements({
            element_unit_ids: [10],
            participant_ids: [4]
        });
        expect(_activities_for_participant_4).toHaveLength(1);
        expect(_activities_for_participant_4[0].price).toBe(72.5);
        const _activities_for_participant_45 = element_group.filter_elements({
            element_unit_ids: [10],
            participant_ids: [4, 5]
        });
        expect(_activities_for_participant_45).toHaveLength(1);
        expect(_activities_for_participant_45[0].price).toBe(72.5 * 2);
    });
});
//# sourceMappingURL=transformer.test.js.map