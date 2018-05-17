
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
    },

    getAverageAge: (response, totalFaces) => {
        if (totalFaces === 0)
            return 0;
        else {
            let ageList = [];
            for (let i = 0; i < totalFaces; i++){
                let thisAge = response.images[0].faces[i].age
                ageList.push(thisAge)
            };

            let avgAgeList = []

            for (let j = 0; j < totalFaces; j++){

                let i = ageList[j]

                var minAge = i.min
                var maxAge = i.max
                var avg = ((maxAge - minAge) / 2) + minAge

                avgAgeList.push(avg)
            }

            var sum = avgAgeList.reduce((a, b) => a + b, 0)
            var finalAvgAge = sum/totalFaces

            return(finalAvgAge)
        }
    }

}
