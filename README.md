

# 离线命令识别demo

**服务端下载** https://wiki.ailemon.net/docs/asrt-doc/download

**API文档** https://wiki.ailemon.net/docs/asrt-doc/asrt-doc-1dkgq9td5mvjj

**项目结构**

```
- src
-- assets
--- mav 测试音频文件
--- ...
-- components
--- AudioCapture.vue 音频采集UI
-- util
--- dictText.js asrt的字典
--- ...
- lib
-- command 
--- command-resolve.js 关键字解析相关函数
--- command.js 存放注册字典命令
-- util
---  asrt-util.js asrt 相关的工具函数
```





首先， **一条完整的命令** = **命令** + **参数**

如 打开菜单, 打开即命令，菜单即参数

因此，只要识别出语句中含有的命令+参数就就可以知道执行什么命令了，

帮我打开菜单，我要打开菜单都是打开菜单

有个问题就是三秒后打开菜单也会被识别成打开菜单，这样的话一条完整的命令应该 = **命令 + 参数 + 执行条件** 了，此demo目前还不考虑这种情况!



主要有三部分

- 字典 （所有的可识别文字）{ 'a': ['啊'], 'da': ['打', '大'] }

- 命令=关键字 （支持的命令 { 'open': ['打开'],'target': ['定位', '跳转'] }）

  一个命令可能有多种表述方式

- 命令=参数 (命令参数{ 'open':  ['菜单', '中国'] }）

  命令对应的参数集合

  

## 大概流程

1. ASRT 使用 /speech 接口获取语音的拼音，如 **['da3','kai1','cai4','dan1']**
2. 前端通过自定义的词典获取可能存在的文字 如 **['打', '大', '开', '楷', '菜', '才', '单', '跳', '转']**
3. 根据解析出来的文字 对 命令相关的关键词进行权重分析得到权重最高的命令 如 **open**
4. 如果有命令，就通过解析出来的文字对命令参数进行权重分析得到参数
5. 执行命令



# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.



## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)



# ASRT

一个基于深度学习的中文语音识别系统 https://github.com/nl8590687/ASRT_SpeechRecognition

# Recorder

用于html5录音 https://github.com/xiangyuecn/Recorder



