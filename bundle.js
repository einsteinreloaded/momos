const fs = require('fs')
const path = require('path')
const esprima = require('esprima')

// entry function
// @params {String} entryFile
function bundle(entryFile) {
  const modules = {}
  let id = 0

  entryFile = path.resolve(__dirname, entryFile)
  // recursively reach all modules and load them into modules object
  function fetchModules(file) {
    console.log('file : ', file)
    if (modules[file] !== undefined || !fs.existsSync(file)) return

    let content = fs.readFileSync(file).toString()
    let parsed = esprima.parseScript(content, {
      range: true
    })

    modules[file] = { id, content, requires: [] }
    id++

    if (!parsed) return
    // requires only Variable declarations 
    const items = parsed.body.filter(item => item.type === 'VariableDeclaration')

    items.forEach(item => {
      item.declarations.forEach(dec => {
        if (dec.init['callee'].name === 'require') {
          let moduleName = dec.init['arguments'][0].value
          let src = path.resolve(path.dirname(file), moduleName)

          // push location and src for each require into that file
          modules[file].requires.push({
            loc: dec.init.range,
            src
          })

          // recursively fetch modules inside this file
          fetchModules(src)
        }
      })
    })
  }


  fetchModules(entryFile)
  let files = Object.keys(modules)
  for (let file of files) {
    const module = modules[file]
    module.requires.forEach(obj => {
      obj.id = modules[obj.src].id;
    })
  }
  console.log(JSON.stringify(modules))
}


const filePath = './exp/index.js'
bundle(filePath);
