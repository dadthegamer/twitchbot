import logger from '../utilities/logger.js';
import { actionEvalulate } from '../handlers/evaluator.js';


class ActionListService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.collectionName = 'actionList';
        this.getActions();
    }

    // Get all the action lists from the database and store them in the cache
    async getActions() {
        try {
            const actions = await this.dbConnection.getCollection(this.collectionName).find().toArray();
            this.cache.set('actions', actions);
            return actions;
        }
        catch (err) {
            logger.error(`Error in getActions: ${err}`);
        }
    }

    // Get an action list by its id
    async getActionListById(id) {
        try {
            const actions = await this.cache.get('actions');
            return actions.find(action => action._id === id);
        }
        catch (err) {
            logger.error(`Error in getActionById: ${err}`);
        }
    }

    // Create a new action list and store it in the database and cache
    async createAction(actionName, actions) {
        try {
            // Make sure the actions is an array
            if (!Array.isArray(actions)) {
                actions = [actions];
            }
            const action = {
                actionName: actionName,
                handlers: actions,
                created: new Date(),
                enabled: true
            };
            const result = await this.dbConnection.getCollection(this.collectionName).insertOne(action);
            this.getActions();
            return result;
        }
        catch (err) {
            logger.error(`Error in createAction: ${err}`);
        }
    }

    // Method to use an action list
    async useAction(actionId, { userId, displayName } = { userId: null, displayName: null }) {
        try {
            const action = await this.getActionListById(actionId);
            if (action) {
                for (let i = 0; i < action.handlers.length; i++) {
                    const handler = action.handlers[i];
                    await actionEvalulate(handler, { userId, displayName });
                }
            }
        }
        catch (err) {
            logger.error(`Error in useAction: ${err}`);
        }
    }

    // Method to delete an action list
    async deleteAction(actionId) {
        try {
            const result = await this.dbConnection.getCollection(this.collectionName).deleteOne({ _id: actionId });
            this.getActions();
            return result;
        }
        catch (err) {
            logger.error(`Error in deleteAction: ${err}`);
        }
    }

    // Method to update an action list
    async updateAction(actionId, actions) {
        try {
            // Make sure the actions is an array
            if (!Array.isArray(actions)) {
                actions = [actions];
            }
            const result = await this.dbConnection.getCollection(this.collectionName).updateOne({ _id: actionId }, { $set: actions });
            this.getActions();
            return result;
        }
        catch (err) {
            logger.error(`Error in updateAction: ${err}`);
        }
    }
}


export default ActionListService;