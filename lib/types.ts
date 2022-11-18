
/**
 * 拼音（不包含声调）
 */
export type Pin_Yin = string

/**
 * 声调
 */
export type Sheng_Diao = number

/**
 * 文字
 */
export type Wen_Zi = string

/**
 * ASRT 字典转树结构 一级节点拼音 二级节点音调 三级节点字
 */
export type DictTree = Map<Pin_Yin, Map<Sheng_Diao, Wen_Zi[]>>


/**
 * 基于字典树的倒排索引
 */
export type InvertedIndex = Map<Wen_Zi, [Pin_Yin, Sheng_Diao][]>