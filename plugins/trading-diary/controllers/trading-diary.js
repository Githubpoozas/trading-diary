'use strict';

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

    // Send 200 `ok`
    ctx.send({
      message: 'ok'
    });
  },
  createTrade: (cts) => {
    const { product, type, comment, imageArr } = ctx.request.body;

    if (!product) {
      return ctx.response.badRequest("Please provide product");
    }
    if (!type) {
      return ctx.response.badRequest("Please provide type");
    }
    if (!comment) {
      return ctx.response.badRequest("Please provide comment");
    }
    if (_.isEmpty(imageArr)) {
      return ctx.response.badRequest("Please provide image");
    }

    try {

      


      ctx.response.status = 200;
      ctx.response.body = sanitizeEntity(tradeRes, {
        model: strapi.models.trade,
      });
      return ctx.response;
    } catch (error) {
      console.log("create trade", error);
      ctx.response.status = 400;
      ctx.response.body = error;
      return ctx.response;
    }
  },
};
