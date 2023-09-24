import { variableHandler } from '../variablesHandler.js';
import logger from '../../utilities/logger.js';
import { usersDB } from '../../config/initializers.js';

export async function metaDataHandler(userId, metadata) {
    try {
        const context = await variableHandler(metadata, userId);
        await usersDB.setMetaData(userId, context);
    }
    catch (err) {
        logger.error(`Error in metaDataHandler: ${err}`);
    }
}

export async function increaseMetaData(userId, metadata) {
    try {
        const context = await variableHandler(metadata, userId);
        await usersDB.increaseMetaData(userId, context);
    }
    catch (err) {
        logger.error(`Error in increaseMetaData: ${err}`);
    }
}