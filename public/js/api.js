const API = {
    base: '',
    online: false,

    async init() {
        try {
            const res = await fetch('/api/settings', { method: 'GET', cache: 'no-cache' });
            if (res.ok) this.online = true;
        } catch (e) {
            this.online = false;
        }
    },

    async getEntries() {
        if (this.online) {
            const res = await fetch('/api/entries');
            return res.json();
        }
        return JSON.parse(localStorage.getItem('erp_entries') || '[]');
    },

    async saveEntry(entry) {
        if (this.online) {
            const res = await fetch('/api/entries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(entry)
            });
            return res.json();
        }
        const entries = JSON.parse(localStorage.getItem('erp_entries') || '[]');
        entries.unshift(entry);
        localStorage.setItem('erp_entries', JSON.stringify(entries));
        return entry;
    },

    async deleteEntry(id) {
        if (this.online) {
            await fetch(`/api/entries/${id}`, { method: 'DELETE' });
            return;
        }
        let entries = JSON.parse(localStorage.getItem('erp_entries') || '[]');
        entries = entries.filter(e => e.id != id);
        localStorage.setItem('erp_entries', JSON.stringify(entries));
    },

    async getSettings() {
        if (this.online) {
            const res = await fetch('/api/settings');
            return res.json();
        }
        return JSON.parse(localStorage.getItem('erp_settings') || '{}');
    },

    async saveSettings(settings) {
        if (this.online) {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            return res.json();
        }
        localStorage.setItem('erp_settings', JSON.stringify(settings));
        return settings;
    },

    async exportCSV() {
        if (this.online) {
            window.location.href = '/api/export';
            return;
        }
        // Frontend CSV export fallback
        const entries = await this.getEntries();
        const settings = await this.getSettings();
        const rate = settings.exchangeRate || 250;
        let csv = 'Date,Campagne,Commandes,Livrees,Revenus_USD,Revenus_DZD,Depenses_USD,Depenses_DZD,Profit_USD,Profit_DZD,ROAS,CPR_CAP,BreakEven_ROAS,Cout_Livree_USD,Cout_Livree_DZD,RPC_USD,RPC_DZD\n';
        entries.forEach(e => {
            const m = Calculator.compute(e, rate);
            csv += `${e.date},${e.campaign},${m.orders},${m.delivered.toFixed(1)},${m.revenue.toFixed(2)},${m.revenueDZD.toFixed(2)},${m.adSpend.toFixed(2)},${m.adSpendDZD.toFixed(2)},${m.profit.toFixed(2)},${m.profitDZD.toFixed(2)},${m.roas.toFixed(2)},${m.cprCap.toFixed(2)},${m.breakEvenRoas.toFixed(2)},${m.costPerDelivered.toFixed(2)},${m.costPerDeliveredDZD.toFixed(2)},${m.rpc.toFixed(2)},${m.rpcDZD.toFixed(2)}\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'erp_export.csv';
        link.click();
    }
};
