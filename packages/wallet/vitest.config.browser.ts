import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from '../../config/vitest.config.browser'

export default mergeConfig(baseConfig, defineConfig({}))
