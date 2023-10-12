import logger from '../utilities/logger.js';
import { cache, usersDB, streamDB } from '../config/initializers.js';
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
variables.push('currency')


export async function variableHandler(context, userId) {
    try {
        const varsWithProps = context.match(/\$[a-zA-Z]+\.[a-zA-Z]+/g);
        const varsNoProps = context.match(/\$[a-zA-Z]+/g);
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
                if (variables.includes(variable.split('$')[1])) {
                    const variableResponse = await updateVariable(variable.split('$')[1], context, userId);
                    if (variableResponse) {
                        context = context.replace(variable, variableResponse);
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
                console.log('User variable');
                // Return the user's display name
                const user = await usersDB.getUserByUserId(userId);
                if (user === null) {
                    return null;
                } else {
                    return user.displayName;
                }
            case 'upTime':
                const uptime = cache.get('uptime');
                if (uptime === null) {
                    return 'Stream is not live';
                } else {
                    return uptime;
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
            default:
                return null;
        }
    }
    catch (err) {
        console.log(err);
        logger.error(`Error in updateVariable from variable ${context}: ${err}`);
    }
}