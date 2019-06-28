// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function callbackifyOnRejected(reason: any, cb: any) {
  // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
  // Because `null` is a special error value in callbacks which means "no error
  // occurred", we error-wrap so the callback consumer can distinguish between
  // "the promise rejected with null" or "the promise fulfilled with undefined".
  if (!reason) {
    const newReason = new Error('Promise was rejected with a falsy value') as any
    newReason.reason = reason
    reason = newReason
  }
  return cb(reason)
}

export function callbackify(original: any): any {
  if (typeof original !== 'function') {
    throw new TypeError('The "original" argument must be of type Function')
  }

  // We DO NOT return the promise as it gives the user a false sense that
  // the promise is actually somehow related to the callback's execution
  // and that the callback throwing will reject the promise.
  function callbackified(this: any) {
    const args = []
    for (let i = 0; i < arguments.length; i++) {
      args.push(arguments[i])
    }

    const maybeCb = args.pop()
    if (typeof maybeCb !== 'function') {
      throw new TypeError('The last argument must be of type Function')
    }

    //tslint:disable-next-line no-invalid-this
    const self = this
    const cb = function() {
      return maybeCb.apply(self, arguments)
    }

    // In true node style we process the callback on `nextTick` with all the
    // implications (stack, `uncaughtException`, `async_hooks`)
    //tslint:disable-next-line no-invalid-this
    original.apply(this, args).then(
      function(ret: any) {
        process.nextTick(cb.bind(null, null, ret))
      },
      function(rej: any) {
        process.nextTick(callbackifyOnRejected.bind(null, rej, cb))
      },
    )
  }

  Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original))
  Object.defineProperties(callbackified, Object.getOwnPropertyDescriptors(original))

  return callbackified
}
