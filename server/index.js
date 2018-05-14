const VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
const fs = require('fs');

const versionVal = "2018-03-19";
const keyVal = "389d6eadabd21097d8ad91c39d990c6e376ec923";
const visualRecognition = new VisualRecognitionV3({
    version: versionVal,
    api_key: keyVal
});


const images_file = fs.createReadStream('./Ginni_Rometty.jpg')

const params = {
      images_file: images_file
};

visualRecognition.detectFaces(params, (err, response) => {
      if (err)
          console.log(err);
      else
          console.log(JSON.stringify(response, null, 2))
});

