import { existsSync, mkdirSync, appendFile, readdir, stat, unlink } from 'fs';
import { join } from 'path';
import { __dirname } from '../app.js'

const logsDirectory = './logs'

// Create logs directory if it doesn't exist
if (!existsSync(logsDirectory)) {
    mkdirSync(logsDirectory);
}

// Function to write log messages to a file
function writeToLogFile(level, message) {
    const logFilePath = join(logsDirectory, `${getCurrentDate()}.log`);
    const logMessage = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}\n`;
    appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
}

// Function to get the current date in 'YYYY-MM-DD' format
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Remove log files older than 7 days
async function removeOldLogFiles() {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - 7);

    readdir(logsDirectory, (err, files) => {
        if (err) {
            console.error('Error reading logs directory:', err);
            return;
        }

        files.forEach((file) => {
            const filePath = join(logsDirectory, file);
            stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }

                if (stats.isFile() && stats.mtime < cutoffDate) {
                    unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting log file:', err);
                        } else {
                            console.log('Deleted log file:', filePath);
                        }
                    });
                }
            });
        });
    });
}

export { writeToLogFile, removeOldLogFiles };