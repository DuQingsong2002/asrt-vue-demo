import { dict, commands, commandParams } from "./command"


/**
 * 拼音文字解析
 * @param {Array<String>} speechs 
 */
export const resolveWords = function(speechs) {
	let result = ''
	speechs.forEach(item => {
		result += dict[item.substring(0, item.length - 1)] || ''
	})
	return result
}

/**
 * 命令解析
 * @param {String} words 文字
 */
export const resolveCommand = function(words) {
  
  // { 命令 => 权重 }
  const weightMap = new Map()
  commands.forEach((_, key) => weightMap.set(key, 0))
  
  let result = null

  Array.from(words).forEach((word, key) => {
    for (const item of weightMap) {

      const commandKeywords = commands.get(item[0]).join('')

      if(commandKeywords.includes(word)) {

        const w = item[1] + 1
        weightMap.set(item[0], w)

        if(!result || result[1] < w) {

          result = [item[0], w]
          if(w >= (words.length / 2)) {
            break
          }
        }
      }
    }
  })

  return result ? result[0] : ''
}

/**
 * 用户关键字解析（命令参数）
 * @param {*} words 
 */
export const resolveCommandParams = function(command, words) {

  const params = commandParams.get(command)
  if(!params) return

  // { 命令参数 => 权重 }
  const weightMap = new Map()
  params.forEach(item => weightMap.set(item, 0))

  let result = null
  
  // 从后往前，减小命令关键字对参数计算的影响
  Array.from(words).reverse().forEach((word, key) => {
    
    for (const key of weightMap) {

      if(key[0].includes(word)) {

        const w = key[1]+1
        weightMap.set(key[0], w)

        if(!result || result[1] < w) {
          result = [key[0], w]
          if(w >= (words.length / 2)) {
            break
          }
        }
      }
    }
  })
  return result ? result[0] : ''
}

/**
 * 解析命令+参数
 * @param {Array} speechs 拼音
 */
export const resolveAll = function(speechs) {

  const words = resolveWords(speechs)
  const command = resolveCommand(words)
  const params = resolveCommandParams(command, words)

  return {
    words,
    command,
    params
  }
}

