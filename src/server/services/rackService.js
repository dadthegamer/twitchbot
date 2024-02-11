import logger from "../utilities/logger.js";
import { webSocket, chatClient, usersDB } from "../config/initializers.js";


class RackService {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.collectionName = 'rackParameters';
    }
    
    // TODO: Create the initial rack parameters
    // Racks: view time, active view time, bits, gifted subs, donations, likes, streams, channel point redemptions, channel points spent, emotes used, sub duration, raids, clips, vip, mod, bans, mini game wins, tier 1, tier 2, tier 3, chat messages, discord member, leaderboard points won, first, second, third, first 5 minutes, hype trains participated, hype trains contribution, top hype train contributor
    // Top Monthly: view time, bits, gifted subs, donations, likes, streams, channel point redemptions, channel points spent, bans, mini game wins, chat messages, clips, first, second, third, first 5 minutes, hype trains participated, hype trains contribution, top hype train contributor
    // Top Yearly: view time, bits, gifted subs, donations, likes, streams, channel point redemptions, channel points spent, bans, mini game wins, chat messages, clips, first, second, third, first 5 minutes, hype trains participated, hype trains contribution, top hype train contributor
    // Most All Time: view time, bits, gifted subs, donations, likes, streams, channel point redemptions, channel points spent, raids, bans, mini game wins, chat messages, clips, first, second, third, first 5 minutes, hype trains participated, hype trains contribution, top hype train contributor

    // Method to create the initial rack parameters
    async createRackParameters() {
        try {
            const res = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            if (res.length === 0) {
                const rackParameters = {
                    "racks": [
                        "viewTime",
                        "bits",
                        "giftedSubs",
                        "donations",
                        "likes",
                        "streams",
                        "channelPointRedemptions",
                        "channelPointsSpent",
                        "emotesUsed",
                        "subDuration",
                        "raids",
                        "clips",
                        "vip",
                        "mod",
                        "bans",
                        "miniGameWins",
                        "tier1",
                        "tier2",
                        "tier3",
                        "chatMessages",
                        "discordMember",
                        "leaderboardPointsWon",
                        "first",
                        "second",
                        "third",
                        "first5Minutes",
                        "hypeTrainsParticipated",
                        "hypeTrainsContribution",
                        "topHypeTrainContributor",
                        "activeViewTime"
                    ],
                    "topMonthly": [
                        "viewTime",
                        "bits",
                        "giftedSubs",
                        "donations",
                        "likes",
                        "streams",
                        "channelPointRedemptions",
                        "channelPointsSpent",
                        "bans",
                        "miniGameWins",
                        "chatMessages",
                        "clips",
                        "leaderboardPointsWon",
                        "first",
                        "second",
                        "third",
                        "first5Minutes",
                        "hypeTrainsParticipated",
                        "hypeTrainsContribution",
                        "topHypeTrainContributor",
                        "activeViewTime"
                    ],
                    "topYearly": [
                        "viewTime",
                        "bits",
                        "giftedSubs",
                        "donations",
                        "likes",
                        "streams",
                        "channelPointRedemptions",
                        "channelPointsSpent",
                        "bans",
                        "miniGameWins",
                        "chatMessages",
                        "clips",
                        "leaderboardPointsWon",
                        "first",
                        "second",
                        "third",
                        "first5Minutes",
                        "hypeTrainsParticipated",
                        "hypeTrainsContribution",
                        "topHypeTrainContributor",
                        "activeViewTime"
                    ],
                    "mostAllTime": [
                        "viewTime",
                        "bits",
                        "giftedSubs",
                        "donations",
                        "likes",
                        "streams",
                        "channelPointRedemptions",
                        "channelPointsSpent",
                        "raids",
                        "bans",
                        "miniGameWins",
                        "chatMessages",
                        "clips",
                        "leaderboardPointsWon",
                        "first",
                        "second",
                        "third",
                        "first5Minutes",
                        "hypeTrainsParticipated",
                        "hypeTrainsContribution",
                        "topHypeTrainContributor",
                        "activeViewTime"
                    ]
                };
                await this.dbConnection.collection(this.collectionName).insertOne(rackParameters);
                logger.info("Rack parameters created successfully");
                return "Rack parameters created successfully";
            }
        } catch (error) {
            logger.error(`Error in creating rack parameters: ${error}`);
            return error;
        }
    }
}

export default RackService;