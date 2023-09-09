import { writeToLogFile } from "./utilities/log.js";
import { cache, usersDB, streamDB } from '../config/initializers.js';
import { formatTimeFromMinutes, formatRank, numberWithCommas } from "../utilities/utilities.js";

let variables = [];

variables.push('followAge')
variables.push('followDate')
variables.push('upTime')
variables.push('allArgs')
variables.push('watchTime')
variables.push('8ball')
variables.push('leaderboard')


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
        writeToLogFile('error', `Error in variableHandler: ${err}`);
    }
}

export async function updateVariable(variable, context, userId, property = null) {
    try {
        switch (variable) {
            case 'followAge':
                return 'testing this variable';
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
                    switch (property) {
                        case 'leaderboard':
                            const rank = await usersDB.getUserRankByProperty(userId, 'leaderboard_points');
                            if (rank === null || rank === undefined) {
                                return 'Rank not found';
                            } else {
                                return formatRank(rank);
                            }
                        case 'watchTime':
                            const watchTime = await usersDB.getUserRankByProperty(userId, 'view_time');
                            if (watchTime === null || watchTime === undefined) {
                                return null;
                            } else {
                                return formatRank(watchTime);
                            }
                    }
                }
                break;
            case 'currency':
                if (property === null) {
                    return null;
                } else {
                    switch (property) {
                        case 'balance':
                            const balance = await getUserProperty(userId, 'currency');
                            if (balance === null || balance === undefined) {
                                return null;
                            } else {
                                return numberWithCommas(balance);
                            }
                        case 'bank':
                            const bank = await getUserProperty(userId, 'bank');
                            if (bank === null || bank === undefined) {
                                return null;
                            } else {
                                return numberWithCommas(bank);
                            }
                    }
                }
            case '8ball':
                const res = await eightBallresponse();
                return res;
            default:
                return null;
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in updateVaraible: ${err}`);
    }
}