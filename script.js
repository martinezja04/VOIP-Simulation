class TrafficCalculator {
    constructor() {
        this.locations = ['US', 'China', 'UK'];
        this.links = [
            { from: 'US', to: 'China' },
            { from: 'China', to: 'UK' },
            { from: 'UK', to: 'US' }
        ];
        this.initializeEventListeners();
        this.calculateTraffic(); // Initial calculation
    }

    initializeEventListeners() {
        const calculateBtn = document.getElementById('calculate-btn');
        calculateBtn.addEventListener('click', () => {
            this.handleCalculateClick();
        });
    }

    async handleCalculateClick() {
        const btn = document.getElementById('calculate-btn');
        const originalText = btn.textContent;
        
        // Visual feedback
        btn.classList.add('calculating');
        btn.textContent = 'Calculating...';
        
        // Add delay for smooth animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.calculateTraffic();
        
        // Reset button
        btn.classList.remove('calculating');
        btn.textContent = originalText;
    }

    // Erlang B formula implementation
    erlangB(erlangs, circuits) {
        if (circuits === 0) return 1;
        
        let numerator = Math.pow(erlangs, circuits) / this.factorial(circuits);
        let denominator = 0;
        
        for (let i = 0; i <= circuits; i++) {
            denominator += Math.pow(erlangs, i) / this.factorial(i);
        }
        
        return numerator / denominator;
    }

    // Calculate VoIP bandwidth with protocol overhead (IP/UDP/RTP = 40 bytes)
    calculateVoIPBandwidth(circuits, codecKbps) {
        let packetRate, payloadBytes, totalBandwidthKbps;
        
        if (codecKbps === 64) { // G.711
            packetRate = 50; // packets per second (20ms intervals)
            payloadBytes = 160; // 160 bytes payload for G.711
            totalBandwidthKbps = circuits * ((40 + payloadBytes) * 8 * packetRate) / 1000;
        } else if (codecKbps === 32) { // G.726
            packetRate = 50;
            payloadBytes = 80; // 80 bytes payload for G.726
            totalBandwidthKbps = circuits * ((40 + payloadBytes) * 8 * packetRate) / 1000;
        } else if (codecKbps === 8) { // G.729
            packetRate = 50;
            payloadBytes = 20; // 20 bytes payload for G.729
            totalBandwidthKbps = circuits * ((40 + payloadBytes) * 8 * packetRate) / 1000;
        }
        
        return totalBandwidthKbps / 1000; // Convert to Mbps
    }

    factorial(n) {
        if (n <= 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // Find minimum circuits needed for given blocking probability
    findMinCircuits(erlangs, maxBlocking) {
        let circuits = Math.ceil(erlangs); // Start with ceiling of erlangs
        
        while (circuits <= erlangs + 20) { // Safety limit
            if (this.erlangB(erlangs, circuits) <= maxBlocking) {
                return circuits;
            }
            circuits++;
        }
        
        return circuits; // Fallback
    }

    calculateTraffic() {
        // Get input values
        const usTraffic = parseInt(document.getElementById('us-traffic').value);
        const ukTraffic = parseInt(document.getElementById('uk-traffic').value);
        const chinaTraffic = parseInt(document.getElementById('china-traffic').value);
        const busyHourPercent = parseFloat(document.getElementById('busy-hour').value);
        const blockingProb = parseFloat(document.getElementById('blocking').value);
        const codecBandwidth = parseInt(document.getElementById('codec').value);

        const trafficData = {
            'US': usTraffic,
            'China': chinaTraffic,
            'UK': ukTraffic
        };

        // Calculate traffic for each link
        const linkResults = this.links.map(link => {
            const dailyMinutes = trafficData[link.from];
            const busyHourMinutes = dailyMinutes * (busyHourPercent / 100);
            const erlangs = busyHourMinutes / 60; // Convert minutes to hours (Erlangs)
            
            const requiredCircuits = this.findMinCircuits(erlangs, blockingProb);
            const t1Circuits = Math.ceil(requiredCircuits / 24); // T-1 has 24 channels
            
            // Corrected VoIP bandwidth with protocol overhead
            const voipBandwidth = this.calculateVoIPBandwidth(requiredCircuits, codecBandwidth);
            // PSTN bandwidth (64 kbps per circuit for T-1)
            const pstBandwidth = (requiredCircuits * 64) / 1000; // Convert kbps to Mbps

            return {
                link: `${link.from} → ${link.to}`,
                dailyMinutes,
                busyHourMinutes: Math.round(busyHourMinutes),
                erlangs: erlangs.toFixed(2),
                requiredCircuits,
                t1Circuits,
                pstBandwidthMbps: pstBandwidth.toFixed(3),
                voipBandwidthMbps: voipBandwidth.toFixed(3),
                actualBlocking: this.erlangB(erlangs, requiredCircuits).toFixed(6)
            };
        });

        // Update results
        this.updateResults(linkResults, codecBandwidth);
        this.drawNetworkDiagram(linkResults);
    }

    updateResults(linkResults, codecBandwidth) {
        // Update PSTN results
        const pstResults = document.getElementById('pstn-results');
        const totalT1s = linkResults.reduce((sum, link) => sum + link.t1Circuits, 0);
        const totalPSTBandwidth = linkResults.reduce((sum, link) => sum + parseFloat(link.pstBandwidthMbps), 0);
        
        pstResults.innerHTML = `
            <div class="metric">
                <span class="metric-label">Total T-1 Circuits:</span>
                <span class="metric-value">${totalT1s}</span>
            </div>
            <div class="metric">
                <span class="metric-label">PSTN Bandwidth (64 kbps/circuit):</span>
                <span class="metric-value">${totalPSTBandwidth.toFixed(3)} Mbps</span>
            </div>
            <div class="metric">
                <span class="metric-label">Network Topology:</span>
                <span class="metric-value">Ring (Unidirectional)</span>
            </div>
            <div class="metric">
                <span class="metric-label">Traffic Model:</span>
                <span class="metric-value">Erlang B (Blocked calls cleared)</span>
            </div>
        `;

        // Update VoIP results
        const voipResults = document.getElementById('voip-results');
        const codecName = codecBandwidth === 64 ? 'G.711' : codecBandwidth === 32 ? 'G.726' : 'G.729';
        const totalConcurrentCalls = linkResults.reduce((sum, link) => sum + link.requiredCircuits, 0);
        const totalVoIPBandwidth = linkResults.reduce((sum, link) => sum + parseFloat(link.voipBandwidthMbps), 0);
        
        voipResults.innerHTML = `
            <div class="metric">
                <span class="metric-label">Codec:</span>
                <span class="metric-value">${codecName} (${codecBandwidth} kbps)</span>
            </div>
            <div class="metric">
                <span class="metric-label">Total Concurrent Calls:</span>
                <span class="metric-value">${totalConcurrentCalls}</span>
            </div>
            <div class="metric">
                <span class="metric-label">VoIP Bandwidth (with overhead):</span>
                <span class="metric-value">${totalVoIPBandwidth.toFixed(3)} Mbps</span>
            </div>
            <div class="metric">
                <span class="metric-label">Protocol Overhead:</span>
                <span class="metric-value">IP/UDP/RTP (40 bytes/packet)</span>
            </div>
        `;

        // Update table
        const tbody = document.getElementById('traffic-tbody');
        tbody.innerHTML = linkResults.map(result => `
            <tr>
                <td>${result.link}</td>
                <td>${result.dailyMinutes.toLocaleString()}</td>
                <td>${result.busyHourMinutes.toLocaleString()}</td>
                <td>${result.erlangs}</td>
                <td>${result.requiredCircuits} (${result.t1Circuits} T-1s)</td>
                <td>PSTN: ${result.pstBandwidthMbps} | VoIP: ${result.voipBandwidthMbps}</td>
            </tr>
        `).join('');
    }

    drawNetworkDiagram(linkResults) {
        const svg = document.getElementById('network-svg');
        const width = svg.getAttribute('width');
        const height = svg.getAttribute('height');
        
        // Clear existing content
        svg.innerHTML = '';

        // Add arrow marker definition
        svg.innerHTML = `
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                        refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#764ba2" />
                </marker>
            </defs>
        `;

        // Node positions (triangle formation)
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = 120;
        
        const nodePositions = {
            'US': { x: centerX - radius, y: centerY + radius/2 },
            'China': { x: centerX + radius, y: centerY + radius/2 },
            'UK': { x: centerX, y: centerY - radius }
        };

        // Draw links first (so they appear behind nodes) with animation
        this.links.forEach((link, index) => {
            const fromPos = nodePositions[link.from];
            const toPos = nodePositions[link.to];
            const result = linkResults[index];
            
            // Calculate link path (curved for better visibility)
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;
            
            // Create curved path
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            const d = `M ${fromPos.x} ${fromPos.y} Q ${midX + 30} ${midY - 20} ${toPos.x} ${toPos.y}`;
            path.setAttribute('d', d);
            path.setAttribute('class', 'link animated');
            svg.appendChild(path);

            // Add T-1 circuits label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', midX + 30);
            label.setAttribute('y', midY - 25);
            label.setAttribute('class', 'link-label');
            label.textContent = `${result.t1Circuits} T-1s`;
            svg.appendChild(label);

            // Add VoIP bandwidth label
            const bwLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            bwLabel.setAttribute('x', midX + 30);
            bwLabel.setAttribute('y', midY - 10);
            bwLabel.setAttribute('class', 'link-label');
            bwLabel.style.fontSize = '10px';
            bwLabel.textContent = `VoIP: ${result.voipBandwidthMbps} Mbps`;
            svg.appendChild(bwLabel);

            // Add PSTN bandwidth label
            const pstLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            pstLabel.setAttribute('x', midX + 30);
            pstLabel.setAttribute('y', midY + 5);
            pstLabel.setAttribute('class', 'link-label');
            pstLabel.style.fontSize = '10px';
            pstLabel.textContent = `PSTN: ${result.pstBandwidthMbps} Mbps`;
            svg.appendChild(pstLabel);
        });

        // Draw nodes with animation
        Object.entries(nodePositions).forEach(([location, pos]) => {
            // Node circle
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', pos.x);
            circle.setAttribute('cy', pos.y);
            circle.setAttribute('r', 40);
            circle.setAttribute('class', 'node');
            svg.appendChild(circle);

            // Node label
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', pos.x);
            text.setAttribute('y', pos.y);
            text.setAttribute('class', 'node-label');
            text.textContent = location;
            svg.appendChild(text);
        });

        // Add title
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        title.setAttribute('x', centerX);
        title.setAttribute('y', 30);
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('font-size', '16');
        title.setAttribute('font-weight', 'bold');
        title.setAttribute('fill', '#333');
        title.textContent = 'PSTN/VoIP Ring Network Topology';
        svg.appendChild(title);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TrafficCalculator();
});