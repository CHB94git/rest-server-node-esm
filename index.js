import dotenv from 'dotenv'
dotenv.config()
import Server from './server/server.js';

const server = new Server()
server.listen()





