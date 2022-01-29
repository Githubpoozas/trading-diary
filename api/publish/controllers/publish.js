"use strict";

module.exports = {
  async publish(ctx) {
    const { name } = ctx.request.body;

    try {
      const findRes = await strapi.query(name).find({ _limit: -1 });

      const promises = findRes.map(async (item) => {
        if (item.published_at) return;
        const res = await strapi
          .query(name)
          .update({ id: item.id }, { published_at: new Date().toISOString() });
        return res;
      });
      const publishRes = await Promise.all(promises);

      ctx.response.status = 200;
      ctx.response.body = publishRes;
      return ctx.response;
    } catch (error) {
      console.log(`publish ${name} failed: ${error}`);
      ctx.response.status = 400;
      ctx.response.body = error;
      return ctx.response;
    }
  },
};
