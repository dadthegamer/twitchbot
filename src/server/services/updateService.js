import axios from 'axios';
import fs from 'fs/promises';
import { pipeline } from 'stream';
import path from 'path';
import { createWriteStream } from 'fs';
import admZip from 'adm-zip';
import semver from 'semver';
import stream from 'stream';
import { spawn } from 'child_process';

// Define __dirname
const __dirname = path.resolve();


async function checkForUpdates(currentVersion) {

    try {
        const response = await axios.get('https://api.github.com/repos/dadthegamer/twitchbot/releases/latest');
        const release = response.data;

        console.log(release);

        const latestVersion = release.tag_name;
        if (semver.gt(latestVersion, currentVersion)) {
            console.log(response.data);

            // await downloadUpdate(release.assets[0].browser_download_url);

            // console.log('Update downloaded and extracted. Restarting...');
            // restartApp();
            return response.data;
        } else {
            return false;
        }

    } catch (error) {
        console.error(error);
    }
}

async function downloadUpdate(url) {

    const filePath = path.join(__dirname, 'latest.zip');

    const writer = createWriteStream(filePath);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    writer.on('finish', async () => {
        console.log('Download complete');

        // If in production, delete the old files
        if (process.env.NODE_ENV === 'production') {
            const files = await fs.readdir(__dirname);
            const filteredFiles = files.filter(file => file !== 'latest.zip');
            const zip = new admZip(filePath);
            zip.extractAllTo(__dirname);
        } else if (process.env.NODE_ENV === 'development') {
            console.log('In development, not deleting old files');
        }

        await fs.unlink(filePath);

        console.log('Extracted and deleted zip');
    });

    response.data.pipe(writer);

    await new Promise(resolve => {
        writer.on('finish', resolve);
    });

    console.log('Download promise resolved');

}

function restartApp() {
    try {
        console.log('Restarting app...');
        const app = spawn('node', ['start'], {
            cwd: process.cwd(),
            detached: true,
            stdio: 'inherit'
        });

        app.stderr.on('data', (data) => {
            console.error(`stderr from new instance: ${data}`);
        });
        
        app.on('error', (err) => {
            console.error('Error during restart:', err);
        });
        
        app.unref();
        console.log('App restart process initiated.');
    }
    catch (error) {
        console.error(error);
    }
}

export { checkForUpdates };