const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure DB exists
if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify({ entries: [], settings: { exchangeRate: 250, businessName: '', defaultPrice: 9.72, defaultCost: 2.88, defaultConfirmation: 70, defaultDelivery: 64.5 } }, null, 2));
}

function readDB() {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// ========== API ROUTES ==========

// Get all entries
app.get('/api/entries', (req, res) => {
    const db = readDB();
    res.json(db.entries);
});

// Create entry
app.post('/api/entries', (req, res) => {
    const db = readDB();
    const entry = { id: Date.now(), ...req.body };
    db.entries.unshift(entry);
    writeDB(db);
    res.status(201).json(entry);
});

// Delete entry
app.delete('/api/entries/:id', (req, res) => {
    const db = readDB();
    db.entries = db.entries.filter(e => e.id != req.params.id);
    writeDB(db);
    res.json({ success: true });
});

// Get settings
app.get('/api/settings', (req, res) => {
    const db = readDB();
    res.json(db.settings);
});

// Update settings
app.post('/api/settings', (req, res) => {
    const db = readDB();
    db.settings = { ...db.settings, ...req.body };
    writeDB(db);
    res.json(db.settings);
});

// Export CSV
app.get('/api/export', (req, res) => {
    const db = readDB();
    const rate = db.settings.exchangeRate || 250;
    let csv = 'Date,Campagne,Commandes,Livrees,Revenus_USD,Revenus_DZD,Depenses_USD,Depenses_DZD,Profit_USD,Profit_DZD,Profit_Unit_USD,Profit_Unit_DZD,ROAS,CPR_CAP,BreakEven_ROAS,Cout_Livree_USD,Cout_Livree_DZD,RPC_USD,RPC_DZD\n';

    db.entries.forEach(e => {
        const orders = parseFloat(e.orders) || 0;
        const confirmationRate = parseFloat(e.confirmationRate) || 0;
        const deliveryRate = parseFloat(e.deliveryRate) || 0;
        const adSpend = parseFloat(e.adSpend) || 0;
        const sellingPriceDZD = parseFloat(e.sellingPriceDZD) || 0;
        const productCostDZD = parseFloat(e.productCostDZD) || 0;
        const sellingPrice = sellingPriceDZD / rate;
        const productCost = productCostDZD / rate;
        
        const confirmed = orders * (confirmationRate / 100);
        const delivered = confirmed * (deliveryRate / 100);
        const revenue = orders * sellingPrice;
        
        // NEW FORMULA: Profit = Revenue - (Delivered × ProductCost) - (CostPerDelivered)
        const totalProductCostDelivered = delivered * productCost;
        const costPerDelivered = delivered > 0 ? adSpend / delivered : 0;
        const profit = revenue - totalProductCostDelivered - costPerDelivered;
        const roas = adSpend > 0 ? revenue / adSpend : 0;
        const aov = orders > 0 ? revenue / orders : 0;
        const cprCap = aov - (orders > 0 ? totalProductCost / orders : 0);
        const breakEvenRoas = cprCap > 0 ? aov / cprCap : 0;
        const costPerDelivered = delivered > 0 ? adSpend / delivered : 0;
        const rpc = clicks > 0 ? revenue / clicks : 0;

        const profitPerUnit = orders > 0 ? profit / orders : 0;
        csv += `${e.date},${e.campaign},${orders},${delivered.toFixed(1)},${revenue.toFixed(2)},${(revenue*rate).toFixed(2)},${adSpend.toFixed(2)},${(adSpend*rate).toFixed(2)},${profit.toFixed(2)},${(profit*rate).toFixed(2)},${profitPerUnit.toFixed(2)},${(profitPerUnit*rate).toFixed(2)},${roas.toFixed(2)},${cprCap.toFixed(2)},${breakEvenRoas.toFixed(2)},${costPerDelivered.toFixed(2)},${(costPerDelivered*rate).toFixed(2)},${rpc.toFixed(2)},${(rpc*rate).toFixed(2)}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=erp_export.csv');
    res.send(csv);
});

// SPA fallback for client-side routes (optional)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`ERP Server running on port ${PORT}`);
});
