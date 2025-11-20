// Countdown Timer
// Mainnet target: 2025-11-21 22:00 Beijing Time (UTC+8) => 2025-11-21T14:00:00Z
const targetDate = new Date('2025-11-21T14:00:00Z').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    if (distance < 0) {
        document.querySelector('.countdown-label').textContent = 'Mainnet Live';
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
    }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Donut Chart with Interactive Animations
function createDonutChart() {
    const data = [
        { 
            label: 'NVAI Presale', 
            value: 40, 
            color: '#76B900',
            description: 'Early-stage contributors powering decentralized AI.'
        },
        { 
            label: 'Public & Liquidity', 
            value: 20, 
            color: '#00FFFF',
            description: 'Ensuring token stability and healthy market access.'
        },
        { 
            label: 'Community & Ecosystem', 
            value: 15, 
            color: '#4ECDC4',
            description: 'Incentivizing participation, governance, and node growth.'
        },
        { 
            label: 'Development', 
            value: 15, 
            color: '#95E1D3',
            description: 'Continuous R&D, GPU optimization, and product innovation.'
        },
        { 
            label: 'Strategic Partners', 
            value: 10, 
            color: '#8B8B8B',
            description: 'For global collaborations and long-term ecosystem expansion.'
        }
    ];

    const svg = document.getElementById('donut-chart');
    svg.innerHTML = ''; // Clear existing content
    
    const centerX = 100;
    const centerY = 100;
    const radius = 85;
    const innerRadius = 55;

    let currentAngle = -90;
    const segments = [];

    // Create segments with animation
    data.forEach((segment, index) => {
        const angle = (segment.value / 100) * 360;
        const endAngle = currentAngle + angle;

        const path = createArcPath(centerX, centerY, radius, innerRadius, currentAngle, endAngle);
        
        const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElement.setAttribute('d', path);
        pathElement.setAttribute('fill', segment.color);
        pathElement.setAttribute('stroke', 'rgba(10, 10, 10, 0.8)');
        pathElement.setAttribute('stroke-width', '2');
        pathElement.classList.add('pie-segment');
        pathElement.dataset.index = index;
        
        // Initial animation
        pathElement.style.opacity = '0';
        pathElement.style.transform = 'scale(0)';
        
        setTimeout(() => {
            pathElement.style.transition = 'all 0.6s ease';
            pathElement.style.opacity = '1';
            pathElement.style.transform = 'scale(1)';
        }, index * 100);
        
        svg.appendChild(pathElement);
        segments.push({ element: pathElement, data: segment, index });
        
        currentAngle = endAngle;
    });

    // Create legend
    const legend = document.querySelector('.tokenomics-legend');
    legend.innerHTML = '';
    
    data.forEach((item, index) => {
        const legendItem = document.createElement('div');
        legendItem.className = 'legend-item';
        legendItem.dataset.index = index;
        legendItem.style.setProperty('--legend-color', item.color);
        
        legendItem.innerHTML = `
            <div class="legend-item-header">
                <div class="legend-item-title">
                    <span class="legend-color" style="background: ${item.color};"></span>
                    <span class="legend-label">${item.label}</span>
                </div>
                <span class="legend-value">${item.value}%</span>
            </div>
            <div class="legend-description">${item.description}</div>
        `;
        
        legend.appendChild(legendItem);
    });

    // Add interactive hover effects
    segments.forEach(segment => {
        segment.element.addEventListener('mouseenter', () => {
            highlightSegment(segment.index);
        });
        
        segment.element.addEventListener('mouseleave', () => {
            unhighlightAll();
        });
    });

    document.querySelectorAll('.legend-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            const index = parseInt(item.dataset.index);
            highlightSegment(index);
        });
        
        item.addEventListener('mouseleave', () => {
            unhighlightAll();
        });
    });

    function highlightSegment(index) {
        // Highlight pie segment
        segments.forEach((seg, i) => {
            if (i === index) {
                seg.element.classList.add('highlighted');
            } else {
                seg.element.style.opacity = '0.4';
            }
        });
        
        // Highlight legend item
        document.querySelectorAll('.legend-item').forEach((item, i) => {
            if (i === index) {
                item.classList.add('highlighted');
            } else {
                item.style.opacity = '0.5';
            }
        });
    }

    function unhighlightAll() {
        segments.forEach(seg => {
            seg.element.classList.remove('highlighted');
            seg.element.style.opacity = '1';
        });
        
        document.querySelectorAll('.legend-item').forEach(item => {
            item.classList.remove('highlighted');
            item.style.opacity = '1';
        });
    }
}

function createArcPath(cx, cy, r, ir, startAngle, endAngle) {
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + r * Math.cos(startRad);
    const y1 = cy + r * Math.sin(startRad);
    const x2 = cx + r * Math.cos(endRad);
    const y2 = cy + r * Math.sin(endRad);

    const ix1 = cx + ir * Math.cos(startRad);
    const iy1 = cy + ir * Math.sin(startRad);
    const ix2 = cx + ir * Math.cos(endRad);
    const iy2 = cy + ir * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${ir} ${ir} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
}

