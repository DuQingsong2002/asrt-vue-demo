import {ref} from 'vue'

/**
 * 全局字典
 */
export const dict = new Map()
dict.set('a', ['安'])
dict.set('an', ['安', '全'])
dict.set('cai', ['菜'])
dict.set('da', ['打'])
dict.set('dao', ['导'])
dict.set('dan', ['单'])
dict.set('ding', ['定'])
dict.set('hang', ['航'])
dict.set('kai', ['开'])
dict.set('shan', ['陕'])
dict.set('guo', ['国'])
dict.set('wu', ['吴'])
dict.set('ning', ['宁'])
dict.set('xia', ['夏'])
dict.set('biao', ['标'])
dict.set('tu', ['图'])
dict.set('hui', ['绘'])
dict.set('qu', ['区'])
dict.set('ta', ['塔'])
dict.set('wei', ['位'])
dict.set('xi', ['西'])
dict.set('yan', ['雁'])
dict.set('zhong', ['中', '忠'])


/**
 * 命令 (命令 => 对应的词)
 */
 export const commands = new Map()
 commands.set('open', ['打开'])
 commands.set('target', ['定位', '跳转'])

/**
 * 命令参数 (命令 => 对应的参数)
 */
export const commandsParam = new Map()
commandsParam.set('open', ['菜单', '导航', '标图标绘'])
commandsParam.set('target', ['中国', '陕西', '西安', '雁塔区', '吴忠', '定西'])




/**
 * 执行命令
 */
 export const executeCommand = function(command, params) {

  switch(command) {
    case 'open':
      console.log('执行命令: 打开' + params);
      break;
    case 'target':
      console.log('执行命令: 定位' + params);
      break;
    default:
      console.warn(`命令${command}不存在`)
  }
}