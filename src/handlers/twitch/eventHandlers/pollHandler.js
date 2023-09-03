// Poll events
export async function onPollBegin(e) {
    try {
        const pollId = e.id;
        const pollTitle = e.title;
        const pollChoices = e.choices;
        for (const choice of pollChoices) {
            console.log(choice.title);
            console.log(choice.id);
        }
    }
    catch (error) {
        writeToLogFile('error', `Error in onPollBegin: ${error}`);
    }
}

export async function onPollProgress(e) {
    console.log('Poll in progress');
}

export async function onPollEnd(e) {
    console.log('Poll ended');
}