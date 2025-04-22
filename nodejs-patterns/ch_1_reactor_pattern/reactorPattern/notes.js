/*

## The reactor pattern

    We can now introduce the reactor pattern, which is a specialization of the algorithms
presented in the previous sections (busyWaiting and demultiplexing). The main idea behind the 
reactor pattern is to have a handler associated with each I/O operation. A handler in Node.js is
represented by a callback (or cb for short) function.

The handler will be invoked as soon as an event is produced and processed by the
event loop.

    A Node.js application will exit when there are no more pending
    operations in the event demultiplexer, and no more events to be
    processed inside the event queue.

    The reactor pattern

    Handles I/O by blocking until new events are available from a set
    of observed resources, and then reacts by dispatching each event to
    an associated handler.


    Libuv, the I/O engine of Node.js
    
        Each operating system has its own interface for the event demultiplexer: epoll on
    Linux, kqueue on macOS, and the I/O completion port (IOCP) API on Windows. On
    top of that, each I/O operation can behave quite differently depending on the type
    of resource, even within the same operating system. In Unix operating systems, for
    example, regular filesystem files do not support non-blocking operations, so in order
    to simulate non-blocking behavior, it is necessary to use a separate thread outside the
    event loop.

        All these inconsistencies across and within the different operating systems required
    a higher-level abstraction to be built for the event demultiplexer. This is exactly why
    the Node.js core team created a native library called libuv, with the objective to make
    Node.js compatible with all the major operating systems and normalize the non-
    blocking behavior of the different types of resource. Libuv represents the low-level
    I/O engine of Node.js and is probably the most important component that Node.js is
    built on.

        Other than abstracting the underlying system calls, libuv also implements the reactor
    pattern, thus providing an API for creating event loops, managing the event queue,
    running asynchronous I/O operations, and queuing other types of task.

    A great resource to learn more about libuv is the free online book
    created by Nikhil Marathe, which is available at nodejsdp.link/
    uvbook.


    The recipe for Node.js

    The reactor pattern and libuv are the basic building blocks of Node.js, but we need
    three more components to build the full platform:
 
        A set of bindings responsible for wrapping and exposing libuv and other
        low-level functionalities to JavaScript.

        V8, the JavaScript engine originally developed by Google for the Chrome
        browser. This is one of the reasons why Node.js is so fast and efficient. V8 is
        acclaimed for its revolutionary design, its speed, and for its efficient memory
        management.
    
        A core JavaScript library that implements the high-level Node.js API.


        ## NODEJS release cycles 
        
            You can find out more about the Node.js release cycles
            at nodejsdp.link/node-releases. Also, you can find
            the reference for the engines section of package.json at
            nodejsdp.link/package-engines. Finally, you can get an
            idea of what ES feature is supported by each Node.js version at
            nodejsdp.link/node-green.

        We should also mention that, nowadays, most JavaScript virtual machines (VMs)
            (and also Node.js) support WebAssembly (Wasm), a low-level instruction format
            that allows us to compile languages other than JavaScript (such as C++ or Rust)
            into a format that is "understandable" by JavaScript VMs. This brings many of
            the advantages we have mentioned, without the need to directly interface with
            native code.

*/