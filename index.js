revision = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString().trim()

console.log(revision)