type EVMPerformanceLogEntry = {
  calls: number
  time: number
  gasUsed: number
}

export type EVMPerformanceLogOutput = {
  calls: number // Amount this opcode/precompile was called
  totalTime: number // Amount of seconds taken for this opcode/precompile (rounded to 3 digits)
  avgTimePerCall: number // Avg time per call of this opcode/precompile (rounded to 3 digits)
  gasUsed: number // Total amount of gas used by this opcode/precompile
  millionGasPerSecond: number // How much million gas is executed per second (rounded to 3 digits)
  tag: string // opcode/precompile tag
}

type EVMPerformanceLogs = {
  [tag: string]: EVMPerformanceLogEntry
}

export class Timer {
  private startTime: number
  private runTime = 0
  tag: string

  constructor(tag: string) {
    this.tag = tag
    this.startTime = performance.now()
  }

  pause() {
    this.runTime = this.runTime + performance.now() - this.startTime
  }

  unpause() {
    this.startTime = performance.now()
  }

  time() {
    return (performance.now() - this.startTime + this.runTime) / 1000
  }
}

export class EVMPerformanceLogger {
  private opcodes!: EVMPerformanceLogs
  private precompiles!: EVMPerformanceLogs

  private currentTimer?: Timer

  constructor() {
    this.clear()
  }

  clear() {
    this.opcodes = {}
    this.precompiles = {}
  }

  getLogs() {
    // Return nicely formatted logs
    function getLogsFor(obj: EVMPerformanceLogs) {
      const output: EVMPerformanceLogOutput[] = []
      for (const key in obj) {
        const field = obj[key]
        const entry = {
          calls: field.calls,
          totalTime: Math.round(field.time * 1e6) / 1e3,
          avgTimePerCall: Math.round((field.time / field.calls) * 1e6) / 1e3,
          gasUsed: field.gasUsed,
          millionGasPerSecond: Math.round(field.gasUsed / field.time / 1e3) / 1e3,
          tag: key,
        }
        output.push(entry)
      }

      output.sort((a, b) => {
        return b.millionGasPerSecond - a.millionGasPerSecond
      })

      return output
    }

    return {
      opcodes: getLogsFor(this.opcodes),
      precompiles: getLogsFor(this.precompiles),
    }
  }

  // Start a new timer
  // Only one timer can be timing at the same time
  startTimer(tag: string) {
    if (this.currentTimer !== undefined) {
      throw new Error('Cannot have two timers running at the same time')
    }

    this.currentTimer = new Timer(tag)
    return this.currentTimer
  }

  // Pauses current timer and returns that timer
  pauseTimer() {
    const timer = this.currentTimer
    if (timer === undefined) {
      throw new Error('No timer to pause')
    }
    timer.pause()
    this.currentTimer = undefined
    return timer
  }

  // Unpauses current timer and returns that timer
  unpauseTimer(timer: Timer) {
    if (this.currentTimer !== undefined) {
      throw new Error('Cannot unpause timer: another timer is already running')
    }
    timer.unpause()
    this.currentTimer = timer
  }

  // Stops a timer from running
  stopTimer(timer: Timer, gasUsed: number, targetTimer: 'precompiles' | 'opcodes' = 'opcodes') {
    if (this.currentTimer !== undefined && this.currentTimer !== timer) {
      throw new Error('Cannot unpause timer: another timer is already running')
    }
    const time = timer.time()
    const tag = timer.tag
    this.currentTimer = undefined

    // Update the fields
    const target = this[targetTimer]
    if (target[tag] === undefined) {
      target[tag] = {
        calls: 0,
        time: 0,
        gasUsed: 0,
      }
    }
    const obj = target[tag]

    obj.calls++
    obj.time += time
    obj.gasUsed += gasUsed
  }
}
