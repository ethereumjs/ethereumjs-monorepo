export const debugLog = (message: string, ...data: unknown[]) => {
  if (!process.env.CI) console.log(message, ...data)
}