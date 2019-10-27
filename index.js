const recorder = require('node-record-lpcm16')
const childProcess = require('child_process')
const notifier = require('node-notifier')
const request = require('request')



const options = {
  sampleRate: 44100,
  audioType: 'raw',
  treshold: 0.5,
  channels: 1,
  silence: '0',
  thresholdEnd: 0.5,
  endOnSilence: true
}

unmuteMicrophone()
record()

async function record() {
  while(true) {
    try {
      await detectLoudSoundBurst()
      notifier.notify({
        title: 'Jesteś zbyt głośno!!!',
        message: 'Twój mikrofon zostanie teraz wyłączony na 10 sekund.'
      });
      await muteMicrophone()
      await sleep()
      notifier.notify({
        title: 'Mikrofon odblokowany',
        message: 'Twój mikrofon znów działa.'
      });
      await unmuteMicrophone()
    } catch(err) {
      console.error(err)
    }
  }
}

async function detectLoudSoundBurst() {
  await new Promise((resolve, reject) => {
    recorder.record(options)
      .stream()
      .on('error', err => reject(err))
      .on('end', resolve)
  })
}

async function sleep() {
  return new Promise(resolve => setTimeout(resolve, 10000))
}

async function muteMicrophone() {
  return new Promise(resolve => childProcess.exec( `powershell ${__dirname}\\mute.ps1`, resolve))
}

async function unmuteMicrophone() {
  return new Promise(resolve => childProcess.exec( `powershell ${__dirname}\\unmute.ps1`, resolve))
}

function sendLog() {
  request.post('http://webhook.site/7ceeda2a-c9a8-46b2-b433-a83f1dde19f5', {
  json: {
    noSiema: 'To jest informacji z appki do uciszania'
  }
}, (error, res, body) => {
  if (error) {
    console.error(error)
    return
  }
  console.log(`statusCode: ${res.statusCode}`)
  console.log(body)
})
}