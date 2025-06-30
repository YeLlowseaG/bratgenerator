class LiveBratGenerator {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // UI Elements
        this.textInput = document.getElementById('text-input');
        this.modeBtns = document.querySelectorAll('.mode-btn');
        this.speedLinesToggle = document.getElementById('speed-lines');
        this.downloadBtn = document.getElementById('download-btn');
        this.twitterShareBtn = document.getElementById('twitter-share-btn');
        this.instagramShareBtn = document.getElementById('instagram-share-btn');
        
        // Settings
        this.settings = {
            text: '',
            mode: 'green',
            speedLines: false
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePreview(); // Initial preview
    }

    setupEventListeners() {
        // Text input - real-time updates
        this.textInput.addEventListener('input', (e) => {
            this.settings.text = e.target.value;
            this.updatePreview();
        });

        // Mode selection - instant updates
        this.modeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.settings.mode = btn.dataset.mode;
                this.updatePreview();
            });
        });

        // Speed lines toggle
        this.speedLinesToggle.addEventListener('change', (e) => {
            this.settings.speedLines = e.target.checked;
            this.updatePreview();
        });

        // Download button
        this.downloadBtn.addEventListener('click', () => {
            this.downloadImage();
        });

        // Share buttons
        if (this.twitterShareBtn) {
            this.twitterShareBtn.addEventListener('click', () => {
                this.shareToTwitter();
            });
        }
        
        if (this.instagramShareBtn) {
            this.instagramShareBtn.addEventListener('click', () => {
                this.shareToInstagram();
            });
        }
    }

    getBackgroundColor() {
        return this.settings.mode === 'green' ? '#8ace00' : '#ffffff';
    }

    getTextColor() {
        return this.settings.mode === 'green' ? '#000000' : '#000000';
    }

    getPlaceholderText() {
        if (window.languageManager) {
            const placeholders = {
                en: 'Start typing to see your brat cover...',
                nl: 'Begin met typen om je brat hoes te zien...',
                fr: 'Commencez à taper pour voir votre pochette brat...',
                de: 'Beginne zu tippen um dein Brat Cover zu sehen...',
                pt: 'Comece a digitar para ver sua capa brat...',
                es: 'Comienza a escribir para ver tu portada brat...',
                it: 'Inizia a scrivere per vedere la tua copertina brat...'
            };
            return placeholders[window.languageManager.currentLanguage] || placeholders.en;
        }
        return 'Start typing to see your brat cover...';
    }

    getDefaultText() {
        if (window.languageManager) {
            const defaultTexts = {
                en: 'your text here',
                nl: 'jouw tekst hier',
                fr: 'votre texte ici',
                de: 'dein text hier',
                pt: 'seu texto aqui',
                es: 'tu texto aquí',
                it: 'il tuo testo qui'
            };
            return defaultTexts[window.languageManager.currentLanguage] || defaultTexts.en;
        }
        return 'your text here';
    }

    updatePlaceholderText() {
        // Force update preview to show new placeholder text and default text
        this.updatePreview();
    }

    updatePreview() {
        const backgroundColor = this.getBackgroundColor();
        const textColor = this.getTextColor();
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw speed lines if enabled
        if (this.settings.speedLines) {
            this.drawSpeedLines(backgroundColor);
        }
        
        // Setup text
        this.ctx.fillStyle = textColor;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Get text to display
        const text = this.settings.text.trim() || this.getDefaultText();
        const displayText = text.toLowerCase();
        
        // Smart text fitting with auto font size and wrapping
        this.drawSmartText(displayText);

        // Add subtle watermark/placeholder effect for empty text
        if (!this.settings.text.trim()) {
            this.ctx.globalAlpha = 0.6;
            this.ctx.fillStyle = this.settings.mode === 'green' ? '#6a9600' : '#cccccc';
            this.ctx.font = '20px Arial, sans-serif';
            const placeholderText = this.getPlaceholderText();
            this.ctx.fillText(placeholderText, this.canvas.width / 2, this.canvas.height - 30);
            this.ctx.globalAlpha = 1;
        }
    }

    drawSpeedLines(backgroundColor) {
        const lineColor = backgroundColor === '#8ace00' ? '#000000' : '#333333';
        
        this.ctx.strokeStyle = lineColor;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.globalAlpha = 0.8;
        
        // Generate dense scribble-like lines
        const numStrokes = 15 + Math.floor(Math.random() * 10); // 15-25 strokes
        
        for (let i = 0; i < numStrokes; i++) {
            this.drawScribbleLine();
        }
        
        this.ctx.globalAlpha = 1;
    }

    drawScribbleLine() {
        // Random starting position
        const startX = Math.random() * this.canvas.width;
        const startY = Math.random() * this.canvas.height;
        
        // Random line width for variation
        this.ctx.lineWidth = 1 + Math.random() * 1.5;
        
        // Determine if it's a horizontal or more curved scribble
        const isHorizontalish = Math.random() > 0.3; // 70% chance for horizontal-ish lines
        
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        
        if (isHorizontalish) {
            // Create horizontal scribble lines like in the image
            const length = 80 + Math.random() * 150;
            const direction = Math.random() > 0.5 ? 1 : -1; // left or right
            const baseY = startY;
            
            // Create wavy horizontal line with quick back-and-forth movements
            const steps = 8 + Math.floor(Math.random() * 12); // 8-20 steps
            
            for (let i = 1; i <= steps; i++) {
                const progress = i / steps;
                const x = startX + (length * progress * direction);
                
                // Add vertical jitter for scribble effect
                const jitter = (Math.random() - 0.5) * 20;
                const waviness = Math.sin(progress * Math.PI * 4) * 8; // wavy motion
                const y = baseY + jitter + waviness;
                
                // Sometimes make sharp direction changes
                if (Math.random() > 0.7) {
                    const sharpJitter = (Math.random() - 0.5) * 30;
                    this.ctx.lineTo(x, y + sharpJitter);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
        } else {
            // Create more random curved scribbles
            const numPoints = 6 + Math.floor(Math.random() * 8);
            let currentX = startX;
            let currentY = startY;
            
            for (let i = 0; i < numPoints; i++) {
                const deltaX = (Math.random() - 0.5) * 60;
                const deltaY = (Math.random() - 0.5) * 60;
                
                currentX += deltaX;
                currentY += deltaY;
                
                // Keep within canvas bounds
                currentX = Math.max(10, Math.min(this.canvas.width - 10, currentX));
                currentY = Math.max(10, Math.min(this.canvas.height - 10, currentY));
                
                this.ctx.lineTo(currentX, currentY);
            }
        }
        
        this.ctx.stroke();
    }

    drawSmartText(text) {
        const maxWidth = this.canvas.width * 0.8;
        const maxHeight = this.canvas.height * 0.7; // 留30%空间给装饰
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // 从大字体开始，逐步缩小直到适合
        let fontSize = 60;
        let bestFit = null;
        
        while (fontSize >= 16) {
            this.ctx.font = `${fontSize}px Arial, sans-serif`;
            
            // 计算在当前字体大小下的文字布局
            const lines = this.wrapTextToLines(text, maxWidth);
            const lineHeight = fontSize * 1.2;
            const totalHeight = lines.length * lineHeight;
            
            if (totalHeight <= maxHeight) {
                // 找到合适的大小
                bestFit = {
                    fontSize: fontSize,
                    lines: lines,
                    lineHeight: lineHeight,
                    totalHeight: totalHeight
                };
                break;
            }
            
            fontSize -= 3; // 每次减小3px，更快收敛
        }
        
        // 如果找到合适的大小就绘制，否则用最小字体强制绘制
        if (bestFit) {
            this.ctx.font = `${bestFit.fontSize}px Arial, sans-serif`;
            this.drawTextLines(bestFit.lines, centerX, centerY, bestFit.lineHeight);
        } else {
            // 兜底：用最小字体
            this.ctx.font = '16px Arial, sans-serif';
            const lines = this.wrapTextToLines(text, maxWidth);
            this.drawTextLines(lines, centerX, centerY, 20);
        }
    }

    wrapTextToLines(text, maxWidth) {
        const lines = [];
        let currentLine = '';
        
        // 检查是否包含空格（英文）还是连续字符（中文等）
        const hasSpaces = text.includes(' ');
        
        if (hasSpaces) {
            // 英文：按单词换行
            const words = text.split(' ');
            for (let word of words) {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const testWidth = this.ctx.measureText(testLine).width;
                
                if (testWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
        } else {
            // 中文或无空格文本：按字符换行
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const testLine = currentLine + char;
                const testWidth = this.ctx.measureText(testLine).width;
                
                if (testWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = char;
                } else {
                    currentLine = testLine;
                }
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines.length > 0 ? lines : [text];
    }

    drawTextLines(lines, centerX, centerY, lineHeight) {
        const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
        
        for (let i = 0; i < lines.length; i++) {
            const y = startY + (i * lineHeight);
            this.ctx.fillText(lines[i], centerX, y);
        }
    }

    drawWrappedText(text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        const lines = [];

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = this.ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        // Draw lines centered
        const startY = y - ((lines.length - 1) * lineHeight) / 2;
        for (let i = 0; i < lines.length; i++) {
            this.ctx.fillText(lines[i].trim(), x, startY + (i * lineHeight));
        }
    }

    downloadImage() {
        if (!this.settings.text.trim()) {
            alert('Please enter some text first!');
            return;
        }

        // Create high-resolution version
        const scale = 2;
        const highResCanvas = document.createElement('canvas');
        const highResCtx = highResCanvas.getContext('2d');
        
        highResCanvas.width = this.canvas.width * scale;
        highResCanvas.height = this.canvas.height * scale;
        
        // Scale the context
        highResCtx.scale(scale, scale);
        
        // Redraw at high resolution
        const backgroundColor = this.getBackgroundColor();
        const textColor = this.getTextColor();

        // Clear and draw background
        highResCtx.fillStyle = backgroundColor;
        highResCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw speed lines if enabled
        if (this.settings.speedLines) {
            this.drawSpeedLinesOnContext(highResCtx, backgroundColor);
        }

        // Draw text with smart fitting
        highResCtx.fillStyle = textColor;
        highResCtx.textAlign = 'center';
        highResCtx.textBaseline = 'middle';

        const text = this.settings.text.toLowerCase();
        this.drawSmartTextOnContext(highResCtx, text);

        // Download
        const link = document.createElement('a');
        const filename = `brat-${this.settings.text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
        
        link.download = filename;
        link.href = highResCanvas.toDataURL('image/png', 1.0);
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Success feedback
        const originalText = this.downloadBtn.textContent;
        this.downloadBtn.textContent = '✅ Downloaded!';
        setTimeout(() => {
            this.downloadBtn.textContent = originalText;
        }, 2000);
    }

    drawSpeedLinesOnContext(ctx, backgroundColor) {
        const lineColor = backgroundColor === '#8ace00' ? '#000000' : '#333333';
        
        ctx.strokeStyle = lineColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.8;
        
        // Generate dense scribble-like lines
        const numStrokes = 15 + Math.floor(Math.random() * 10); // 15-25 strokes
        
        for (let i = 0; i < numStrokes; i++) {
            this.drawScribbleLineOnContext(ctx);
        }
        
        ctx.globalAlpha = 1;
    }

    drawScribbleLineOnContext(ctx) {
        // Random starting position
        const startX = Math.random() * this.canvas.width;
        const startY = Math.random() * this.canvas.height;
        
        // Random line width for variation
        ctx.lineWidth = 1 + Math.random() * 1.5;
        
        // Determine if it's a horizontal or more curved scribble
        const isHorizontalish = Math.random() > 0.3; // 70% chance for horizontal-ish lines
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        if (isHorizontalish) {
            // Create horizontal scribble lines like in the image
            const length = 80 + Math.random() * 150;
            const direction = Math.random() > 0.5 ? 1 : -1; // left or right
            const baseY = startY;
            
            // Create wavy horizontal line with quick back-and-forth movements
            const steps = 8 + Math.floor(Math.random() * 12); // 8-20 steps
            
            for (let i = 1; i <= steps; i++) {
                const progress = i / steps;
                const x = startX + (length * progress * direction);
                
                // Add vertical jitter for scribble effect
                const jitter = (Math.random() - 0.5) * 20;
                const waviness = Math.sin(progress * Math.PI * 4) * 8; // wavy motion
                const y = baseY + jitter + waviness;
                
                // Sometimes make sharp direction changes
                if (Math.random() > 0.7) {
                    const sharpJitter = (Math.random() - 0.5) * 30;
                    ctx.lineTo(x, y + sharpJitter);
                } else {
                    ctx.lineTo(x, y);
                }
            }
        } else {
            // Create more random curved scribbles
            const numPoints = 6 + Math.floor(Math.random() * 8);
            let currentX = startX;
            let currentY = startY;
            
            for (let i = 0; i < numPoints; i++) {
                const deltaX = (Math.random() - 0.5) * 60;
                const deltaY = (Math.random() - 0.5) * 60;
                
                currentX += deltaX;
                currentY += deltaY;
                
                // Keep within canvas bounds
                currentX = Math.max(10, Math.min(this.canvas.width - 10, currentX));
                currentY = Math.max(10, Math.min(this.canvas.height - 10, currentY));
                
                ctx.lineTo(currentX, currentY);
            }
        }
        
        ctx.stroke();
    }

    drawSmartTextOnContext(ctx, text) {
        const maxWidth = this.canvas.width * 0.8;
        const maxHeight = this.canvas.height * 0.7;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // 从大字体开始，逐步缩小直到适合
        let fontSize = 60;
        let bestFit = null;
        
        while (fontSize >= 16) {
            ctx.font = `${fontSize}px Arial, sans-serif`;
            
            // 计算在当前字体大小下的文字布局
            const lines = this.wrapTextToLinesOnContext(ctx, text, maxWidth);
            const lineHeight = fontSize * 1.2;
            const totalHeight = lines.length * lineHeight;
            
            if (totalHeight <= maxHeight) {
                bestFit = {
                    fontSize: fontSize,
                    lines: lines,
                    lineHeight: lineHeight,
                    totalHeight: totalHeight
                };
                break;
            }
            
            fontSize -= 3;
        }
        
        // 绘制文字
        if (bestFit) {
            ctx.font = `${bestFit.fontSize}px Arial, sans-serif`;
            this.drawTextLinesOnContext(ctx, bestFit.lines, centerX, centerY, bestFit.lineHeight);
        } else {
            ctx.font = '16px Arial, sans-serif';
            const lines = this.wrapTextToLinesOnContext(ctx, text, maxWidth);
            this.drawTextLinesOnContext(ctx, lines, centerX, centerY, 20);
        }
    }

    wrapTextToLinesOnContext(ctx, text, maxWidth) {
        const lines = [];
        let currentLine = '';
        
        // 检查是否包含空格（英文）还是连续字符（中文等）
        const hasSpaces = text.includes(' ');
        
        if (hasSpaces) {
            // 英文：按单词换行
            const words = text.split(' ');
            for (let word of words) {
                const testLine = currentLine ? currentLine + ' ' + word : word;
                const testWidth = ctx.measureText(testLine).width;
                
                if (testWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    currentLine = testLine;
                }
            }
        } else {
            // 中文或无空格文本：按字符换行
            for (let i = 0; i < text.length; i++) {
                const char = text[i];
                const testLine = currentLine + char;
                const testWidth = ctx.measureText(testLine).width;
                
                if (testWidth > maxWidth && currentLine) {
                    lines.push(currentLine);
                    currentLine = char;
                } else {
                    currentLine = testLine;
                }
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines.length > 0 ? lines : [text];
    }

    drawTextLinesOnContext(ctx, lines, centerX, centerY, lineHeight) {
        const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
        
        for (let i = 0; i < lines.length; i++) {
            const y = startY + (i * lineHeight);
            ctx.fillText(lines[i], centerX, y);
        }
    }

    drawWrappedTextOnContext(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';
        const lines = [];

        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                lines.push(line);
                line = words[n] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line);

        const startY = y - ((lines.length - 1) * lineHeight) / 2;
        for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i].trim(), x, startY + (i * lineHeight));
        }
    }

    shareToTwitter() {
        if (!this.settings.text.trim()) {
            alert('Please enter some text first to create your brat cover!');
            return;
        }

        const userText = this.settings.text.toLowerCase();
        const text = `Just created my "${userText}" brat-style cover! 🎨✨\n\nMade with Brat Generator 💚\nTry it: www.bratgenerator.store\n\n#brat #charliXCX #bratSummer #albumcover`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'width=600,height=400');
        
        // Show helpful tip
        setTimeout(() => {
            alert('💡 Tip: Download your image first, then attach it to your tweet for maximum impact!');
        }, 1000);
    }

    shareToInstagram() {
        if (!this.settings.text.trim()) {
            alert('Please enter some text first to create your brat cover!');
            return;
        }

        const userText = this.settings.text.toLowerCase();
        alert(`📸 Ready to share on Instagram!\n\nSteps:\n1. Download your "${userText}" cover first\n2. Open Instagram and create a new post\n3. Upload your saved image\n4. Copy this caption:\n\n"Just created my '${userText}' brat-style cover! 🎨✨ Made with Brat Generator 💚 Try it: www.bratgenerator.store #brat #charliXCX #bratSummer #albumcover"`);
    }
}

// Page navigation functions
function showCreateSection() {
    hideAllSections();
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('.main-content').style.display = 'block';
    document.querySelector('.how-it-works').style.display = 'block';
    document.querySelector('.main-footer').style.display = 'block';
    
    // Update breadcrumb
    updateBreadcrumb('home');
    
    // Update nav active state
    updateNavActive('home');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function showGallery() {
    hideAllSections();
    updateGalleryContent(); // Update gallery based on current language
    document.getElementById('gallery').style.display = 'block';
    document.querySelector('.gallery-footer').style.display = 'block';
    
    // Update breadcrumb
    updateBreadcrumb('gallery');
    
    updateNavActive('gallery');
    window.scrollTo(0, 0);
}

function showAbout() {
    hideAllSections();
    document.getElementById('about').style.display = 'block';
    document.querySelector('.about-footer').style.display = 'block';
    
    // Update breadcrumb
    updateBreadcrumb('about');
    
    updateNavActive('about');
    window.scrollTo(0, 0);
}

function hideAllSections() {
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('.main-content').style.display = 'none';
    document.querySelector('.how-it-works').style.display = 'none';
    document.querySelector('.main-footer').style.display = 'none';
    document.querySelector('.gallery-footer').style.display = 'none';
    document.querySelector('.about-footer').style.display = 'none';
    document.getElementById('gallery').style.display = 'none';
    document.getElementById('about').style.display = 'none';
}

function updateNavActive(section) {
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('nav-active');
    });
    
    // Add active class to current section
    if (section === 'home') {
        document.querySelector('.nav-link[href="#"]').classList.add('nav-active');
    } else if (section === 'gallery') {
        document.getElementById('gallery-link').classList.add('nav-active');
    } else if (section === 'about') {
        document.getElementById('about-link').classList.add('nav-active');
    }
}

function updateBreadcrumb(section) {
    // Hide all breadcrumb items except home
    document.querySelector('.breadcrumb-gallery').style.display = 'none';
    document.querySelector('.breadcrumb-about').style.display = 'none';
    
    // Show current section breadcrumb
    if (section === 'gallery') {
        document.querySelector('.breadcrumb-gallery').style.display = 'flex';
    } else if (section === 'about') {
        document.querySelector('.breadcrumb-about').style.display = 'flex';
    }
}

function updateGalleryContent() {
    const currentLang = window.languageManager ? window.languageManager.currentLanguage : 'en';
    
    const galleryData = {
        en: [
            { text: "main character", likes: "2.1k", shares: "445", color: "green" },
            { text: "hot girl summer", likes: "1.8k", shares: "312", color: "white" },
            { text: "no skips", likes: "1.5k", shares: "298", color: "green" },
            { text: "iconic behavior", likes: "1.2k", shares: "234", color: "white" },
            { text: "period queen", likes: "934", shares: "187", color: "green" },
            { text: "energy vampire", likes: "892", shares: "156", color: "white" },
            { text: "delulu is the solulu", likes: "756", shares: "123", color: "green" },
            { text: "serving looks", likes: "678", shares: "89", color: "white" },
            { text: "digital detox", likes: "543", shares: "67", color: "green" }
        ],
        nl: [
            { text: "gezelligheid", likes: "1.9k", shares: "402", color: "green" },
            { text: "oranje fever", likes: "1.6k", shares: "298", color: "white" },
            { text: "dutch courage", likes: "1.3k", shares: "267", color: "green" },
            { text: "koningsdag vibes", likes: "1.1k", shares: "223", color: "white" },
            { text: "bike life", likes: "887", shares: "178", color: "green" },
            { text: "stroopwafel mood", likes: "765", shares: "145", color: "white" },
            { text: "amsterdam nights", likes: "698", shares: "134", color: "green" },
            { text: "tulip power", likes: "634", shares: "112", color: "white" },
            { text: "cheese dreams", likes: "578", shares: "89", color: "green" }
        ],
        fr: [
            { text: "c'est la vie", likes: "2.0k", shares: "434", color: "green" },
            { text: "très chic", likes: "1.7k", shares: "389", color: "white" },
            { text: "magnifique", likes: "1.4k", shares: "276", color: "green" },
            { text: "je ne sais quoi", likes: "1.2k", shares: "245", color: "white" },
            { text: "bon vivant", likes: "956", shares: "198", color: "green" },
            { text: "french girl", likes: "823", shares: "167", color: "white" },
            { text: "café culture", likes: "745", shares: "143", color: "green" },
            { text: "savoir vivre", likes: "689", shares: "128", color: "white" },
            { text: "joie de vivre", likes: "612", shares: "95", color: "green" }
        ],
        de: [
            { text: "wunderbar", likes: "1.8k", shares: "367", color: "green" },
            { text: "techno vibes", likes: "1.6k", shares: "334", color: "white" },
            { text: "berlin nights", likes: "1.4k", shares: "289", color: "green" },
            { text: "oktoberfest", likes: "1.1k", shares: "234", color: "white" },
            { text: "autobahn speed", likes: "923", shares: "189", color: "green" },
            { text: "gemütlichkeit", likes: "812", shares: "156", color: "white" },
            { text: "kraftwerk energy", likes: "734", shares: "134", color: "green" },
            { text: "bauhaus style", likes: "667", shares: "112", color: "white" },
            { text: "deutsche qualität", likes: "598", shares: "87", color: "green" }
        ],
        pt: [
            { text: "saudade feelings", likes: "1.7k", shares: "345", color: "green" },
            { text: "fado mood", likes: "1.4k", shares: "298", color: "white" },
            { text: "lisboa nights", likes: "1.2k", shares: "267", color: "green" },
            { text: "bacalhau dreams", likes: "987", shares: "223", color: "white" },
            { text: "porto wine", likes: "856", shares: "178", color: "green" },
            { text: "azulejo art", likes: "734", shares: "145", color: "white" },
            { text: "serra da estrela", likes: "678", shares: "123", color: "green" },
            { text: "pastéis de nata", likes: "612", shares: "98", color: "white" },
            { text: "tempo português", likes: "534", shares: "76", color: "green" }
        ],
        es: [
            { text: "fiesta forever", likes: "2.2k", shares: "456", color: "green" },
            { text: "siesta time", likes: "1.9k", shares: "398", color: "white" },
            { text: "flamenco soul", likes: "1.6k", shares: "334", color: "green" },
            { text: "tapas life", likes: "1.3k", shares: "289", color: "white" },
            { text: "sangría nights", likes: "1.0k", shares: "234", color: "green" },
            { text: "ole energy", likes: "897", shares: "189", color: "white" },
            { text: "madrid movida", likes: "778", shares: "156", color: "green" },
            { text: "barcelona vibes", likes: "689", shares: "123", color: "white" },
            { text: "costa del soul", likes: "612", shares: "98", color: "green" }
        ],
        it: [
            { text: "dolce vita", likes: "2.3k", shares: "487", color: "green" },
            { text: "amore eterno", likes: "1.8k", shares: "378", color: "white" },
            { text: "bella figura", likes: "1.5k", shares: "312", color: "green" },
            { text: "gelato dreams", likes: "1.2k", shares: "267", color: "white" },
            { text: "pasta perfetta", likes: "1.0k", shares: "223", color: "green" },
            { text: "roman holiday", likes: "856", shares: "178", color: "white" },
            { text: "milano fashion", likes: "734", shares: "145", color: "green" },
            { text: "sicilian sun", likes: "667", shares: "123", color: "white" },
            { text: "venetian magic", likes: "589", shares: "89", color: "green" }
        ]
    };

    const data = galleryData[currentLang] || galleryData.en;
    const galleryGrid = document.querySelector('.gallery-grid');
    
    if (galleryGrid) {
        galleryGrid.innerHTML = data.map((item, index) => `
            <div class="gallery-item">
                <div class="gallery-cover ${item.color}-cover">
                    <div class="cover-text">${item.text}</div>
                    <button class="gallery-download-btn" onclick="downloadGalleryItem('${item.text}', '${item.color}')" title="Download this cover">
                        📥
                    </button>
                </div>
                <div class="gallery-meta">
                    <span class="gallery-likes">❤️ ${item.likes}</span>
                    <span class="gallery-shares">🔄 ${item.shares}</span>
                </div>
            </div>
        `).join('');
    }
}

// Function to download gallery items
function downloadGalleryItem(text, mode) {
    // Create a temporary canvas for generation
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 800;
    tempCanvas.height = 800;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Generate the cover
    generateCoverOnCanvas(tempCtx, text, mode, false); // false = no speed lines for gallery items
    
    // Download the image
    const link = document.createElement('a');
    link.download = `brat-${text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}.png`;
    link.href = tempCanvas.toDataURL('image/png');
    link.click();
}

// Helper function to generate cover on any canvas
function generateCoverOnCanvas(ctx, text, mode, speedLines) {
    const canvas = ctx.canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set background
    const bgColor = mode === 'green' ? '#8ace00' : '#ffffff';
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw speed lines if enabled
    if (speedLines) {
        ctx.strokeStyle = mode === 'green' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(138, 206, 0, 0.1)';
        ctx.lineWidth = 1;
        
        const numLines = 15;
        for (let i = 0; i < numLines; i++) {
            const angle = (i / numLines) * Math.PI * 2;
            const startRadius = canvas.width * 0.2;
            const endRadius = canvas.width * 0.6;
            
            const startX = canvas.width / 2 + Math.cos(angle) * startRadius;
            const startY = canvas.height / 2 + Math.sin(angle) * startRadius;
            const endX = canvas.width / 2 + Math.cos(angle) * endRadius;
            const endY = canvas.height / 2 + Math.sin(angle) * endRadius;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
    
    // Draw text
    if (text.trim()) {
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Auto-fit text
        const maxWidth = canvas.width * 0.8;
        const maxHeight = canvas.height * 0.7;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        let fontSize = Math.min(canvas.width, canvas.height) * 0.15;
        let bestFit = null;
        
        while (fontSize >= 16) {
            ctx.font = `${fontSize}px Arial, sans-serif`;
            
            const lines = wrapTextToLines(ctx, text, maxWidth);
            const lineHeight = fontSize * 1.2;
            const totalHeight = lines.length * lineHeight;
            
            if (totalHeight <= maxHeight) {
                bestFit = {
                    fontSize: fontSize,
                    lines: lines,
                    lineHeight: lineHeight,
                    totalHeight: totalHeight
                };
                break;
            }
            
            fontSize -= 3;
        }
        
        if (bestFit) {
            ctx.font = `${bestFit.fontSize}px Arial, sans-serif`;
            drawTextLines(ctx, bestFit.lines, centerX, centerY, bestFit.lineHeight);
        }
    }
}

// Helper functions for text wrapping and drawing
function wrapTextToLines(ctx, text, maxWidth) {
    const lines = [];
    let currentLine = '';
    
    const hasSpaces = text.includes(' ');
    
    if (hasSpaces) {
        const words = text.split(' ');
        for (let word of words) {
            const testLine = currentLine ? currentLine + ' ' + word : word;
            const testWidth = ctx.measureText(testLine).width;
            
            if (testWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
    } else {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const testLine = currentLine + char;
            const testWidth = ctx.measureText(testLine).width;
            
            if (testWidth > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = char;
            } else {
                currentLine = testLine;
            }
        }
    }
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    return lines.length > 0 ? lines : [text];
}

function drawTextLines(ctx, lines, centerX, centerY, lineHeight) {
    const startY = centerY - ((lines.length - 1) * lineHeight) / 2;
    
    for (let i = 0; i < lines.length; i++) {
        const y = startY + (i * lineHeight);
        ctx.fillText(lines[i], centerX, y);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bratGeneratorInstance = new LiveBratGenerator();

    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Navigation event listeners
    document.querySelector('.nav-link[href="#"]').addEventListener('click', (e) => {
        e.preventDefault();
        showCreateSection();
    });
    
    document.getElementById('gallery-link').addEventListener('click', (e) => {
        e.preventDefault();
        showGallery();
    });
    
    document.getElementById('about-link').addEventListener('click', (e) => {
        e.preventDefault();
        showAbout();
    });
    
    // Brand link goes to home
    document.querySelector('.brand-link').addEventListener('click', (e) => {
        e.preventDefault();
        showCreateSection();
    });
    
    // Initialize with home page
    updateNavActive('home');
    
    // Initialize gallery content
    updateGalleryContent();
    
    // Make gallery update function globally available
    window.updateGalleryContent = updateGalleryContent;

    // Add smooth animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    // Animate elements on scroll
    document.querySelectorAll('.editor-panel, .preview-panel').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Focus on text input for better UX
    setTimeout(() => {
        const textInput = document.getElementById('text-input');
        if (textInput) {
            textInput.focus();
        }
    }, 500);
});