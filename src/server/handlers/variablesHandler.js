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
variables.push('rewardUserInput')
variables.push('args')

export async function variableHandler(context, input = null, userId = null) {
    try {
        const varsWithProps = context.match(/\$[a-zA-Z]+(\.[a-zA-Z]+)?/g);
        const varsNoProps = context.match(/\$[a-zA-Z]+(\[\d+\])?/g);
        if (varsWithProps) {
            for (const variable of varsWithProps) {
                const [varName, varProperty] = variable.slice(1).split('.');
                const variableValue = await updateVariable(varName, context, userId, varProperty, input);
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
                            const variableResponse = await updateVariable(varName, context, userId, index, input);
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

export async function updateVariable(variable, context, userId, property = null, input = null) {
    try {
        const userData = await usersDB.getUserByUserId(userId);
        switch (variable) {
            case 'followAge':
                const followDate = userData.followDate
                if (followDate === null) {
                    return 'You are not following the channel';
                } else {
                    // Calculate the difference between the follow date and now down  to the second
                    const diff = Math.abs(new Date() - followDate);
                    // Convert the difference to days
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    // Convert the difference to hours
                    const hours = Math.floor(diff / (1000 * 60 * 60));
                    // Convert the difference to minutes
                    const minutes = Math.floor(diff / (1000 * 60));
                    // Convert the difference to seconds
                    const seconds = Math.floor(diff / (1000));

                    let string = '';
                    if (days > 0) {
                        string += `${days}d `;
                    }
                    // Subtract the days from the hours to get the remainder
                    const hoursRemainder = hours - (days * 24);
                    if (hoursRemainder > 0) {
                        string += `${hoursRemainder}h `;
                    }
                    // Subtract the hours from the minutes to get the remainder
                    const minutesRemainder = minutes - (hours * 60);
                    if (minutesRemainder > 0) {
                        string += `${minutesRemainder}m `;
                    }
                    // Subtract the minutes from the seconds to get the remainder
                    const secondsRemainder = seconds - (minutes * 60);
                    if (secondsRemainder > 0) {
                        string += `${secondsRemainder}s`;
                    }

                    // Convert the follow date to a string with a format of December 25, 2020 at 12:00 AM
                    const followDateString = followDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true });
                    return `@${userData.displayName} has been following DTG for ${string} (${followDateString})`;
                }
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
                    console.log(streamInfo);
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
                    return `Stream has been live for ${upTimeString}`;
                }
            case 'watchTime':
                const watchTime = userData.viewTime.allTime;
                if (watchTime === 0) {
                    return 'You have not watched the stream long enough to get a watch time';
                } else {
                    const formatTime = await formatTimeFromMinutes(watchTime);
                    return `@${userData.displayName} has watched the stream for ${formatTime}`;
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
            case 'rewardUserInput':
                return input;
            default:
                return null;
        }
    }
    catch (err) {
        logger.error(`Error in updateVariable from variable ${context}: ${err}`);
    }
}