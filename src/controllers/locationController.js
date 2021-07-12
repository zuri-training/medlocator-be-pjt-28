const {GOOGLE_MAPS_API_KEY:GAT} = require("../config/constants");
const turfDistance = require("@turf/distance").default; 
const Drug = require("../models/Drug");
const {Client} = require("@googlemaps/google-maps-services-js");
const client = new Client({});


// forwardHandler to forward geocode incoming addresses

module.exports = {
forwardHandler: (req,res,next) => {
    function geocode(value){
        client.geocode({
            params:{
                address: value,
                region: "NG",
                key: GAT
            }
        })
        .then(({data})=>{
            if(data.status == "OK"){
                if(address){
                     req.body.geometry = data.results[0].geometry.location;
                     req.body.place_id = data.results[0].place_id;}
                else if(location) req.body.location = data.results[0].geometry.location;
            } else {
                if(address) req.body.geometry = [];
                else if(location) req.body.location = [];
            }
            next();
        })
        .catch(err => {
            const customErr = new Error();
            customErr.message = err.response.data.error_message;
            customErr.status = err.response.status;
            next(customErr);
        })
    }
    const {location, address} = req.body;
    if(location && typeof(location) == "string" ){
        geocode(location);
    }
    else if(address && typeof(address) == "string"){
        geocode(address);
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
            if(isLocation && valArray[0] && valArray[1]) req.body.location = {lat:valArray[0], lng:valArray[1]};
            else if(isAddress && valArray[0] && valArray[1]) req.body.address = {lat:valArray[0], lng:valArray[1]};
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
        if(stores.length > 0){
            stores.forEach(drugStore => {
                const from = [location.lng,location.lat];
                const to = [drugStore.store.geometry.lng, drugStore.store.geometry.lat];
                drugStore.store.distance = turfDistance(from, to);
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
        } else {
            req.api_res = {
                status: "failure",
                code: 200,
                body: stores,
                message: "Drug not found"
            }
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