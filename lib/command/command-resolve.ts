
// @ts-nocheck
import { globalOptions } from ".."
import { Pin_Yin, Sheng_Diao, Wen_Zi } from "../types"
import { getLCS } from "../util/lcs"
import { commands, commandParams, getDict, getInvertedIndex } from "./command"

/**
 * 多级权重
  权重影响因子 （顺序无关）
   (主要算法类似于 求两个字符串的公共子串)
  0. 全拼最大连续匹配个数
  1. 文字最大连续匹配个数
  2. 全拼连续累计匹配次数 
  3. 文字连续匹配次数
  4. 拼音最大连续匹配个数
  5. 拼音连续匹配次数
  6. 全拼包含个数
  7. 拼音包含个数
  8. 文字包含个数
  9. 各种模糊连续匹配
  10. 各种模糊匹配
 */
type WeightList = [number, number, number, number, number, number, number, number, number, number]

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

    
  const weightMap:Map<string, WeightList> = new Map()
  commands.forEach(command => {
    if(command.length <= speechs.length) {
      weightMap.set(command, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  })

  weightMap.forEach((weight, param) => {
    speechs = speechs.slice(0, param.length)
    language = language.slice(0, param.length)
    // 参数对应的词典树索引
    const paramIndexes = resolveSpeechs(Array.from(param))
    // 索引对应的拼音
    const probSpeechs:string[][] = paramIndexes.map(item => item.map(i => i[0]+i[1]))
    // 
    const probLabels = resolveWordsByIndexes(paramIndexes)

    const L_1_LCS = getLCS(speechs, probSpeechs)
    const L_2_LCS = getLCS(language, probLabels)
    const L_5_LCS = getLCS(speechs.map(s=>s.slice(0, -1)), probLabels.map(i=>i.map(i => i?.slice(0, -1))))
    // const L_2_LCS = getLCS(language, probLabels)
    // const L_2_LCS = getLCS(language, probLabels)
    // 0. 全拼最大连续匹配个数
    // 1. 文字最大连续匹配个数
    // 2. 全拼连续累计匹配次数 
    // 3. 文字连续匹配次数
    // 4. 拼音最大连续匹配个数
    // 5. 拼音连续匹配次数
    // 6. 全拼包含个数
    // 7. 拼音包含个数
    // 8. 文字包含个数
    // 9. 各种模糊匹配
    weight[0] = L_1_LCS.maxLen
    weight[1] = L_2_LCS.maxLen
    // weight[2] = L_1_LCS.total
    // weight[3] = L_2_LCS.total
    weight[4] = L_5_LCS.maxLen
    weight[5] = L_5_LCS.maxLen
    weight[6] = L_5_LCS.maxLen

    
    // 七八级权重分析
    const flatProbSpeechs = probSpeechs.flat()
    speechs.forEach(speech => {
      flatProbSpeechs.forEach(sp => {
        // 三级全拼
        // if(sp === speech) weight[6]++
        // 四级不带音调
        // if(sp.slice(0, -1) === speech.slice(0, -1)) weight[7]++

        if(sp.slice(0, 1) === speech.slice(0, 1)) weight[9]++
      })
    })

    // 五级...
    probLabels.flat(Infinity).forEach((word) => {
      // if(language.includes(word)) {
      //   weight[8]++
      // }
    })

  })

  return Array.from(weightMap)
    .map(item => [item[0], item[1].reduce((r, c, k) => r + c * globalOptions.weightLevel[k], 0)])
    .sort((a,b) => (b[1] as number) - (a[1] as number))[0][0]
}

/**
 * 用户关键字解析（命令参数）
 * @param {String} command 命令
 * @param {Array} speechs 拼音集合
 * @param {String} language 文字
 */
export const resolveCommandParams = function(command: string, speechs: string[], language: string[]) {
  // const words = resolveWords(speechs)
  const params = commandParams.get(command)
  if(!params) return

  // { 命令参数 => 权重 }
  const weightMap:Map<string, WeightList> = new Map()
  params.forEach(item => {
    if(item.length <= speechs.length) {
      weightMap.set(item, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
  })

  // example: da3 kai1 biao1 tu2 biao1 hui4
  // slice(2)
  // 给定一组数据，查找该数据在example中最大连续匹配的次数
  // biao1 tu2

  weightMap.forEach((weight, param) => {
    
    // 参数对应的词典树索引
    const paramIndexes = resolveSpeechs(Array.from(param))
    // 索引对应的拼音
    const probSpeechs:string[][] = paramIndexes.map(item => item.map(i => i[0]+i[1]))
    // 
    const probLabels = resolveWordsByIndexes(paramIndexes)

    const L_1_LCS = getLCS(speechs, probSpeechs)
    const L_2_LCS = getLCS(language, probLabels)
    const L_5_LCS = getLCS(speechs.map(s=>s.slice(0, -1)), probLabels.map(i=>i.map(i => i?.slice(0, -1))))
    // const L_2_LCS = getLCS(language, probLabels)
    // const L_2_LCS = getLCS(language, probLabels)
    // 0. 全拼最大连续匹配个数
    // 1. 文字最大连续匹配个数
    // 2. 全拼连续累计匹配次数 
    // 3. 文字连续匹配次数
    // 4. 拼音最大连续匹配个数
    // 5. 拼音连续匹配次数
    // 6. 全拼包含个数
    // 7. 拼音包含个数
    // 8. 文字包含个数
    // 9. 各种模糊连续匹配
    // 10. 各种模糊匹配
    weight[0] = L_1_LCS.maxLen
    weight[1] = L_2_LCS.maxLen
    // weight[2] = L_1_LCS.total
    // weight[3] = L_2_LCS.total
    weight[4] = L_5_LCS.maxLen
    weight[5] = L_5_LCS.maxLen
    weight[6] = L_5_LCS.maxLen

    
    // 七八级权重分析
    const flatProbSpeechs = probSpeechs.flat()
    speechs.forEach(speech => {
      flatProbSpeechs.forEach(sp => {
        // 三级全拼
        // if(sp === speech) weight[6]++
        // 四级不带音调
        // if(sp.slice(0, -1) === speech.slice(0, -1)) weight[7]++

        if(sp.slice(0, 1) === speech.slice(0, 1)) weight[9]++
      })
    })

    // 五级...
    probLabels.flat(Infinity).forEach((word) => {
      // if(language.includes(word)) {
      //   weight[8]++
      // }
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

  const command = resolveCommand(speechs, language)
  const params = resolveCommandParams(command, speechs.slice(command.length), language.slice(command.length))
  return {
    command,
    params
  }
}

