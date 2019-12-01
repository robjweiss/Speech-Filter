# Speech-Filter
Filters audio files based on language.

## About
This program leverages the [Google Speech-to-Text API](https://cloud.google.com/speech-to-text/) to transcribe audio files and discern the spoken language.

## Goal
This app was created to achieve a specific goal.

I had a collection of around 150 short audio files in two different languages (Japanese and English) mixed together in the same directory. The files were named by number (ex. 001, 002, 003...) with no metadata or other method to determine the language of a given file other than by listening.

I wanted to accomplish three tasks:
1. Keep only the Japanese audio files
2. Rename the files in a meaningful way
3. Maintain MP3 encoding for the finished files

## Design
1. There is a config used for the Speech-to-Text API that specifies languages and alternative languages. I was able to filter out the English audio files from the results by performing a check against the transcription results and the `languageCode` key of the config.

2. Since the audio of my files happened to be one word or expression each, I decided to name them by their transcription.

3. At the time of development, MP3 encoding is unsupported by the Speech-To-Text API. To get around this I used [ffmpeg](https://www.ffmpeg.org/) to batch encode my source MP3 files to FLAC (which is supported), resulting in two identical copies with each encoding. The FLAC files are sent to the API and the MP3 files are piped to the output with the transcribed name.

## Use
1. Prepare MP3 and corresponding FLAC files in a directory
2. Prepare a Google Cloud Project and configure the SDK
3. `npm start`

## Extension
While my particular use case was fairly targeted. This program is well documented and modularized. It can easily be extended and used as a base or an example for further development.