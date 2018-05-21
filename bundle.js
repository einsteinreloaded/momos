const fs = require('fs')
const path = require('path')
const esprima = require('esprima')

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

function Module(id, content) {
  this.id = id
  this.content = content
}

// entry function
// @params entryFile
function bundle(entryFile) {
  const modules = {}
  let id = 0

  // recursively reach all modules and load them into modules object
  function fetchModules(file) {
    if (modules[file] !== undefined || !fs.existsSync(file)) return

    let content = fs.readFileSync(file).toString()
    let parsed = esprima.parseScript(content)

    modules[file] = { id, content }
    id++

    if (!parsed) return
    const items = parsed.body.filter(item => item.type === 'VariableDeclaration')

    items.forEach(item => {
      item.declarations.forEach(dec => {
        try {
          if (dec.init['callee'].name === 'require') {
            let moduleName = dec.init['arguments'][0].value
            let src = path.resolve(path.dirname(file), moduleName)
            fetchModules(src)
          }
        }
        catch (e) {

        }
      })
    })
  }


  let entry = path.resolve(__dirname, entryFile)
  fetchModules(entryFile)
  console.log(modules)
}


const filePath = './exp/index.js'
bundle(filePath);
