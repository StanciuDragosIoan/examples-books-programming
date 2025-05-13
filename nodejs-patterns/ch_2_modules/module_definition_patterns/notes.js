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



/*

Exporting an instance

We can leverage the caching mechanism of require() to easily define
stateful instances created from a constructor or a factory, which can be shared
across different modules. The following code shows an example of this pattern:


*/

// file logger.js
class Logger {
    constructor(name) {
        this.count = 0
        this.name = name
    }
    log(message) {
        this.count++
        console.log('[' + this.name + '] ' + message)
    }
}
module.exports = new Logger('DEFAULT')

//This newly defined module can then be used as follows:

// main.js
const logger = require('./logger')
logger.log('This is an informational message')

/*
Because the module is cached, every module that requires the logger module will
actually always retrieve the same instance of the object, thus sharing its state. This
pattern is very much like creating a singleton. However, it does not guarantee
the uniqueness of the instance across the entire application, as it happens in the
traditional singleton pattern. When analyzing the resolving algorithm, we have seen
that a module might be installed multiple times inside the dependency tree of an
application. This results in multiple instances of the same logical module, all running
in the context of the same Node.js application.


One interesting detail of this pattern is that it does not preclude the opportunity to
create new instances, even if we are not explicitly exporting the class. In fact, we can
rely on the constructor property of the exported instance to construct a new instance
of the same type
*/

const customLogger = new logger.constructor('CUSTOM')
customLogger.log('This is an informational message')

/*
As you can see, by using logger.constructor(), we can instantiate new Logger
objects. Note that this technique must be used with caution or avoided altogether.
Consider that, if the module author decided not to export the class explicitly, they
probably wanted to keep this class private.

*/

/*

Modifying other modules or the global scope

A module can even export nothing. This can seem a bit out of place; however,
we should not forget that a module can modify the global scope and any object
in it, including other modules in the cache. Please note that these are in general
considered bad practices, but since this pattern can be useful and safe under some
circumstances (for example, for testing) and it's sometimes used in real-life projects,
it's worth knowing.

We said that a module can modify other modules or objects in the global scope;
well, this is called monkey patching. It generally refers to the practice of modifying
the existing objects at runtime to change or extend their behavior or to apply
temporary fixes.
*/

// file patcher.js
// ./logger is another module
require('./logger').customMessage = function () {
    console.log('This is a new functionality')
}

require('./patcher')
const logger = require('./logger')
logger.customMessage()

/*

The technique described here can be very dangerous to use. The main concern is
that having a module that modifies the global namespace or other modules is an
operation with side effects. In other words, it affects the state of entities outside their
scope, which can have consequences that aren't easily predictable, especially when
multiple modules interact with the same entities. Imagine having two different
modules trying to set the same global variable, or modifying the same property of
the same module. 


If you want a real-life example of how this can be useful, have
a look at nock (nodejsdp.link/nock), a module that allows you
to mock HTTP responses in your tests. The way nock works is
by monkey patching the Node.js http module and by changing
its behavior so that it will provide the mocked response rather
than issuing a real HTTP request. This allows our unit test to run
without hitting the actual production HTTP endpoints, something
that's very convenient when writing tests for code that relies on
third-party APIs.


*/