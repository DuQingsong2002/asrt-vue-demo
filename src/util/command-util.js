import { dict, commands, commandsParam } from "../store/command"


/**
 * 拼音文字解析
 * @param {Array<String>} speechs 
 */
export const wordsResolver = function(speechs) {
	let result = []
	speechs.forEach(item => {
		result.push(...(dict.get(item.substring(0, item.length - 1)) || []))
	})
	return result
}

/**
 * 命令解析
 * @param {Array} words 文字
 */
export const commandResolver = function(words) {
  
  // { 命令 => 权重 }
  const weightMap = new Map()
  commands.forEach((_, key) => weightMap.set(key, 0))
  
  let result = null
  words.forEach((word, key) => {
    for (const item of weightMap) {

      const commandKeywords = commands.get(item[0]).join('')

      if(commandKeywords.includes(word)) {

        weightMap.set(item[0], item[1]+1)
        if(!result || result[1] < item[1]+1) {
          result = [item[0], item[1]+1]
          if(item[1]+1 > words.length - key) {
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
export const commandParamResolver = function(command, words) {

  const params = commandsParam.get(command)
  if(!params) return

  // { 命令参数 => 权重 }
  const weightMap = new Map()
  params.forEach(item => weightMap.set(item, 0))

  let result = null
  words.forEach((word, key) => {
    
    for (const key of weightMap) {
      if(key[0].includes(word)) {
        weightMap.set(key[0], key[1]+1)
        if(!result || result[1] < key[1]+1) {
          result = [key[0], key[1]+1]
          if(key[1]+1 > words.length - key) {
            break
          }
        }
      }
    }
  })
  return result ? result[0] : ''
}

