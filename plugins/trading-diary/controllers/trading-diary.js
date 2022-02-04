"use strict";

/**
 * trading-diary.js controller
 *
 * @description: A set of functions called "actions" of the `trading-diary` plugin.
 */

const _ = require("lodash");


module.exports = {
  /**
   * Default action.
   *
   * @return {Object}
   */

  index: async (ctx) => {
    // Add your own logic here.
    const res = await strapi.plugins["trading-diary"].services[
      "trading-diary"
    ].index();
    console.log("index", res);
    // Send 200 `ok`
    ctx.response.status = 200;
    ctx.response.body = res;
    return ctx.response;
  },
};
