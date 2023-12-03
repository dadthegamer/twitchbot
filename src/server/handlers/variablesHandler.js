import logger from '../utilities/logger.js';
import { cache, usersDB } from '../config/initializers.js';
import { formatTimeFromMinutes, formatRank, numberWithCommas } from "../utilities/utils.js";

let variables = [];

variables.push('followAge')
variables.push('followDate')
variables.push('upTime')
variables.push('allArgs')
variables.push('watchTime')
variables.push('8ball')
variables.push('leaderboard')
variables.push('rank')
variables.push('user')
variables.push('randomQuote')
variables.push('quote')
variables.push('currency')
variables.push('rewardInput')
variables.push('args')

export async function variableHandler(context, userId = null) {
    try {
        const varsWithProps = context.match(/\$[a-zA-Z]+\.[a-zA-Z]+/g);
        const varsNoProps = context.match(/\$[a-zA-Z]+\[\d+\]/g);
        console.log(`varsWithProps: ${varsWithProps}`);
        console.log(`varsNoProps: ${varsNoProps}`);
        if (varsWithProps) {
            for (const variable of varsWithProps) {
                const [varName, varProperty] = variable.slice(1).split('.');
                const variableValue = await updateVariable(varName, context, userId, varProperty);
                let propValue = variableValue;
                context = context.replace(variable, propValue);
            }
        }
        if (varsNoProps) {
            for (const variable of varsNoProps) {
                const matches = variable.match(/\$([a-zA-Z]+)\[(\d+)\]/);
                if (matches) {
                    const varName = matches[1];
                    const index = parseInt(matches[2], 10);
                    if (index) {
                        const variableValue = await updateVariable(varName, context, userId, index);
                        let propValue = variableValue;
                        context = context.replace(variable, propValue);
                    } else {
                        if (variables.includes(varName)) {
                            const variableResponse = await updateVariable(varName, context, userId, index);
                            if (variableResponse) {
                                context = context.replace(variable, variableResponse);
                            }
                        }
                    }
                }
            }
        }
        return context;
    }
    catch (err) {
        logger.error(`Error in variableHandler: ${err}`);
    }
}

export async function updateVariable(variable, context, userId, property = null) {
    try {
        switch (variable) {
            case 'followAge':
                return 'testing this variable';
            case 'user':
                const user = await usersDB.getUserByUserId(userId);
                if (user === null) {
                    return null;
                } else {
                    return user.displayName;
                }
            case 'upTime':
                const live = cache.get('live');
                if (!live) {
                    return 'Stream is not live';
                } else {
                    const streamInfo = cache.get('streamInfo');
                    const upTime = streamInfo.startedAt;
                    const now = new Date();
                    const diff = now - upTime;
                    const seconds = Math.floor(diff / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    const hoursRemainder = hours % 24;
                    const minutesRemainder = minutes % 60;
                    const secondsRemainder = seconds % 60;
                    let upTimeString = '';
                    if (days > 0) {
                        upTimeString += `${days}d `;
                    }
                    if (hoursRemainder > 0) {
                        upTimeString += `${hoursRemainder}h `;
                    }
                    if (minutesRemainder > 0) {
                        upTimeString += `${minutesRemainder}m `;
                    }
                    if (secondsRemainder > 0) {
                        upTimeString += `${secondsRemainder}s`;
                    }
                    return upTimeString;
                }
            case 'watchTime':
                const userData = await usersDB.getUserByUserId(userId);
                const watchTime = userData.view_time;
                if (watchTime === 0) {
                    return 'You have not watched the stream long enough to get a watch time';
                } else {
                    return formatTimeFromMinutes(watchTime);
                }
            case 'allArgs':
                return context.slice(context.indexOf(variable) + variable.length + 1);
            case 'rank':
                if (property === null) {
                    return null;
                } else {
                    const currencies = cache.get('currencies');
                    // Loop through each currency and check if the property is in the currency. Convert the name and property to lowercase to make it easier to check
                    for (const currency of currencies) {
                        if (currency.name.toLowerCase() === property.toLowerCase()) {
                            const rank = await usersDB.getUserRankByCurrencyProperty(userId, currency.name.toLowerCase());
                            return formatRank(rank);
                        }
                    }
                }
                break;
            case 'currency':
                if (property === null) {
                    return null;
                } else {
                    const currencies = cache.get('currencies');
                    // Loop through each currency and check if the property is in the currency. Convert the name and property to lowercase to make it easier to check
                    for (const currency of currencies) {
                        if (currency.name.toLowerCase() === property.toLowerCase()) {
                            const amount = await usersDB.getCurrency(userId, currency.name.toLowerCase());
                            // If amount is null, return 0
                            if (amount === null || amount === undefined) {
                                return 0;
                            } else {
                                return numberWithCommas(amount);
                            }
                        }
                    }
                }
                break;
            case 'randomQuote':
                const quotes = cache.get('quotes');
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
                return randomQuote;
            case 'quote':
                const quoteId = parseInt(property);
                const quote = await interactionsDB.getQuoteById(quoteId);
                return quote.text;
            case 'rewardInput':
                return context;
            default:
                return null;
        }
    }
    catch (err) {
        logger.error(`Error in updateVariable from variable ${context}: ${err}`);
    }
}