'use strict';

const request = require('request-promise-native');

// Fetches images from the Dan Hadani collection.
function getDanHadani(date) {

  // Constructs the query URL according to the given date.
  function consturctURL(date) {
    return 'http://primo.nli.org.il/PrimoWebServices/xservice/search/brief?institution=NNL&loc=local,scope:(NNL)&query=lsr08,exact,%D7%94%D7%A1%D7%A4%D7%A8%D7%99%D7%99%D7%94+%D7%94%D7%9C%D7%90%D7%95%D7%9E%D7%99%D7%AA+%D7%90%D7%A8%D7%9B%D7%99%D7%95%D7%9F+%D7%93%D7%9F+%D7%94%D7%93%D7%A0%D7%99&query=lsr08,exact,13+%D7%91%D7%99%D7%95%D7%A0%D7%99+1969&indx=1&bulkSize=50&json=true';
  }

  let url = consturctURL(date);
  return request(url).then((res) => JSON.parse(res));
}


module.exports = {

  fetchers: {
    'dan-hadani': getDanHadani
  },

  getDanHadani
};