createDonutChart();

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const item = button.parentElement;
        const isActive = item.classList.contains('active');
        
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Wireframe Globe
const globeCanvas = document.getElementById('wireframe-globe');
if (globeCanvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = globeCanvas.getContext('2d');
    globeCanvas.width = 500;
    globeCanvas.height = 500;

    const centerX = 250;
    const centerY = 250;
    const radius = 150;
    let rotation = 0;

    function drawGlobe() {
        ctx.clearRect(0, 0, globeCanvas.width, globeCanvas.height);
        
        // Draw latitude lines
        for (let lat = -60; lat <= 60; lat += 30) {
            ctx.beginPath();
            const latRad = (lat * Math.PI) / 180;
            const latRadius = radius * Math.cos(latRad);
            const yOffset = radius * Math.sin(latRad);
            
            for (let lon = 0; lon <= 360; lon += 5) {
                const lonRad = ((lon + rotation) * Math.PI) / 180;
                const x = centerX + latRadius * Math.cos(lonRad);
                const y = centerY + yOffset;
                const z = latRadius * Math.sin(lonRad);
                
                if (z > 0) {
                    ctx.strokeStyle = `rgba(118, 185, 0, ${0.3 + (z / latRadius) * 0.3})`;
                } else {
                    ctx.strokeStyle = `rgba(118, 185, 0, ${0.1})`;
                }
                
                if (lon === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Draw longitude lines
        for (let lon = 0; lon < 360; lon += 30) {
            ctx.beginPath();
            for (let lat = -90; lat <= 90; lat += 5) {
                const latRad = (lat * Math.PI) / 180;
                const lonRad = ((lon + rotation) * Math.PI) / 180;
                
                const x = centerX + radius * Math.cos(latRad) * Math.cos(lonRad);
                const y = centerY + radius * Math.sin(latRad);
                const z = radius * Math.cos(latRad) * Math.sin(lonRad);
                
                if (z > 0) {
                    ctx.strokeStyle = `rgba(118, 185, 0, ${0.3 + (z / radius) * 0.4})`;
                } else {
                    ctx.strokeStyle = `rgba(118, 185, 0, ${0.08})`;
                }
                
                if (lat === -90) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        
        // Draw nodes
        const nodeCount = 20;
        for (let i = 0; i < nodeCount; i++) {
            const lat = (Math.random() * 160 - 80) * Math.PI / 180;
            const lon = ((Math.random() * 360 + rotation) * Math.PI) / 180;
            
            const x = centerX + radius * Math.cos(lat) * Math.cos(lon);
            const y = centerY + radius * Math.sin(lat);
            const z = radius * Math.cos(lat) * Math.sin(lon);
            
            if (z > 0) {
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + (z / radius) * 0.5})`;
                ctx.fill();
            }
        }
        
        rotation += 0.2;
        requestAnimationFrame(drawGlobe);
    }
    
    drawGlobe();
}

// Particles Canvas
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 80;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.3 + 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(118, 185, 0, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach(p2 => {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(118, 185, 0, ${0.1 * (1 - distance / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animateParticles);
}

// Check for reduced motion preference
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    animateParticles();
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    const header = document.getElementById('header');
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Diagonal stripe parallax
window.addEventListener('scroll', () => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const stripe = document.querySelector('.diagonal-stripe');
        if (stripe) {
            const scrolled = window.pageYOffset;
            stripe.style.transform = `skewY(-3deg) translateY(${scrolled * 0.05}px)`;
        }
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Global state for language
let currentLang = 'en';

// Presale Configuration
const PRESALE_CONFIG = {
    TOKEN_NAME: "NVAI",
    TOKEN_SYMBOL: "NVAI",
    PRICE_TABLE: {
        ETH: 150000,
        BNB: 45000,
        USDT: 50,
        USDC: 50
    },
    MIN: {
        ETH: 0.1,
        BNB: 0.3,
        USDT: 200,
        USDC: 200
    },
    ADDRESSES: {
        ETH: null, // obfuscated
        BNB: null, // obfuscated
        USDT: null, // obfuscated
        USDC: null  // obfuscated
    },
    NETWORK_HINT: {
        ETH: "Use Ethereum network (ETH / ERC-20).",
        BNB: "USE BNB SMART CHAIN (BEP-20)",
        USDT: "Ethereum or BNB Smart Chain.",
        USDC: "Ethereum or BNB Smart Chain."
    },
    COUNTDOWN_TARGET_UTC: "2025-11-21T14:00:00Z"
};

// Presale State
let currentCurrency = "ETH";

// Presale Countdown
const presaleTargetDate = new Date(PRESALE_CONFIG.COUNTDOWN_TARGET_UTC).getTime();

function updatePresaleCountdown() {
    const now = new Date().getTime();
    const distance = presaleTargetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('presale-days').textContent = String(days).padStart(2, '0');
    document.getElementById('presale-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('presale-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('presale-seconds').textContent = String(seconds).padStart(2, '0');
}

updatePresaleCountdown();
setInterval(updatePresaleCountdown, 1000);

// Currency Tab Switching
document.querySelectorAll('.currency-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.currency-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        currentCurrency = tab.dataset.currency;
        updateCurrencyDisplay();
        calculateReceiveAmount();
    });
});

function updateCurrencyDisplay() {
    document.getElementById('input-currency').textContent = currentCurrency;
    const minHint = document.getElementById('min-amount-hint');
    if (minHint && window.translations && window.translations[currentLang]) {
        const format = window.translations[currentLang]['presale.minAmountHint'] || window.translations['en']['presale.minAmountHint'];
        minHint.textContent = format
            .replace('{amount}', PRESALE_CONFIG.MIN[currentCurrency])
            .replace('{currency}', currentCurrency);
    } else {
        minHint.textContent = `Minimum: ${PRESALE_CONFIG.MIN[currentCurrency]} ${currentCurrency}`;
    }
}

// Amount Calculation
const purchaseAmountInput = document.getElementById('purchase-amount');
purchaseAmountInput.addEventListener('input', calculateReceiveAmount);

function calculateReceiveAmount() {
    const amount = parseFloat(purchaseAmountInput.value) || 0;
    const minAmount = PRESALE_CONFIG.MIN[currentCurrency];
    const receiveAmount = amount * PRESALE_CONFIG.PRICE_TABLE[currentCurrency];
    
    document.getElementById('receive-amount').textContent = `${receiveAmount.toLocaleString()} ${PRESALE_CONFIG.TOKEN_SYMBOL}`;
    
    const minHint = document.getElementById('min-amount-hint');
    const buyButton = document.getElementById('btn-buy-nvai');
    
    if (amount > 0 && amount < minAmount) {
        minHint.classList.add('error');
        const format = (window.translations[currentLang] && window.translations[currentLang]['presale.minAmountHintError']) || window.translations['en']['presale.minAmountHintError'];
        minHint.textContent = format
            .replace('{amount}', minAmount)
            .replace('{currency}', currentCurrency);
        buyButton.disabled = true;
    } else {
        minHint.classList.remove('error');
        const format = (window.translations[currentLang] && window.translations[currentLang]['presale.minAmountHint']) || window.translations['en']['presale.minAmountHint'];
        minHint.textContent = format
            .replace('{amount}', minAmount)
            .replace('{currency}', currentCurrency);
        buyButton.disabled = amount === 0;
    }
}

// Modal System
function createModal(content) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-content">${content}</div>`;
    document.body.appendChild(overlay);

    // Apply translations to the new modal content
    if (window.applyTranslations) {
        window.applyTranslations(overlay);
    }
    
    setTimeout(() => overlay.classList.add('active'), 10);
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay);
    });
    
    document.addEventListener('keydown', function escHandler(e) {
        if (e.key === 'Escape') {
            closeModal(overlay);
            document.removeEventListener('keydown', escHandler);
        }
    });
    
    return overlay;
}

function closeModal(modal) {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 300);
}

// Buy NVAI Modal
document.getElementById('btn-buy-nvai').addEventListener('click', () => {
    const amount = parseFloat(purchaseAmountInput.value) || 0;
    const receiveAmount = amount * PRESALE_CONFIG.PRICE_TABLE[currentCurrency];
    const networkHintKey = `modal.networkHint.${currentCurrency}`;
    const networkHint = (window.translations?.[currentLang]?.[networkHintKey]) || PRESALE_CONFIG.NETWORK_HINT[currentCurrency];
    const walletAddress = getPresaleAddress();

    const content = `
        <div class="modal-header">
            <h2 class="modal-title" data-lang-key="modal.completePurchase">Complete Your NVAI Purchase</h2>
        </div>
        <div class="modal-body">
            <p data-lang-key="modal.purchaseInstruction"><strong>Send the exact amount below to our secure presale address on the correct blockchain. The system will automatically send NVAI tokens to your wallet address once your payment is received — no manual claiming required.</strong></p>
            
            <div class="modal-field">
                <div class="modal-field-label" data-lang-key="modal.sendAmount">Send Amount</div>
                <div class="modal-field-value">${amount} ${currentCurrency}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label" data-lang-key="modal.youWillReceive">You'll Receive</div>
                <div class="modal-field-value">${receiveAmount.toLocaleString()} ${PRESALE_CONFIG.TOKEN_SYMBOL}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label" data-lang-key="modal.network">Network</div>
                <div class="modal-field-value" style="font-size: 14px; color: var(--nv-cyan);">${networkHint}</div>
            </div>
            
            <div class="modal-field">
                <div class="modal-field-label" style="font-size: 15px; font-weight: 700; color: var(--nv-green); text-transform: uppercase; letter-spacing: 0.1em;" data-lang-key="modal.presaleAddress">NVAI PRESALE ADDRESS</div>
                <div class="modal-field-address">
                    <div class="modal-field-address-text">${walletAddress}</div>
                    <button class="address-copy-btn" id="address-copy-inline-btn" data-lang-key="modal.copy">Copy</button>
                </div>
            </div>
            
            <div class="modal-warning" data-lang-key="modal.important" data-currency="${currentCurrency}">
                <strong>⚠️ Important:</strong> Only send ${currentCurrency} from a personal wallet you control (e.g., MetaMask, Trust Wallet). Do NOT send from an exchange.
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-secondary" id="modal-close-btn" data-lang-key="modal.close">Close</button>
            </div>
        </div>
    `;
    
    const modal = createModal(content);
    
    modal.querySelector('#address-copy-inline-btn').addEventListener('click', () => {
        copyToClipboard(walletAddress);
    });
    
    modal.querySelector('#modal-close-btn').addEventListener('click', () => {
        closeModal(modal);
    });
});

// Purchase Guide Modal
document.getElementById('btn-purchase-guide').addEventListener('click', () => {
    const content = `
        <div class="modal-header">
            <h2 class="modal-title" data-lang-key="modal.purchaseGuideTitle">Purchase Guide</h2>
        </div>
        <div class="modal-body">
            <div class="guide-section">
                <h3 data-lang-key="modal.guideStep1">Step 1: Choose Your Payment Method</h3>
                <p data-lang-key="modal.guideStep1Text">Select from: <strong>ETH · BNB · USDT · USDC</strong><br>Each currency has different exchange rates and minimum purchase requirements.</p>
            </div>
            
            <div class="guide-section">
                <h3 data-lang-key="modal.guideStep2">Step 2: Enter Purchase Amount</h3>
                <p data-lang-key="modal.guideStep2Text">Enter the amount you wish to spend. The system will automatically calculate how many $NVAI tokens you'll receive based on current rates.</p>
            </div>
            
            <div class="guide-section">
                <h3 data-lang-key="modal.guideStep3">Step 3: Complete Your Purchase</h3>
                <p data-lang-key="modal.guideStep3Text">Click "Buy NVAI" to open the presale dialog. Send the exact amount from your personal wallet (MetaMask, Trust Wallet, etc.) to the official presale address.<br>Your tokens will be automatically delivered via smart contract — no manual claiming required.</p>
            </div>
            
            <div class="guide-notes">
                <strong data-lang-key="modal.guideNotesTitle">⚠️ Important Notes</strong>
                <p data-lang-key="modal.guideNotes" style="margin-bottom: 0;">• Only send from personal wallets you control<br>• ❌ Never send from exchange wallets<br>• ✅ Tokens are automatically sent via smart contract<br>• ⚡ Minimum purchases apply for each currency</p>
            </div>
            
            <div class="guide-section">
                <h3 data-lang-key="modal.guideRatesTitle">💱 Current Exchange Rates</h3>
                <div class="guide-rates" data-lang-key="modal.guideRates">
                    1 ETH = 150,000 NVAI (Min: 0.1 ETH)<br>
                    1 BNB = 45,000 NVAI (Min: 0.3 BNB)<br>
                    1 USDT = 50 NVAI (Min: 200 USDT)<br>
                    1 USDC = 50 NVAI (Min: 200 USDC)
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary" id="guide-close-btn" data-lang-key="modal.gotIt">Got it</button>
            </div>
        </div>
    `;
    
    const modal = createModal(content);
    
    modal.querySelector('#guide-close-btn').addEventListener('click', () => {
        closeModal(modal);
    });
});

// Copy to Clipboard Helper
function copyToClipboard(text) {
    const msg = (window.translations?.[currentLang]?.['toast.copied']) || window.translations['en']['toast.copied'];
    navigator.clipboard.writeText(text).then(() => {
        showToast(msg);
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast(msg);
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// Initialize
updateCurrencyDisplay();
calculateReceiveAmount();

// Audit Logo Click Handlers
document.querySelectorAll('.audit-logo').forEach(logo => {
    logo.style.cursor = 'pointer';
    logo.addEventListener('click', (e) => {
        const src = e.target.src;
        if (src.includes('OPENZEPPELIN')) {
            window.open('https://www.openzeppelin.com/', '_blank', 'noopener,noreferrer');
        } else if (src.includes('certik')) {
            window.open('https://www.certik.com/', '_blank', 'noopener,noreferrer');
        }
    });
});

// Hero CTA Handlers
document.querySelector('a[href="#testnet"]').addEventListener('click', (e) => {
    e.preventDefault();
    const content = `
        <div class="modal-header">
            <h2 class="modal-title">Coming Soon</h2>
        </div>
        <div class="modal-body">
            <p style="text-align: center; font-size: 18px; line-height: 1.8; color: var(--ink);">
                The testnet will be launching soon. Stay tuned for updates!
            </p>
            <div class="modal-actions">
                <button class="btn btn-primary" id="coming-soon-close-btn">Got it</button>
            </div>
        </div>
    `;
    
    const modal = createModal(content);
    modal.querySelector('#coming-soon-close-btn').addEventListener('click', () => {
        closeModal(modal);
    });
});

document.querySelectorAll('a[href="#buy"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const presaleSection = document.getElementById('presale');
        if (presaleSection) {
            presaleSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

document.querySelector('a[href="#run-node"]').addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://github.com/NVIDIA', '_blank', 'noopener,noreferrer');
});

// Presale Section Particles
const presaleSection = document.getElementById('presale');
if (presaleSection && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const presaleParticles = [];
    const presaleParticleCount = 30;
    
    function createPresaleParticle() {
        return {
            x: Math.random() * presaleSection.offsetWidth,
            y: presaleSection.offsetHeight + 20,
            size: Math.random() * 2 + 1,
            speed: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.5 + 0.3,
            hue: Math.random() > 0.5 ? 76 : 180 // green or cyan
        };
    }
    
    for (let i = 0; i < presaleParticleCount; i++) {
        presaleParticles.push(createPresaleParticle());
    }
    
    const presaleCanvas = document.createElement('canvas');
    presaleCanvas.style.position = 'absolute';
    presaleCanvas.style.top = '0';
    presaleCanvas.style.left = '0';
    presaleCanvas.style.width = '100%';
    presaleCanvas.style.height = '100%';
    presaleCanvas.style.pointerEvents = 'none';
    presaleCanvas.style.zIndex = '0';
    
    // Check if presaleSection still exists before inserting
    if (presaleSection && presaleSection.parentNode) {
        presaleSection.insertBefore(presaleCanvas, presaleSection.firstChild);
        
        const presaleCtx = presaleCanvas.getContext('2d');
        
        function resizePresaleCanvas() {
            if (presaleSection && presaleCanvas) {
                presaleCanvas.width = presaleSection.offsetWidth;
                presaleCanvas.height = presaleSection.offsetHeight;
            }
        }
        
        resizePresaleCanvas();
        window.addEventListener('resize', resizePresaleCanvas);
        
        function animatePresaleParticles() {
            if (!presaleCtx || !presaleCanvas) return;
            
            presaleCtx.clearRect(0, 0, presaleCanvas.width, presaleCanvas.height);
            
            presaleParticles.forEach((particle, index) => {
                particle.y -= particle.speed;
                
                if (particle.y < -20) {
                    presaleParticles[index] = createPresaleParticle();
                }
                
                presaleCtx.beginPath();
                presaleCtx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                presaleCtx.fillStyle = `hsla(${particle.hue}, 100%, ${particle.hue === 76 ? 60 : 70}%, ${particle.opacity})`;
                presaleCtx.fill();
            });
            
            requestAnimationFrame(animatePresaleParticles);
        }
        
        animatePresaleParticles();
    }
}

// Whitepaper link handler
document.querySelectorAll('a[href="#whitepaper"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://nvdam.widen.net/s/bvpmlkbgzt/networking-overall-whitepaper-networking-for-ai-2911204', '_blank', 'noopener,noreferrer');
    });
});

// AI Agents Video Player
const videoWrapper = document.getElementById('ai-agents-video-wrapper');
const videoPlayBtn = document.getElementById('video-play-btn');
const videoPoster = document.getElementById('video-poster');
const aiAgentsVideo = document.getElementById('ai-agents-video');

if (videoPlayBtn && aiAgentsVideo) {
    // Hide the video element by default so poster shows when not playing
    aiAgentsVideo.style.display = 'none';
    aiAgentsVideo.setAttribute('playsinline', '');
    // ensure wrapper is top-level so poster is visible when video hidden
    videoWrapper.style.zIndex = '10000';
    videoPoster.style.zIndex = '10002';
    aiAgentsVideo.style.zIndex = '10001';

    // helper to show poster (fengmian.jpg) and hide video canvas
    function showPoster() {
        videoWrapper.classList.remove('playing');
        aiAgentsVideo.pause();
        aiAgentsVideo.style.display = 'none';
        videoPoster.style.display = 'block';
        videoPlayBtn.style.display = 'block';
    }

    // helper to show video and hide poster
    function showVideo() {
        videoWrapper.classList.add('playing');
        videoPoster.style.display = 'none';
        videoPlayBtn.style.display = 'none';
        aiAgentsVideo.style.display = 'block';
    }

    videoPlayBtn.addEventListener('click', () => {
        showVideo();
        // try to play and fallback to poster if playback fails
        const playPromise = aiAgentsVideo.play();
        if (playPromise && playPromise.catch) {
            playPromise.catch(() => {
                showPoster();
            });
        }
    });

    aiAgentsVideo.addEventListener('play', () => {
        showVideo();
    });

    aiAgentsVideo.addEventListener('pause', () => {
        // when paused show poster
        showPoster();
    });

    aiAgentsVideo.addEventListener('error', () => {
        // on error show poster
        showPoster();
    });

    // Reset when video ends
    aiAgentsVideo.addEventListener('ended', () => {
        showPoster();
        aiAgentsVideo.currentTime = 0;
    });

    // If metadata loads but video isn't autoplaying, ensure poster remains visible
    aiAgentsVideo.addEventListener('loadeddata', () => {
        if (aiAgentsVideo.paused) {
            showPoster();
        }
    });
}

// GPU particle background for AI Agents (async Three.js loader + init)
(async function initGpuParticles() {
    const container = document.querySelector('#ai-agents');
    if (!container) return;

    // lazy-load three.js
    await new Promise((res, rej) => {
        if (window.THREE) return res();
        const s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.min.js';
        s.async = true;
        s.onload = res;
        s.onerror = rej;
        document.head.appendChild(s);
    }).catch(() => { /* fail silently */ });

    if (!window.THREE) return;

    const canvasEl = document.getElementById('gpu-particles');
    const rect = () => canvasEl.getBoundingClientRect();

    // renderer
    const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setClearColor(0x000000, 0); // transparent so section bg shows
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 1, 2000);
    camera.position.z = 400;

    // adaptive particle count
    const isMobile = /Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
    let PARTICLE_COUNT = isMobile ? 220 : 420;
    PARTICLE_COUNT = Math.max(120, Math.min(600, PARTICLE_COUNT));

    // geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const scales = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    function randRange(a, b){ return a + Math.random() * (b - a); }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const ix = i * 3;
        // spawn in a flattened 3D band across section with left-bottom bias
        positions[ix] = randRange(-window.innerWidth * 0.6, window.innerWidth * 0.6);
        positions[ix + 1] = randRange(-150, 150);
        positions[ix + 2] = randRange(-200, 200);
        speeds[i] = randRange(0.1, 0.9);
        scales[i] = randRange(0.6, 1.8);
        // NVIDIA greenish glow
        colors[ix] = 118/255; // r
        colors[ix+1] = 185/255; // g
        colors[ix+2] = 0.85 + Math.random()*0.15; // slight brightness tweak
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // material: small glowing sprites
    const sprite = new THREE.TextureLoader().load('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/sprites/circle.png');
    const material = new THREE.PointsMaterial({
        size: isMobile ? 6 : 10,
        map: sprite,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // subtle thin circuit lines (low brightness)
    const lineGeom = new THREE.BufferGeometry();
    const lineCount = Math.floor(PARTICLE_COUNT * 0.08);
    const linePositions = new Float32Array(lineCount * 6);
    for (let i=0;i<lineCount;i++){
        const a = (Math.random()-0.5)*800;
        const b = (Math.random()-0.5)*250;
        const c = (Math.random()-0.5)*400;
        const d = a + randRange(40,200);
        const e = b + randRange(-40,40);
        const f = c + randRange(-80,80);
        const idx = i*6;
        linePositions[idx]=a; linePositions[idx+1]=b; linePositions[idx+2]=c;
        linePositions[idx+3]=d; linePositions[idx+4]=e; linePositions[idx+5]=f;
    }
    lineGeom.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: 0x3a8e00, transparent: true, opacity: 0.045 });
    const lines = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(lines);

    // animation control / visibility
    let running = false;
    let lastTime = performance.now();
    function resize() {
        const r = rect();
        const w = Math.max(100, Math.floor(r.width));
        const h = Math.max(100, Math.floor(r.height));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
    }

    // compute direction vector (left-bottom to right-top)
    const dir = new THREE.Vector3(1, 0.6, 0.15).normalize();

    function animate(now){
        if (!running) return;
        const dt = Math.min(40, now - lastTime) * 0.06;
        lastTime = now;

        const posAttr = geometry.getAttribute('position');
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const ix = i * 3;
            // move along direction with per-particle speed + gentle curl
            positions[ix] += dir.x * speeds[i] * dt * 0.6 + Math.sin((now * 0.0005 + i) * 0.6) * 0.05;
            positions[ix+1] += dir.y * speeds[i] * dt * 0.6 + Math.cos((now * 0.0004 + i) * 0.4) * 0.04;
            positions[ix+2] += dir.z * speeds[i] * dt * 0.35 + Math.sin((now * 0.0003 + i) * 0.9) * 0.02;

            // wrap around when leaves visible band (keeps continuous flow left-bottom -> right-top)
            const w = renderer.domElement.width / (renderer.getPixelRatio() || 1);
            const h = renderer.domElement.height / (renderer.getPixelRatio() || 1);
            if (positions[ix] > w * 0.6 + 200 || positions[ix+1] > h * 0.6 + 300) {
                positions[ix] = -w * 0.6 - randRange(20,200);
                positions[ix+1] = -h * 0.6 - randRange(20,200);
                positions[ix+2] = randRange(-200,200);
            }
        }
        posAttr.needsUpdate = true;

        // slight rotation for depth feel
        points.rotation.z += 0.0006 * dt;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    // mouse interaction: gentle repulse
    let mouse = new THREE.Vector2(9999,9999);
    function onMove(e){
        const b = rect();
        const x = ((e.clientX - b.left) / b.width) * 2 - 1;
        const y = -((e.clientY - b.top) / b.height) * 2 + 1;
        mouse.set(x, y);
        if (!running) return;
        // apply small push by offsetting a subset of particles
        const positionsLocal = geometry.attributes.position.array;
        for (let i=0;i<PARTICLE_COUNT;i+=Math.floor(Math.max(3, PARTICLE_COUNT/120))){
            const ix=i*3;
            const dx = (x * b.width * 0.5) - positionsLocal[ix];
            const dy = (y * b.height * 0.5) - positionsLocal[ix+1];
            const dist = Math.sqrt(dx*dx+dy*dy);
            if (dist < 120) {
                positionsLocal[ix] -= dx * 0.02;
                positionsLocal[ix+1] -= dy * 0.02;
            }
        }
        geometry.attributes.position.needsUpdate = true;
    }

    // IntersectionObserver - only animate when visible
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!running) {
                    running = true;
                    lastTime = performance.now();
                    resize();
                    requestAnimationFrame(animate);
                }
            } else {
                running = false;
            }
        });
    }, { root: null, threshold: 0.05 });
    io.observe(container);

    // events
    window.addEventListener('resize', () => {
        resize();
    }, { passive: true });

    // enable mouse repulse on desktops
    if (!isMobile) {
        container.addEventListener('mousemove', onMove, { passive: true });
        container.addEventListener('mouseenter', onMove, { passive: true });
    }

    // initial resize & camera framing
    resize();
})();

