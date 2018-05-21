module.exports = `
(function(modules) { 
  // temporary cache for modules
  var moduleCache = {}

  // core require function
  function loadModule(moduleId) {

    // avoid reloading module
    if(moduleCache[moduleId]) {
      return moduleCache[moduleId].exports;
    }

    // Create and cache the module
    var module = moduleCache[moduleId] = {
      i: moduleId,
      exports: {}
    }

    // Execute the loaded module (function)
    modules[moduleId].call(module.exports, module, module.exports, loadModule)


    // return the exports
    return module.exports
  }


  // Load entry module and return exports
  return loadModule(0)
})
/*** replace with real modules here ****/
([
  {{modules}}
])
`
