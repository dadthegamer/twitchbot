import logger from "../../utilities/logger";
import { currencyDB } from "../../config/initializers.js";


async function createCurrency(req, res) {
    try {
        const currency = await currencyService.createCurrency(req.body);
        return res.status(200).json({ currency });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: error.message });
    }
}