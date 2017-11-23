'use strict';

const config = require('../../../config/config'),
      nli = require('../lib/nli-lib');

module.exports = {

  get: function (req, res, next) {

    let date = req.body.date;
    let promises = [];

    function returnResults(results) {
      return res.json(results);
    }

    // Fetch data from supported collections.
    Object.values(config.supportedCollections)
          .forEach((collection) => promises.push(nli.getFromCollection(collection)(date)));

    Promise.all(promises)
           .then(returnResults)
           .catch(console.log);
  }

};
