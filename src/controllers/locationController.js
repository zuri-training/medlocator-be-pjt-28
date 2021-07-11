const {MY_ACCESS_TOKEN:AT} = require("../config/constants");
const turfDistance = require("@turf/distance").default; 
const Drug = require("../models/Drug");
const mbxGeocoder = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingService = mbxGeocoder({ accessToken: AT });


// forwardHandler to forward geocode incoming addresses

module.exports = {
forwardHandler: (req,res,next) => {
    function forwardGeocode(value){
        geocodingService.forwardGeocode({
            query:value,
            countries: ['ng'],
            limit: 1
        })
        .send()
        .then(response => {
            const match = response.body;
            if(match.features.length > 0){
                if(address) req.body.geometry = match.features[0].geometry;
                else if(location) req.body.location = match.features[0].geometry;
            }
            else{
                if(address) req.body.geometry = [];
                else if(location) req.body.location = [];
            }
            next();
        })
        .catch(error => {
            next(error);
        });
    }

    const {location, address} = req.body;
    if(location && typeof(location) == "string" ){
        forwardGeocode(location);
    }
    else if(address && typeof(address) == "string"){
        forwardGeocode(address);
    }
    else{
        next();
    };
    
},

checkCoords: (req,res,next) => {
    function check(value,isLocation,isAddress){
        valArray = value.split(",");
        if(valArray.length == 2){
            valArray[0] = parseFloat(valArray[0]);
            valArray[1] = parseFloat(valArray[1]);
            if(isLocation && valArray[0] && valArray[1]) req.body.location = valArray;
            else if(isAddress && valArray[0] && valArray[1]) req.body.address = valArray;
            next();
        }
        else{
            next();
        }
    }

    const {location, address} = req.body;
    if(location){
        check(location, true, null);
    }
    else if(address){
        check(address, null, true);
    }
    else{
        next();
    }
},

sortStores: (req,res,next) => {
    try{
        const {location, stores} = req.body;
        stores.forEach(drugStore => {
            drugStore.store.distance = turfDistance(location, drugStore.store.geometry);
        });
        stores.sort((a, b) => {
            if (a.store.distance > b.store.distance) {
                return 1;
            }
            if (a.store.distance < b.store.distance) {
                return -1;
            }
            return 0; // a must be equal to b
        });
        req.api_res = {
            status: "success",
            code: 200,
            body: stores,
            message: "Drug stores sorted"
        }
        next();
    } catch(err){
        next(err);
    }
},

findDrugStores: async (req,res,next) => {
    try{
        const {drug} = req.body;
        const drugStores = await Drug.find({ $or: [ {name: drug}, {chemical_name: drug} ] }, "price store", {populate:"store"} );
        req.body.stores = drugStores;
        next();
    } catch(err){
        next(err);
    } 
},

};