<script setup>

/**
 * 音频采集
 * @author Du Qingsong
 * @date 2022-09-05
 * @version 1.0.0
 */

import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import {asrtDictTextToJSON, createASRTRequestData} from './../../lib/util/asrt-util'
import {dictText} from '../util/dictText'
import {startRecorder, stopRecorder} from './../util/recorder-util'
import { commandParams, commands } from '../../lib/command/command'
import * as CommandResolve from './../../lib'
import Modal from './modal/Modal.vue';

const message = ref('')

const audios = ref([])

const currentAudio = ref()

let stopTimeoutID = null


const starting = ref(false)
const globalEvent = new Map()

const showModel = ref(false)

onBeforeMount(() => {
	
	CommandResolve.useDict(asrtDictTextToJSON(dictText))
	CommandResolve.registerCommand('open', '打开' )
	CommandResolve.registerCommand('target', '定位', '跳转')
	CommandResolve.registerCommandParams('open', '菜单', '导航', '标图标绘')
	CommandResolve.registerCommandParams('target', '中国', '陕西', '西安', '雁塔区', '吴忠', '定西')
	
})

onMounted(() => {

	document.body.addEventListener('keydown', globalEvent.set('keydown', e => e.code === "Space" && start(showModel.value=true)).get('keydown'))
	document.body.addEventListener('keyup', globalEvent.set('keyup', e => e.code === "Space" && stop(showModel.value=false)).get('keyup'))
})

onUnmounted(() => {
	globalEvent.forEach((fn, eKey) => document.body.removeEventListener(eKey, fn))
})


/**
 * 执行命令
 */
const executeCommand = function(command, params) {

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

const setMessage = function(...msg) {
	console.log(msg)
	message.value = msg.join('<br />')
}

const successHandler = function({blob, duration}) {

	setMessage('录音完成', '大小' + (blob.size/1024).toFixed(2) + 'kb', '时间:' + duration + 'ms')
	audios.value.push({
		dataURL: (window.URL||webkitURL).createObjectURL(blob),
		blob
	})
	starting.value = false
}

const errorHandler = function(err) {
	setMessage('录音失败', err)
	starting.value = false
}

const start = function(){

	if(starting.value) return
	setMessage('录音中....\n松开或移出停止录音')

	startRecorder()
		.then(() => {
			starting.value = true
			stopTimeoutID = setTimeout(() => stopRecorder().then(successHandler).catch(errorHandler), 1000 * 10)
		})
		.catch(() => starting.value = false)
}

const stop = function(){
	
	clearTimeout(stopTimeoutID)

	stopRecorder()
		.then(successHandler)
		.catch(errorHandler)

}

const upload = function(){
	
	setMessage('正在上传识别....')
	const starta = performance.now()
	
	createASRTRequestData(currentAudio.value.blob)
		.then(data => {

			fetch('http://127.0.0.1:20001/speech', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}).then(async resp => {
				if(!resp.ok || resp.status !== 200) {
					throw Error('上传失败')	
				}
				resp = await resp.json() 
				const start = performance.now()
				const {command, params} = CommandResolve.resolveAll(resp.result)
				const end = performance.now()
				message.value = resp.result + '\n执行命令: ' + command + params + '\n耗时: '
				executeCommand(command, params)
				message.value = [`识别拼音${resp.result}`, `执行命令`, `<b>${command} ${params}</b>`, `总计耗时: ${(end-starta).toFixed(2)}ms`, `命令解析耗时: ${(end-start).toFixed(2)}ms`].join('<br />')

			})
		})
		.catch((err) => {
			setMessage('程序异常 ' + err)
			console.error(err)
		})

}

const uploadLocalMav = function() {
	const file = document.createElement('input')
	file.type = 'file'
	file.accept = '.wav'
	file.click()
	file.onchange = function(value) {
		const reader = new FileReader()
		reader.readAsArrayBuffer(file.files.item(0))
		reader.onload = function(e) {
			const blob = new Blob([e.target.result], { type: file.type })
			audios.value.push({
				dataURL: (window.URL||webkitURL).createObjectURL(blob),
				blob
			})
		}
	}
}

const handleChangeAudio = function(audioItem) {
	setMessage(`选择音频 ${audioItem.dataURL}`, ` 大小 ${(audioItem.blob.size / 1024).toFixed(2)} k`);
	currentAudio.value = audioItem
}


</script>


<template>
		<section class="audio-panel" >
    
			<div class="audio-panel__head">

				<button @click="uploadLocalMav" :disabled="starting">添加本地wav</button>

				<button @mousedown="start" @mouseup="stop" @mouseout="stop" >
					<img src="./../assets/icon/audio.svg" width="20" v-if="!starting" />
					<img src="./../assets/icon/audio-fill.svg" width="20" v-else />
				</button>

				<button @click="upload" :disabled="starting || !currentAudio">上传识别</button>

			</div>
			<div class="audio-panel__body">
				<div class="audio-panel__body__list">
					点击选择音频
					<audio v-for="(item, key) in audios" 
									:key="key" 
									:src="item.dataURL"
									controls
									:class="{'--checked': currentAudio === item}"
									@focus="handleChangeAudio(item)" />
					<!-- 当前没有音频文件...<button>+</button> -->
				</div>
				<div class="audio-panel__body__list">
					
					<p>支持命令</p>
					<div><b v-for="item in commands" :key="item">{{item[0]}}:{{item[1].join(',')}},<br/></b></div>
					
					<p>命令参数</p>
					<div><b v-for="item in commandParams" :key="item">{{item[0]}}:{{item[1].join(',')}},<br/></b></div>
				</div>
				<div class="audio-panel__body__results" v-html="message">
				</div>
			</div>
		</section>
		<p><b>按住空格</b> 或 <b>长按右上角麦克风</b> 录音</p>

		<Modal :show="starting && showModel" >

			<img src="./../assets/icon/audio-fill.svg" />
			<template #footer>
				正在录音，松开停止
			</template>
		</Modal>

</template>


<style>
.audio-panel {
	border: 1px solid #ddd;
	border-radius: 4px;
	padding: 20px;
	width: 960px;
}

.audio-panel__head {
	display: flex;
}
.audio-panel__head button {
	margin-right: 20px;
}
.audio-panel__head button:first-child {
	margin-right: auto;
}

.audio-panel__body {
	display: flex;
	margin-top: 20px;
}

@media only screen and (max-width: 768px) {
	.audio-panel__body {
		flex-direction: column;
	}
}

.audio-panel__body__list {
	margin-right: 20px;
}
.audio-panel__body__results,
.audio-panel__body__list {
	border: 1px solid #ddd;
	border-radius: 4px;
	padding: 20px;
	flex: 1;
}

.audio-panel__body__list {
	display: flex;
	flex-direction: column;
	height: 200px;
	overflow: hidden;
	overflow-y: auto;
}
.audio-panel__body__list > audio {
	margin-bottom: 10px;
	width: auto;
	border-radius: 27px;
	min-height: 40px;
}

.audio-panel__body__list > audio.--checked {
	border: 1px solid #646cff;
}
</style>