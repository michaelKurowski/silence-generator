const recorder = require('node-record-lpcm16')
const fs = require('fs')
const wav = require('wav')
const childProcess = require('child_process')

const options = {
  sampleRate: 44100,
  audioType: 'raw',
  treshold: 0.5,
  channels: 1,
  silence: '0',
  thresholdEnd: 0.5,
  endOnSilence: true
}

record()

async function record() {
  while(true) {
    try {
      await detectLoudSoundBurst()
      console.log('muted')
      await muteMicrophone()
      await sleep()
      console.log('unmuted')
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
  return new Promise(resolve => setTimeout(resolve, 5000))
}

async function muteMicrophone() {
  return new Promise(resolve => childProcess.exec( `powershell ${__dirname}\\mute.ps1`, resolve))
}

async function unmuteMicrophone() {
  return new Promise(resolve => childProcess.exec( `powershell ${__dirname}\\unmute.ps1`, resolve))
}