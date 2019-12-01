const fs = require('fs');

const speech = require('@google-cloud/speech').v1p1beta1;

const client = new speech.SpeechClient();

// Configuration options for the Speech-to-Text API
const CONFIG = require('../config/api.json');

/**
 * Makes a call to the Google Speech-to-Text API
 * and transcribes the audio provided
 *
 * @param { string } dir A directory containing files
 * @param { string } file The name of a particular audio file within the directory
 * @param { WriteStream } logger A stream to log results to
 * @returns { string } A transcription of the audio
 */
async function recognize(dir, file, logger) {

    try {

        // A request to the API containing the audio file as a base64 encoded string
        const request = {
            config: CONFIG,
            audio: {
                content: (await fs.promises.readFile(dir + file)).toString('base64'),
            },
        };

        // Log and return the transcription result
        const [ response ] = await client.recognize(request);

        const firstResult = response.results.pop();

        // Keep only results with the desired language code
        if (firstResult && firstResult.languageCode === CONFIG.languageCode) {
            const firstAlternative = firstResult.alternatives.pop();

            const { transcript, confidence } = firstAlternative;

            // Log the transcription result and the confidence of the transcription to STDOUT and log file
            const message = `${file}: ${transcript} - ${Math.round(confidence * 100)}%`;

            console.log(message)
            logger.write(message + '\n');

            return transcript;
        }

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

module.exports = recognize;
