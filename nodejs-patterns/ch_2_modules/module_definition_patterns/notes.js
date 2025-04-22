/*
@ Name Exports

The most basic method for exposing a public API is using named exports, which
involves assigning the values we want to make public to properties of the object
referenced by exports (or module.exports). In this way, the resulting exported
object becomes a container or namespace for a set of related functionalities.

*/

// file logger.js
exports.info = (message) => {
    console.log(`info: ${message}`)
    exports.verbose = (message) => {
        console.log(`verbose: ${message}`)
    }
}

/*
The exported functions are then available as properties of the loaded module, as
shown in the following code:
*/

// file main.js
const logger = require('./logger')
logger.info('This is an informational message')
logger.verbose('This is a verbose message')

/*

Exporting a function
One of the most popular module definition patterns consists of reassigning the
whole module.exports variable to a function. The main strength of this pattern is
the fact that it allows you to expose only a single functionality, which provides a
clear entry point for the module, making it simpler to understand and use;

*/

// file logger.js
module.exports = (message) => {
    console.log(`info: ${message}`)
}

/*

A possible extension of this pattern is using the exported function as a namespace
for other public APIs. This is a very powerful combination because it still gives the
module the clarity of a single entry point (the main exported function) and at the
same time it allows us to expose other functionalities that have secondary or more
advanced use cases. The following code shows us how to extend the module we
defined previously by using the exported function as a namespace:

*/

module.exports.verbose = (message) => {
    console.log(`verbose: ${message}`)
}

// file main.js
const logger = require('./logger')
logger('This is an informational message')
logger.verbose('This is a verbose message')


/*

Exporting a class

A module that exports a class is a specialization of a module that exports a function.
The difference is that with this new pattern we allow the user to create new instances
using the constructor, but we also give them the ability to extend its prototype and
forge new classes.
*/

class Logger {
    constructor(name) {
        this.name = name
    }
    log(message) {
        console.log(`[${this.name}] ${message}`)
    }
    info(message) {
        this.log(`info: ${message}`)
    }
    verbose(message) {
        this.log(`verbose: ${message}`)
    }
}
module.exports = Logger

// file main.js
const Logger = require('./logger')
const dbLogger = new Logger('DB')
dbLogger.info('This is an informational message')
const accessLogger = new Logger('ACCESS')
accessLogger.verbose('This is a verbose message')