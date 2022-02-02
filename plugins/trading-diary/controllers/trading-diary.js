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
  createTrade: async (ctx) => {
    const { product, type, comment, imageArr } = ctx.request.body;
    console.log("createTrade", product, type, comment, imageArr);

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
      // const source = await tinify.fromFile(imageArr[0].file);

      console.log(source);

      ctx.response.status = 200;
      // ctx.response.body = sanitizeEntity(tradeRes, {
      //   model: strapi.models.trade,
      // });
      ctx.response.body = "ok";
      return ctx.response;
    } catch (error) {
      console.log("create trade", error);
      ctx.response.status = 400;
      ctx.response.body = error;
      return ctx.response;
    }
  },
};
