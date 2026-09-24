/**
 * ============================================================================
 * JAVASCRIPT CORE CONCEPTS & ARCHITECTURAL REFERENCE
 * ============================================================================
 * 
 * 1. JavaScript — Event Loop:
 * ----------------------------
 * JavaScript is single-threaded with a non-blocking concurrency model powered by the Event Loop.
 * Structure:
 *   - Call Stack: LIFO execution stack for synchronous function execution.
 *   - Web APIs / Node C++ APIs: Handles timers (setTimeout), network I/O, file system operations.
 *   - Microtask Queue: Highest priority queue for Promises (.then/catch/finally), queueMicrotask(), process.nextTick().
 *   - Macrotask (Task) Queue: Lower priority queue for setTimeout, setInterval, setImmediate, I/O callbacks.
 * 
 * Event Loop Execution Order:
 *   1. Execute all synchronous code on the Call Stack until empty.
 *   2. Drain ALL Microtasks in the Microtask Queue.
 *   3. Dequeue and execute ONE Macrotask from the Task Queue.
 *   4. Repeat step 2 (drain microtasks) then step 3.
 */

export function demonstrateEventLoop() {
  const executionOrder = [];

  executionOrder.push("1: Synchronous Task Start");

  setTimeout(() => {
    executionOrder.push("5: Macrotask (setTimeout 0ms)");
  }, 0);

  Promise.resolve().then(() => {
    executionOrder.push("3: Microtask (Promise 1 resolved)");
  }).then(() => {
    executionOrder.push("4: Microtask (Chained Promise 2)");
  });

  queueMicrotask(() => {
    executionOrder.push("3.5: queueMicrotask executed");
  });

  executionOrder.push("2: Synchronous Task End");

  return executionOrder;
}

/**
 * 2. JavaScript — Promises vs Callbacks:
 * --------------------------------------
 * Callbacks:
 *   - Traditional asynchronous pattern where functions are passed as arguments.
 *   - Drawbacks: Callback Hell (Pyramid of Doom), inverted control, clumsy error propagation (err-first callbacks).
 * 
 * Promises & Async/Await:
 *   - Represent the eventual completion (or failure) of an asynchronous operation and its resulting value.
 *   - States: Pending -> Fulfilled | Rejected (Immutable once settled).
 *   - Benefits: Chaining with .then(), unified try/catch error handling, combinators (Promise.all, Promise.allSettled, Promise.race).
 */

// Legacy Callback Pattern
export function legacyFetchUserData(userId, callback) {
  setTimeout(() => {
    if (!userId) {
      return callback(new Error("User ID is required"), null);
    }
    callback(null, { id: userId, name: "Community Member" });
  }, 100);
}

// Modern Promise & Async/Await Pattern (Promisified)
export function modernFetchUserData(userId) {
  return new Promise((resolve, reject) => {
    legacyFetchUserData(userId, (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
}

/**
 * 3. JavaScript — Hoisting:
 * -------------------------
 * Hoisting is JavaScript's default behavior of moving declarations to the top of the current scope 
 * during the compilation phase before code execution.
 * 
 * Behavior Breakdown:
 *   - Function Declarations: Entire function definition is hoisted. Can be called before declaration.
 *   - 'var' variables: Declaration hoisted and initialized with `undefined`. Access before declaration returns `undefined`.
 *   - 'let' & 'const': Declarations are hoisted but NOT initialized. Access before declaration triggers a `ReferenceError` 
 *     due to the Temporal Dead Zone (TDZ).
 *   - Function Expressions / Arrow Functions: Follow the variable declaration rules (`var` -> undefined, `let/const` -> TDZ).
 */

export function demonstrateHoisting() {
  // Hoisted function declaration
  const funcResult = hoistedFunction(); // Works! Returns "I am fully hoisted"

  function hoistedFunction() {
    return "I am fully hoisted";
  }

  // var hoisting vs let/const Temporal Dead Zone
  var hoistedVar = "var is initialized as undefined during creation phase";
  const tdzConst = "const lives in TDZ until assignment";

  return {
    funcResult,
    hoistedVar,
    tdzConst
  };
}
