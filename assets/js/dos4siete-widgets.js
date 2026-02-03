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
                            <div class="config-item ${a._isNew ? 'slide-in-new' : ''}">
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
                const newAgent = { id: newId, name: "0000 - Nuevo Agente", pos: 1, status: "offline", time: "0m", _isNew: true };
                lvl.agents.push(newAgent);
                this.renderModalMembers();
                delete newAgent._isNew; // Clear flag for next re-render
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

            // 2.5 Change Member (Interact with dropdown)
            // Selector for the LAST added item in the first level
            const dropdownSelector = '#levels-container .level-section:first-child .config-list .config-item:last-child select';
            const dropdown = document.querySelector(dropdownSelector);

            if (dropdown) {
                await this.moveCursorTo(dropdownSelector);
                await this.clickCursor();

                // Simulate selection
                dropdown.value = "2006 - Maria Garcia"; // Change to a valid staff member
                dropdown.dispatchEvent(new Event('change')); // Trigger logic

                // Visual Feedback
                const row = dropdown.closest('.config-item');
                if (row) row.classList.add('flash-change');

                await this.wait(500); // Visual pause
            }

            await this.wait(1000);

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

    // --- 4. QUEUE STATS DASHBOARD MODULE (COHERENT LOGIC) ---
    const QueueStatsModule = {
        // State for cumulative metrics
        state: {
            incoming: 250,
            answered: 235,
            missed: 15,
            // New Outgoing Stats
            outgoing: 180,
            outgoingAnswered: 150,
            outgoingMissed: 30,
            waitTimeTotal: 1200,
            waitTimeCount: 40
        },

        init: function () {
            this.updateStats(); // Initial Draw
            // Live loop: Update every 3 seconds
            setInterval(() => this.simulateLiveActivity(), 3000);
        },

        getRandom: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

        // Simulate activity over time (incremental)
        simulateLiveActivity: function () {
            // 1. Chance of new call incoming
            if (Math.random() > 0.3) {
                this.state.incoming++;
                if (Math.random() > 0.1) {
                    this.state.answered++;
                    this.state.waitTimeTotal += this.getRandom(5, 60);
                    this.state.waitTimeCount++;
                } else {
                    this.state.missed++;
                }
            }

            // 1.5 Chance of new call outgoing
            if (Math.random() > 0.35) {
                this.state.outgoing++;
                if (Math.random() > 0.15) {
                    this.state.outgoingAnswered++;
                } else {
                    this.state.outgoingMissed++;
                }
            }
            this.updateStats();
        },

        updateStats: function () {
            const s = this.state;
            const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerText = val; };
            const setWidth = (id, percent) => { const el = document.getElementById(id); if (el) el.style.width = percent + '%'; };

            // --- 1. COMPARATIVE CHARTS ---
            this.renderComparativeCharts();

            // --- 2. LIVE METRICS (Fluctuating but coherent) ---

            // Agents logic - LINKED TO STAFF DIRECTORY
            // We use the count from QueueModule if available, otherwise default to 35
            const registeredAgents = QueueModule.data.staffDirectory ? QueueModule.data.staffDirectory.length : 7;
            // Scale it up for the "Big Stats" feel, or use real count? 
            // The screenshot showed large numbers (Total Agentes), so let's simulate a larger center based on the directory
            const totalAgents = registeredAgents * 5; // Simulating a larger floor based on the 7 demo users

            const agentsOffline = this.getRandom(Math.floor(totalAgents * 0.05), Math.floor(totalAgents * 0.1));
            const agentsPaused = this.getRandom(Math.floor(totalAgents * 0.1), Math.floor(totalAgents * 0.2));
            const agentsActive = totalAgents - agentsOffline - agentsPaused;

            // Calls in conversation (cannot exceed active agents)
            // Let's say utilization is high, between 60% and 90% of active agents
            const agentsTalking = Math.floor(agentsActive * (this.getRandom(60, 90) / 100));
            const agentsAvailable = agentsActive - agentsTalking;

            set('stat-agents-active', agentsActive);
            set('stat-agents-talk', agentsTalking);

            // Occupancy (Talking / Active)
            const occupancy = agentsActive > 0 ? Math.round((agentsTalking / agentsActive) * 100) : 0;
            const availability = 100 - occupancy;

            set('val-occupancy', occupancy + '%');
            set('val-availability', availability + '%');
            setWidth('bar-occupancy', occupancy);
            setWidth('bar-availability', availability);

            // Live Calls (Incoming/Outgoing)
            // Ringing is usually low
            set('stat-incoming-ring', this.getRandom(0, 4));
            set('stat-incoming-talk', Math.floor(agentsTalking * 0.7)); // Most talking agents are on inbound
            set('stat-outgoing-ring', this.getRandom(0, 2));
            set('stat-outgoing-talk', Math.floor(agentsTalking * 0.3)); // Rest on outbound

            // Warnings
            set('stat-abandoned', s.missed);
            set('stat-wait', this.getRandom(0, 5)); // Calls currently waiting

            // Pause/Status
            set('stat-pause', agentsPaused);
            set('stat-offline', agentsOffline);

            // --- 3. KPIs ---
            // Average Wait Time (Cumulative)
            const avgWait = Math.round(s.waitTimeTotal / s.waitTimeCount);
            set('kpi-wait-time', avgWait + 's');

            // Longest Wait / Next Call (Random fluctuation around average)
            const nextCallWait = Math.floor(avgWait * (0.5 + Math.random()));
            set('kpi-next-call', nextCallWait + 's');
        },

        // --- NEW: TABS LOGIC ---
        switchStatsTab: function (tabId) {
            // Update Buttons
            document.querySelectorAll('[id^="btn-tab-"]').forEach(btn => {
                if (btn.id === 'btn-tab-' + tabId) {
                    btn.classList.add('bg-[#141F4C]', 'text-white');
                    btn.classList.remove('bg-white', 'text-gray-500');
                } else {
                    btn.classList.remove('bg-[#141F4C]', 'text-white');
                    btn.classList.add('bg-white', 'text-gray-500');
                }
            });

            // Update Panels
            const summary = document.getElementById('tab-summary');
            const agentes = document.getElementById('tab-agentes');
            const detalle = document.getElementById('tab-detalle');

            summary.classList.add('hidden');
            agentes.classList.add('hidden');
            if (detalle) detalle.classList.add('hidden'); // Safety check

            if (tabId === 'summary') {
                summary.classList.remove('hidden');
            } else if (tabId === 'agentes') {
                agentes.classList.remove('hidden');
                this.renderAgentChart();
            } else if (tabId === 'detalle') {
                if (detalle) detalle.classList.remove('hidden');
                this.renderDetailedStats();
            }
        },

        // --- NEW: DETAILED STATS (TAB 3) ---
        renderDetailedStats: function () {
            // 1. Render Pie Charts (Simplistic Gradients)
            // No complex JS needed here since we use inline styles in HTML for the gradients
            // But we could animate them or update them if we wanted dynamic data.
            // For now, let's focus on the BAR CHARTS which use the existing Queue Data.

            this.renderDualBarChart('bars-calls-count', 'count');
            this.renderDualBarChart('bars-calls-time', 'time');
        },

        renderDualBarChart: function (containerId, mode) {
            const container = document.getElementById(containerId);
            if (!container) return;
            container.innerHTML = '';

            // Use the same staff data
            let agents = QueueModule.data.staffDirectory.map(a => {
                const id = a.split(' - ')[0];
                return {
                    id: id,
                    name: a,
                    // Random values based on mode
                    value: mode === 'count' ? this.getRandom(5, 45) : this.getRandom(500, 6000)
                };
            });

            // Sort by Value Descending (like screenshot)
            agents.sort((a, b) => b.value - a.value);

            const maxValue = Math.max(...agents.map(a => a.value));

            agents.forEach((agent, i) => {
                // Colors: Blue for Count, Green for Time (or mix to match screenshot?)
                // Screenshot left (Count) -> Blue Bars (#51C3E5) + Green Bars (#9EF5A8) mixed? 
                // Actually screenshot shows: Left chart uses Blue(#51C3E5) and Green(#9EF5A8) alternating.
                // Right chart uses same.

                const isBlue = i % 2 === 0; // Alternating
                const color = isBlue ? '#51C3E5' : '#9EF5A8';
                const heightPercent = (agent.value / maxValue) * 100;

                const barGroup = document.createElement('div');
                barGroup.className = 'flex flex-col items-center justify-end h-full group relative w-8'; // Thinner bars
                barGroup.style.height = '100%';

                barGroup.innerHTML = `
                   <!-- Tooltip -->
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-[${heightPercent}%] mb-1 z-20 pointer-events-none">
                        <div class="bg-gray-800 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap">
                            ${agent.value}${mode === 'time' ? 's' : ''}
                        </div>
                    </div>

                    <!-- Bar -->
                    <div class="w-full rounded-t-sm transition-all duration-500 ease-out hover:opacity-80"
                         style="background-color: ${color}; height: 0%;"
                         data-height="${heightPercent}%"></div>
                    
                    <!-- X-Axis Label (Rotated if needed, or just ID) -->
                    <div class="absolute bottom-0 translate-y-full w-full text-center text-[9px] text-gray-400 pt-1 -rotate-45 origin-left" style="left:50%;">${agent.id}</div>
                `;
                container.appendChild(barGroup);

                // Animate
                setTimeout(() => {
                    const bar = barGroup.querySelector('[data-height]');
                    if (bar) bar.style.height = bar.getAttribute('data-height');
                }, 100 + (i * 30));
            });
        },

        // --- NEW: CHART LOGIC (Reference Match) ---
        renderAgentChart: function () {
            const container = document.getElementById('agent-chart-bars');
            const axisContainer = document.getElementById('agent-chart-axis'); // Need to create this in HTML if missing

            if (!container) return;
            container.innerHTML = '';

            // Use the staff directory as data source
            let agents = QueueModule.data.staffDirectory.map(a => {
                const id = a.split(' - ')[0]; // "2001"
                return { id: id, name: a, value: this.getRandom(500, 1600) }; // Values roughly 0-1600 like screenshot
            });

            // Sort by ID to look organized like screenshot
            agents.sort((a, b) => a.id - b.id);

            // Find Max for scaling (Fixed snaps like 1600, 1400...)
            const rawMax = Math.max(...agents.map(a => a.value));
            const maxVal = Math.ceil(rawMax / 200) * 200; // Snap to nearest 200

            // 1. Generate Y-Axis Labels (HTML injection if we had a container, but for now specific bars)
            // Note: In the HTML structure, we might need a separate container for Y-axis. 
            // Let's adjust the HTML structure slightly in the next tool call if needed.
            // For now, assume we just render the bars and the grid is static or handled elsewhere.

            agents.forEach((agent, i) => {
                // Exact Screenshot Colors
                const colorCyan = '#51C3E5'; // Muted Cyan
                const colorGreen = '#9EF5A8'; // Pale Green
                const colorHover = '#00BFFF'; // Bright Blue Highlight

                const isCyan = i % 2 === 0;
                const baseColor = isCyan ? colorCyan : colorGreen;
                const heightPercent = (agent.value / maxVal) * 100;

                const barGroup = document.createElement('div');
                barGroup.className = 'flex flex-col items-center justify-end h-full group relative w-12';
                barGroup.style.height = '100%';

                barGroup.innerHTML = `
                    <!-- Tooltip (Hidden by default, standard Dos Siete Dark) -->
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-[${heightPercent}%] mb-2 z-20 pointer-events-none transform translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
                        <div class="bg-[#1F2937] text-white text-xs rounded-lg px-3 py-2 shadow-lg flex flex-col items-center">
                            <span class="font-bold text-sm">${agent.value}</span>
                            <span class="text-[10px] text-gray-400 whitespace-nowrap">${agent.name}</span>
                            <!-- Little arrow -->
                            <div class="w-2 h-2 bg-[#1F2937] transform rotate-45 absolute -bottom-1"></div>
                        </div>
                    </div>

                    <!-- Bar Container for Alignment -->
                    <div class="w-full flex items-end justify-center flex-1 pb-6"> <!-- Padding bottom for labels -->
                         <div class="w-10 rounded-t-sm transition-all duration-300 ease-out hover:brightness-110 relative"
                              style="background-color: ${baseColor}; height: 0%;"
                              data-height="${heightPercent}%">
                            
                            <!-- Highlight Border on Hover (Box Shadow to avoid layout shift) -->
                            <div class="absolute inset-0 border-2 border-transparent group-hover:border-[#0099CC] transition-colors rounded-t-sm"></div>
                         </div>
                    </div>

                    <!-- X-Axis Label -->
                    <div class="absolute bottom-0 w-full text-center text-xs text-gray-500 font-medium pb-0">${agent.id}</div>
                `;
                container.appendChild(barGroup);

                // Animate
                setTimeout(() => {
                    const bar = barGroup.querySelector('[data-height]');
                    if (bar) bar.style.height = bar.getAttribute('data-height');
                }, 100 + (i * 50));
            });
        },

        // --- NEW: COMPARATIVE CHARTS RENDERER ---
        renderComparativeCharts: function () {
            const s = this.state;

            // Chart 1: Incoming vs Outgoing
            this.drawDonut('chart-volumen', [
                { label: 'Entrantes', value: s.incoming, color: '#9dff86' }, // Light Green
                { label: 'Salientes', value: s.outgoing, color: '#757575' }  // Grey
            ]);

            // Chart 2: Incoming Answered vs Unanswered
            const incUnanswered = s.incoming - s.answered; // Recalc purely from totals
            this.drawDonut('chart-entrantes', [
                { label: 'Contestadas', value: s.answered, color: '#4dc9f6' }, // Light Blue
                { label: 'Sin contestar', value: incUnanswered, color: '#D34535' } // Red
            ]);

            // Chart 3: Outgoing Answered vs Unanswered
            const outUnanswered = s.outgoing - s.outgoingAnswered;
            this.drawDonut('chart-salientes', [
                { label: 'Contestadas', value: s.outgoingAnswered, color: '#4dc9f6' }, // Light Blue
                { label: 'Sin Contestar', value: outUnanswered, color: '#D34535' } // Red
            ]);
        },

        drawDonut: function (containerId, slices) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const total = slices.reduce((sum, slice) => sum + slice.value, 0);
            const radius = 15.9155; // Radius where circumference is approx 100
            const circumference = 100; // Simplifies percentage calc

            let html = `<svg viewBox="0 0 42 42" class="donut" style="width:120px; height:120px;">`;

            // Background Circle
            html += `<circle cx="21" cy="21" r="${radius}" fill="transparent" stroke="#f2f2f2" stroke-width="8"></circle>`;

            if (total > 0) {
                let offset = 25; // Start at top (12 o'clock approx)

                slices.forEach(slice => {
                    const percent = (slice.value / total) * 100;
                    if (percent > 0) {
                        html += `<circle cx="21" cy="21" r="${radius}" fill="transparent" stroke="${slice.color}" stroke-width="8" 
                                  stroke-dasharray="${percent} ${100 - percent}" stroke-dashoffset="${offset}" 
                                  style="transition: stroke-dasharray 0.5s ease-out;"></circle>`;
                        offset -= percent;
                    }
                });
            }

            html += `</svg>`;
            container.innerHTML = html;

            // Update Legend numbers
            slices.forEach((slice, i) => {
                const el = document.getElementById(`${containerId}-val-${i}`);
                if (el) el.innerText = slice.value;
            });
        },

        // --- NEW: AGENT TIME DISTRIBUTION CHART ---
        renderAgentTimeChart: function () {
            // Get agents from directory
            const agents = QueueModule.data.staffDirectory.map(name => {
                const parts = name.split(' - ');
                return {
                    id: parts[0], // ID for X-axis
                    label: parts[1], // Name for tooltip
                    value: this.getRandom(5, 120) // Random minutes
                };
            });

            // Sort by time descending
            agents.sort((a, b) => b.value - a.value);

            // Limited to top 10 for better width/density match
            const topAgents = agents.slice(0, 10);

            this.drawBarChart('chart-agent-time', topAgents, 'Minutos en Conversación');
        },

        drawBarChart: function (containerId, data, yLabel = '') {
            const container = document.getElementById(containerId);
            if (!container) return;

            const width = container.clientWidth || 400;
            const height = 250; // Taller for better "reach"
            // Increased left padding for Y-axis values
            const padding = { top: 30, bottom: 30, left: 40, right: 10 };

            const maxVal = Math.max(...data.map(d => d.value));
            // Round up maxVal to nice number for grid
            const gridMax = Math.ceil(maxVal / 10) * 10;

            const chartWidth = width - padding.left - padding.right;
            const chartHeight = height - padding.top - padding.bottom;

            const barWidth = (chartWidth / data.length) * 0.5; // Thinner bars
            const gap = (chartWidth / data.length) * 0.5;

            let html = `<svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%;">`;

            // Y-Axis Label
            if (yLabel) {
                html += `<text x="10" y="15" fill="#6B7280" font-size="10" font-weight="bold">${yLabel}</text>`;
            }

            // Grid lines & Y-Axis Values (4 lines)
            for (let i = 0; i <= 4; i++) {
                const ratio = i / 4;
                const y = padding.top + (chartHeight * (1 - ratio)); // Bottom to Top
                const value = Math.round(gridMax * ratio);

                // Grid Line
                html += `<line x1="${padding.left}" y1="${y}" x2="${width}" y2="${y}" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="4 4" />`;

                // Y-Value Text
                html += `<text x="${padding.left - 8}" y="${y + 3}" text-anchor="end" fill="#9CA3AF" font-size="10">${value}</text>`;
            }

            // Bars
            data.forEach((d, i) => {
                const h = (d.value / gridMax) * chartHeight;
                const x = padding.left + (i * (barWidth + gap)) + (gap / 2);
                const y = padding.top + (chartHeight - h);

                // Rounded Bar
                html += `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="2" fill="#E5E7EB" class="hover:fill-[#2000D6] transition-colors duration-300">
                    <title>[${d.id}] ${d.label}: ${d.value} min</title>
                </rect>`;

                // Active/High volume styling
                if (d.value > (gridMax * 0.7)) {
                    html += `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="2" fill="#2000D6" opacity="0.9"></rect>`;
                }

                // X-Axis ID Label
                html += `<text x="${x + barWidth / 2}" y="${height - 10}" text-anchor="middle" fill="#6B7280" font-size="10" font-weight="500">${d.id}</text>`;
            });

            html += `</svg>`;
            container.innerHTML = html;
        }
    };

    // --- 5. CALL WIDGET MODULE ---
    const CallWidgetModule = {
        timerInterval: null,
        seconds: 65, // Start at 1:05

        init: function () {
            this.startTimer();
            this.bindControls();
        },

        startTimer: function () {
            const timerEl = document.getElementById('call-timer');
            if (!timerEl) return;

            this.timerInterval = setInterval(() => {
                this.seconds++;
                const m = Math.floor(this.seconds / 60).toString().padStart(2, '0');
                const s = (this.seconds % 60).toString().padStart(2, '0');
                timerEl.innerText = `${m}:${s}`;
            }, 1000);
        },

        bindControls: function () {
            // Toggle buttons visual state
            document.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', function () {
                    if (this.classList.contains('bg-gray-50')) {
                        const icon = this.querySelector('i');
                        if (icon && !this.classList.contains('opacity-50')) {
                            this.classList.toggle('bg-blue-50');
                            this.classList.toggle('border-blue-200');
                            icon.classList.toggle('text-blue-600');
                        }
                    }
                });
            });
        }
    };

    // --- 6. TRANSFER FLOW MODULE ---
    const CallTransferModule = {
        transferMode: 'Atendida', // Default mode

        init: function () {
            // Re-use timer from CallWidget but independent instance logic
            this.startTimer();
            this.bindEvents();
        },

        startTimer: function () {
            let seconds = 65;
            const timerEl = document.getElementById('call-timer');
            if (timerEl) {
                setInterval(() => {
                    seconds++;
                    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
                    const s = (seconds % 60).toString().padStart(2, '0');
                    timerEl.innerText = `${m}:${s}`;
                }, 1000);
            }
        },

        bindEvents: function () {
            const btnTransfer = document.getElementById('btn-transfer');
            const modal = document.getElementById('transfer-modal');
            const modalContent = document.getElementById('transfer-modal-content');
            const btnClose = document.getElementById('modal-close');
            const contacts = document.querySelectorAll('.transfer-contact'); // Keep compatibility if strictly needed, but we use new structure now

            // Open Modal
            if (btnTransfer && modal) {
                btnTransfer.addEventListener('click', () => {
                    modal.classList.remove('hidden');
                    // Small delay for transition
                    setTimeout(() => {
                        modal.classList.remove('opacity-0');
                        modalContent.classList.remove('scale-95'); // Updated for new transition
                        modalContent.classList.add('scale-100');
                    }, 10);
                });
            }

            // Close Logic
            const closeModal = () => {
                modalContent.classList.remove('scale-100');
                modalContent.classList.add('scale-95');
                modal.classList.add('opacity-0');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 200);
            };

            if (btnClose) btnClose.addEventListener('click', closeModal);

            // Handle Contact Selection (Dynamic delegation for better support)
            // We use the new structure where the whole row or the button can trigger it? 
            // The request implies "click agent". Let's bind to the rows.
            // We used specific IDs or classes in the new HTML? 
            // In the replace_content we used: class="... cursor-pointer group ..." (lines 288 etc)
            // But we didn't give them a common class like 'transfer-contact' explicitly in the new HTML.
            // Let's add listeners to the list items by looking for their structure or parent.

            // Re-selecting based on new structure (div inside flex-1 overflow-y-auto)
            // Ideally we should have added a class. Let's select by attribute or behavior.
            const contactRows = document.querySelectorAll('#transfer-modal-content .overflow-y-auto > div > div.group'); // Selects the rows inside the groups

            contactRows.forEach(row => {
                row.addEventListener('click', () => {
                    // Extract data
                    const nameDiv = row.querySelector('.text-\\[\\#141F4C\\]');
                    const name = nameDiv ? nameDiv.innerText : 'Desconocido';
                    const avatarDiv = row.querySelector('.rounded-full.text-white'); // The avatar circle
                    const avatarText = avatarDiv ? avatarDiv.innerText : 'XX';

                    // Close and Transfer
                    closeModal();
                    this.setTransferState(name, avatarText);
                });
            });


            // MODE SWITCHING LOGIC
            const modes = ['atendida', 'directa', 'llamadas', 'salas'];
            modes.forEach(mode => {
                const btn = document.getElementById(`btn-mode-${mode}`);
                if (btn) {
                    btn.addEventListener('click', () => this.setMode(mode));
                }
            });
        },

        setMode: function (mode) {
            // Update State
            // Map to Capitalized for display
            const map = { 'atendida': 'Atendida', 'directa': 'Directa', 'llamadas': 'Llamada en curso', 'salas': 'Sala de conferencia' };
            this.transferMode = map[mode] || 'Atendida';

            // Update UI
            const modes = ['atendida', 'directa', 'llamadas', 'salas'];
            modes.forEach(m => {
                const btn = document.getElementById(`btn-mode-${m}`);
                if (!btn) return;

                const indicator = btn.querySelector('.indicator');
                const label = btn; // The button itself controls text color via classes

                if (m === mode) {
                    // Active
                    btn.classList.remove('text-gray-400');
                    btn.classList.add('text-blue-500');
                    if (indicator) {
                        indicator.classList.remove('bg-transparent');
                        indicator.classList.add('bg-blue-500');
                    }
                } else {
                    // Inactive
                    btn.classList.add('text-gray-400');
                    btn.classList.remove('text-blue-500');
                    if (indicator) {
                        indicator.classList.add('bg-transparent');
                        indicator.classList.remove('bg-blue-500');
                    }
                }
            });
        },

        setTransferState: function (name, avatarText) {
            const stageStatusText = document.getElementById('stage-status-text');
            const stageNumber = document.getElementById('stage-number');
            const stageAvatarText = document.getElementById('stage-avatar-text');
            const stagePulse = document.getElementById('stage-pulse');
            const stageControls = document.getElementById('stage-controls');
            const stageVolume = document.getElementById('stage-volume');
            const stageFlag = document.getElementById('stage-flag');
            const stageStatusDot = document.getElementById('stage-status-dot');

            // Hide controls/volume to focus on state change
            if (stageControls) stageControls.style.opacity = '0';
            if (stageVolume) stageVolume.style.opacity = '0';
            if (stageFlag) stageFlag.style.display = 'none';

            // Change Status
            if (stageStatusText) {
                // Use the selected MODE here
                stageStatusText.innerText = `Transfiriendo (${this.transferMode})...`;
                stageStatusText.className = 'text-sm font-bold text-blue-500 mb-2 animate-pulse';
            }
            if (stageNumber) stageNumber.innerText = name;

            // Avatar Update
            if (stageAvatarText) {
                stageAvatarText.innerText = avatarText;
                // Temporarily stop pulse or change color
                stagePulse.style.display = 'none';
            }

            if (stageStatusDot) stageStatusDot.className = 'w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse';

            // Simulate Connected after 3s
            setTimeout(() => {
                if (stageStatusText) {
                    stageStatusText.innerText = `Llamada Transferida (${this.transferMode})`;
                    stageStatusText.className = 'text-sm font-bold text-green-500 mb-2';
                }
                if (stageStatusDot) stageStatusDot.className = 'w-1.5 h-1.5 rounded-full bg-green-500';

                // Show "Hang up" only? Or restore controls?
                // For demo, just fade controls back in partialy disabled or different state
                if (stageControls) {
                    stageControls.style.opacity = '0.5';
                    stageControls.style.pointerEvents = 'none';
                }

                // Pulse back?
                // stagePulse.style.display = 'block';
            }, 3000);
        }
    };

    // --- 7. COMPARATIVE STATS MODULE ---
    const ComparativeStatsModule = {
        // [Entrantes, Contestadas, Sin Contestar, Salientes, Espera]
        // Start all false for sequential reveal demo
        visibleSeries: [false, false, false, false, false],

        init: function () {
            console.log("ComparativeStatsModule initialized");
            this.renderChart(1.0); // Default multiplier

            // Bind Date Change
            const selector = document.getElementById('date-selector');
            if (selector) {
                selector.addEventListener('change', (e) => {
                    const val = e.target.value;
                    let multiplier = 1.0;
                    // Simulate different data profiles based on selection
                    if (val === 'yesterday') multiplier = 0.8;
                    else if (val === '25jan') multiplier = 1.2;
                    else if (val === '24jan') multiplier = 0.6;
                    else if (val === '23jan') multiplier = 0.9;
                    else if (val === 'today') multiplier = 1.0;

                    console.log(`Date changed to ${val}, refreshing chart...`);
                    this.renderChart(multiplier);
                });
            }
        },

        toggleSeries: function (index) {
            if (index >= 0 && index < this.visibleSeries.length) {
                this.visibleSeries[index] = !this.visibleSeries[index];
                this.renderChart(); // Re-render with current state
            }
        },

        renderChart: function (multiplier = 1.0) {
            console.log("Rendering comparative chart with multiplier:", multiplier);

            // Mock Data: Hourly breakdown (09:00 - 18:00)
            const hours = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

            // Helper for randoms
            const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

            const timeData = hours.map(h => {
                // Mock trends: Peak at 10-12 and 16-17
                const timeTrend = (h === '10:00' || h === '11:00' || h === '16:00') ? 1.5 : 1.0;

                // Apply date multiplier to vary the "day"
                const incoming = Math.floor(rnd(30, 60) * timeTrend * multiplier);
                const answered = Math.floor(incoming * rnd(0.85, 0.98)); // High answer rate
                const missed = incoming - answered;
                const outgoing = Math.floor(rnd(20, 50) * timeTrend * multiplier);
                const wait = Math.floor(rnd(15, 60) * (2 - multiplier)); // Inverse trend for wait time (less traffic/more efficieny?)

                // Metrics Definitions
                // Index 0: Entrantes
                // Index 1: Contestadas
                // Index 2: Sin Contestar
                // Index 3: Salientes
                // Index 4: Espera (s)

                const allMetrics = [
                    { label: 'Entrantes', value: incoming, color: '#29ABE2' },     // Blue
                    { label: 'Contestadas', value: answered, color: '#22C55E' },   // Green
                    { label: 'Sin Contestar', value: missed, color: '#EF4444' },   // Red
                    { label: 'Salientes', value: outgoing, color: '#141F4C' },     // Dark Blue
                    { label: 'Espera (s)', value: wait, color: '#F59E0B' }         // Orange
                ];

                // Filter based on visibleSeries state
                // We keep the index/structure consistent but only return what is visible
                const visibleMetrics = allMetrics.filter((_, i) => this.visibleSeries[i]);

                return {
                    time: h,
                    metrics: visibleMetrics
                };
            });

            this.drawChart('chart-comparative', timeData);
        },

        drawChart: function (containerId, data) {
            const container = document.getElementById(containerId);
            if (!container) {
                console.warn("Container not found:", containerId);
                return;
            }

            // Force clear and minimal style
            container.innerHTML = '';

            // Determine dimensions
            const width = container.clientWidth || 800;
            const height = container.clientHeight || 320;
            const padding = { top: 40, bottom: 50, left: 50, right: 20 };

            // Find Max Value for Scale (scan all data even if hidden? No, scan rendered data)
            let maxVal = 0;
            data.forEach(slot => {
                slot.metrics.forEach(m => {
                    if (m.value > maxVal) maxVal = m.value;
                });
            });
            // Default max if nothing visible
            if (maxVal === 0) maxVal = 100;

            const gridMax = Math.ceil(maxVal / 20) * 20 || 100; // Snap to 20s for Bars

            const chartWidth = width - padding.left - padding.right;
            const chartHeight = height - padding.top - padding.bottom;

            // Calculations for Grouped Bars
            const numGroups = data.length;
            const groupWidth = chartWidth / numGroups;
            const groupPadding = groupWidth * 0.2;
            const contentWidth = groupWidth - groupPadding;

            // Calculate active bars for width distribution
            // We need to know how many bar-type metrics are visible per group
            // Wait Time (Orange) is a line, so exclude it from bar count logic if visible
            // We check the first slot to see what kind of metrics are present
            const sampleMetrics = data.length > 0 ? data[0].metrics : [];
            const barMetricsCount = sampleMetrics.filter(m => !m.label.includes('Espera')).length;

            // Avoid division by zero
            const numBars = barMetricsCount > 0 ? barMetricsCount : 1;
            const barWidth = (contentWidth / numBars) * 0.9;

            let html = `<svg viewBox="0 0 ${width} ${height}" style="width:100%; height:100%; overflow:visible;">`;

            // Y-Axis Title
            html += `<text x="${-height / 2}" y="15" transform="rotate(-90)" text-anchor="middle" fill="#9CA3AF" font-size="10" font-weight="500">N° de Llamadas</text>`;

            // 1. Grid Lines (Y-Axis)
            for (let i = 0; i <= 5; i++) {
                const ratio = i / 5;
                const val = Math.round(gridMax * ratio);
                const y = padding.top + (chartHeight * (1 - ratio));

                html += `<line x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}" stroke="#E5E7EB" stroke-width="1" stroke-dasharray="4 4" />`;
                html += `<text x="${padding.left - 10}" y="${y + 4}" text-anchor="end" fill="#9CA3AF" font-size="10">${val}</text>`;
            }

            // 2. Data Rendering Loop (Bars)
            // Collect Line Points simultaneously
            let linePoints = [];

            data.forEach((slot, i) => {
                // X Position of this Group
                const groupX = padding.left + (i * groupWidth) + (groupPadding / 2);

                // Split metrics
                const barMetrics = slot.metrics.filter(m => !m.label.includes('Espera'));
                const waitMetric = slot.metrics.find(m => m.label.includes('Espera'));

                barMetrics.forEach((metric, j) => {
                    const barHeight = (metric.value / gridMax) * chartHeight;
                    const x = groupX + (j * barWidth);
                    const y = padding.top + (chartHeight - barHeight);

                    // Bar
                    html += `<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="2" fill="${metric.color}" class="hover:opacity-80 transition-opacity">
                        <title>${slot.time} - ${metric.label}: ${metric.value}</title>
                    </rect>`;
                });

                // Calculate Line Point (Center of group)
                if (waitMetric) {
                    const x = groupX + (contentWidth / 2);
                    const y = padding.top + (chartHeight - ((waitMetric.value / gridMax) * chartHeight));
                    linePoints.push({ x, y, value: waitMetric.value, label: waitMetric.label });
                }

                // X-Axis Label (Hour)
                const labelX = groupX + (contentWidth / 2);
                html += `<text x="${labelX}" y="${height - 15}" text-anchor="middle" fill="#6B7280" font-size="11" font-weight="600">${slot.time}</text>`;
            });

            // 3. Render Curved Line
            if (linePoints.length > 0) {
                // Generate Path Command (Catmull-Rom or Cubic Bezier)
                // Simple Smoothing helper
                let d = `M ${linePoints[0].x} ${linePoints[0].y}`;

                for (let i = 0; i < linePoints.length - 1; i++) {
                    const p0 = linePoints[i - 1] || linePoints[i];
                    const p1 = linePoints[i];
                    const p2 = linePoints[i + 1];
                    const p3 = linePoints[i + 2] || p2;

                    // Implementing basic Catmull-Rom to Bezier conversion for smoothness
                    const cp1x = i === 0 ? p1.x : p1.x + (p2.x - p0.x) * 0.15;
                    const cp1y = i === 0 ? p1.y : p1.y + (p2.y - p0.y) * 0.15;
                    const cp2x = i === linePoints.length - 2 ? p2.x : p2.x - (p3.x - p1.x) * 0.15;
                    const cp2y = i === linePoints.length - 2 ? p2.y : p2.y - (p3.y - p1.y) * 0.15;

                    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
                }

                html += `<path d="${d}" fill="none" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-md" />`;

                // Add Dots
                linePoints.forEach(p => {
                    html += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="white" stroke="#F59E0B" stroke-width="2" class="hover:scale-125 transition-transform cursor-pointer">
                        <title>${p.label}: ${p.value}s</title>
                    </circle>`;
                });
            }

            html += `</svg>`;
            container.innerHTML = html;
        }
    };

    const VoiceoverModalModule = {
        init: function () {
            console.log("Voiceover Manager initialized");
            this.bindEvents();
        },

        bindEvents: function () {
            const btnNew = document.getElementById('btn-new-voiceover');
            const modal = document.getElementById('locucion-modal');
            const modalContent = document.getElementById('locucion-modal-content');
            const btnClose = document.getElementById('btn-close-modal');
            const btnCancel = document.getElementById('btn-cancel-modal');

            if (!btnNew) {
                // Not finding button is okay if widget isn't active
                // console.error("Btn New Voiceover not found!");
                return;
            }
            if (!modal) console.error("Modal not found!");

            const openModal = () => {
                console.log("Opening modal...");
                if (!modal) return;
                modal.classList.remove('hidden');
                // Small timeout to allow display:block to apply before opacity transition
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    if (modalContent) modalContent.classList.remove('scale-95');
                }, 10);
            };

            const closeModal = () => {
                console.log("Closing modal...");
                if (!modal) return;
                modal.classList.add('opacity-0');
                if (modalContent) modalContent.classList.add('scale-95');

                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 200); // Match transition duration
            };

            if (btnNew) {
                console.log("Binding click to New Voiceover button");
                btnNew.addEventListener('click', openModal);
            }
            if (btnClose) btnClose.addEventListener('click', closeModal);
            if (btnCancel) btnCancel.addEventListener('click', closeModal);

            // Close on click outside
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });
            }
        }
    };

    // --- 8. TRANSFER DEMO MODULE (AUTOMATION) ---
    const TransferDemoModule = {
        // Standard Init Pattern
        init: function () {
            console.log("Transfer Demo Initialized");
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                this.runSequence();
            } else {
                window.addEventListener('DOMContentLoaded', () => this.runSequence());
            }
        },

        // Helper: Promisified Wait
        wait: ms => new Promise(r => setTimeout(r, ms)),

        // Helper: Move Cursor (Standard)
        async moveCursorTo(selector) {
            const cursor = document.getElementById('demo-cursor');
            const el = document.querySelector(selector);

            if (!el) { return; }
            if (!cursor) { console.warn("Cursor not found"); return; }

            // Ensure Visibility
            cursor.classList.remove('opacity-0');
            cursor.style.opacity = '1';

            // Calculate Position
            const rect = el.getBoundingClientRect();
            // Target center
            const x = rect.left + (rect.width / 2);
            const y = rect.top + (rect.height / 2);

            // Move
            cursor.style.transform = `translate(${x}px, ${y}px)`;

            // Wait for transition to finish
            await this.wait(800);
        },

        // Helper: Simulate Click (Standard)
        async clickCursor() {
            const cursor = document.getElementById('demo-cursor');
            const icon = cursor?.querySelector('i');
            const effect = document.getElementById('click-effect');

            // Visual Down
            if (icon) icon.style.transform = "scale(0.8) rotate(-15deg)";
            if (effect) {
                effect.classList.remove('hidden');
                setTimeout(() => effect.classList.add('hidden'), 300);
            }
            await this.wait(150);

            // Visual Up
            if (icon) icon.style.transform = "scale(1) rotate(-15deg)";
            await this.wait(150);
        },

        async runSequence() {
            console.log("Starting Demo Sequence...");
            await this.wait(1000);

            // 1. Click Transfer Button
            await this.moveCursorTo('#btn-transfer');
            await this.clickCursor();
            document.getElementById('btn-transfer')?.click();
            await this.wait(1500); // Wait for modal animation

            // 2. Click "Directa" Tab
            await this.moveCursorTo('#btn-mode-directa');
            await this.clickCursor();
            document.getElementById('btn-mode-directa')?.click();
            await this.wait(1000);

            // 3. Select Agent "Jean Gomez"
            // Using a more specific selector if possible, or keeping the nth-child approach
            const agentSelector = '#transfer-modal-content .overflow-y-auto .mb-2 > div:nth-child(3)';
            const agentRow = document.querySelector(agentSelector);

            if (agentRow) {
                await this.moveCursorTo(agentSelector);
                await this.clickCursor();
                agentRow.click();
            } else {
                console.warn("Agent row for Jean Gomez not found");
            }

            await this.wait(4000);

            // Loop (Optional)
            // window.location.reload();
        }
    };

    // --- PUBLIC API ---
    return {
        initQueuePanel: () => QueueModule.init(),
        initQueueDemo: () => DemoModule.init(),
        initStats: () => StatsModule.init(),
        initQueueStats: () => QueueStatsModule.init(),
        initAgentStats: () => {
            QueueStatsModule.renderAgentTimeChart();
            setInterval(() => QueueStatsModule.renderAgentTimeChart(), 5000);
        },
        initCallWidget: () => CallWidgetModule.init(),
        initTransferFlow: () => CallTransferModule.init(),
        initComparativeStats: () => ComparativeStatsModule.init(),
        initVoiceoverManager: () => VoiceoverModalModule.init(),
        switchStatsTab: (tab) => QueueStatsModule.switchStatsTab(tab),
        initTransferDemo: () => TransferDemoModule.init(),
        toggleComparativeSeries: (idx) => ComparativeStatsModule.toggleSeries(idx)
    };
})();
