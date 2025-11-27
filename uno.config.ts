import { defineConfig } from 'unocss'
import presetUno from '@unocss/preset-uno'
import presetAttributify from '@unocss/preset-attributify'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify()
  ],
  // 在这里可以添加更多自定义配置
  theme: {
    colors: {
      // 示例：添加自定义颜色
      // primary: '#1677ff',
    }
  },
  shortcuts: {
    // 示例：添加自定义快捷方式
    'flex-center': 'flex items-center justify-center',
  }
})