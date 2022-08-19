// Based on https://github.com/jsoendermann/semaphore-async-await/blob/master/src/Semaphore.ts
export class Semaphore {
  private permits: number
  private promiseResolverQueue: Array<(v: boolean) => void> = []

  /**
   * Creates a semaphore.
   * @param permits  The number of permits, i.e. strands of execution being allowed
   * to run in parallel.
   * This number can be initialized with a negative integer.
   */
  constructor(permits: number) {
    this.permits = permits
  }

  /**
   * Returns a promise used to wait for a permit to become available. This method should be awaited on.
   * @returns  A promise that gets resolved when execution is allowed to proceed.
   */
  public async wait(): Promise<boolean> {
    if (this.permits > 0) {
      this.permits -= 1
      return Promise.resolve(true)
    }

    // If there is no permit available, we return a promise that resolves once the semaphore gets
    // signaled enough times that permits is equal to one.
    return new Promise<boolean>((resolver) => this.promiseResolverQueue.push(resolver))
  }

  /**
   * Increases the number of permits by one. If there are other functions waiting, one of them will
   * continue to execute in a future iteration of the event loop.
   */
  public signal(): void {
    this.permits += 1

    if (this.permits > 1 && this.promiseResolverQueue.length > 0) {
      // eslint-disable-next-line no-console
      console.warn('Semaphore.permits should never be > 0 when there is someone waiting.')
    } else if (this.permits === 1 && this.promiseResolverQueue.length > 0) {
      // If there is someone else waiting, immediately consume the permit that was released
      // at the beginning of this function and let the waiting function resume.
      this.permits -= 1

      const nextResolver = this.promiseResolverQueue.shift()
      if (nextResolver) {
        nextResolver(true)
      }
    }
  }
}
