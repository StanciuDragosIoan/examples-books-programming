resources = [socketA, socketB, fileA]
while (!resources.isEmpty()) {
    for (resource of resources) {
        // try to read
        data = resource.read()
        if (data === NO_DATA_AVAILABLE) {
            // there is no data to read at the moment
            continue
        }
        if (data === RESOURCE_CLOSED) {
            // the resource was closed, remove it from the list
            resources.remove(i)
        } else {
            //some data was received, process it
            consumeData(data)
        }
    }
}

/*

    The resources array contains objects like socketA, socketB, and fileA, which are assumed 
to be readable resources (e.g., network sockets or file streams).

    These resources support a read() method that returns data, a special value NO_DATA_AVAILABLE 
(if no data is ready), or RESOURCE_CLOSED (if the resource is closed)

    # Outer loop:

    The while (!resources.isEmpty()) loop continues as long as there are resources in the resources array.
    This ensures the program keeps checking for data until all resources are closed and removed.


    # Inner Loop

    The for (resource of resources) iterates over each resource in the resources array.
    For each resource, the code attempts to read data using resource.read().

    The read() method can return three types of results:
    
        NO_DATA_AVAILABLE: No data is available to read at the moment, so the loop moves to the 
        next resource (continue).
        
        RESOURCE_CLOSED: The resource is closed (e.g., the socket connection is terminated or 
        the file is fully read). The resource is removed from the resources array (resources.remove(i)).
        
        Other data: If actual data is returned, it is processed by calling consumeData(data).

    Busy-Waiting:
    
        The loop continuously polls all resources in a busy-waiting fashion, repeatedly checking each one for data. 
        This is inefficient because it consumes CPU cycles even when no data is available.

        In real-world applications, non-blocking I/O with event-driven mechanisms (e.g., Node.js's event loop with 
        callbacks, promises, or async/await) is preferred to avoid busy-waiting.

    Observations:

        The read() method is non-blocking, meaning it returns immediately with either data, 
        NO_DATA_AVAILABLE, or RESOURCE_CLOSED.

        The consumeData(data) function processes the received data (e.g., logging it or performing 
        some computation).
        
        The resources.remove(i) operation removes a closed resource from the array.
*/