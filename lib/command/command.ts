
// @ts-nocheck
import { resolveAsrtDictText } from './../util/asrt-util';
import { DictTree, InvertedIndex } from "../types"


/**
 * 全局字典
 * { a: '啊阿...' }
 */
let dict:Map<string, string>

/**
 * 字典树
 */
let dictMap:DictTree

/**
 * 字典树倒排索引，
 */
let invertedIndex:InvertedIndex

/**
 * 命令 (命令 => 对应的关键词)
 */
 export const commands:Map<string, string[]> = new Map()

/**
 * 命令参数 (命令 => 对应的参数)
 */
export const commandParams:Map<string, string[]> = new Map()

/**
 * 使用asrt的字典
 * @param asrtDictText 
 */
export const useAsrtDict = function(asrtDictText: string) {
  
  const resolveResult = resolveAsrtDictText(asrtDictText)

  dictMap = resolveResult.tree
  invertedIndex = resolveResult.invertedIndex

}

export const getDict = () => dictMap

export const getInvertedIndex = () => invertedIndex


export const registerCommand = function(command, ...keywords) {

  if(commands.get(command)) {
    console.warn(`命令${command}已存在`)
  }
  commands.set(command, keywords)
}

export const registerCommandParams = function(command, params) {
  return commandParams.set(command, params)

}
