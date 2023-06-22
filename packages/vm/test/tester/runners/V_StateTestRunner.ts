import type {
  CancelReason,
  VitestRunnerConfig,
  VitestRunnerImportSource,
  VitestRunnerInterface,
} from './ViTestRunner'
import type { File, Suite, TaskResult, Test, TestContext } from 'vitest'

export class VStateTestRunner implements VitestRunnerInterface {
  public config: VitestRunnerConfig
  public constructor(config: Partial<VitestRunnerConfig>) {
    this.config = {
      root: process.cwd(),
      setupFiles: [],
      name: 'Vitest',
      passWithNoTests: false,
      sequence: {
        shuffle: false,
        seed: 0,
        hooks: 'stack',
        setupFiles: 'parallel',
      },
      maxConcurrency: 5,
      testTimeout: 5000,
      hookTimeout: 5000,
      ...config,
    }
  }
  public onBeforeCollect?(paths: string[]): unknown {
    return
  }
  public onCollected?(files: File[]): unknown {
    return
  }
  public onCancel?(reason: CancelReason): unknown {
    return
  }
  public onBeforeRunTest?(test: Test): unknown {
    return
  }
  public onBeforeTryTest?(test: Test, retryCount: number): unknown {
    return
  }
  public onAfterRunTest?(test: Test): unknown {
    return
  }
  public onAfterTryTest?(test: Test, retryCount: number): unknown {
    return
  }
  public onBeforeRunSuite?(suite: Suite): unknown {
    return
  }
  public onAfterRunSuite?(suite: Suite): unknown {
    return
  }
  public runSuite?(suite: Suite): Promise<void> {
    return Promise.resolve()
  }
  public runTest?(test: Test): Promise<void> {
    return Promise.resolve()
  }
  public onTaskUpdate?(task: [string, TaskResult | undefined][]): Promise<void> {
    return Promise.resolve()
  }
  public onBeforeRun?(files: File[]): unknown {
    return
  }
  public onAfterRun?(files: File[]): unknown {
    return
  }
  public extendTestContext?(context: TestContext): TestContext {
    return context
  }
  public importFile(filepath: string, source: VitestRunnerImportSource): unknown {
    return
  }
}
