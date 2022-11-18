
// @ts-nocheck
import { DictTree, InvertedIndex, Pin_Yin, Sheng_Diao } from "../types"

/**
 * 创建asrt请求数据
 * @param {Blob} blob 音频
 */
export const createASRTRequestData = function(blob) {

	const reader = new FileReader()

	return new Promise((resolve, reject) => {

    reader.onloadend = () => resolve({    
      'channels': 1,
      'sample_rate': 16000,
      'byte_width': 2,
      // @ts-ignore
      'samples': (/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result)||[])[1]
    })

    reader.onerror = reject

    reader.readAsDataURL(blob)
  })

}

/**
 * ASRT词典转
 * @param {*} dictTxt 
 * @returns 
 */
export const asrtDictTextToDict = function(dictTxt: string) {

  const result:Map<string, string> = new Map()
  
  dictTxt.split('\n').forEach(item => {
    const [speech, texts] = item.split('\t')
    result.set(speech, texts)
  })
  return result
}

/**
 * asrt 字典解析结果
 */
export interface AsrtDictResolveResult {

  tree: DictTree,
  
  invertedIndex: InvertedIndex

}

/**
 * 解析asrt字典 ， 返回字典树及其倒排索引
 * @param dictText 
 */
export const resolveAsrtDictText = function(dictText: string): AsrtDictResolveResult {

  const tree:DictTree = new Map()
  const invertedIndex:InvertedIndex = new Map()
  
  dictText.split('\n')
    .forEach(item => {

      const [speech, texts] = item.split('\t')
      const pin_Yin:Pin_Yin = speech.slice(0, -1)
      const sheng_diao:Sheng_Diao = Number(speech.slice(-1))

      let sheng_Diao_Map = tree.get(pin_Yin)
      if(!sheng_Diao_Map) {
        tree.set(pin_Yin, (sheng_Diao_Map = new Map()))
      }

      if(!sheng_Diao_Map.get(sheng_diao)) {
        const textList = Array.from(texts)
        sheng_Diao_Map.set(sheng_diao, textList)

        textList.forEach(text => {
          let index = invertedIndex.get(text)
          if(!index) {
            invertedIndex.set(text, (index = []))
          }
          index.push([pin_Yin, sheng_diao])
        })
      }
      
    })
    
    return {
      tree,
      invertedIndex
    }

}