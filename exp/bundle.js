const path = require('path')

/***
 * 
 *  Idea is to write a simple bundler. 
 *  It bundles through 3 steps.
 *    - Through entry file, recursively reads all `requires` and load them into a module object 
 *          with their key as path, also assign them an id
 *    - In each file replace the require object loaded in the memory
 *    - Write this in the bundler template file
 * 
 */
// entry function
// @params entryFile
function bundle(entryFile) {
  const modules = getAllModules(entryfile)
  console.log(modules)
}


// fetch all modules recursively
function getModules(entryFile) {
  const modules = {}
  let id = 0
  let src = path.resolve(__dirname, entry);
  console.log(src)


  // return the modules object
  return modules
}





const filePath = './exp/index.js'
bundle(filePath);
