/*

### The revealing module pattern

    One of the bigger problems with JavaScript in the browser is the lack of
namespacing. Every script runs in the global scope; therefore, internal application
code or third-party dependencies can pollute the scope while exposing their own
pieces of functionality. This can be extremely harmful. Imagine, for instance, that a
third-party library instantiates a global variable called utils. If any other library, or
the application code itself, accidentally overrides or alters utils, the code that relies
on it will likely crash in some unpredictable way. Unpredictable side effects can also
happen if other libraries or the application code accidentally invoke a function of
another library meant for internal use only.


*/

const myModule = (() => {
    const privateFoo = () => { }
    const privateBar = []
    const exported = {
        publicFoo: () => { },
        publicBar: () => { }
    }
    return exported
})() // once the parenthesis here are parsed, the function
// will be invoked
// console.log(myModule)
// console.log(myModule.privateFoo, myModule.privateBar)


//the idea behind this pattern is used as a base for the CommonJS module system

/*

    CommonJS modules

    CommonJS is the first module system originally built into Node.js. Node.js'
    CommonJS implementation respects the CommonJS specification, with the addition
    of some custom extensions.

        require is a function that allows you to import a module from the local filesystem

        exports and module.exports are special variables that can be used to export
public functionality from the current module

*/