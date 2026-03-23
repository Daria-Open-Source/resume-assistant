import 'dotenv/config';
import server from './server.js';

server.listen(5000, () => console.log('live on http://localhost:5000'));