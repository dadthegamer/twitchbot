import { writeToLogFile } from '../utilities/logging.js';

// User class 
export class GoalService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.collectionName = 'goals';
        this.createInitialGoals();
        this.getAllGoals();
    }

    // Method to create the initial goal in the database and cache
    async createInitialGoals() {
        try {
            const initialGoals = [
                {
                    name: 'Daily Sub Goal',
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'Monthly Sub Goal',
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'Monthly Donation Goal',
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'Daily Cheer Goal',
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'Monthly Cheer Goal',
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'Daily Follower Goal',
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'Monthly Follower Goal',
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
            ]
            // Check if there are as many goals in the database as there are in the goals array as well as checking to make sure each key exists under each goal
            const goals = await this.dbConnection.collection(this.collectionName).find().toArray();
            if (goals.length !== initialGoals.length || goals.some(goal => !initialGoals.some(initialGoal => initialGoal.name === goal.name))) {
                // If there are not as many goals in the database as there are in the initial goals array, or if there are goals in the database that do not exist in the initial goals array, then delete all goals in the database and insert the initial goals
                await this.dbConnection.collection('goals').deleteMany({});
                await this.dbConnection.collection('goals').insertMany(initialGoals);
                await this.getAllGoals();
            }
        } catch (error) {
            writeToLogFile('error', `Error creating initial goal: ${error}`);
        }
    }

    // Method to get all goals and store them in the cache
    async getAllGoals() {
        try {
            const goals = await this.dbConnection.collection(this.collectionName).find().toArray();
            await this.cache.set('goals', goals);
            return goals;
        } catch (error) {
            writeToLogFile('error', `Error getting all goals: ${error}`);
        }
    }

    // Method to get a goal by name
    async getGoalByName(goalName) {
        const goals = await this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            return new Error(`Goal ${goalName} does not exist`);
        }
        try {
            const goals = await this.cache.get('goals');
            const goal = goals.find(goal => goal.name === goalName);
            return goal;
        } catch (error) {
            writeToLogFile('error', `Error getting goal by name: ${error}`);
        }
    }

    // Method to set a goal's goal
    async setGoal(goalName, goalGoal) {
        const goals = await this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            return new Error(`Goal ${goalName} does not exist`);
        }
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $set: { goal: goalGoal } });
            await this.getAllGoals();
            return result;
        } catch (error) {
            writeToLogFile('error', `Error setting goal goal: ${error}`);
        }
    }

    // Method to set a goal's current
    async setGoalCurrent(goalName, goalCurrent) {
        const goals = await this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            return new Error(`Goal ${goalName} does not exist`);
        }
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $set: { current: goalCurrent } });
            await this.getAllGoals();
            return result;
        } catch (error) {
            writeToLogFile('error', `Error setting goal current: ${error}`);
        }
    }

    // Method to increase a goal's current
    async increaseGoalCurrent(goalName, goalIncrease) {
        const goals = await this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            return new Error(`Goal ${goalName} does not exist`);
        }
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $inc: { current: goalIncrease } });
            await this.getAllGoals();
            return result;
        } catch (error) {
            writeToLogFile('error', `Error increasing goal current: ${error}`);
        }
    }

    // Method to update a goal
    async updateGoal(goalName, goal, current, description, handlers) {
        const goals = await this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            return new Error(`Goal ${goalName} does not exist`);
        }
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $set: { goal, current, description, handlers } });
            await this.getAllGoals();
            return result;
        } catch (error) {
            writeToLogFile('error', `Error updating goal: ${error}`);
        }
    }

}