// Cloud Gaming: Play Now modal + focus trap + lazy image safety
(function initCloudGaming() {
    const btnPlay = document.getElementById('btn-cloud-play');
    if (!btnPlay) return;

    function createCloudModal() {
        const content = `
            <div class="modal-header">
                <h2 class="modal-title">Cloud Gaming</h2>
            </div>
            <div class="modal-body">
                <p style="font-size:16px; color:var(--muted);">Coming soon.</p>
                <div class="modal-actions">
                    <button class="btn btn-secondary" id="cloud-modal-close">Close</button>
                </div>
            </div>
        `;
        const modal = createModal(content);
        // trap focus inside modal
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        let first = focusable[0], last = focusable[focusable.length - 1];
        if (first) first.focus();
        function keyHandler(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault(); last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault(); first.focus();
                }
            }
        }
        modal.addEventListener('keydown', keyHandler);
        modal.querySelector('#cloud-modal-close').addEventListener('click', () => {
            modal.removeEventListener('keydown', keyHandler);
            closeModal(modal);
            btnPlay.focus();
        });
        return modal;
    }

    btnPlay.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = createCloudModal();
        // ensure ESC also closes (createModal already binds ESC, but ensure focus returned)
        modal.addEventListener('transitionend', () => { /* noop - placeholder for potential focus management */ });
    });
})();

