import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.ts'

export default mergeConfig(baseConfig, defineConfig({}))
