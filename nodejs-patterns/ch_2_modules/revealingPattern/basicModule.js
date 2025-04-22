const fs = {
    readFileSync(path, encoding) {

    }
}
/*
    function that loads the content of a module, wraps it into
    a private scope, and evaluates it:
*/

function loadModule(filename, module, require) {
    const wrappedSrc =
        `(function (module, exports, require) {
    ${fs.readFileSync(filename, 'utf8')}
    })(module, module.exports, require)`
    eval(wrappedSrc)
}

/*
    The source code of a module is essentially wrapped into a function, as it was for
    the revealing module pattern. The difference here is that we pass a list of variables
    to the module, in particular, module, exports, and require. Make a note of how
    the exports argument of the wrapping function is initialized with the content
    of module.exports

    Another important detail to mention is that we are using readFileSync to read the
    module's content. While it is generally not recommended to use the synchronous
    version of the filesystem APIs, here it makes sense to do so. The reason for that is
    that loading modules in CommonJS are deliberately synchronous operations. This
    approach makes sure that, if we are importing multiple modules, they (and their
    dependencies) are loaded in the right order. We will talk more about this aspect
    later in the chapter.

    !! Bear in mind that this is only an example, and you will rarely need
    to evaluate some source code in a real application. Features such
    as eval() or the functions of the vm module (nodejsdp.link/vm)
    can be easily used in the wrong way or with the wrong input, thus
    opening a system to code injection attacks. They should always be
    used with extreme care or avoided altogether.

*/


//require function

function require(moduleName) {
    console.log(`Require invoked for module: ${moduleName}`)
    const id = require.resolve(moduleName) // (1)
    if (require.cache[id]) { // (2)
        return require.cache[id].exports
    }
    // module metadata
    const module = {
        exports: {},
        id
        // (3)
    }
    // Update the cache
    require.cache[id] = module // (4)
    // load the module
    loadModule(id, module, require) // (5)
    // return exported variables
    return module.exports // (6)
}
require.cache = {}
require.resolve = (moduleName) => {
    /* resolve a full module id from the moduleName */
}


/*

What our homemade module system does is explained as follows:

    1.  A module name is accepted as input, and the very first thing that we do
    is resolve the full path of the module, which we call id. This task is delegated
    to require.resolve(), which implements a specific resolving algorithm
    (we will talk about it later).


    2.  If the module has already been loaded in the past, it should be available
    in the cache. If this is the case, we just return it immediately.

    3.  If the module has never been loaded before, we set up the environment
    for the first load. In particular, we create a module object that contains
    an exports property initialized with an empty object literal. This object
    will be populated by the code of the module to export its public API.

    4.  After the first load, the module object is cached.


    5.  The module source code is read from its file and the code is evaluated, as
    we saw before. We provide the module with the module object that we just
    created, and a reference to the require() function. The module exports its
    public API by manipulating or replacing the module.exports object.


    6.  Finally, the content of module.exports, which represents the public API
    of the module, is returned to the caller.


    As we can see, there is nothing magical behind the workings of the Node.js module
    system. The trick is all in the wrapper we create around a module's source code and
    the artificial environment in which we run it.

*/

/*

    Defining a module

    By looking at how our custom require() function works, we should now be able
    to understand how to define a module. The following code gives us an example:
*/

// load another dependency
const dependency = require('./anotherModule')
// a private function
function log() {
    console.log(`Well done ${dependency.username}`)
}

// the API to be exported for public use
const hello = module.exports.run = () => {
    log()
}


/*
    The essential concept to remember is that everything inside a module is private
    unless it's assigned to the module.exports variable. The content of this variable is
    then cached and returned when the module is loaded using require().
*/
   

/*

    ## module.exports versus exports

    For many developers who are not yet familiar with Node.js, a common source of
    confusion is the difference between using exports and module.exports to expose a
    public API. The code of our custom require() function should again clear any doubt.
    The exports variable is just a reference to the initial value of module.exports. We
    have seen that such a value is essentially a simple object literal created before the
    module is loaded.
*/

console.log(hello)

/*
    This means that we can only attach new properties to the object referenced by
    the exports variable, as shown in the following code:
*/

// exports.hello = () => {
//     console.log('Hello')
// }

/*

    Reassigning the exports variable doesn't have any effect, because it doesn't change
    the content of module.exports. It will only reassign the variable itself. The following
    code is therefore wrong:
*/

// exports = () => {
//     console.log('Hello')
// }

// console.log(Object.entries(hello))

/*
    If we want to export something other than an object literal, such as a function,
    an instance, or even a string, we have to reassign module.exports as follows:

*/
module.exports = () => {
    console.log('Hello')
}

/*

    The require function is synchronous

    A very important detail that we should take into account is that our
    homemade require() function is synchronous. In fact, it returns the module contents
    using a simple direct style, and no callback is required. This is true for the original
    Node.js require() function too. 

    As a consequence, any assignment to module.exports must be synchronous as well. 
    For example, the following code is incorrect and it will cause trouble:

*/
setTimeout(() => {
    module.exports = function() {}
}, 100)
/*
    The synchronous nature of require() has important repercussions on the way
    we define modules, as it limits us to mostly using synchronous code during
    the definition of a module. This is one of the most important reasons why the
    core Node.js libraries offer synchronous APIs as an alternative to most of the
    asynchronous ones.

    If we need some asynchronous initialization steps for a module, we can always
    define and export an uninitialized module that is initialized asynchronously at
    a later time. The problem with this approach, though, is that loading such a module
    using require() does not guarantee that it's ready to be used. In Chapter 11,
    Advanced Recipes, we will analyze this problem in detail and present some patterns
    to solve this issue elegantly.

    For the sake of curiosity, you might want to know that in its early days, Node.js
    used to have an asynchronous version of require(), but it was soon removed
    because it was overcomplicating a functionality that was actually only meant to be
    used at initialization time and where asynchronous I/O brings more complexities
    than advantages.

 

    ### The resolving algorithm

    The term dependency hell describes a situation whereby two or more dependencies
    of a program in turn depend on a shared dependency, but require different
    incompatible versions. Node.js solves this problem elegantly by loading a different
    version of a module depending on where the module is loaded from. All the
    merits of this feature go to the way Node.js package managers (such as npm or
    yarn) organize the dependencies of the application, and also to the resolving
    algorithm used in the require() function.
 
 
    Let's now give a quick overview of this algorithm. As we saw, the resolve() function
    takes a module name (which we will call moduleName) as input and it returns the full
    path of the module. This path is then used to load its code and also to identify the
    module uniquely. The resolving algorithm can be divided into the following three
    major branches:
 
    File modules: If moduleName starts with /, it is already considered an
    absolute path to the module and it's returned as it is. If it starts with ./,
    then moduleName is considered a relative path, which is calculated starting
    from the directory of the requiring module.


    Core modules: If moduleName is not prefixed with / or ./, the algorithm will
    first try to search within the core Node.js modules.

    Package modules: If no core module is found matching moduleName, then
    the search continues by looking for a matching module in the first node_
    modules directory that is found navigating up in the directory structure
    starting from the requiring module. The algorithm continues to search for
    a match by looking into the next node_modules directory up in the directory
    tree, until it reaches the root of the filesystem.
*/