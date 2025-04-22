const fs = require('fs');

// Constants to simulate the pseudocode's return values
const RESOURCE_CLOSED = Symbol('RESOURCE_CLOSED');

// Resource class to wrap a readable stream (e.g., a file stream)
class Resource {
  constructor(filePath) {
    this.filePath = filePath;
    this.stream = fs.createReadStream(filePath, { encoding: 'utf8' });
    this.isClosed = false;
  }

  // Simulate the read() method by consuming available data
  read(data) {
    if (this.isClosed) {
      return RESOURCE_CLOSED;
    }
    if (data) {
      return data;
    }
    return null; // No data available yet (handled by event-driven model)
  }

  close() {
    this.isClosed = true;
    this.stream.close(); // Close the stream
  }
}

// Function to process received data
function consumeData(data) {
  console.log('Received data:', data);
}

// Main function to manage resources using demultiplexing
function processResources() {
  // Initialize resources (two text files)
  const watchedList = new Map(); // Map to track resources and their streams
  const resources = [
    new Resource('fileA.txt'),
    new Resource('fileB.txt')
  ];

  // Add resources to watchedList (simulate watchedList.add(resource, FOR_READ))
  resources.forEach(resource => {
    watchedList.set(resource.stream, resource);
    // Listen for 'data' events (simulates demultiplexer notifying readable events)
    resource.stream.on('data', chunk => {
      const data = resource.read(chunk);
      if (data !== null) {
        consumeData(data);
      }
    });
    // Listen for 'end' or 'error' events (simulates RESOURCE_CLOSED)
    resource.stream.on('end', () => handleResourceClosed(resource));
    resource.stream.on('error', () => handleResourceClosed(resource));
  });

  // Handle resource closure (simulate demultiplexer.unwatch)
  function handleResourceClosed(resource) {
    if (!resource.isClosed) {
      console.log(`Resource ${resource.filePath} closed.`);
      resource.close();
      watchedList.delete(resource.stream); // Remove from watchedList
      // Check if all resources are closed
      if (watchedList.size === 0) {
        console.log('All resources closed.');
      }
    }
  }

  // The Node.js event loop acts as the demultiplexer, so no explicit while loop is needed
}

// Create two sample files for testing
fs.writeFileSync('fileA.txt', 'Hello from file A!\nMore data from A.');
fs.writeFileSync('fileB.txt', 'Greetings from file B!');

// Start processing resources
processResources();