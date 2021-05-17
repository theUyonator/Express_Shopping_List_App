/*
This Express Error class extends the built in js Error class
it allows you add a status code and a message to the current 
error instance.

The error handling middleware will return this.
*/

class ExpressError extends Error {
    constructor(message, status) {
      super();
      this.message = message;
      this.status = status;
      console.error(this.stack);
    }
  }
  
  
  module.exports = ExpressError;