import { spotifyService, commandHandler } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';
import { replyHandler } from './replyHandler.js';
import { formatTrackAndArtistResponse } from '../../services/openAi.js';

// Function to add a song to the queue
export async function addSongToQueue(userId, input, messageID) {
    try {
        const res = await formatTrackAndArtistResponse(input);
        if (!res) {
            return;
        } else if (res.artist && res.track) {
            const track = await spotifyService.searchForTrackWithArtist(res.track, res.artist);
            if (track) {
                const added = await spotifyService.addTrackToQueue(track.uri);
                if (added.statusCode === 204) {
                    // Get the song name and artist name
                    const trackName = track.name;
                    const artistName = track.artists[0].name;
                    replyHandler(`The song ${trackName} by ${artistName} was added to the queue.`, messageID);
                } else {
                    commandHandler.removeUserFromCooldownCache(userId, 'addsong');
                    replyHandler('I could not add that song to the queue.', messageID);
                }
            }
        } else if (res.track) {
            const track = await spotifyService.addTrackToQueue(res.track);
            if (track) {
                const added = await spotifyService.addTrackToQueue(track.uri);
                // If status code is 204, then the song was added to the queue
                if (added.statusCode === 204) {
                    replyHandler('The song was added to the queue.', messageID);
                } else {
                    commandHandler.removeUserFromCooldownCache(userId, 'addsong');
                    replyHandler('I could not add that song to the queue.', messageID);
                }
            }
        } else {
            replyHandler('I could not find that song.', messageID);
        }
    }
    catch (error) {
        logger.error(`Error adding song to queue: ${error}`);
    }
}

// Function to get the currently playing data
export async function getCurrentlyPlayingData(messageID) {
    try {
        const data = await spotifyService.getCurrentlyPlayingData();
        if (data) {
            const track = data.item.name;
            const artist = data.item.artists[0].name;
            replyHandler(`The currently playing song is ${track} by ${artist}.`, messageID);
        } else {
            replyHandler('I could not find the currently playing data.', messageID);
        }
    }
    catch (error) {
        logger.error(`Error getting currently playing data: ${error}`);
    }
}