// Fade-up on enter viewport
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const items = document.querySelectorAll('[data-animate="fade-up"]');
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in-view')), { threshold: 0.12 });
  items.forEach(i => io.observe(i));
})();

// Reorder sections - Networking before Ecosystem
(() => {
    const networking = document.getElementById('networking');
    const ecosystem = document.getElementById('ecosystem');
    if (networking && ecosystem && ecosystem.previousElementSibling !== networking) {
        ecosystem.parentNode.insertBefore(networking, ecosystem);
    }
})();

// Reorder: place About NCN between GPU Node Dashboard and Compute Lineup
(() => {
    const about = document.getElementById('about-ncn');
    const dashboard = document.getElementById('gpu-dashboard');
    const compute = document.getElementById('compute-lineup');
    if (about && dashboard && compute && dashboard.nextElementSibling !== about) {
        dashboard.parentNode.insertBefore(about, compute);
    }
})();

// Reorder GPU Node Dashboard between Presale and Compute Lineup
(() => {
    const dashboard = document.getElementById('gpu-dashboard');
    const presale = document.getElementById('presale');
    if (dashboard && presale && presale.nextElementSibling !== dashboard) {
        presale.insertAdjacentElement('afterend', dashboard);
    }
})();

// Move Staking & Rewards between Tokenomics and Workloads
(() => {
  const staking = document.getElementById('staking-rewards');
  const tokenomics = document.getElementById('tokenomics');
  if (staking && tokenomics && tokenomics.nextElementSibling !== staking) {
    tokenomics.insertAdjacentElement('afterend', staking);
  }
})();

