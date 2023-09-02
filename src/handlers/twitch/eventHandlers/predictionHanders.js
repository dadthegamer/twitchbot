// Prediction events
export async function onPredictionStart(e) {
    try {
        const outcomeArray = [];
        e.outcomes.forEach((outcome) => {
            console.log(outcome.title);
            console.log(outcome.id);
            outcomeArray.push({
                id: outcome.id,
                title: outcome.title,
                color: outcome.color,
                channelPoints: 0,
                users: 0,
            });
        });
        const startDate = e.startDate;
        const lockDate = e.lockDate;
        const predictionTitle = e.title;
        console.log(`Prediction started: ${predictionTitle}`);
    }
    catch (error) {
        console.log(error);
        writeToLogFile('error', `Error in onPredictionStart: ${error}`);
    }
}

export async function onPredictionProgress(e) {
    try {
        for (const outcome of e.outcomes) {
            updatePrediction(outcome.id, outcome.channelPoints, outcome.users);
        }
    }
    catch (error) {
        writeToLogFile('error', `Error in onPredictionProgress: ${error}`);
    }
}

export async function onPredictionLock(e) {
    try {
        lockPrediction();
        for (const outcome of e.outcomes) {
            console.log(`Outcome ${outcome.title} has ${outcome.channelPoints} points`);
        }
    }
    catch (error) {
        writeToLogFile('error', `Error in onPredictionLock: ${error}`);
    }
}

export async function onPredictionEnd(e) {
    try {
        endPrediction();
        for (const outcome of e.outcomes) {
            console.log(`Outcome ${outcome.title} has ${outcome.channelPoints} points`);
        }
    }
    catch (error) {
        writeToLogFile('error', `Error in onPredictionEnd: ${error}`);
    }
}