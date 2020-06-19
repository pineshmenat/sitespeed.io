'use strict';

const throwIfMissing = require('../../support/util').throwIfMissing;
const log = require('intel').getLogger('sitespeedio.plugin.mysqldb');
const Sender = require('./sender');
const DataGenerator = require('./data-generator');

module.exports = {
  open(context, options) {
    throwIfMissing(options.mysqldb, ['host', 'database'], 'mysqldb');
    this.filterRegistry = context.filterRegistry;
    log.debug(
      'Setup mysqldb host %s and database %s',
      options.mysqldb.host,
      options.mysqldb.database
    );

    const opts = options.mysqldb;
    this.options = options;
    this.timestamp = context.timestamp;
    this.resultUrls = context.resultUrls;
    this.dataGenerator = new DataGenerator(opts);
    this.messageTypesToFireAnnotations = [];
    this.receivedTypesThatFireAnnotations = {};
    this.make = context.messageMaker('mysqldb').make;
    this.sendAnnotation = true;
    this.alias = {};
    this.wptExtras = {};
  },
  processMessage(message, queue) {
    const filterRegistry = this.filterRegistry;
    if ( message.type == "gpsi.pageSummary") {
      let {result, error} = this.dataGenerator.dataFromMessage(message);
      this.sender = new Sender(this.options.mysqldb);
      if (!error) {
        log.info('Send the following data to mysqldb: %:2j', result);
        result.siteType = this.options.siteType;
        result.platform = this.options.mobile ? "Mobile" : "Desktop";
        return this.sender.execute(
          `INSERT INTO lighthouse.metrics (url, siteType, platform, performanceScore, accessibilityScore, best_practices, seo, firstContentfulPaint, fieldFCP, originFCP, firstMeaningfulPaint, 
            largestContentfulPaint, speedIndex, interactive, time)
          VALUES
          (:url, :siteType, :platform, :performanceScore, :accessibilityScore, :best_practices, :seo, :firstContentfulPaint, :fieldFCP, :originFCP, :firstMeaningfulPaint,
            :largestContentfulPaint, :speedIndex, :interactive,  NOW());`,
          result,(err, results, fields) => {
                  if(err) console.log(err); // results contains rows returned by server
                  console.log(results); // results contains rows returned by server
                  console.log(fields);
                });
      } else {
        return Promise.reject(
          new Error(
            'No data to send to mysqldb for message:\n' +
              JSON.stringify(message, null, 2)
          )
        );
      }
    }
  }
};
