const TextToSpeechV1 = require('watson-developer-cloud/text-to-speech/v1');
const fs = require('fs');

const user = "60f6d8c9-cdca-4b31-a54c-b428d6d7d9cb";
const pw = "FosxPc1nUhkT";
const text_to_speech = new TextToSpeechV1 ({
      username: user,
      password: pw
});

const femaleUSVoice = "en-US_AllisonVoice";
const kawaiiJPVoice = "ja-JP_EmiVoice"; // XD
const brazilian = "pt-BR_IsabelaVoice";
const deutsche = "de-DE_DieterVoice";

module.exports = {
    t2sRequest: (textStr, errCallback, filePath = "public/audio.wav", format = "audio/wav") => {
        const params = {
            text: textStr,
            voice: femaleUSVoice,
            accept: format
        };

        // Pipe the synthesized text to a file.
        text_to_speech.synthesize(params).on('error', errCallback).pipe(fs.createWriteStream(filePath));
    }
}
