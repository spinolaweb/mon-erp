const Calculator = {
    compute(data, rate = 250) {
        const orders = parseFloat(data.orders) || 0;
        const confirmationRate = parseFloat(data.confirmationRate) || 0;
        const deliveryRate = parseFloat(data.deliveryRate) || 0;
        const adSpend = parseFloat(data.adSpend) || 0;
        const cpr = parseFloat(data.cpr) || 0;
        const clicks = parseFloat(data.clicks) || 0;
        const sellingPrice = parseFloat(data.sellingPrice) || 0;
        const productCost = parseFloat(data.productCost) || 0;

        const confirmed = orders * (confirmationRate / 100);
        const delivered = confirmed * (deliveryRate / 100);

        const revenue = orders * sellingPrice;
        const totalProductCost = orders * productCost;
        const profit = revenue - totalProductCost - adSpend;

        const cprCalc = orders > 0 ? adSpend / orders : 0;
        const costPerDelivered = delivered > 0 ? adSpend / delivered : 0;
        const roas = adSpend > 0 ? revenue / adSpend : 0;

        const aov = orders > 0 ? revenue / orders : 0;
        const productCostPerOrder = orders > 0 ? totalProductCost / orders : 0;
        const cprCap = aov - productCostPerOrder;
        const breakEvenRoas = cprCap > 0 ? aov / cprCap : 0;

        const rpc = clicks > 0 ? revenue / clicks : 0;
        const cpc = clicks > 0 ? adSpend / clicks : 0;

        return {
            orders, confirmed, delivered, revenue, profit, totalProductCost,
            adSpend, cpr, cprCalc, costPerDelivered, roas, aov, 
            productCostPerOrder, cprCap, breakEvenRoas, rpc, cpc, clicks,
            revenueDZD: revenue * rate,
            profitDZD: profit * rate,
            adSpendDZD: adSpend * rate,
            cprDZD: cpr * rate,
            cprCapDZD: cprCap * rate,
            costPerDeliveredDZD: costPerDelivered * rate,
            rpcDZD: rpc * rate,
            cpcDZD: cpc * rate,
            rate
        };
    }
};
