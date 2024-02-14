import logger from '../../utilities/logger.js';
import { chatClient, twitchApi } from '../../config/initializers.js';


let players = [];


export async function slapHandler(slapperUserId, slapperDisplayName, slappedDisplayName) {
    // Make sure the slapper has not already been slapped by the same person
    const alreadySlapped = players.find(player => player.slapperUserId === slapperUserId && player.slappedDisplayName === slappedDisplayName);
    if (alreadySlapped) {
        return `@${slapperDisplayName} stop slapping @${slappedDisplayName}. They have already taken a beating from you!`;
    }
    if (slapperDisplayName === slappedDisplayName) {
        return `@${slapperDisplayName} stop hitting yourself`;
    }
    if (slappedDisplayName === 'DadTheGam3r' || slappedDisplayName === 'TheDadb0t') {
        return `@${slapperDisplayName} slap someone who can slap back!`;
    }
    // Get the user data for the slapped user. Convert the username to lowercase to match the API response
    const slappedUserData = await twitchApi.getUserDataByUserName(slappedDisplayName.toLowerCase());
    console.log(slappedUserData);
    const slappedUserId = slappedUserData.id;
    players.push(
        {
            slapperUserId: slapperUserId,
            slapperDisplayName: slapperDisplayName,
            slappedUserId: slappedUserId,
            slappedDisplayName: slappedDisplayName
        }
    )
    chatClient.say(`@${slapperDisplayName} slapped @${slappedDisplayName}. You have 10 seconds to block the slap with !block`);
    setTimeout(() => {
        // See if the slapped user is in the players array
        const player = players.find(player => player.slappedUserId === slappedUserId);
        if (player) {
            players = players.filter(player => player.slappedUserId !== slappedUserId);
            chatClient.say(`@${slappedDisplayName} was slapped by @${slapperDisplayName} and did not block it!`);
        } else {
            return;
        }
    }, 10000);
}

export async function blockHandler(blockerUserId, blockerDisplayName) {
    const player = players.find(player => player.slappedUserId === blockerUserId);
    if (player) {
        // Check if the slapped player is being slapped by multiple people
        const multipleSlappers = players.filter(player => player.slappedUserId === blockerUserId);
        if (multipleSlappers.length > 1) {
            chatClient.say(`@${blockerDisplayName} blocked all the slaps!`);
            players = players.filter(player => player.slappedUserId !== blockerUserId);
        } else {
            // Get the person who slapped the blocker
            const slapper = players.find(player => player.slappedUserId === blockerUserId);
            chatClient.say(`@${blockerDisplayName} blocked the slap from @${slapper.slapperDisplayName}!`);
            players = players.filter(player => player.slappedUserId !== blockerUserId);
        }
    } else {
        return;
    }
}