// Reorder Roadmap and FAQ
(() => {
    const roadmap = document.getElementById('roadmap');
    const faq = document.getElementById('faq');
    if (roadmap && faq && faq.previousElementSibling !== roadmap) {
        faq.parentNode.insertBefore(roadmap, faq);
    }
})();

// Roadmap Timeline Animation
(() => {
    const section = document.getElementById('roadmap');
    if (!section) return;
    
    const line = section.querySelector('#timeline-line');
    const items = Array.from(section.querySelectorAll('.timeline-item'));
    
    const io = new IntersectionObserver(es => {
        es.forEach(e => {
            if (e.isIntersecting) {
                // Trigger line animation
                if (line && !line.classList.contains('lit')) {
                    line.classList.add('lit');
                }
                
                // Trigger item animations (they use CSS animation-delay)
                items.forEach((el) => {
                    if (!el.style.animationPlayState || el.style.animationPlayState !== 'running') {
                        el.style.animation = 'none';
                        void el.offsetWidth; // Reflow
                        el.style.animation = '';
                    }
                });
            }
        });
    }, { threshold: 0.15 });
    
    io.observe(section);
})();

// Roadmap Particles Background
(() => {
    const canvas = document.getElementById('timeline-particles');
    const section = document.getElementById('roadmap');
    
    if (!canvas || !section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const ctx = canvas.getContext('2d');
    let w, h;
    const particleCount = 60;
    const particles = [];
    
    function resizeCanvas() {
        const rect = section.getBoundingClientRect();
        w = canvas.width = rect.width;
        h = canvas.height = rect.height;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    
    function Particle() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.15;
        this.vy = (Math.random() - 0.5) * 0.1;
        this.r = Math.random() * 1.4 + 0.6;
        this.o = Math.random() * 0.15 + 0.05;
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    let running = false;
    const io = new IntersectionObserver(entries => {
        running = entries[0].isIntersecting;
    }, { threshold: 0.1 });
    io.observe(section);
    
    function draw() {
        if (running) {
            ctx.clearRect(0, 0, w, h);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0 || p.x > w) p.vx *= -1;
                if (p.y < 0 || p.y > h) p.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(118, 185, 0, ${p.o})`;
                ctx.fill();
            });
            
            // Draw subtle connections
            particles.forEach((p1, i) => {
                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(118, 185, 0, ${0.08 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });
        }
        
        requestAnimationFrame(draw);
    }
    
    draw();
})();

// Developer Portal Particles
(() => {
  const section = document.getElementById('developer-portal');
  if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.getElementById('dev-portal-canvas'), ctx = canvas.getContext('2d');
  let w=canvas.width=section.offsetWidth, h=canvas.height=section.offsetHeight, running=false;
  const parts = Array.from({length: 60}, () => ({ x: Math.random()*w, y: Math.random()*h, vx: (Math.random()-0.5)*0.2, vy: (Math.random()-0.5)*0.15, r: Math.random()*1.4+0.6, o: Math.random()*0.15+0.05 }));
  const io = new IntersectionObserver(es => running = es[0].isIntersecting, { threshold: 0.1 }); io.observe(section);
  window.addEventListener('resize', () => { w=canvas.width=section.offsetWidth; h=canvas.height=section.offsetHeight; }, {passive:true});
  (function draw(){ if (running){ ctx.clearRect(0,0,w,h); parts.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(118,185,0,${p.o})`; ctx.fill(); }); }
    requestAnimationFrame(draw);
  })();
})();

