
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
      'samples': (/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result)||[])[1]
    })

    reader.onerror = reject

    reader.readAsDataURL(blob)
  })

}

/**
 * ASRT词典转json
 * @param {*} dictTxt 
 * @returns 
 */
export const asrtDictTextToJSON = function(dictTxt) {

  let result = {}
  
  dictTxt.split('\n').forEach(item => {
    const row = item.split('\t')
    const s = row[0].substring(0, row[0].length - 1)
    if(!s) return
    const value = result[s]
    if(!value) {
      return result[s] = row[1]
    }
    result[s] += value + row[1]
  })
  return result
}