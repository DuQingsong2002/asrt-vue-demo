<script setup>
import { ref } from 'vue'
import AudioCapture from './AudioCapture.vue';

defineProps({
  msg: String
})

</script>

<template>

  <div class="card">
    <AudioCapture />
  </div>

  <p>
    ASRT
    <a href="https://github.com/nl8590687/ASRT_SpeechRecognition" target="_blank"
      >https://github.com/nl8590687/ASRT_SpeechRecognition</a
    >, 一个基于深度学习的中文语音识别系统
  </p>
  <p>
    Recorder
    <a href="https://github.com/xiangyuecn/Recorder" target="_blank"
      >https://github.com/xiangyuecn/Recorder</a
    >, 用于html5录音
  </p>
  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
