const UI = {
    formatNum(num, decimals = 2) {
        if (isNaN(num) || !isFinite(num)) return '0';
        return num.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    },

    toast(msg, type = 'success') {
        const existing = document.querySelector('.toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = 'toast show';
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const color = type === 'success' ? '#4ade80' : '#f87171';
        toast.innerHTML = `<i class="fas ${icon}" style="color:${color}"></i><span>${msg}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    setRate(rate) {
        const el = document.getElementById('sidebar-rate');
        if (el) el.textContent = rate;
    },

    async loadSettings() {
        let settings = await API.getSettings();
        const defaults = { exchangeRate: 250, businessName: '', defaultPrice: 9.72, defaultCost: 2.88, defaultConfirmation: 70, defaultDelivery: 64.5 };
        settings = { ...defaults, ...settings };
        this.setRate(settings.exchangeRate);
        return settings;
    }
};

// Init on every page
document.addEventListener('DOMContentLoaded', () => {
    API.init().then(() => {
        UI.loadSettings();
        const indicator = document.getElementById('conn-status');
        if (indicator) {
            if (API.online) {
                indicator.innerHTML = '<span class="status-dot"></span> Backend Online';
                indicator.className = 'status status-online';
            } else {
                indicator.innerHTML = '<i class="fas fa-wifi" style="font-size:10px"></i> Mode Local';
                indicator.className = 'status';
                indicator.style.background = '#f1f5f9';
                indicator.style.color = '#64748b';
            }
        }
    });
});
