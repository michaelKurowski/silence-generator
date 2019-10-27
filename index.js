const recorder = require('node-record-lpcm16')
const fs = require('fs')
const wav = require('wav')
const wavDecoder = require('node-wav')

const file = fs.createWriteStream('test.wav', { encoding: 'binary' })
const reader = new wav.Reader();

reader.on('format', function (format) {
  console.log(format)
});
recorder.record({
  sampleRate: 44100,
  audioType: 'raw',
  treshold: 0.5,
  channels: 1,
  silence: '3.0',
  thresholdEnd: 0.5,
  endOnSilence: true
})
.stream()
.on('error', err => {
  console.error('recorder threw an error:', err)
})
//.pipe(reader)
.on('data', data => {
  console.log('r')
 // const result = wavDecoder.decode(data)
//  console.log(result.channelData)
})
.on('end', () => console.log('end'))