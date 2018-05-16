
module.exports = {
    // count number of faces
    numberOfFaces: (response) => {
        return response.images[0].faces.length;
    },

    // check genders in image
    getGenderList: (response, totalFaces) => {
        let glist = [];
        for (let i = 0; i < totalFaces; i++){
            let thisGender = response.images[0].faces[i].gender.gender
            glist.push(thisGender)
        };
        return glist;
    },

    getFaceCoords: (response, totalFaces) => {

        let dList = [];
        for (let i = 0; i < totalFaces; i++){
            let thisDimension = response.images[0].faces[i].face_location
            dList.push(thisDimension)
        };

        let coordList = []
        let tempList = []

        for (let j = 0; j < totalFaces; j++){

            let i = dList[j]

            var xCoord = i.left
            var yCoord = i.top

            tempList.push({x: xCoord, y: yCoord})
            tempList.push({x: xCoord+i.width, y: yCoord})
            tempList.push({x: xCoord, y: yCoord+i.height})
            tempList.push({x: xCoord+i.width, y: yCoord+i.height})

            coordList.push(tempList)
            tempList = []
        }
        return dList;
    }
}
