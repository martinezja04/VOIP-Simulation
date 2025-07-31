\# PSTN/VoIP Traffic Distribution Calculator



A comprehensive web-based calculator for analyzing telecommunications traffic distribution using industry-standard Erlang B models. Features real-time network topology visualization and supports both PSTN and VoIP traffic analysis.



!\[Network Topology Demo](https://img.shields.io/badge/Demo-Live%20Topology-blue?style=for-the-badge)

!\[Erlang B](https://img.shields.io/badge/Traffic%20Model-Erlang%20B-green?style=for-the-badge)

!\[Responsive](https://img.shields.io/badge/Design-Responsive-purple?style=for-the-badge)



\## 🚀 Features



\### 📊 Traffic Analysis

\- \*\*Erlang B calculations\*\* for circuit dimensioning

\- \*\*Busy hour traffic analysis\*\* (configurable percentage)

\- \*\*Blocking probability optimization\*\* (default 0.01)

\- \*\*T-1 circuit requirements\*\* (24 channels per T-1)

\- \*\*Ring topology simulation\*\* (US → China → UK → US)



\### 🎨 Interactive Visualization

\- \*\*Real-time network diagram\*\* generation

\- \*\*Smooth animations\*\* (growing nodes, flowing links)

\- \*\*Visual feedback\*\* on button clicks

\- \*\*Responsive design\*\* for all devices



\### 📡 Technology Support

\- \*\*PSTN Analysis\*\*: T-1 circuits, 64 kbps per channel

\- \*\*VoIP Analysis\*\*: G.711, G.726, G.729 codecs

\- \*\*Protocol overhead\*\*: Accurate IP/UDP/RTP calculations

\- \*\*Bandwidth comparison\*\*: Side-by-side PSTN vs VoIP



\## 🛠️ Technical Specifications



\### Supported Codecs

| Codec | Bit Rate | Bandwidth (with overhead) |

|-------|----------|---------------------------|

| G.711 | 64 kbps  | ~80 kbps per call |

| G.726 | 32 kbps  | ~48 kbps per call |

| G.729 | 8 kbps   | ~24 kbps per call |



\### Traffic Model

\- \*\*Model\*\*: Erlang B (blocked calls cleared)

\- \*\*Formula\*\*: P = (A^N / N!) / Σ(A^i / i!) for i=0 to N

\- \*\*Assumptions\*\*: Poisson arrivals, exponential service times

\- \*\*Default blocking\*\*: 1% (P = 0.01)



\## 📁 Project Structure



```

pstn-voip-calculator/

├── index.html          # Main HTML structure

├── styles.css          # CSS styling and animations

├── script.js           # JavaScript calculations and logic

└── README.md           # This documentation

```



\## 🚀 Getting Started



\### Prerequisites

\- Modern web browser (Chrome, Firefox, Safari, Edge)

\- No server required - runs entirely client-side



\### Installation

1\. \*\*Clone the repository\*\*

&nbsp;  ```bash

&nbsp;  git clone https://github.com/yourusername/pstn-voip-calculator.git

&nbsp;  cd pstn-voip-calculator

&nbsp;  ```



2\. \*\*Open in browser\*\*

&nbsp;  ```bash

&nbsp;  # Simply open index.html in your browser

&nbsp;  open index.html

&nbsp;  # OR serve with a local server

&nbsp;  python -m http.server 8000

&nbsp;  ```



3\. \*\*Start calculating!\*\*

&nbsp;  - Enter traffic parameters

&nbsp;  - Select codec type

&nbsp;  - Click "Calculate Traffic Distribution"

&nbsp;  - View animated network topology



\## 💻 Usage



\### Default Configuration

The calculator comes pre-loaded with realistic traffic values:

\- \*\*US Traffic\*\*: 12,822 minutes/day

\- \*\*UK Traffic\*\*: 28,000 minutes/day  

\- \*\*China Traffic\*\*: 28,286 minutes/day

\- \*\*Busy Hour\*\*: 17% of daily traffic

\- \*\*Blocking\*\*: 0.01 (1%)



\### Customization

All parameters are fully configurable:

1\. \*\*Traffic Volumes\*\*: Enter daily minutes per location

2\. \*\*Busy Hour Percentage\*\*: Adjust peak traffic ratio

3\. \*\*Blocking Probability\*\*: Set quality of service level

4\. \*\*Codec Selection\*\*: Choose G.711, G.726, or G.729



\### Output Analysis

The calculator provides:

\- \*\*Circuit Requirements\*\*: Number of circuits and T-1s needed

\- \*\*Bandwidth Analysis\*\*: Separate PSTN and VoIP calculations

\- \*\*Network Diagram\*\*: Visual topology with real-time data

\- \*\*Detailed Tables\*\*: Complete traffic breakdown per link



\## 🔬 Calculations Explained



\### Traffic Flow (Ring Topology)

```

US (12,822 min/day) → China → UK (28,000 min/day) → US

&nbsp;                   ↑                              ↓

&nbsp;             China (28,286 min/day) ←←←←←←←←←←←←←←

```



\### Erlang Calculation Steps

1\. \*\*Daily to Busy Hour\*\*: `Busy Minutes = Daily × (Busy Hour % / 100)`

2\. \*\*Minutes to Erlangs\*\*: `Erlangs = Busy Minutes / 60`

3\. \*\*Circuit Sizing\*\*: Use Erlang B formula to find minimum circuits

4\. \*\*T-1 Calculation\*\*: `T-1s = ceil(Circuits / 24)`



\### VoIP Bandwidth Formula

```

Total Bandwidth = Circuits × ((Payload + 40 bytes overhead) × 8 × 50 pps) / 1000

```



\## 🎨 Animation Features



\### Visual Effects

\- \*\*Button Feedback\*\*: Loading spinner during calculations

\- \*\*Node Animation\*\*: Circles grow from center (1.5s duration)

\- \*\*Link Animation\*\*: Flowing dashed lines simulate traffic

\- \*\*Label Fade-in\*\*: Staggered appearance for professional look



\### Timing Sequence

1\. Button click → Loading state (1.5s)

2\. Calculations complete → Diagram cleared

3\. Nodes appear (0-1.5s)

4\. Links draw with flow animation (0-2s)

5\. Labels fade in (0.5-2.5s)



\## 📊 Sample Output



For default values, expect:

\- \*\*US → China\*\*: ~36 circuits (2 T-1s)

\- \*\*China → UK\*\*: ~80 circuits (4 T-1s)

\- \*\*UK → US\*\*: ~79 circuits (4 T-1s)

\- \*\*Total\*\*: 10 T-1 circuits, ~6.4 Mbps PSTN bandwidth



\## 🤝 Contributing



1\. \*\*Fork the repository\*\*

2\. \*\*Create feature branch\*\*: `git checkout -b feature/new-codec`

3\. \*\*Commit changes\*\*: `git commit -am 'Add G.722 codec support'`

4\. \*\*Push to branch\*\*: `git push origin feature/new-codec`

5\. \*\*Create Pull Request\*\*



\### Development Guidelines

\- Follow existing code style and structure

\- Test calculations against industry standards

\- Ensure responsive design on all devices

\- Add comments for complex telecommunications formulas



\## 📚 References



\- \*\*ITU-T G.711\*\*: Pulse Code Modulation (PCM)

\- \*\*ITU-T G.729\*\*: Coding of speech at 8 kbit/s

\- \*\*RFC 3550\*\*: RTP Protocol Specification

\- \*\*Erlang B Model\*\*: A.K. Erlang traffic engineering principles



\## 📄 License



This project is licensed under the MIT License - see the \[LICENSE](LICENSE) file for details.



\## 🙋‍♂️ Support



\- \*\*Issues\*\*: \[GitHub Issues](https://github.com/yourusername/pstn-voip-calculator/issues)

\- \*\*Discussions\*\*: \[GitHub Discussions](https://github.com/yourusername/pstn-voip-calculator/discussions)

\- \*\*Email\*\*: your.email@domain.com



\## 🔗 Live Demo



🌐 \*\*\[Try the Calculator](https://yourusername.github.io/pstn-voip-calculator/)\*\*



---



\*\*Built with ❤️ for telecommunications engineers and network planners\*\*

