'use strict';

const config = require('../../../config/config'),
      nli = require('../lib/nli-lib');

module.exports = {

  get: function (req, res, next) {

    let date = {
      day: req.query.day,
      month: req.query.month
    };

    let promises = [];

    function modifyResults(results) {

      results = [].concat.apply([], results);

      return new Promise(function(resolve, reject) {

        results = results.map(function(result) {
          result.title = result.title.replace(new RegExp('<br>', 'g'), '');
          return result;
        });

        results = results.filter(function(result) {
          return result.title.split(' ').length > 4;
        });

        resolve(results);
      });
    }

    function returnResults(results) {
      return res.json(results);
    }

    // Fetch data from supported collections.
    Object.values(config.supportedCollections)
          .forEach((collection) => promises.push(nli.getFromCollection(collection)(date)));

    Promise.all(promises)
           .then(modifyResults)
           .then(returnResults)
           .catch(console.log);
  }

};
