export async function onStreamOffline(e) {
    try {
        setVariable('live', false);
        writeToLogFile('info', 'Stream offline');
        await endStream();
    }
    catch (error) {
        writeToLogFile('error', `Error in onStreamOffline: ${error}`);
    }
}

export async function onStreamUpdate(e) {
    console.log('Stream updated');
}