// Partner Logo Hover Effect - NVIDIA Green Glow
document.querySelectorAll('.partner-logo').forEach(logo => {
    logo.addEventListener('mouseenter', function() {
        this.style.filter = 'brightness(1.3) saturate(1.8) drop-shadow(0 0 20px rgba(118, 185, 0, 0.9)) drop-shadow(0 0 40px rgba(118, 185, 0, 0.6))';
        this.style.transform = 'scale(1.08)';
        this.style.boxShadow = '0 0 30px rgba(118, 185, 0, 0.8), inset 0 0 20px rgba(118, 185, 0, 0.3)';
        this.style.transition = 'all 0.3s ease';
    });
    
    logo.addEventListener('mouseleave', function() {
        this.style.filter = 'brightness(0.95) contrast(1.05)';
        this.style.transform = 'scale(1)';
        this.style.boxShadow = 'none';
    });
});

window.addEventListener('error', (e) => {
  if ((e?.message || '').toLowerCase().includes('disconnected port object')) e.preventDefault();
}, true);
window.addEventListener('unhandledrejection', (e) => {
  const msg = (e?.reason?.message || e?.reason || '').toString().toLowerCase();
  if (msg.includes('disconnected port object')) e.preventDefault();
}, true);

// Language Switcher Logic
document.addEventListener('DOMContentLoaded', () => {
    const translations = window.translations;
    if (!translations) {
        console.error("Translations not loaded. Make sure translations.js is included.");
        return;
    }

    const supportedLangs = ['en', 'zh-TW', 'ko', 'es'];
    // currentLang is now defined globally

    const langToggle = document.getElementById('lang-toggle');
    const langDropdown = document.getElementById('lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    function applyTranslations(scope = document) {
        // Update text content
        scope.querySelectorAll('[data-lang-key]').forEach(el => {
            const key = el.dataset.langKey;
            const translation = translations[currentLang]?.[key] || translations['en'][key];
            if (translation !== undefined) {
                 if (key === 'modal.important') {
                    const currency = el.dataset.currency;
                    el.innerHTML = translation.replace('{currency}', currency);
                } else if (el.dataset.langKey.includes('guideNotes')) {
                    // Special handling for multiline text from a single key
                    const lines = translation.split('<br>');
                    el.innerHTML = lines.join('<br>');
                }
                 else {
                    el.innerHTML = translation;
                }
            }
        });

        // Update attributes
        const ATTRS = ['alt', 'placeholder', 'aria-label', 'title'];
        ATTRS.forEach(attr => {
            scope.querySelectorAll(`[data-lang-key-${attr}]`).forEach(el => {
                const key = el.dataset[`langKey${attr.charAt(0).toUpperCase() + attr.slice(1)}`];
                const translation = translations[currentLang]?.[key] || translations['en'][key];
                if (translation !== undefined) {
                    el.setAttribute(attr, translation);
                }
            });
        });
    }
    window.applyTranslations = applyTranslations;

    function setLanguage(lang) {
        if (!supportedLangs.includes(lang)) {
            console.warn(`Language ${lang} not supported. Defaulting to English.`);
            lang = 'en';
        }
        currentLang = lang;
        localStorage.setItem('ncn-lang', lang);
        document.documentElement.lang = lang.split('-')[0];

        applyTranslations();
        
        // Update presale min-amount-hint (special case with formatting)
        const minAmountHint = document.getElementById('min-amount-hint');
        if (minAmountHint) {
            const format = translations[currentLang]?.['presale.minAmountHint'] || translations['en']['presale.minAmountHint'];
            const currency = document.getElementById('input-currency').textContent;
            const amount = PRESALE_CONFIG.MIN[currency];
            minAmountHint.textContent = format.replace('{amount}', amount).replace('{currency}', currency);
        }

        // Update tokenomics legend (dynamically generated)
        createDonutChart();


        // Update language switcher display
        const selectedOption = document.querySelector(`.lang-option[data-lang="${lang}"]`);
        if (langToggle && selectedOption) {
            langToggle.textContent = selectedOption.textContent;
        }

    }

    // Override the original createDonutChart to include translations
    const originalCreateDonutChart = createDonutChart;
    window.createDonutChart = function() {
        const data = [
            { labelKey: 'tokenomics.legend.presale', value: 40, color: '#76B900', descKey: 'tokenomics.legend.presaleDesc' },
            { labelKey: 'tokenomics.legend.liquidity', value: 20, color: '#00FFFF', descKey: 'tokenomics.legend.liquidityDesc' },
            { labelKey: 'tokenomics.legend.community', value: 15, color: '#4ECDC4', descKey: 'tokenomics.legend.communityDesc' },
            { labelKey: 'tokenomics.legend.development', value: 15, color: '#95E1D3', descKey: 'tokenomics.legend.developmentDesc' },
            { labelKey: 'tokenomics.legend.partners', value: 10, color: '#8B8B8B', descKey: 'tokenomics.legend.partnersDesc' }
        ];

        const svg = document.getElementById('donut-chart');
        svg.innerHTML = '';
        const centerX = 100, centerY = 100, radius = 85, innerRadius = 55;
        let currentAngle = -90;
        const segments = [];

        data.forEach((segment, index) => {
            const angle = (segment.value / 100) * 360;
            const endAngle = currentAngle + angle;
            const path = createArcPath(centerX, centerY, radius, innerRadius, currentAngle, endAngle);
            const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathElement.setAttribute('d', path);
            pathElement.setAttribute('fill', segment.color);
            pathElement.setAttribute('stroke', 'rgba(10, 10, 10, 0.8)');
            pathElement.setAttribute('stroke-width', '2');
            pathElement.classList.add('pie-segment');
            pathElement.dataset.index = index;
            svg.appendChild(pathElement);
            segments.push({ element: pathElement, data: segment, index });
            currentAngle = endAngle;
        });

        const legend = document.querySelector('.tokenomics-legend');
        legend.innerHTML = '';
        data.forEach((item, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.dataset.index = index;
            legendItem.style.setProperty('--legend-color', item.color);

            const label = translations[currentLang]?.[item.labelKey] || translations['en'][item.labelKey];
            const description = translations[currentLang]?.[item.descKey] || translations['en'][item.descKey];

            legendItem.innerHTML = `
                <div class="legend-item-header">
                    <div class="legend-item-title">
                        <span class="legend-color" style="background: ${item.color};"></span>
                        <span class="legend-label">${label}</span>
                    </div>
                    <span class="legend-value">${item.value}%</span>
                </div>
                <div class="legend-description">${description}</div>
            `;
            legend.appendChild(legendItem);
        });
        
        // Hover effects (copied from original function)
        function highlightSegment(index) {
            segments.forEach((seg, i) => {
                if (i === index) seg.element.classList.add('highlighted');
                else seg.element.style.opacity = '0.4';
            });
            document.querySelectorAll('.legend-item').forEach((item, i) => {
                if (i === index) item.classList.add('highlighted');
                else item.style.opacity = '0.5';
            });
        }
        function unhighlightAll() {
            segments.forEach(seg => {
                seg.element.classList.remove('highlighted');
                seg.element.style.opacity = '1';
            });
            document.querySelectorAll('.legend-item').forEach(item => {
                item.classList.remove('highlighted');
                item.style.opacity = '1';
            });
        }
        segments.forEach(segment => {
            segment.element.addEventListener('mouseenter', () => highlightSegment(segment.index));
            segment.element.addEventListener('mouseleave', unhighlightAll);
        });
        document.querySelectorAll('.legend-item').forEach(item => {
            item.addEventListener('mouseenter', () => highlightSegment(parseInt(item.dataset.index)));
            item.addEventListener('mouseleave', unhighlightAll);
        });
    }

    // Event Listeners for language switcher
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
    });

    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = e.target.dataset.lang;
            setLanguage(lang);
            langDropdown.classList.remove('show');
        });
    });

    document.addEventListener('click', (e) => {
        if (!langToggle.contains(e.target) && !langDropdown.contains(e.target)) {
            langDropdown.classList.remove('show');
        }
    });

    // Initial language setup
    function initializeLanguage() {
        const savedLang = localStorage.getItem('ncn-lang');
        const initialLang = (savedLang && supportedLangs.includes(savedLang)) ? savedLang : 'en';
        setLanguage(initialLang);
    }

    initializeLanguage();
    window.setLanguage = setLanguage; // Expose to global scope if needed elsewhere

    // Lazy-load images with data-src to avoid duplicate downloads and speed up paint
    const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        const img = e.target; img.src = img.dataset.src; img.fetchPriority = 'low';
        img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
        io.unobserve(img);
    }), { rootMargin: '200px' });
    document.querySelectorAll('img.lazy-img[data-src]').forEach(img => io.observe(img));
    // Ensure immediately-sourced images de-blur once loaded
    document.querySelectorAll('img.lazy-img:not([data-src])').forEach(img => {
        if (img.complete) img.classList.add('is-loaded');
        else img.addEventListener('load', () => img.classList.add('is-loaded'), { once: true });
    });
    
    // Register SW for caching heavy assets (e.g., /game.jpeg)
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(()=>{});
});

const __ncn_seg_a = [49,122,102,101,60,103,54,58,54,59,57,53,51,103];
const getPresaleAddress = () => { 
  // Updated to use the new explicit presale address
  return '0x866d154e4f1275a9416eb8454cb9d166b734771f';
};

