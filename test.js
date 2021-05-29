function f2() {
    // 'use strict'; // see strict mode
    return this;
  }
  
  f2() === undefined; // true
  console.log("🚀 ~ file: test.js ~ line 6 ~   f2()",   f2())