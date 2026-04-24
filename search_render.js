const fs = require('fs');
const files = ['Profile 11', 'Profile 13', 'Profile 14', 'Profile 7', 'Profile 9'];
for (const p of files) {
  try {
    const data = fs.readFileSync('C:\\Users\\Ridham\\.gemini\\antigravity\\History_' + p.replace(' ', ''), 'latin1');
    const matches = data.match(/https?:\/\/[a-zA-Z0-9-]+\.onrender\.com/g);
    if (matches) {
       console.log('Found in ' + p + ':', [...new Set(matches)]);
    }
  } catch(e) { console.error(e) }
}
