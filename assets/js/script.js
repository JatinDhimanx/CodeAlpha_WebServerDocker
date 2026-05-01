// NexusOS Dashboard Application Logic
const app = {
    init() {
        // Initialize Lucide Icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Initialize Tab Switching
        this.initTabs();
        
        // Initialize Modals
        this.initModals();
        
        // Start live metrics simulation
        this.simulateMetrics();
        
        // Start streaming logs
        this.streamLogs();
    },

    switchAuthView(view) {
        const loginCard = document.getElementById('auth-login');
        const signupCard = document.getElementById('auth-signup');
        
        if (view === 'login') {
            signupCard.style.display = 'none';
            loginCard.style.display = 'block';
            setTimeout(() => loginCard.classList.add('active'), 10);
            signupCard.classList.remove('active');
        } else {
            loginCard.style.display = 'none';
            signupCard.style.display = 'block';
            setTimeout(() => signupCard.classList.add('active'), 10);
            loginCard.classList.remove('active');
        }
    },

    handleLogin() {
        const btn = document.querySelector('#auth-login .auth-submit');
        btn.innerHTML = '<i data-lucide="loader" class="spin"></i> Authenticating...';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            document.getElementById('auth-layout').style.display = 'none';
            document.getElementById('app-layout').style.display = 'flex';
            this.showToast('Login successful! Welcome back.', 'success');
            
            // Reset button state
            btn.innerHTML = 'Sign In <i data-lucide="arrow-right"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 1500);
    },

    handleSignup() {
        const btn = document.querySelector('#auth-signup .auth-submit');
        btn.innerHTML = '<i data-lucide="loader" class="spin"></i> Creating account...';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
            document.getElementById('auth-layout').style.display = 'none';
            document.getElementById('app-layout').style.display = 'flex';
            this.showToast('Account created successfully!', 'success');
            
            // Reset button state
            btn.innerHTML = 'Create Account <i data-lucide="user-plus"></i>';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 1500);
    },

    logout() {
        document.getElementById('app-layout').style.display = 'none';
        document.getElementById('auth-layout').style.display = 'flex';
        this.switchAuthView('login');
        this.showToast('Disconnected from server.', 'warning');
        
        // Reset tabs to dashboard
        this.switchTab('dashboard');
    },

    initTabs() {
        const navItems = document.querySelectorAll('.nav-item[data-target]');
        const views = document.querySelectorAll('.view');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active class from all
                navItems.forEach(nav => nav.classList.remove('active'));
                views.forEach(view => view.classList.remove('active'));

                // Add active class to clicked
                const targetId = item.getAttribute('data-target');
                item.classList.add('active');
                document.getElementById(`view-${targetId}`).classList.add('active');
            });
        });
    },

    switchTab(targetId) {
        const navItem = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (navItem) {
            navItem.click();
        }
    },

    initModals() {
        const deployBtn = document.getElementById('deploy-btn');
        const deployModal = document.getElementById('deploy-modal');
        const closeBtns = document.querySelectorAll('.close-modal');
        const confirmBtn = document.getElementById('confirm-deploy-btn');

        if (deployBtn && deployModal) {
            deployBtn.addEventListener('click', () => {
                deployModal.classList.add('active');
            });
        }

        closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (deployModal) deployModal.classList.remove('active');
            });
        });

        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                if (deployModal) deployModal.classList.remove('active');
                this.showToast('Deployment initiated! Building container...', 'success');
            });
        }
    },

    simulateMetrics() {
        const cpuPercent = document.getElementById('cpu-percent');
        const cpuBar = document.getElementById('cpu-bar');
        const cpuChart = document.getElementById('cpu-chart');
        
        const memPercent = document.getElementById('mem-percent');
        const memBar = document.getElementById('mem-bar');
        const memChart = document.getElementById('mem-chart');

        if (!cpuPercent || !memPercent) return;

        // Initialize chart bars
        for (let i = 0; i < 20; i++) {
            const cpuBarEl = document.createElement('div');
            cpuBarEl.className = 'chart-bar blue';
            cpuBarEl.style.height = `${Math.random() * 40 + 10}%`;
            cpuChart.appendChild(cpuBarEl);

            const memBarEl = document.createElement('div');
            memBarEl.className = 'chart-bar purple';
            memBarEl.style.height = `${Math.random() * 20 + 30}%`;
            memChart.appendChild(memBarEl);
        }

        setInterval(() => {
            // CPU
            const newCpu = Math.floor(Math.random() * 15) + 10; // 10-25%
            cpuPercent.innerText = `${newCpu}%`;
            cpuBar.style.width = `${newCpu}%`;
            
            // Shift CPU chart
            const firstCpu = cpuChart.firstElementChild;
            const newCpuBar = document.createElement('div');
            newCpuBar.className = 'chart-bar blue';
            newCpuBar.style.height = `${newCpu}%`;
            cpuChart.appendChild(newCpuBar);
            cpuChart.removeChild(firstCpu);

            // Memory
            const newMem = Math.floor(Math.random() * 5) + 43; // 43-48%
            memPercent.innerText = `${newMem}%`;
            memBar.style.width = `${newMem}%`;

            // Shift Memory chart
            const firstMem = memChart.firstElementChild;
            const newMemBar = document.createElement('div');
            newMemBar.className = 'chart-bar purple';
            newMemBar.style.height = `${newMem}%`;
            memChart.appendChild(newMemBar);
            memChart.removeChild(firstMem);
            
            // Randomly update dashboard requests
            const reqEl = document.getElementById('stat-requests');
            if (reqEl && Math.random() > 0.5) {
                let currentReq = parseInt(reqEl.innerText.replace(',', ''));
                currentReq += Math.floor(Math.random() * 5);
                reqEl.innerText = currentReq.toLocaleString();
            }

        }, 2000);
    },

    streamLogs() {
        const logOutput = document.getElementById('log-output');
        const clearLogsBtn = document.getElementById('clear-logs-btn');
        if (!logOutput) return;

        if (clearLogsBtn) {
            clearLogsBtn.addEventListener('click', () => {
                logOutput.innerHTML = '';
                this.showToast('Terminal logs cleared', 'success');
            });
        }

        const logMessages = [
            { type: 'system', msg: 'GET /api/v1/metrics 200 OK - 12ms' },
            { type: 'system', msg: 'GET /assets/css/style.css 304 Not Modified - 2ms' },
            { type: 'system', msg: 'GET / 200 OK - 45ms' },
            { type: 'system', msg: 'Worker process 142 handling new connection' },
            { type: 'success', msg: 'Database sync completed successfully.' },
            { type: 'warning', msg: 'Memory usage approaching 50% threshold' },
            { type: 'system', msg: 'Auth token validated for session XJ9-322' }
        ];

        function addLog() {
            const log = logMessages[Math.floor(Math.random() * logMessages.length)];
            const time = new Date().toISOString().split('T')[1].substring(0, 8);
            
            const line = document.createElement('div');
            line.className = `log-line ${log.type}`;
            line.innerHTML = `<span class="timestamp">[${time}]</span> ${log.msg}`;
            
            logOutput.appendChild(line);
            
            // Auto scroll
            logOutput.scrollTop = logOutput.scrollHeight;
            
            // Limit log lines to prevent memory issues
            if (logOutput.children.length > 50) {
                logOutput.removeChild(logOutput.firstElementChild);
            }
            
            setTimeout(addLog, Math.random() * 3000 + 1000);
        }

        setTimeout(addLog, 2000);
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'check-circle';
        if (type === 'warning') icon = 'alert-triangle';
        if (type === 'error') icon = 'x-circle';

        toast.innerHTML = `
            <i data-lucide="${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s forwards';
            setTimeout(() => {
                if (container.contains(toast)) {
                    container.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
