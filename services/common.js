const Address = require('../models/address');
const Region = require('../models/region');
const Country = require('../models/country');
const Person = require('../models/person');

exports.getNewPersonIdNumber = async function getNewPersonIdNumber(personAddress) {
    try {
        const address = await getAdress(personAddress);
        if (!address) {
            throw new Error('No existe dirección :' + personAddress);
        }

        const region = await getRegion(address.region);
        if (!region) {
            console.log("No existe región :" + address.region)
            return { idNumber: "", idCardNumber: "" };
        }

        const country = await getCountry(region.country);
        if (!country) {
            console.log("No existe país :" + region.country)
            return { idNumber: "", idCardNumber: "" };
        }
        const addressByRegion = await getRegionAddresses(address.region);
        const lastPerson = await Person.find({ address: { $in: addressByRegion } }).sort({ idNumber: -1 }).limit(1).exec();
        const idNumber = lastPerson.length ? lastPerson[0].idNumber + 1 : 1;
        const idCardNumber = country.idNumber.toString() + region.idNumber.toString() + idNumber.toString().padStart(7, '0');
        return { idNumber, idCardNumber };
    } catch (error) {
        console.error(error.message);
        return { idNumber: "", idCardNumber: "" };
    }
};

function getRegionAddresses(regionId) {
    return new Promise((resolve, reject) => {
        Address.find({ region: regionId })
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getCountry(countryId) {
    return new Promise((resolve, reject) => {
        Country.findById(countryId)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getRegion(regionId) {
    return new Promise((resolve, reject) => {
        Region.findById(regionId)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
}

function getAdress(addressId) {
    return new Promise((resolve, reject) => {
        Address.findById(addressId)
            .then(result => {
                resolve(result);
            })
            .catch(err => {
                reject(err);
            });
    });
}

exports.capitalLetters = function capitalLetters(str) {
    const arr = str.split(" ");

    for (var i = 0; i < arr.length; i++) {
        arr[i] = capitalString(arr[i]);
    }

    return arr.join(" ");
};

exports.lowerCaseLetters = function lowerCaseLetters(str) {
    
    if (!str){
        return "";
    }
    
    const arr = str.split(" ");

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].toLowerCase();
    }

    return arr.join(" ");
};

exports.upperCaseLetters = function upperCaseLetters(str) {
    const arr = str.split(" ");

    for (var i = 0; i < arr.length; i++) {
        arr[i] = arr[i].toUpperCase();
    }

    return arr.join(" ");
};

function capitalString(str) {
    if (typeof str !== 'string' || str.length === 0) {
        return str;
    }

    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};