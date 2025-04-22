

watchedList.add(socketA, FOR_READ) // (1)
watchedList.add(fileB, FOR_READ)
while (events = demultiplexer.watch(watchedList)) { // (2)
    // event loop
    for (event of events) { // (3)
        // This read will never block and will always return data
        data = event.resource.read()
        if (data === RESOURCE_CLOSED) {
            // the resource was closed, remove it from the watched list
            demultiplexer.unwatch(event.resource)
        } else {
            // some actual data was received, process it
            consumeData(data)
        }
    }
}

/*
        The provided pseudocode demonstrates a demultiplexing approach to handle multiple resources 
    (e.g., sockets or files) using an event-driven model, typically implemented with a system-level 
    mechanism like select, poll, or epoll (or Node.js's event loop). This is a more efficient alternative 
    to the busy-waiting approach, as it avoids continuously polling resources and instead waits for events 
    indicating that data is available.


    Adding Resources to the Watched List:

        watchedList.add(socketA, FOR_READ) and watchedList.add(fileB, FOR_READ)

            Resources (socketA and fileB) are added to a watchedList, which tracks 
            resources to monitor for specific operations (in this case, FOR_READ, meaning 
            we're interested in read events, i.e., when data is available to read)

            The watchedList is a data structure used by the demultiplexer to monitor 
            multiple resources efficiently.

            The FOR_READ flag indicates that we want to be notified when the resource is 
            readable (e.g., data arrives on a socket or a file has data available).


    Event Loop with Demultiplexer:

        while (events = demultiplexer.watch(watchedList))

            The demultiplexer.watch(watchedList) call blocks (or waits) until at least one resource in 
            watchedList has an event (e.g., data is available to read).

            The demultiplexer returns a list of events, where each event corresponds to a resource that 
            is ready for reading.

            This is the core of the event-driven model: the program waits for notifications from the 
            operating system (via the demultiplexer) rather than actively polling resources.

            Common demultiplexing mechanisms include select, poll, or epoll on Linux, kqueue on macOS/BSD, 
            or IOCP on Windows. In Node.js, this is abstracted by the event loop and libraries like libuv.

        Processing Events:
        
            for (event of events):

                Iterates over the list of events returned by the demultiplexer.
                Each event object contains a reference to the associated resource (e.g., socketA or fileB) 
                and possibly other metadata (e.g., the type of event, though here it’s implicitly a 
                read event).

        Reading Data:

            data = event.resource.read():

                The read() method is called on the resource associated with the event.

                Because the demultiplexer only returns events when a resource is ready, 
                this read() is guaranteed to be non-blocking and will return data immediately 
                (or indicate closure).

                The pseudocode assumes read() returns one of two things:

                    RESOURCE_CLOSED: The resource is closed (e.g., the socket connection is terminated or the 
                    file is fully read).

                    Actual data:  Some data is available to process.

        Handling Read Results:

            if (data === RESOURCE_CLOSED):
                
                If the resource is closed, it is removed from the watchedList using 
                demultiplexer.unwatch(event.resource).

                This ensures the demultiplexer stops monitoring the closed resource.

            else:
                
                If data is received, it is processed by calling consumeData(data) (e.g., 
                logging it or performing some computation).

    
    Key Characteristics:
        
        Efficiency: Unlike busy-waiting, demultiplexing waits for events from the operating system, 
        reducing CPU usage.
        
        Non-Blocking Reads: The read() calls are non-blocking because the demultiplexer ensures the 
        resource is ready.
        
        Scalability: Demultiplexing scales better than busy-waiting, especially for many resources, 
        as it leverages OS-level event notifications.
        
        Event Loop: The while loop represents an event loop, a common pattern in event-driven systems 
        like Node.js.

            
        
*/