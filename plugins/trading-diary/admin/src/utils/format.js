const _ = require("lodash");

export const formatOrders = (data) => {
  const formatOrders = [];

  data.forEach((order) => {
    if (
      _.some(formatOrders, {
        product: order.product.name,
        type: order.type,
      })
    ) {
      const findIndex = _.findIndex(formatOrders, {
        product: order.product.name,
        type: order.type,
      });

      formatOrders[findIndex].totalSize = parseFloat(
        (formatOrders[findIndex].totalSize + order.size).toFixed(10)
      );

      formatOrders[findIndex].orders.push({
        id: order.id,
        ticket: order.ticket,
        openPrice: order.openPrice,
        stopLoss: order.stopLoss,
        takeProfit: order.takeProfit,
        swap: order.swap,
        profit: order.profit,
        size: order.size,
        openTime: order.openTime,
      });
    } else {
      formatOrders.push({
        product: order.product.name,
        digits: order.product.digits,
        type: order.type,
        totalSize: order.size,
        orders: [
          {
            id: order.id,
            ticket: order.ticket,
            openPrice: order.openPrice,
            stopLoss: order.stopLoss,
            takeProfit: order.takeProfit,
            swap: order.swap,
            profit: order.profit,
            size: order.size,
            openTime: order.openTime,
          },
        ],
      });
    }
  });

  return formatOrders;
};

export const averagePrice = (orders, totalSize, digits) => {
  const price =
    _.reduce(orders, (acc, order) => acc + order.openPrice * order.size, 0) /
    totalSize;

  return _.floor(price, digits);
};
