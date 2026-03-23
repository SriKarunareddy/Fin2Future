import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try loading the local .env first (in server/), then the root one.
let result = dotenv.config({ path: path.join(__dirname, '../.env') });
if (result.error) {
  result = dotenv.config({ path: path.join(__dirname, '../../.env') });
}

if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  // Clean up any potential carriage returns or spaces from common environment editors
  Object.keys(process.env).forEach(key => {
    if (typeof process.env[key] === 'string') {
      process.env[key] = process.env[key].trim().replace(/\r$/, '');
    }
  });
  console.log('Environment variables loaded and sanitized');
}
