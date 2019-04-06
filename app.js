const fs = require('fs');

// Imports the Google Cloud client library
const speech = require('@google-cloud/speech').v1p1beta1;

// Creates a client
const client = new speech.SpeechClient();

const file = './genki-17-vocab-005.mp3';

const config = {
  encoding: 'LINEAR16',
  sampleRateHertz: 44100,
  languageCode: `en-US`,
  alternativeLanguageCodes: [`es-ES`, `en-US`],
};

const audio = {
  content: fs.readFileSync(file).toString('base64'),
};

const request = {
  config: config,
  audio: audio,
};

async function main() {
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    console.log(`Transcription: ${transcription}`);
}

main();