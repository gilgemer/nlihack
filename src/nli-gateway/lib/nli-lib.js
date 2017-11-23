'use strict';

const request = require('request-promise-native');

const config = require('../../../config/config'),
      supportedCollections = Object.values(config.supportedCollections);

// Constructs the query URL according to the given date.
const collectionAdapters = {

  'dan-hadani': function(date) {

    const SEARCH_QUERY = "http://primo.nli.org.il/PrimoWebServices/xservice/search/brief?institution=NNL&loc=local,scope:(NNL)&query=lsr08,exact,%D7%94%D7%A1%D7%A4%D7%A8%D7%99%D7%99%D7%94+%D7%94%D7%9C%D7%90%D7%95%D7%9E%D7%99%D7%AA+%D7%90%D7%A8%D7%9B%D7%99%D7%95%D7%9F+%D7%93%D7%9F+%D7%94%D7%93%D7%A0%D7%99&query=lsr08,exact,{search_date}&indx=1&bulkSize=50&json=true";
    const PRESENTATION_QUERY = "http://iiif.nli.org.il/IIIFv21/DOCID/{identity}/manifest";
    const IMAGE_QUERY = "http://iiif.nli.org.il/IIIFv21/{image_id}/full/576,576/0/default.jpg";

    const START_YEAR = 1965;
    const END_YEAR = 2000;
    let MONTHS = {
            '1' : "%D7%91%D7%99%D7%A0%D7%95%D7%90%D7%A8",
            '2' : "%D7%91%D7%A4%D7%91%D7%A8%D7%95%D7%90%D7%A8",
            '3' : "%D7%91%D7%9E%D7%A8%D7%A5",
            '4' : "%D7%91%D7%90%D7%A4%D7%A8%D7%99%D7%9C",
            '5' : "%D7%91%D7%9E%D7%90%D7%99",
            '6' : "%D7%91%D7%99%D7%95%D7%A0%D7%99",
            '7' : "%D7%91%D7%99%D7%95%D7%9C%D7%99",
            '8' : "%D7%91%D7%90%D7%95%D7%92%D7%95%D7%A1%D7%98",
            '9' : "%D7%91%D7%A1%D7%A4%D7%98%D7%9E%D7%91%D7%A8",
            '10': "%D7%91%D7%90%1950D7%95%D7%A7%D7%98%D7%95%D7%91%D7%A8",
            '11': "%D7%91%D7%A0%D7%95%D7%91%D7%9E%D7%91%D7%A8",
            '12': "%D7%91%D7%93%D7%A6%D7%9E%D7%91%D7%A8"
        };
    let current_year = 1969;
    let formatted_date = date.day + '+' + MONTHS[date.month.toString()] + '+' + current_year.toString();

    return request(SEARCH_QUERY.replace("{search_date}", formatted_date))
            .then(function(search_response) {
                let jsonRes = JSON.parse(search_response);
                let objects =  jsonRes['SEGMENTS']['JAGROOT']['RESULT']['DOCSET']['DOC'];
                if (!objects){
                    return;
                }

                let ret = [];
                let promises = [];

                objects.forEach(function(obj) {
                    let retObj = { };

                    let record_id;
                    let image_id;

                    // Exported Variables:
                    let title;
                    let photographer;
                    let img_url;
                    let archive = "Dan Hadany";
                    let year = current_year;

                    try {
                        record_id = obj['PrimoNMBib']['record']['control']['recordid'];
                    }catch(e){
                        return;
                    }

                    promises.push(request(PRESENTATION_QUERY.replace("{identity}", record_id))
                        .then(function(presentation_response) {
                            let jsonRes = JSON.parse(presentation_response);
                            try{
                                image_id = jsonRes['sequences'][0]['canvases'][0]['images'][0]['@id'];
                            }
                            catch(e){
                                return;
                            }
                            try{
                                title = jsonRes.metadata.filter((obj) => obj.label === 'Title').map((obj) => obj.value);
                            }
                            catch(e){
                                title = "No title available";
                            }
                            try{
                                photographer = jsonRes.metadata.filter((obj) => obj.label === 'The Creator').map((obj) => obj.value);
                            }
                            catch(e){
                                photographer = "IPPA";
                            }
                            img_url = IMAGE_QUERY.replace('{image_id}', image_id);

                            retObj.title = title;
                            retObj.img_url = img_url;
                            retObj.photographer = photographer;
                            retObj.archive = archive;
                            retObj.year = year;
                            ret.push(retObj);
                        }));

                });

                return Promise.all(promises).then(function () {
                    return ret;
                });


            });

  }

};

// Fetches images from the collection.
function getFromCollection(collection) {

  if (!supportedCollections.includes(collection)) {
    throw Error('Collection not supported!');
  }

  let adapter = collectionAdapters[collection];

  function fetch(date) {
    return adapter(date);
  }

  return fetch;
}

module.exports = {
  getFromCollection
};
