'use strict';
const flatten = require('../../support/flattenMessage'),
  merge = require('lodash.merge'),
  clone = require('lodash.clonedeep'),
  util = require('../../support/tsdbUtil'),
  reduce = require('lodash.reduce');

class MySQLDBDataGenerator {
  constructor(options) {
    this.options = options;
  }

  dataFromMessage(message, time, alias) {
    if(message.type.match(( /(^gpsi)/ ))) {
      let psi_result = clone(message.data.data);
      if(typeof(psi_result.lighthouseResult) == "undefined") {
        return {result: null, error: new Error("lighthouseResult is undefined")};
      }
      
      const lighthouseResult = psi_result.lighthouseResult;
      delete psi_result.lighthouseResult;

      const result = {
        url: lighthouseResult.requestedUrl,
        totalTime: lighthouseResult.timing.total,
        performanceScore: lighthouseResult.categories.performance.score,
        accessibilityScore: lighthouseResult.categories.accessibility.score,
        best_practices: lighthouseResult.categories['best-practices'].score,
        seo: lighthouseResult.categories.seo.score,
        originFCP: psi_result.originLoadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.percentile,
        fieldFCP: psi_result.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.percentile,
        ...lighthouseResult.audits.metrics.details.items[0]
      }

      return {result, error: null};
    }
  }
}

module.exports = MySQLDBDataGenerator;
