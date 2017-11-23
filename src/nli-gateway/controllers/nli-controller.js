'use strict';

const nli = require('../nli-lib');

module.exports = {

  get: function (req, res, next) {

    let date = req.body.date;
    let promises = [];

    function returnResults(results) {
      return res.json(results);
    }

    Object.values(nli.fetchers)
          .forEach(function (fetcher) {
            promises.push(fetcher(date))
          });

    Promise.all(promises)
           .then(returnResults)
           .catch(console.log);
  }

};
