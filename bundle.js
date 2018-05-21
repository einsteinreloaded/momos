const fs = require('fs')
const path = require('path')
const esprima = require('esprima')

// entry function
// @params {String} entryFile
function bundle(entryFile) {
  entryFile = path.resolve(__dirname, entryFile)
  const modules = {}
  let id = 0

  // recursively reach all modules and load them into modules object
  function fetchModules(file) {
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

  function addIdToRequires(module) {
    module.requires.forEach(obj => {
      obj.id = modules[obj.src].id
    })
    return module

  }

  function createLoadPartOflength(id, length) {
    let string = `loadModule(${id})`
    let len = string.length
    let spacesRequired = length - len
    while (spacesRequired--) {
      string += ' '
    }
    return string
  }

  function replacePathWithModuleId(module) {
    if (!module.requires.length) return module.content

    for (let req of module.requires) {
      let content = module.content
      let length = req.loc[1] - req.loc[0]
      let loadPart = createLoadPartOflength(req.id, length);
      let slice1 = content.slice(0, req.loc[0])
      let slice2 = content.slice(req.loc[1])
      module.content = slice1 + loadPart + slice2
    }

    return module.content
  }

  function bakeIntoFunction(module) {
    let code = []
    let content = replacePathWithModuleId(module)

    code.push('(function(module, exports, loadModule) {')
    code.push(content)
    code.push('})')
    return code.join('\n')
  }


  fetchModules(entryFile)
  let modulesArray = Object.values(modules)
    .map(addIdToRequires)
    .sort((a, b) => a.id - b.id)
    .map(bakeIntoFunction)

  console.log(JSON.stringify(modulesArray))
}


const filePath = './exp/index.js'
bundle(filePath);
