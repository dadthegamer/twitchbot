import logger from "../../utilities/logger.js";
import { interactionsDB, webSocket, chatClient } from '../../config/initializers.js';


// Function to play a sound
export async function playSoundFromCommand(sound) {
    try {
        const soundData = await interactionsDB.getSound(sound);
        if (soundData.location) {
            webSocket.sound(soundData.location);
            chatClient.say(`Playing sound: ${sound.soundName}`)
        } else {
            logger.error(`Sound not found in soundHandler: ${sound}`);
        }
    } catch (error) {
        logger.error(`Error getting sound in soundHandler: ${error}`);
    }
};

// Function to play a random sound
export async function playRandomSound() {
    try {
        const sounds = await interactionsDB.getAllSounds();
        // Filter out all the sounds with a type of alert or game
        const filteredSounds = sounds.filter(sound => sound.type !== 'alert' && sound.type !== 'game');
        // Get a random sound from the filtered list
        const randomSound = filteredSounds[Math.floor(Math.random() * filteredSounds.length)];
        // Play the random sound
        if (randomSound.location) {
            webSocket.sound(randomSound.location);
            chatClient.say(`Playing random sound: ${randomSound.soundName}`)
        } else {
            logger.error(`Random sound not found in soundHandler: ${randomSound}`);
        }
    } catch (error) {
        logger.error(`Error getting random sound in soundHandler: ${error}`);
    }
};