import logger from "../utilities/logger.js";
// Import the Philips Hue library
import { discovery, api } from "node-hue-api";


// Class to handle interactions with the Philips Hue API
class HueService {
    constructor(cache) {    
        this.cache = cache;
        this.api = null;
        this.ip = null;
        this.getBridge();
    }

    async getBridge() {
        try {
            const bridges = await discovery.nupnpSearch();
            console.log(JSON.stringify(results, null, 2));
        }
        catch (err) {
            logger.error(`Error in getBridge: ${err}`);
        }
    }
}

export default HueService;
