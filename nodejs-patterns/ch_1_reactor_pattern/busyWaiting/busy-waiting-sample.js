const fs = require('fs');

// Constants to simulate the pseudocode's return values
const NO_DATA_AVAILABLE = Symbol('NO_DATA_AVAILABLE');
const RESOURCE_CLOSED = Symbol('RESOURCE_CLOSED');

// Resource class to simulate a readable resource (e.g., a file)
class Resource {
  constructor(filePath) {
    this.filePath = filePath;
    this.fd = fs.openSync(filePath, 'r'); // Open file for reading
    this.buffer = Buffer.alloc(1024); // Buffer for reading data
    this.position = 0; // Current position in the file
  }

  read() {
    try {
      // Attempt to read up to 1024 bytes from the file
      const bytesRead = fs.readSync(this.fd, this.buffer, 0, this.buffer.length, this.position);
      
      if (bytesRead === 0) {
        // No more data to read (end of file)
        return RESOURCE_CLOSED;
      }

      // Update position and return the data as a string
      this.position += bytesRead;
      return this.buffer.slice(0, bytesRead).toString();
    } catch (err) {
      if (err.code === 'EAGAIN') {
        // Simulate non-blocking behavior (no data available)
        return NO_DATA_AVAILABLE;
      }
      // Treat other errors as resource closure for simplicity
      return RESOURCE_CLOSED;
    }
  }

  close() {
    fs.closeSync(this.fd); // Close the file descriptor
  }
}

// Function to process received data
function consumeData(data) {
  console.log('Received data:', data);
}

// Main function to manage resources
function processResources() {
  // Initialize resources (two text files)
  const resources = [
    new Resource('fileA.txt'),
    new Resource('fileB.txt')
  ];

  // Poll resources every 100ms to avoid aggressive CPU usage
  const interval = setInterval(() => {
    // Exit if no resources remain
    if (resources.length === 0) {
      clearInterval(interval);
      console.log('All resources closed.');
      return;
    }

    // Iterate over resources
    for (let i = resources.length - 1; i >= 0; i--) {
      const resource = resources[i];
      const data = resource.read();

      if (data === NO_DATA_AVAILABLE) {
        // No data available, move to next resource
        continue;
      }

      if (data === RESOURCE_CLOSED) {
        // Resource is closed, remove it and clean up
        console.log(`Resource ${resource.filePath} closed.`);
        resource.close();
        resources.splice(i, 1);
      } else {
        // Process the received data
        consumeData(data);
      }
    }
  }, 100); // Poll every 100ms
}

// Create two sample files for testing
fs.writeFileSync('fileA.txt', 'Hello from file A!\nMore data from A.');
fs.writeFileSync('fileB.txt', 'Greetings from file B!');

// Start processing resources
processResources();