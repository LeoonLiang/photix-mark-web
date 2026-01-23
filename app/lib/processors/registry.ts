import type { ImageProcessor, ProcessorClass } from './types'

/**
 * 处理器注册表
 */
const processors = new Map<string, ProcessorClass>()

/**
 * 注册处理器
 * @param processor 处理器类
 */
export function registerProcessor(processor: ProcessorClass) {
  const instance = new processor()
  processors.set(instance.name, processor)
  console.log(`[Registry] Registered processor: ${instance.name}`)
}

/**
 * 获取处理器
 * @param name 处理器名称
 * @returns 处理器类，如果未找到则返回 undefined
 */
export function getProcessor(name: string): ProcessorClass | undefined {
  return processors.get(name)
}

/**
 * 获取所有已注册的处理器
 * @returns 所有处理器的 Map
 */
export function getAllProcessors(): Map<string, ProcessorClass> {
  return new Map(processors)
}

/**
 * 清空处理器注册表（用于测试）
 */
export function clearProcessors() {
  processors.clear()
}
