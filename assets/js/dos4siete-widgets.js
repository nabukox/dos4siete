/**
 * DOS4SIETE WIDGETS CORE LIBRARY
 * Centralizes logic for Queue Management, Stats, and Demos.
 */

window.Dos4Siete = (function () {

    // --- SHARED UTILS --- 
    const qs = (selector, scope = document) => scope.querySelector(selector);
    const qsa = (selector, scope = document) => scope.querySelectorAll(selector);

    // --- 1. QUEUE MANAGEMENT (PANEL & DEMO) ---
    const QueueModule = {
        data: {
            staffDirectory: [
                "2001 - Jose Marti", "2002 - Jose Carrasco", "2003 - Alvaro Valero",
                "2004 - Daniel Estrada", "2005 - Jean Gomez", "2006 - Maria Garcia", "2007 - Carlos Ruiz"
            ],
            levels: [
                {
                    id: 101, name: "Nivel 1",
                    agents: [
                        { id: 1, name: "2004 - Daniel Estrada", pos: 1, status: 'available', time: "82d 1h 40m" },
                        { id: 2, name: "2005 - Jean Gomez", pos: 3, status: 'available', time: "321d 20h 1m" }
                    ]
                },
                {
                    id: 102, name: "Nivel 2",
                    agents: [
                        { id: 3, name: "2001 - Jose Marti", pos: 1, status: 'busy', time: "0h 5m 12s" }
                    ]
                }
            ],
            draftLevels: []
        },

        init: function () {
            // Bind global functions for HTML onclick attributes (Legacy support pattern)
            window.openModal = this.openModal.bind(this);
            window.closeModal = this.closeModal.bind(this);
            window.switchTab = this.switchTab.bind(this);
            window.addLevel = this.addLevel.bind(this);
            window.addAgentToDraft = this.addAgentToDraft.bind(this);
            window.removeDraftAgent = this.removeDraftAgent.bind(this);
            window.removeDraftLevel = this.removeDraftLevel.bind(this);
            window.updateDraftName = this.updateDraftName.bind(this);
            window.updateDraftPos = this.updateDraftPos.bind(this);

            this.renderPanel();
            this.renderDetalle();
        },

        getAllAgents: function (source) {
            return source.flatMap(l => l.agents);
        },

        renderPanel: function () {
            const container = document.getElementById('panel-agents-list');
            if (!container) return;
            container.innerHTML = '';

            let cAvail = 0, cPause = 0, cBusy = 0;
            const allAgents = this.getAllAgents(this.data.levels);

            allAgents.forEach(a => {
                let statusClass = '';
                if (a.status === 'available') cAvail++;
                else if (a.status === 'busy') { cBusy++; statusClass = 'busy'; }
                else { cPause++; statusClass = 'pause'; }

                const el = document.createElement('div');
                el.className = 'agent-card-mini';
                el.innerHTML = `
                    <div class="agent-card-time">${a.time}</div>
                    <div class="agent-card-body ${statusClass}">
                        <div class="agent-mini-icon">👤</div>
                        <span style="font-size:11px; font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${a.name}</span>
                    </div>
                `;
                container.appendChild(el);
            });

            // Update Counters safely
            const safeSet = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
            safeSet('cnt-avail', cAvail);
            safeSet('cnt-pause', cPause);
            safeSet('cnt-busy', cBusy);
            safeSet('total-agents', allAgents.length);
        },

        renderDetalle: function () {
            const container = document.getElementById('detail-list-container');
            if (!container) return;
            container.innerHTML = '';
            const allAgents = this.getAllAgents(this.data.levels);

            if (allAgents.length === 0) {
                container.innerHTML = '<div style="color:#999; text-align:center;">No hay agentes configurados</div>';
                return;
            }

            allAgents.forEach(a => {
                const div = document.createElement('div');
                div.className = 'config-item';
                div.style.background = '#F9FAFB';
                div.innerHTML = `
                    <div style="width:32px; height:32px; background:#E0E7FF; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#4F46E5; font-size:12px; font-weight:bold;">${a.name.charAt(0)}</div>
                    <span style="font-size:13px; font-weight:600;">${a.name}</span>
                     <span style="font-size:12px; color:#666; margin-left:auto; display:flex; align-items:center; gap:6px;">
                        <span style="width:8px; height:8px; border-radius:50%; background:${a.status === 'available' ? '#22C55E' : (a.status === 'busy' ? '#EF4444' : '#F59E0B')}"></span>
                        ${a.status.toUpperCase()} &bull; ${a.time}
                    </span>
                `;
                container.appendChild(div);
            });
        },

        renderModalMembers: function () {
            const container = document.getElementById('levels-container');
            if (!container) return;
            container.innerHTML = '';

            this.data.draftLevels.forEach((lvl, index) => {
                const lvlDiv = document.createElement('div');
                lvlDiv.className = 'level-section';

                let agentsHtml = '';
                if (lvl.agents.length === 0) {
                    agentsHtml = '<div style="padding:12px; text-align:center; font-size:12px; color:#999; font-style:italic;">Sin agentes en este nivel</div>';
                } else {
                    lvl.agents.forEach(a => {
                        const options = this.data.staffDirectory.map(s => `<option ${s === a.name ? 'selected' : ''}>${s}</option>`).join('');

                        agentsHtml += `
                            <div class="config-item">
                                <div style="width:32px; height:32px; background:#E0E7FF; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#4F46E5; font-size:12px; font-weight:bold;">${a.name.charAt(0)}</div>
                                <div style="flex:1;">
                                    <select class="config-select" onchange="updateDraftName(${lvl.id}, ${a.id}, this.value)">${options}</select>
                                </div>
                                <div style="display:flex; align-items:center; gap:4px;">
                                    <span style="font-size:10px; color:#999; text-transform:uppercase;">Pos</span>
                                    <input type="text" class="pos-input" value="${a.pos}" onchange="updateDraftPos(${lvl.id}, ${a.id}, this.value)">
                                </div>
                                <button class="btn-icon" onclick="removeDraftAgent(${lvl.id}, ${a.id})">🗑</button>
                            </div>
                        `;
                    });
                }

                lvlDiv.innerHTML = `
                    <div class="level-header">
                        ${lvl.name}
                        ${index > 0 ? `<button class="btn-icon" style="color:#EF4444;" onclick="removeDraftLevel(${lvl.id})">Eliminar Nivel</button>` : ''}
                    </div>
                    <div class="config-list">
                        ${agentsHtml}
                    </div>
                    <button id="btn-add-agent-${lvl.id}" class="btn-secondary" onclick="addAgentToDraft(${lvl.id})">+ Añadir Miembro a ${lvl.name}</button>
                `;
                container.appendChild(lvlDiv);
            });
        },

        openModal: function () {
            this.data.draftLevels = JSON.parse(JSON.stringify(this.data.levels));
            this.renderModalMembers();
            document.getElementById('modal-miembros').classList.add('active');
        },

        closeModal: function (save) {
            if (save) {
                this.data.levels = JSON.parse(JSON.stringify(this.data.draftLevels));
                this.renderPanel();
                this.renderDetalle();
            }
            document.getElementById('modal-miembros').classList.remove('active');
        },

        // --- Helpers for HTML calls ---
        updateDraftName: function (lvlId, agentId, val) {
            const lvl = this.data.draftLevels.find(l => l.id === lvlId);
            const agent = lvl ? lvl.agents.find(a => a.id === agentId) : null;
            if (agent) agent.name = val;
        },
        updateDraftPos: function (lvlId, agentId, val) {
            const lvl = this.data.draftLevels.find(l => l.id === lvlId);
            const agent = lvl ? lvl.agents.find(a => a.id === agentId) : null;
            if (agent) agent.pos = val;
        },
        removeDraftAgent: function (lvlId, agentId) {
            const lvl = this.data.draftLevels.find(l => l.id === lvlId);
            if (lvl) {
                lvl.agents = lvl.agents.filter(a => a.id !== agentId);
                this.renderModalMembers();
            }
        },
        addAgentToDraft: function (lvlId) {
            const lvl = this.data.draftLevels.find(l => l.id === lvlId);
            if (lvl) {
                const newId = Math.floor(Math.random() * 10000);
                lvl.agents.push({ id: newId, name: "0000 - Nuevo Agente", pos: 1, status: "offline", time: "0m" });
                this.renderModalMembers();
            }
        },
        addLevel: function () {
            const newId = this.data.draftLevels.length + 101;
            this.data.draftLevels.push({ id: newId, name: `Nivel ${this.data.draftLevels.length + 1}`, agents: [] });
            this.renderModalMembers();
        },
        removeDraftLevel: function (id) {
            this.data.draftLevels = this.data.draftLevels.filter(l => l.id !== id);
            this.renderModalMembers();
        },
        switchTab: function (view, btn) {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active'));
            const vw = document.getElementById('view-' + view);
            if (vw) vw.classList.add('active');
        }
    };

    // --- 2. DEMO AUTOMATION MODULE ---
    const DemoModule = {
        init: function () {
            // Re-use core queue logic
            QueueModule.init();

            // Start automation loop
            window.addEventListener('load', this.runLoop.bind(this));
        },

        wait: ms => new Promise(r => setTimeout(r, ms)),

        async moveCursorTo(selector) {
            const cursor = document.getElementById('demo-cursor');
            const el = document.querySelector(selector);
            if (!el || !cursor) return;
            const rect = el.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            cursor.style.transform = `translate(${x}px, ${y}px)`;
            cursor.style.opacity = '1';
            await this.wait(800);
        },

        async clickCursor() {
            const cursor = document.getElementById('demo-cursor');
            if (!cursor) return;
            const icon = cursor.querySelector('i');
            if (icon) {
                icon.style.transform = "scale(0.8)";
                await this.wait(150);
                icon.style.transform = "scale(1)";
                await this.wait(150);
            }
        },

        async runLoop() {
            await this.wait(1000);

            // 1. Open
            await this.moveCursorTo('#btn-manage');
            await this.clickCursor();
            QueueModule.openModal();
            await this.wait(1500);

            // 2. Add
            await this.moveCursorTo('#btn-add-agent-101');
            await this.clickCursor();
            QueueModule.addAgentToDraft(101);
            await this.wait(1500);

            // 3. Save
            await this.moveCursorTo('#btn-save-changes');
            await this.clickCursor();
            QueueModule.closeModal(true);

            // 4. Success Overlay
            const overlay = document.getElementById('success-overlay');
            if (overlay) {
                overlay.classList.remove('hidden');
                overlay.classList.add('flex');
            }

            await this.wait(3000);
            window.location.reload();
        }
    };

    // --- 3. STATS VISUAL MODULE ---
    const StatsModule = {
        init: function () {
            window.toggleSeries = this.toggleSeries.bind(this);
            window.updateChart = this.updateChart.bind(this);

            const dp = document.getElementById('datePicker');
            if (dp) dp.addEventListener('change', () => this.updateChart());

            this.updateChart();
        },

        // Data & State
        currentData: [],
        visibleSeries: { total: true, answered: true, wait: true },
        chartConfig: { height: 100, maxVal: 80, maxWait: 15 },

        generateData: function (seed) {
            const times = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00'];
            return times.map((time, i) => {
                const randomFactor = Math.sin(seed * (i + 1)) * 0.5 + 0.5;
                const total = Math.floor(20 + randomFactor * 50);
                const answered = Math.floor(total * (0.8 + Math.random() * 0.15));
                const wait = Math.floor(2 + Math.random() * 8);
                return { time, total, answered, wait };
            });
        },

        toggleSeries: function (key) {
            this.visibleSeries[key] = !this.visibleSeries[key];
            const btnMap = { 'total': 'btn-total', 'answered': 'btn-answered', 'wait': 'btn-wait' };
            const btn = document.getElementById(btnMap[key]);
            if (btn) {
                if (this.visibleSeries[key]) btn.classList.remove('opacity-40', 'grayscale');
                else btn.classList.add('opacity-40', 'grayscale');
            }
            this.renderChart(this.currentData);
        },

        updateChart: function () {
            const datePicker = document.getElementById('datePicker');
            if (!datePicker) return;

            const dateStr = datePicker.value;
            const seed = dateStr.split('-').reduce((a, c) => a + parseInt(c), 0);
            this.currentData = this.generateData(seed);

            // Stats
            const totalCalls = this.currentData.reduce((sum, item) => sum + item.total, 0);
            const totalAnswered = this.currentData.reduce((sum, item) => sum + item.answered, 0);
            const totalMissed = totalCalls - totalAnswered;
            const efficiency = totalCalls > 0 ? Math.round((totalAnswered / totalCalls) * 100) : 0;

            const safeText = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
            safeText('statTotal', totalCalls);
            safeText('statAnswered', totalAnswered);
            safeText('statMissed', totalMissed);
            safeText('statEfficiency', `${efficiency}%`);

            this.renderChart(this.currentData);
        },

        renderChart: function (data) {
            const barsLayer = document.getElementById('barsLayer');
            const lineLayer = document.getElementById('lineLayer');
            const dotsLayer = document.getElementById('dotsLayer');
            const xAxisLabels = document.getElementById('xAxisLabels');

            if (!barsLayer) return;

            barsLayer.innerHTML = '';
            lineLayer.innerHTML = '';
            dotsLayer.innerHTML = '';
            xAxisLabels.innerHTML = '';

            const lineDataPoints = [];
            data.forEach((d, i) => {
                const xPos = (i / (data.length - 1)) * 100;
                const barWidth = 4;

                // Total
                if (this.visibleSeries.total) {
                    const hTotal = (d.total / this.chartConfig.maxVal) * this.chartConfig.height;
                    const yTotal = this.chartConfig.height - hTotal;
                    barsLayer.appendChild(this.createRect(xPos - 2, yTotal, barWidth, hTotal, '#2000D6'));
                }
                // Answered
                if (this.visibleSeries.answered) {
                    const hAns = (d.answered / this.chartConfig.maxVal) * this.chartConfig.height;
                    const yAns = this.chartConfig.height - hAns;
                    barsLayer.appendChild(this.createRect(xPos + 2, yAns, barWidth, hAns, '#29ABE2', 0.9));
                }
                // Label
                const label = document.createElement('div');
                label.textContent = d.time;
                xAxisLabels.appendChild(label);

                // Line
                if (this.visibleSeries.wait) {
                    const yLine = this.chartConfig.height - ((d.wait / this.chartConfig.maxWait) * this.chartConfig.height);
                    lineDataPoints.push({ x: xPos, y: yLine });

                    const dot = document.createElement('div');
                    dot.className = 'absolute w-3 h-3 bg-white border-2 border-[#141F4C] rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm z-10 transition-all duration-500';
                    dot.style.left = `${xPos}%`;
                    dot.style.top = `${yLine}%`;
                    dotsLayer.appendChild(dot);
                }
            });

            if (this.visibleSeries.wait && lineDataPoints.length > 0) {
                const pathD = this.getSmoothPath(lineDataPoints);
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute('d', pathD);
                path.setAttribute('fill', 'none');
                path.setAttribute('stroke', '#141F4C');
                path.setAttribute('stroke-width', '2');
                path.setAttribute('vector-effect', 'non-scaling-stroke');
                path.classList.add('line-path');
                lineLayer.insertBefore(path, lineLayer.firstChild);
            }
        },

        createRect: function (x, y, w, h, fill, opacity = 1) {
            const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('x', x);
            rect.setAttribute('y', y);
            rect.setAttribute('width', w);
            rect.setAttribute('height', h);
            rect.setAttribute('fill', fill);
            rect.setAttribute('rx', '1');
            rect.setAttribute('opacity', opacity);
            rect.classList.add('bar-rect');
            return rect;
        },

        getSmoothPath: function (points) {
            if (points.length === 0) return "";
            if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
            let d = `M ${points[0].x} ${points[0].y}`;
            for (let i = 0; i < points.length - 1; i++) {
                const p0 = points[i - 1] || points[i];
                const p1 = points[i];
                const p2 = points[i + 1];
                const p3 = points[i + 2] || points[i + 1];
                const cp1x = p1.x + (p2.x - p0.x) / 6;
                const cp1y = p1.y + (p2.y - p0.y) / 6;
                const cp2x = p2.x - (p3.x - p1.x) / 6;
                const cp2y = p2.y - (p3.y - p1.y) / 6;
                d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
            }
            return d;
        }
    };

    // --- PUBLIC API ---
    return {
        initQueuePanel: () => QueueModule.init(),
        initQueueDemo: () => DemoModule.init(),
        initStats: () => StatsModule.init()
    };
})();
