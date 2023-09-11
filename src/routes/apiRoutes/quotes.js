import { Router } from 'express';
import { writeToLogFile } from '../../utilities/logging.js';
import { cache, usersDB } from '../../config/initializers.js';

const router = Router();