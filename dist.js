
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
  (function(module, exports, loadModule) {
const testModule = loadModule(1)          
const module3 = loadModule(3)          

console.log(testModule)
console.log(module3.pokemon)

}),(function(module, exports, loadModule) {
const module2 = loadModule(2)          
const module3 = loadModule(3)          
module.exports = {
  name: 'khubo',
  loves: 'js'
  // age: module2.age
}

}),(function(module, exports, loadModule) {

module.exports = {
  age: 695
}

}),(function(module, exports, loadModule) {
const module1 = loadModule(1)          

module.exports = {
  pokemon: 'pikachu'
}

})
])
