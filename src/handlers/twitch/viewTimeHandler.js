import { usersDB } from "../../config/initializers.js";
import { twitchApi } from "../../config/initializers.js";
import { writeToLogFile } from "../../utilities/logging.js";
import { cache } from "../../config/initializers.js";
import NodeCache from "node-cache";
import { environment } from "../../config/environmentVars.js";


export const knownBots = new NodeCache();

export async function addBotsToKnownBots() {
    knownBots.set('671284746', {
        id: '671284746',
        username: 'thedadb0t',
        display_name: 'TheDadB0t',
    });
    knownBots.set('64431397', {
        id: '671284746',
        username: 'dadthegam3r',
        display_name: 'DadTheGam3r',
    });
    knownBots.set('447685927', {
        id: 447685927,
        username: 'playwithviewersbot',
        display_name: 'PlayWithViewersBot',
    });
    knownBots.set('25681094', {
        id: 25681094,
        username: 'commanderroot',
        display_name: 'CommanderRoot',
    })
    knownBots.set('605116711', {
        id: 605116711,
        username: 'lumiastream',
        display_name: 'LumiaStream',
    })
    knownBots.set('451658633', {
        id: 451658633,
        username: 'streamlootsbot',
        display_name: 'StreamlootsBot',
    })
    knownBots.set('196328541', {
        id: 196328541,
        username: 'lumiathingamabot',
        display_name: 'LumiaThingamaBot',
    })
    knownBots.set('406576975', {
        id: 406576975,
        username: 'anotherttvviewer',
        display_name: 'AnotherTTVViewer',
    })
    knownBots.set('191739645', {
        id: 191739645,
        username: '01ella',
        display_name: '01Ella',
    })
    knownBots.set('654447790', {
        id: '654447790',
        username: 'aliceydra',
        display_name: 'aliceydra'
    })
    knownBots.set('43547909', {
        id: '43547909',
        username: 'drapsnatt',
        userDisplayName: 'Drapsnatt'
    })
    knownBots.set('909524085', {
        id: '909524085',
        username: 'morgane2k7',
        display_name: 'Morgane2k7'
    })
    knownBots.set('100135110', {
        id: '100135110',
        username: 'streamelements',
        display_name: 'StreamElements'
    })
    knownBots.set('216527497', {
        id: '216527497',
        username: 'soundalerts',
        display_name: 'SoundAlerts'
    })
}


// Function to get a list of all chatters in a channel that are not bots
export async function getChattersWithoutBots() {
    try {
        const chatters = await twitchApi.getChatters();
        if (environment === 'development') {
            console.log('chatters', chatters);
        }
        const bots = knownBots.keys();
        const chattersWithoutBots = chatters.filter((chatter) => !bots.includes(chatter.userId));
        return chattersWithoutBots;
    }
    catch (err) {
        writeToLogFile('error', `Error in getChattersWithoutBots: ${err}`);
    }
}


// Function to handle chatters
export async function viewTimeHandler() {
    try {
        const live = cache.get('live');
        const mintues = 1;
        if (!live) {
            return;
        };
        const chatters = await getChattersWithoutBots();
        for (const chatter of chatters) {
            const exists = usersDB.isFollower(chatter.userId);
            if (exists) {
                usersDB.increaseViewTime(chatter.userId, mintues);
                usersDB.increaseUserValue(chatter.userId, 'leaderboard_points', 30);
            }
        }
    }
    catch (err) {
        console.log(`Error in viewTimeHandler: ${err}`)
        writeToLogFile('error', `Error in viewTimeHandler: ${err}`);
    }
}