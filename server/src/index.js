import 'dotenv/config';
import app from './app.js';
import { setupApp } from './config.js';

await setupApp();   // configure details before launch
app.listen(3000, () => console.log('check status on /api/util/health'));