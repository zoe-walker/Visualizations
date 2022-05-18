//
// Perform processing following npm install
//
// 1. Update jointjs package.json to force polyfills in code in order to support IE11
//
const fs = require('fs')
const jointPkgFileName = './node_modules/jointjs/package.json'

if (!fs.existsSync(jointPkgFileName))
{
    return console.log('Error: file ' + jointPkgFileName + ' doesn\'t exist');
}
const jointjsPkg = fs.readFileSync(jointPkgFileName, 'utf-8')
const newPkg = jointjsPkg.replace(/\"module\":/, '"module1":')

if (jointjsPkg !== newPkg) {
  fs.writeFileSync(jointPkgFileName, newPkg)
  console.log('Modified ' + jointPkgFileName + ' in order to support IE11 browser')
}