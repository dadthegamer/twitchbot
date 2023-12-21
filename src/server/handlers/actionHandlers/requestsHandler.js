import logger from '../../utilities/logger.js';
import axios from 'axios';


// Method to send a GET request to a server
export async function getRequest(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        logger.error(error);
    }
}