import VM from '../lib'
import { InterpreterStep } from '../lib/evm/interpreter'

// Usage: import the VM and the json trace of the transaction
// This is the raw JSON object which you get from calling debug_traceTransaction on Geth.
export function compareTrace(vm: VM, traceJSON: any) {
  let opCounter = 0
  let diverged = false
  const entryPoint = traceJSON.structLogs
  vm.on('step', (stepEvent: InterpreterStep) => {
    const actualStep = entryPoint[opCounter]
    if (!actualStep || diverged) {
      return
    }
    if (actualStep.pc !== stepEvent.pc) {
      console.log(`PC wrong, have ${stepEvent.pc}, need ${actualStep.pc}`)
      diverged = true
    }
    if (stepEvent.gasLeft.toNumber() !== actualStep.gas) {
      console.log(`Gas wrong, have ${stepEvent.gasLeft.toNumber()}, need ${actualStep.gas}`)
      diverged = true
    }
    // Compare the stack

    const newStack: string[] = []

    stepEvent.stack.forEach((item) => {
      newStack.push(item.toString('hex', 64))
    })

    newStack.forEach((item, index) => {
      if (item !== actualStep.stack[index]) {
        console.log('Stack is wrong. Dumping VM stack: ')
        console.log(newStack)
        console.log('Expected stack: ')
        console.log(actualStep.stack)
        console.log(
          `PC wrong, have ${stepEvent.pc}, step ${opCounter}, current operation ${
            actualStep.op
          }, previous op ${entryPoint[opCounter - 1].op}`
        )
        console.log('Stack at previous operation: ')
        console.log(entryPoint[opCounter - 1].stack)
        diverged = true
      }
    })

    opCounter++
  })
}
