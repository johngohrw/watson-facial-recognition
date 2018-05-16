const chai = require('chai');
const expect = chai.expect;

const faces = require('./faces.js');
const functions = require('./functions.js');
const networkTimeout = 100000;

describe("VisualRecognition", function () {
    it("numberOfFaces() returns the number of faces in the given image",
        function (done) {
            this.timeout(networkTimeout);
            const filePath = "./test_images/test1.jpg";
            faces.vrRequest(filePath, (response) => {
                const totalfaces = functions.numberOfFaces(response);
                expect(totalfaces).to.equal(5);
                done();
            });
        });


    it("numberOfFaces() returns 0 number of faces for an image with no faces",
        function (done) {
            this.timeout(networkTimeout);
            const filePath = "./test_images/test2.jpg";
            faces.vrRequest(filePath, (response) => {
                const totalfaces = functions.numberOfFaces(response);
                expect(totalfaces).to.equal(0);
                done();
            });
        });
});
