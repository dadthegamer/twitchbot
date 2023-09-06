import { BotClient } from '../bot.js';
import { increaseUserValue } from '../db.js';
import { runEffectList } from '../utilities/utilis.js';
import { connectToMongoDB } from '../db/connection.js';


let pct = 750;
const maxJackPot = 10000;

// Function that returns a whole number between two numbers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to increase the jackpot amount
export async function increaseJackpot(amount) {
    const db = await connectToMongoDB();
    try {
        const collection = db.collection('streamInfo');
        await collection.updateOne({ id: 'jackpot' }, { $inc: { jackpot: amount } });
        const jackpot = await collection.findOne({ id: 'jackpot' });
        return jackpot.jackpot;
    }
    catch (err) {
        console.log(err);
    }
}

// Function to get the jackpot amount
export async function getJackpot() {
    const db = await connectToMongoDB();
    try {
        const collection = db.collection('streamInfo');
        const jackpot = await collection.findOne({ id: 'jackpot' });
        return jackpot.jackpot;
    }
    catch (err) {
        console.log(err);
    }
}

// Function to set the jackpot amount
export async function setJackpot(amount) {
    const db = await connectToMongoDB();
    try {
        const collection = db.collection('streamInfo');
        await collection.updateOne({ id: 'jackpot' }, { $set: { jackpot: amount } });
        const jackpot = await collection.findOne({ id: 'jackpot' });
        return jackpot.jackpot;
    }
    catch (err) {
        console.log(err);
    }
}

// Spinning Function
export async function spin() {
    const spin = getRandomInt(1, maxJackPot);
    if (spin <= pct) {
        return true;
    } else {
        return false;
    }
}
