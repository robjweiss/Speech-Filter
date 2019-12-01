const fs = require('fs');
const readline = require('readline');

const recognize = require('./modules/recognize');
const stream  = require('./modules/stream');

// Interface for interacting with STDIN and STDOUT
const RL = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

async function main() {

    // Read the directory containing the files from STDIN
    const inDir = await new Promise(resolve => {
        RL.question('Enter a path to a directory containing FLAC and MP3 files: ', input => resolve(input));
    });

    RL.close();

    // Create output directory one level up in '/out'
    const dirElements = inDir.split('/');

    // If path was provided with a trailing slash
    if (dirElements[dirElements.length - 1] === '') await dirElements.pop();

    const currentDir = await dirElements.pop();
    dirElements.push(`${currentDir} (transcribed)`);

    const outDir = dirElements.join('/');

    await fs.promises.mkdir(outDir, { recursive: true });

    // Create a stream to log results to
    const logger = fs.createWriteStream(`${outDir}/log.txt`);
    logger.on('error', error => stream.onError(error, logger));

    // Read files and process each
    const files = await fs.promises.readdir(inDir);

    files.forEach( async (file) => {
        // Files to recognize must be encoded FLAC
        if (file.endsWith('.flac')) {
            try {
                await processFile(inDir, file, outDir, logger);
            } catch (error) {
                console.error(error);
                process.exit(1);
            }
        }
    });
}

async function processFile(inDir, file, outDir, logger) {
    // Transcribe the audo file
    const transcript = await recognize(inDir, file, logger);

    if (transcript) {
        // Split file name and extension and grab name
        const [ name ] = file.split('.');

        // Copy the MP3 version of the file to a new file named by the transcription
        const reader = fs.createReadStream(inDir + name + '.mp3');
        const writer = fs.createWriteStream(`${outDir}/${transcript}.mp3`);

        reader.on('error', error => stream.onError(error, reader));
        writer.on('error', error => stream.onError(error, writer));

        reader.pipe(writer);
    }

};

try {
    main();
} catch (error) {
    console.error(error);
    process.exit(1);
}
