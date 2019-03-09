const fs = require('fs');
fs.createReadStream('src/index.html')
.pipe(fs.createWriteStream('dist/browser/index.html'));