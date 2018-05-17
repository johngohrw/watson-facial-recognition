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


    it("getAverageAge() returns the overall age average from the faces detected",
        function (done) {
            this.timeout(networkTimeout);
            const filePath = "./test_images/test1.jpg";
            faces.vrRequest(filePath, (response) => {
                const totalfaces = functions.numberOfFaces(response);
                const averageAge = functions.getAverageAge(response, totalfaces);
                expect(averageAge).to.be.within(20, 30);
                done();
            });
        });


    it("getAverageAge() returns 0 if no faces detected",
        function (done) {
            this.timeout(networkTimeout);
            const filePath = "./test_images/test2.jpg";
            faces.vrRequest(filePath, (response) => {
                const totalfaces = functions.numberOfFaces(response);
                const averageAge = functions.getAverageAge(response, totalfaces);
                expect(averageAge).to.equal(0);
                done();
            });
        });
});
