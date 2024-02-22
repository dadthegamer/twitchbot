import logger from "../utilities/logger.js";
import { usersDB, cache, tokenDB, webSocket, chatClient } from '../config/initializers.js';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';


class SpotifyService {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: process.env.SPOTIFY_REDIRECT_URI
        });
        this.setAccessToken();
        this.accessTokenSet = false;
        this.token = null;
        this.currentlyPlayingId = null;
        this.checkCurrentlyPlaying();
        this.baseUrl = 'https://api.spotify.com/v1'
        this.currentlyPlayData = null;
    }

    // Method to get the acceess token from the database and set it in the spotifyApi object
    async setAccessToken() {
        try {
            const tokenData = await tokenDB.getSpotifyToken();
            if (tokenData === null) {
                logger.error(`No token data found.`);
                return;
            }
            this.spotifyApi.setAccessToken(tokenData[0].token);
            this.spotifyApi.setRefreshToken(tokenData[0].refreshToken);
            this.accessTokenSet = true;
            this.token = tokenData[0].token;
            // Check if the token is expired by checking the obtainment timestamp and the expires in time.
            // The expires in time is in seconds so we need to multiply it by 1000 to get the time in milliseconds
            const currentTime = new Date().getTime();
            const tokenObtainmentTime = tokenData[0].obtainmentTimestamp;
            const expiresIn = tokenData[0].expiresIn * 1000;
            if (currentTime - tokenObtainmentTime > expiresIn) {
                console.log('Token expired');
                await this.refreshAccessToken();
            }
        } catch (error) {
            logger.error(`Error setting access token: ${error}`);
        }
    }

    // Method to get information about the authenticated user
    async getAuthenticatedUser() {
        try {
            const user = await this.spotifyApi.getMe();
            return user.body;
        } catch (error) {
            console.log('Something went wrong!', error);
            logger.error(error);
        }
    }

    async exchangeCode(code) {
        try {
            const clientId = process.env.SPOTIFY_CLIENT_ID;
            const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
            const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
            const data = {
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code',
            };
            const response = await axios.post('https://accounts.spotify.com/api/token', data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + (Buffer.from(`${clientId}:${clientSecret}`).toString('base64'))
                }
            });
            tokenDB.storeSpotifyUserAuthToken(response.data.access_token, response.data.refresh_token, response.data.expires_in);
            this.spotifyApi.setAccessToken(response.data.access_token);
            return response.data;
        }
        catch (error) {
            logger.error(error);
            return null;
        }
    };

    // Method to refresh the access token
    async refreshAccessToken() {
        try {
            const res = await this.spotifyApi.refreshAccessToken();
            tokenDB.updateSpotifyUserAuthToken(res.body.access_token, res.body.expires_in);
            this.spotifyApi.setAccessToken(res.body.access_token);
            this.accessTokenSet = true;
            this.token = res.body.access_token;
        }
        catch (error) {
            console.log('Error refreshing access token:', error);
            logger.error(error);
            return null;
        }
    }

    // Method to get the currently play track
    async getCurrentlyPlaying() {
        // Check if the access token has been set
        try {
            if (!this.accessTokenSet) {
                await this.setAccessToken();
            }
            const currentlyPlaying = await this.spotifyApi.getMyCurrentPlayingTrack();
            return currentlyPlaying.body;
        }
        catch (error) {
            logger.error(`Error getting currently playing track: ${error}`);
            return null;
        }
    }

    // Method to check every 3 seconds to check what the current track is
    async checkCurrentlyPlaying() {
        try {
            setInterval(async () => {
                const currentlyPlaying = await this.getCurrentlyPlaying();
                if (currentlyPlaying === null) {
                    return;
                }
                if (currentlyPlaying.is_playing) {
                    if (currentlyPlaying.item.id !== this.currentlyPlayingId) {
                        this.currentlyPlayingId = currentlyPlaying.item.id;
                        webSocket.spotify(currentlyPlaying);
                        chatClient.say(`Currently playing: ${currentlyPlaying.item.name} by ${currentlyPlaying.item.artists[0].name}`);
                        const artist = currentlyPlaying.item.artists[0].name;
                        const track = currentlyPlaying.item.name;
                        const data = {
                            artist: artist,
                            track: track
                        }
                        this.currentlyPlayData = data;
                    };
                }
            }, 3000);
        }
        catch (error) {
            logger.error(`Error checking currently playing: ${error}`);
        }
    }

    // Method to check the queue for the next song to play
    async checkQueue() {
        try {
            if (!this.accessTokenSet) {
                await this.setAccessToken();
            }
            if (this.tokenData === null) {
                return;
            }
            const response = await axios.post(`${this.baseUrl}/me/player/queue`, {
                header: 'Authorization: Bearer ' + this.token
            });
            console.log(response);
        }
        catch (error) {
            logger.error(`Error checking queue: ${error}`);
            if (error.response.status === 401) {
                await this.refreshAccessToken();
            }
        }
    }

    // Method to search for a track with artist
    async searchForTrackWithArtist(track, artist) {
        try {
            if (!this.accessTokenSet) {
                await this.setAccessToken();
            }
            const response = await this.spotifyApi.searchTracks(`track:${track} artist:${artist}`);
            return response.body.tracks.items[0];
        }
        catch (error) {
            logger.error(`Error searching for track: ${error}`);
            return null;
        }
    }

    // Method to add a track to the queue
    async addTrackToQueue(track) {
        try {
            if (!this.accessTokenSet) {
                await this.setAccessToken();
            }
            const response = await this.spotifyApi.addToQueue(track);
            return response;
        }
        catch (error) {
            logger.error(`Error adding track to queue: ${error}`);
            return null;
        }
    }

    // Method to get the currently playing data
    async getCurrentlyPlayingData() {
        return this.currentlyPlayData;
    }
}

export default SpotifyService;