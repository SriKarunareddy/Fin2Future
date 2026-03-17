import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const content = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');

console.log('--- ENV CHECK ---');
content.split('\n').filter(l => l.includes('CLOUDINARY')).forEach(line => {
  const trimmed = line.trim();
  console.log(`Original: "${line}" (Length: ${line.length})`);
  console.log(`Trimmed: "${trimmed}" (Length: ${trimmed.length})`);
  if (line.length !== trimmed.length) {
    console.log('!!! WARNING: Trailing/Leading whitespace detected !!!');
  }
});
