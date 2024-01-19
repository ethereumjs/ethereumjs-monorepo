import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser.mts'

const config = mergeConfig(baseConfig, defineConfig({}))

export default config
