export async function wait(delay: number) {
  await new Promise((resolve) => setTimeout(resolve, delay))
}
