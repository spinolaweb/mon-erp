const Calculator = {
    compute(data, rate = 250) {
        const orders = parseFloat(data.orders) || 0;
        const confirmationRate = parseFloat(data.confirmationRate) || 0;
        const deliveryRate = parseFloat(data.deliveryRate) || 0;
        const adSpend = parseFloat(data.adSpend) || 0;
        const cpr = parseFloat(data.cpr) || 0;
        const clicks = parseFloat(data.clicks) || 0;

        // Prices are now in DZD - convert to USD for calculations
        const sellingPriceDZD = parseFloat(data.sellingPriceDZD) || 0;
        const productCostDZD = parseFloat(data.productCostDZD) || 0;
        const sellingPrice = sellingPriceDZD / rate;
        const productCost = productCostDZD / rate;

        const confirmed = orders * (confirmationRate / 100);
        const delivered = confirmed * (deliveryRate / 100);

        const revenue = orders * sellingPrice;
        const revenueDZD = orders * sellingPriceDZD;
        const totalProductCost = orders * productCost;
        const totalProductCostDZD = orders * productCostDZD;
        const profit = revenue - totalProductCost - adSpend;
        const profitDZD = revenueDZD - totalProductCostDZD - (adSpend * rate);

        // Profit Per Unit
        const profitPerUnit = orders > 0 ? profit / orders : 0;
        const profitPerUnitDZD = orders > 0 ? profitDZD / orders : 0;

        const cprCalc = orders > 0 ? adSpend / orders : 0;
        const costPerDelivered = delivered > 0 ? adSpend / delivered : 0;
        const costPerDeliveredDZD = costPerDelivered * rate;
        const roas = adSpend > 0 ? revenue / adSpend : 0;

        const aov = orders > 0 ? revenue / orders : 0;
        const aovDZD = orders > 0 ? revenueDZD / orders : 0;
        const productCostPerOrder = orders > 0 ? totalProductCost / orders : 0;
        const productCostPerOrderDZD = orders > 0 ? totalProductCostDZD / orders : 0;
        const cprCap = aov - productCostPerOrder;
        const cprCapDZD = aovDZD - productCostPerOrderDZD;
        const breakEvenRoas = cprCap > 0 ? aov / cprCap : 0;

        const rpc = clicks > 0 ? revenue / clicks : 0;
        const cpc = clicks > 0 ? adSpend / clicks : 0;

        return {
            orders, confirmed, delivered, 
            sellingPrice, sellingPriceDZD,
            productCost, productCostDZD,
            revenue, revenueDZD, 
            totalProductCost, totalProductCostDZD,
            profit, profitDZD, 
            profitPerUnit, profitPerUnitDZD,
            adSpend, cpr, cprCalc, 
            costPerDelivered, costPerDeliveredDZD,
            roas, aov, aovDZD,
            productCostPerOrder, productCostPerOrderDZD,
            cprCap, cprCapDZD,
            breakEvenRoas, rpc, cpc, clicks,
            adSpendDZD: adSpend * rate,
            cprDZD: cpr * rate,
            rpcDZD: rpc * rate,
            cpcDZD: cpc * rate,
            rate
        };
    }
};
