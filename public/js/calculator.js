const Calculator = {
    compute(data, rate = 250) {
        const orders = parseFloat(data.orders) || 0;
        const confirmationRate = parseFloat(data.confirmationRate) || 0;
        const deliveryRate = parseFloat(data.deliveryRate) || 0;
        const adSpend = parseFloat(data.adSpend) || 0;
        const cpr = parseFloat(data.cpr) || 0;
        const clicks = parseFloat(data.clicks) || 0;
        
        // Prices entered in DZD
        const sellingPriceDZD = parseFloat(data.sellingPriceDZD) || 0;
        const productCostDZD = parseFloat(data.productCostDZD) || 0;
        const sellingPrice = sellingPriceDZD / rate;
        const productCost = productCostDZD / rate;

        const confirmed = orders * (confirmationRate / 100);
        const delivered = confirmed * (deliveryRate / 100);
        
        // COD: Revenue ONLY from DELIVERED orders
        const revenue = delivered * sellingPrice;
        const revenueDZD = delivered * sellingPriceDZD;
        
        // COD: Product cost ONLY for DELIVERED orders
        const productCostDelivered = delivered * productCost;
        const productCostDeliveredDZD = delivered * productCostDZD;
        
        // Coût par Achat Livré (per unit, for display)
        const costPerDelivered = delivered > 0 ? adSpend / delivered : 0;
        const costPerDeliveredDZD = costPerDelivered * rate;
        
        // PROFIT = Revenue(Livré) - CoûtProduit(Livré) - DépensesPub(TOTALES)
        const profit = revenue - productCostDelivered - adSpend;
        const profitDZD = revenueDZD - productCostDeliveredDZD - (adSpend * rate);
        
        // Profit Per Unit = Profit / Commandes Livrées
        const profitPerUnit = delivered > 0 ? profit / delivered : 0;
        const profitPerUnitDZD = delivered > 0 ? profitDZD / delivered : 0;
        
        const cprCalc = orders > 0 ? adSpend / orders : 0;
        const roas = adSpend > 0 ? revenue / adSpend : 0;
        
        // AOV based on DELIVERED orders
        const aov = delivered > 0 ? revenue / delivered : 0;
        const aovDZD = delivered > 0 ? revenueDZD / delivered : 0;
        
        const cprCap = aov - productCost;
        const cprCapDZD = aovDZD - productCostDZD;
        const breakEvenRoas = cprCap > 0 ? aov / cprCap : 0;
        
        const rpc = clicks > 0 ? revenue / clicks : 0;
        const cpc = clicks > 0 ? adSpend / clicks : 0;
        
        return {
            orders, confirmed, delivered, 
            sellingPrice, sellingPriceDZD,
            productCost, productCostDZD,
            revenue, revenueDZD, 
            productCostDelivered, productCostDeliveredDZD,
            profit, profitDZD, 
            profitPerUnit, profitPerUnitDZD,
            adSpend, cpr, cprCalc, 
            costPerDelivered, costPerDeliveredDZD,
            roas, aov, aovDZD,
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
