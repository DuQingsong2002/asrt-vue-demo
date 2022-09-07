
/**
 * 全局字典
 * { 'a': '啊啊啊' }
 */
export const dict = {}

/**
 * 命令 (命令 => 对应的关键词)
 */
 export const commands = new Map()

/**
 * 命令参数 (命令 => 对应的参数)
 */
export const commandParams = new Map()

export const useDict = function(json) {
  
  Object.assign(dict, json)
}

export const registerCommand = function(command, ...keywords) {

  if(commands.get(command)) {
    console.warn(`命令${command}已存在`)
  }
  commands.set(command, keywords)
}

export const registerCommandParams = function(command, ...params) {

  let _params = commandParams.get(command)

  if(!_params) {
    return commandParams.set(command, params)
  }
  _params.push(...params)

}
