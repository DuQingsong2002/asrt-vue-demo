
let instance = null
let recording = false

const getRecorder = function() {

  return instance || (instance = new Recorder({
    type: "wav",
    sampleRate: 16000,
    bitRate: 16
  }))

}

/**
 * 开始录音
 * @returns {Promise}
 */
export const startRecorder = function() {

  if(recording) {
    
    return
  }

  const recorder = getRecorder()

  recording = true

  return new Promise((resolve, reject) => {

    recorder.open(() => resolve(recorder.start()), reject)
  })
} 

/**
 * 停止录音
 * @returns {Promise}
 */
export const stopRecorder = function() {

  const recorder = getRecorder()

  return new Promise((resolve, reject) => {

    if(!recording) {
      return reject()
    }

    recorder.stop((blob, duration) => {
      resolve({blob, duration})
      recorder.close()
      recording = false
    }, (err) => {
      reject(err)
      recorder.close()
      recording = false
    })
  })
}