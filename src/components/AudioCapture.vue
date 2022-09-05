<script setup>

/**
 * 音频采集
 * @author Du Qingsong
 * @date 2022-09-05
 * @version 1.0.0
 */

import { ref } from 'vue';

const message = ref('')

const audios = ref([])

const currentAudio = ref()

let stopTimeoutID = null


let rec;
const starting = ref(false)

const setMessage = function(...msg) {
	console.log(msg)
	message.value = msg.join('\n')
}
 
const recOpen=function(success){
  rec=Recorder({
      type:"wav",sampleRate:16000,bitRate:16 
      ,onProcess:function(buffers,powerLevel,bufferDuration,bufferSampleRate,newBufferIdx,asyncEnd){
          
          
          
      }
  });

  
  rec.open(function(){
      
      
      
      success&&success();
  },function(msg,isUserNotAllow){
      
			setMessage((isUserNotAllow?"UserNotAllow，":"")+"无法录音:"+msg)
  });
};

 
function recStart(){
  rec.start();
};

 
function recStop(){
  rec.stop(function(blob,duration){
			setMessage(blob, (window.URL||webkitURL).createObjectURL(blob),"时长:"+duration+"ms");
      rec.close();
      rec=null;

			audios.value.push({
				dataURL: (window.URL||webkitURL).createObjectURL(blob),
				blob
			})
      
  },function(msg){
			setMessage("录音失败:"+msg);
      rec.close();
      rec=null;
  });

	starting.value = false
};


const startReocrd = function(event){

	if(starting.value) return
	starting.value = true
	setMessage('录音中....')

	recOpen(function(){
	    recStart();
	    stopTimeoutID = setTimeout(recStop,10000);
	});
}

const endRecord = function(event){
	clearTimeout(stopTimeoutID)
	recStop();
	starting.value = false
	setMessage('录制完成....')
}

const upload = function(){
	
	setMessage('正在上传识别....')
	
	 
	const reader=new FileReader();
	reader.onloadend=function(){
			const data = {    
				'channels': 1,
				'sample_rate': 16000,
				'byte_width': 2,
				'samples': (/.+;\s*base64\s*,\s*(.+)$/i.exec(reader.result)||[])[1]
			}
			fetch('http://127.0.0.1:20001/all', {
				method: 'post',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			}).then(async resp => {
				if(!resp.ok || resp.status !== 200) {
					throw Error('上传失败')	
				}
				message.value = await resp.json()
			}).catch((err) => {
				setMessage('程序异常 ' + err)
			})
	};
	reader.readAsDataURL(currentAudio.value.blob);

}

const uploadLocalMav = function() {
	const file = document.createElement('input')
	file.type = 'file'
	file.accept = 'audio/'
	// file.multiple = true
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


</script>


<template>
		<section class="audio-panel" @keydown.space="startReocrd" @keyup.space="endRecord">
    
			<div class="audio-panel__head">

				<button @click="uploadLocalMav" :disabled="starting">添加本地wav</button>

				<button @mousedown="startReocrd" @mouseup="endRecord" >
					<img src="./../assets/icon/audio.svg" width="20" v-if="!starting" />
					<img src="./../assets/icon/audio-fill.svg" width="20" v-else />
				</button>

				<button @click="upload" :disabled="starting || !currentAudio">上传识别</button>

			</div>
			<div class="audio-panel__body">
				<p class="audio-panel__body__list">
					<audio v-for="(item, key) in audios" 
									:key="key" 
									:src="item.dataURL"
									controls
									:class="{'--checked': currentAudio === item}"
									@focus="currentAudio = item" />
					<!-- 当前没有音频文件...<button>+</button> -->
				</p>
				<p class="audio-panel__body__results">
					{{ message }}
				</p>
			</div>
		</section>
		<p><b>按住空格</b> 或 <b>长按右上角麦克风</b> 录音</p>

</template>


<style>
.audio-panel {
	border: 1px solid #ddd;
	border-radius: 4px;
	padding: 20px;
	width: 600px;
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