import logger from "../utilities/logger.js";
import { webSocket } from '../config/initializers.js';

// User class 
class GoalService {
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
                    name: 'dailySubGoal',
                    enabled: true,
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'monthlySubGoal',
                    enabled: true,
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'dailyDonationGoal',
                    enabled: true,
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'monthlyDonationGoal',
                    enabled: true,
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'dailyBitsGoal',
                    enabled: true,
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'monthlyBitsGoal',
                    enabled: true,
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'dailyFollowersGoal',
                    enabled: true,
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                },
                {
                    name: 'monthlyFollowersGoal',
                    enabled: true,
                    goal: 0,
                    current: 0,
                    description: null,
                    completed: false,
                    handlers: [],
                }
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
            logger.error(`Error creating initial goals: ${error}`);
        }
    }

    // Method to get all goals and store them in the cache
    async getAllGoals() {
        try {
            // Check if the goals are in the cache. If they are return them. If not, get them from the database and store them in the cache
            const goals = this.cache.get('goals');
            if (goals) {
                return goals;
            } else {
                const goals = await this.getAllGoalsDB();
                return goals;
            };
        } catch (error) {
            logger.error(`Error getting all goals: ${error}`);
        }
    }

    // Method to get all goals in the database
    async getAllGoalsDB() {
        try {
            const goals = await this.dbConnection.collection(this.collectionName).find().toArray();
            await this.cache.set('goals', goals);
            return goals;
        } catch (error) {
            logger.error(`Error getting all goals: ${error}`);
        }
    }

    // Method to get a goal by name
    async getGoalByName(goalName) {
        const goals = this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            logger.error(`Goal ${goalName} does not exist`);
            return;
        }
        try {
            const goals = await this.cache.get('goals');
            const goal = goals.find(goal => goal.name === goalName);
            return goal;
        } catch (error) {
            logger.error(`Error getting goal by name: ${error}`);
        }
    }

    // Method to set a goal's goal
    async setGoal(goalName, goalGoal) {
        const goals = this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            logger.error(`Goal ${goalName} does not exist`);
            return;
        }
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $set: { goal: goalGoal } });
            await this.getAllGoals();
            return result;
        } catch (error) {
            logger.error(`Error setting goal goal: ${error}`);  
        }
    }

    // Method to set a goal's current
    async setGoalCurrent(goalName, goalCurrent) {
        if (typeof goalCurrent !== 'number') {
            goalCurrent = parseInt(goalCurrent);
            // If the goalIncrease is not a number, then return an error
            if (isNaN(goalCurrent)) {
                logger.error(`Goal set ${goalCurrent} is not a number`);
            }
        }
        const goals = await this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            logger.error(`Goal ${goalName} does not exist`);
            return;
        }
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $set: { current: goalCurrent } });
            await this.getAllGoalsDB();
            webSocket.subsUpdate();
            return result;
        } catch (error) {
            logger.error(`Error setting goal current: ${error}`);
        }
    }

    // Method to set a goal's description
    async setGoalDescription(goalName, goalDescription) {
        console.log(goalDescription);
        const goals = this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            logger.error(`Goal ${goalName} does not exist`);
            return;
        }
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $set: { description: goalDescription } });
            await this.getAllGoalsDB();
            return result;
        } catch (error) {
            logger.error(`Error setting goal description: ${error}`);
        }
    }

    // Method to increase a goal's current in the cache and database. Then check if the goal has been completed
    async increaseGoalCurrent(goalName, goalIncrease) {
        // Check if the goalIncrease is a number. If it is not, then parse it to a number
        if (typeof goalIncrease !== 'number') {
            goalIncrease = parseInt(goalIncrease);
            // If the goalIncrease is not a number, then return an error
            if (isNaN(goalIncrease)) {
                logger.error(`Goal increase ${goalIncrease} is not a number`);
            }
        };
        const goals = await this.cache.get('goals');
        // Check if the goal name exists
        if (!goals.some(goal => goal.name === goalName)) {
            logger.error(`Goal ${goalName} does not exist`);
            return;
        };
        try {
            // Increase the goal in the cache
            const goalCache = goals.find(goal => goal.name === goalName);
            goalCache.current += goalIncrease;
            await this.cache.set('goals', goals);
            // Increase the goal in the database
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $inc: { current: goalIncrease } });
            await this.getAllGoalsDB();
            // Check if the goal has been completed
            const goal = await this.getGoalByName(goalName);
            if (goal.current >= goal.goal) {
                await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $set: { completed: true } });
            };
            webSocket.subsUpdate();
            return result;
        } catch (error) {
            logger.error(`Error increasing goal current: ${error}`);
        }
    }

    // Method to enable/disable a goal
    async setGoalEnabled(goalName, enabled) {
        const goals = this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            logger.error(`Goal ${goalName} does not exist`);
            return;
        }
        try {
            console.log(`Goal ${goalName} enabled: ${enabled}`)
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $set: { enabled } });
            await this.getAllGoalsDB();
            return result;
        } catch (error) {
            logger.error(`Error enabling goal: ${error}`);
        }
    }

    // Method to update a goal
    async updateGoal(goalName, goal, current, description, handlers) {
        const goals = this.cache.get('goals');
        if (!goals.some(goal => goal.name === goalName)) {
            logger.error(`Goal ${goalName} does not exist`);
            return;
        }
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ name: goalName }, { $set: { goal, current, description, handlers } });
            await this.getAllGoalsDB();
            return result;
        } catch (error) {
            logger.error(`Error updating goal: ${error}`);
        }
    }

    // Method to increase the dailysubgoal and the monthlysubgoal
    async increaseSubGoals(goalIncrease) {
        // Check if the goalIncrease is a number. If it is not, then parse it to a number
        if (typeof goalIncrease !== 'number') {
            goalIncrease = parseInt(goalIncrease);
            // If the goalIncrease is not a number, then return an error
            if (isNaN(goalIncrease)) {
                logger.error(`Goal increase ${goalIncrease} is not a number`);
                return;
            }
        }
        try {
            await this.increaseGoalCurrent('dailySubGoal', goalIncrease);
            await this.increaseGoalCurrent('monthlySubGoal', goalIncrease);
            await this.getAllGoalsDB();
        } catch (error) {
            logger.error(`Error increasing subgoals: ${error}`);
        }
    }

    // Method to increase the dailydonationgoal and the monthlydonationgoal
    async increaseDonationGoals(goalIncrease) {
        // Check if the goalIncrease is a number. If it is not, then parse it to a number
        if (typeof goalIncrease !== 'number') {
            goalIncrease = parseInt(goalIncrease);
            // If the goalIncrease is not a number, then return an error
            if (isNaN(goalIncrease)) {
                logger.error(`Goal increase ${goalIncrease} is not a number`);
                return;
            }
        }
        try {
            await this.increaseGoalCurrent('dailyDonationGoal', goalIncrease);
            await this.increaseGoalCurrent('monthlyDonationGoal', goalIncrease);
            await this.getAllGoals();
        } catch (error) {
            logger.error(`Error increasing donation goals: ${error}`);
        }
    }

    // Method to increase the dailybitsgoal and the monthlybitsgoal
    async increaseBitsGoals(goalIncrease) {
        // Check if the goalIncrease is a number. If it is not, then parse it to a number
        if (typeof goalIncrease !== 'number') {
            goalIncrease = parseInt(goalIncrease);
            // If the goalIncrease is not a number, then return an error
            if (isNaN(goalIncrease)) {
                logger.error(`Goal increase ${goalIncrease} is not a number`);
                return;
            }
        }
        try {
            await this.increaseGoalCurrent('dailyBitsGoal', goalIncrease);
            await this.increaseGoalCurrent('monthlyBitsGoal', goalIncrease);
            await this.getAllGoals();
        } catch (error) {
            logger.error(`Error increasing bits goals: ${error}`);
        }
    }

    // Method to increase the dailyfollowersgoal
    async increaseFollowersGoal(goalIncrease) {
        // Check if the goalIncrease is a number. If it is not, then parse it to a number
        if (typeof goalIncrease !== 'number') {
            goalIncrease = parseInt(goalIncrease);
            // If the goalIncrease is not a number, then return an error
            if (isNaN(goalIncrease)) {
                logger.error(`Goal increase ${goalIncrease} is not a number`);
                return;
            }
        }
        try {
            await this.increaseGoalCurrent('dailyFollowersGoal', goalIncrease);
            await this.getAllGoalsDB();
        } catch (error) {
            logger.error(`Error increasing followers goal: ${error}`);
        }
    }
}


export default GoalService;