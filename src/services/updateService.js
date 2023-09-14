import axios from 'axios';
import fs from 'fs/promises';
import { pipeline } from 'stream';
import path from 'path';
import { createWriteStream } from 'fs';
import admZip from 'adm-zip';
import semver from 'semver';
import stream from 'stream';

// Define __dirname
const __dirname = path.resolve();

const currentVersion = '0.1.0';

async function checkForUpdates() {

    try {
        const response = await axios.get('https://api.github.com/repos/dadthegamer/twitchbot/releases/latest');
        const release = response.data;

        const latestVersion = release.tag_name;
        if (semver.gt(latestVersion, currentVersion)) {
            console.log(response.data);
            console.log(`Update available: ${latestVersion}`);

            await downloadUpdate(release.assets[0].browser_download_url);

            console.log('Update downloaded and extracted. Restarting...');
            restartApp();

        } else {
            console.log('No update available');
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
    console.log('Restarting app...');
}

export { checkForUpdates };