const fs = require('fs')
const path = require('path')
const esprima = require('esprima')

// entry function
// @params {String} entryFile
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
    // requires only Variable declarations 
    const items = parsed.body.filter(item => item.type === 'VariableDeclaration')

    items.forEach(item => {
      item.declarations.forEach(dec => {
        if (dec.init['callee'].name === 'require') {
          let moduleName = dec.init['arguments'][0].value
          let src = path.resolve(path.dirname(file), moduleName)
          // recursively fetch modules inside this file
          fetchModules(src)
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
