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
 * @param {Array} speechs 拼音集合
 * @param {String} language 文字
 */
export const resolveCommand = function(speechs, language) {
  
  const words = resolveWords(speechs)

  // { 命令 => 权重 }
  const weightMap = new Map()
  commands.forEach((command, key) => {
    // 排除命令文字数大于解析文字数量的
    if(Math.max(...command.map(i => i.length)) <= speechs.length) {
      weightMap.set(key, 0)
    }
  })
  
  let result = null

  if(!weightMap.size) {

    return result
  }

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
 * @param {String} command 命令
 * @param {Array} speechs 拼音集合
 * @param {String} language 文字
 */
export const resolveCommandParams = function(command, speechs, language) {

  const words = resolveWords(speechs)
  const params = commandParams.get(command)
  if(!params) return

  // { 命令参数 => 权重 }
  const weightMap = new Map()
  params.forEach(item => {
    if(item.length <= speechs.length) {
      weightMap.set(item, 0)
    }
  })
  let result = null
  
  Array.from(words).forEach((word, key) => {
    
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
 * @param {String} language 文字
 */
export const resolveAll = function(speechs, language) {

  const words = resolveWords(speechs)
  const command = resolveCommand(speechs, language)
  // 去掉识别的命令数量，这里没处理好... ...后面再改了
  const params = resolveCommandParams(command, speechs.slice(2), language.slice(2))

  return {
    words,
    command,
    params
  }
}

