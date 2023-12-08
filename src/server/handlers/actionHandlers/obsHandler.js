import logger from "../../utilities/logger.js";
import { obsService } from '../../config/initializers.js';

// Function to start recording
export async function startRecording() {
    try {
        await obsService.startRecording();
    } catch (err) {
        logger.error(`Error in startRecording: ${err}`);
    }
}

// Function to stop recording
export async function stopRecording() {
    try {
        await obsService.stopRecording();
    } catch (err) {
        logger.error(`Error in stopRecording: ${err}`);
    }
}

// Function to get the current scene
export async function getCurrentScene() {
    try {
        return await obsService.getCurrentScene();
    } catch (err) {
        logger.error(`Error in getCurrentScene: ${err}`);
    }
}

// Function to set the current scene
export async function setCurrentScene(sceneName) {
    try {
        await obsService.setCurrentScene(sceneName);
    } catch (err) {
        logger.error(`Error in setCurrentScene: ${err}`);
    }
}

// Function to start streaming
export async function startStreaming() {
    try {
        await obsService.startStreaming();
    } catch (err) {
        logger.error(`Error in startStreaming: ${err}`);
    }
}

// Function to stop streaming
export async function stopStreaming() {
    try {
        await obsService.stopStreaming();
    } catch (err) {
        logger.error(`Error in stopStreaming: ${err}`);
    }
}

// Function to save the replay buffer
export async function saveReplayBuffer() {
    try {
        await obsService.saveReplayBuffer();
    } catch (err) {
        logger.error(`Error in saveReplayBuffer: ${err}`);
    }
}