import 'dotenv/config';
import server from './server.js';

server.listen(3000, () => console.log('live on http://localhost:3000'));