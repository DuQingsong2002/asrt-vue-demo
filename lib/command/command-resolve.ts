
// @ts-nocheck
import { globalOptions } from ".."
import { Pin_Yin, Sheng_Diao, Wen_Zi } from "../types"
import { commands, commandParams, getDict, getInvertedIndex } from "./command"

/**
 * 多级权重
 * [ 连续精确匹配次数(音调一致)，连续匹配次数(拼音不包含音调)，精确包含次数(音调一致)，普通包含次数(不包含音调)，模糊权重(待定) ]
 */
type WeightList = [number, number, number, number, number]


/**
 * 拼音文字解析
 * @param {Array<String>} speechs 
 */
 export const resolveWords = function(speechs: string[]) {
	// let result = ''
	// speechs.forEach(item => {
	// 	result += dict[item.substring(0, item.length - 1)] || ''
	// })
	// return result
}

/**
 * 
 * @param texts 文字
 * @returns 
 */
 export const resolveSpeechs = function(texts: Wen_Zi[]) {
  
  const invertedIndex = getInvertedIndex()
	const result:[string, number][] = []
	texts.forEach(text => {
    const index = invertedIndex.get(text)
    // @ts-ignore
    index && result.push(index)
	})
	return result
}

/**
 * 通过索引获取文字
 * @param indexes
 */
export const resolveWordsByIndexes = function(indexes: [Pin_Yin, Sheng_Diao][]) {

  const dict = getDict()
  return indexes.map(item => item.map(inx => dict.get(inx[0])?.get(inx[1])))
}

/**
 * 命令解析
 * @param {Array} speechs 拼音集合
 * @param {String} language 文字
 */
export const resolveCommand = function(speechs: string[], language: string[]) {
  
  // const words = resolveWords(speechs)

  // // { 命令 => 权重 }
  // const weightMap = new Map()
  // commands.forEach((command, key) => {
  //   // 排除命令文字数大于解析文字数量的
  //   if(Math.max(...command.map(i => i.length)) <= speechs.length) {
  //     weightMap.set(key, 0)
  //   }
  // })
  
  // let result = null

  // if(!weightMap.size) {

  //   return result
  // }

  // Array.from(words).forEach((word, key) => {
  //   for (const item of weightMap) {

  //     const commandKeywords = commands.get(item[0]).join('')

  //     if(commandKeywords.includes(word)) {

  //       const w = item[1] + 1
  //       weightMap.set(item[0], w)

  //       if(!result || result[1] < w) {

  //         result = [item[0], w]
  //         if(w >= (words.length / 2)) {
  //           break
  //         }
  //       }
  //     }
  //   }
  // })

  // return result ? result[0] : ''
}

/**
 * 用户关键字解析（命令参数）
 * @param {String} command 命令
 * @param {Array} speechs 拼音集合
 * @param {String} language 文字
 */
export const resolveCommandParams = function(command: string, speechs: string[], language: string[]) {
  // const words = resolveWords(speechs)
  const params = commandParams.get(command || 'target')
  if(!params) return

  // { 命令参数 => 权重 }
  const weightMap:Map<string, WeightList> = new Map()
  params.forEach(item => {
    if(item.length <= speechs.length) {
      weightMap.set(item, [0, 0, 0, 0, 0])
    }
  })

  weightMap.forEach((weight, param) => {
    const paramIndexes = resolveSpeechs(Array.from(param))
    const probSpeechs:string[][] = paramIndexes.map(item => item.map(i => i[0]+i[1]))
    const probLabels = resolveWordsByIndexes(paramIndexes)


    const continuousCounter = {
      firstIndex: -1,
      secondIndex: -1,
      firstSpeechIndex: -1,
      secondSpeechIndex: -1,
      firstLevel: 0,
      secondLevel: 0,
    }

    probSpeechs.forEach((shs, key) => {

      // 一级
      let isFind = false
      // 上次是否有查到，没有就是新的开始
      if(continuousCounter.firstLevel === 0) {
        const newIndex = speechs.findIndex(i => shs.includes(i))
        if(newIndex > -1) {
          continuousCounter.firstLevel++
          continuousCounter.firstSpeechIndex = newIndex 
          continuousCounter.firstIndex = key
          isFind = true
        }else { // 没有匹配重置
          continuousCounter.firstLevel = 0
        }
        
      }else {
        // 如果上次查到了，就用上次索引的下一个匹配
        if(!!speechs.slice(continuousCounter.firstSpeechIndex).find(i => shs.includes(i))) {
          continuousCounter.firstLevel++
          continuousCounter.firstSpeechIndex = key 
          isFind = true
        // 如果下次没有匹配上，刷新
        }else {
          continuousCounter.firstLevel = 0
          const newIndex = speechs.findIndex(i => shs.includes(i))
          if(newIndex > -1) {
            continuousCounter.firstLevel++
            continuousCounter.firstSpeechIndex = newIndex 
            continuousCounter.firstIndex = key 
            isFind = true
          }
        }
      }
      if(isFind) {
        if(continuousCounter.firstLevel > 1) {
          weight[0]++
        }
      }
      
      // 二级
      if(speechs.find(item => shs.find(subItem => subItem.slice(0, -1) === item.slice(0, -1)))) {
        continuousCounter.secondLevel++
        if(continuousCounter.secondLevel > 1) {
          weight[1]++
        }
      }else {
        continuousCounter.secondLevel = 0
      }
    })
    
    // 三四级权重分析
    const flatProbSpeechs = probSpeechs.flat()
    speechs.forEach(speech => {
      flatProbSpeechs.forEach(sp => {
        // 三级全拼
        if(sp === speech) weight[2]++
        // 四级不带音调
        if(sp.slice(0, -1) === speech.slice(0, -1)) weight[3]++
      })
    })

    // 五级...
    probLabels.flat(Infinity).forEach((word) => {
      if(language.includes(word)) {
        weight[4]++
      }
    })
  })
  
  return Array.from(weightMap)
    .map(item => [item[0], item[1].reduce((r, c, k) => r + c * globalOptions.weightLevel[k], 0)])
    .sort((a,b) => (b[1] as number) - (a[1] as number))
}

/**
 * 解析命令+参数
 * @param {Array} speechs 拼音
 * @param {String} language 文字
 */
export const resolveAll = function(speechs: string[], language: string[]) {

  const words = ''??resolveWords(speechs)
  const command = ''??resolveCommand(speechs, language)
  // 去掉识别的命令数量，这里没处理好... ...后面再改了
  const params = resolveCommandParams(command, speechs, language)
  console.debug('>>>', params)
  return {
    words,
    command,
    params
  }
}

