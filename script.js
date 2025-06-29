class LiveBratGenerator {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        // UI Elements
        this.textInput = document.getElementById('text-input');
        this.modeBtns = document.querySelectorAll('.mode-btn');
        this.speedLinesToggle = document.getElementById('speed-lines');
        this.downloadBtn = document.getElementById('download-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.shareModal = document.getElementById('share-modal');
        this.modalClose = document.querySelector('.modal-close');
        
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

        // Download button
        this.downloadBtn.addEventListener('click', () => {
            this.downloadImage();
        });

        // Share button and modal
        this.shareBtn.addEventListener('click', () => {
            this.showShareModal();
        });

        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => {
                this.hideShareModal();
            });
        }

        if (this.shareModal) {
            this.shareModal.addEventListener('click', (e) => {
                if (e.target === this.shareModal) {
                    this.hideShareModal();
                }
            });
        }

        // Social share buttons
        const twitterBtn = document.querySelector('.share-btn.twitter');
        const instagramBtn = document.querySelector('.share-btn.instagram');
        
        if (twitterBtn) {
            twitterBtn.addEventListener('click', () => {
                this.shareToTwitter();
            });
        }
        
        if (instagramBtn) {
            instagramBtn.addEventListener('click', () => {
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

    updatePreview() {
        const backgroundColor = this.getBackgroundColor();
        const textColor = this.getTextColor();
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.ctx.fillStyle = backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Setup text
        this.ctx.fillStyle = textColor;
        this.ctx.font = '48px Arial, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Get text to display
        const text = this.settings.text.trim() || 'your text here';
        const displayText = text.toLowerCase();
        
        // Handle text wrapping for long text
        const maxWidth = this.canvas.width * 0.8;
        
        if (this.ctx.measureText(displayText).width > maxWidth) {
            this.drawWrappedText(displayText, this.canvas.width / 2, this.canvas.height / 2, maxWidth, 58);
        } else {
            this.ctx.fillText(displayText, this.canvas.width / 2, this.canvas.height / 2);
        }

        // Add subtle watermark/placeholder effect for empty text
        if (!this.settings.text.trim()) {
            this.ctx.globalAlpha = 0.6;
            this.ctx.fillStyle = this.settings.mode === 'green' ? '#6a9600' : '#cccccc';
            this.ctx.font = '20px Arial, sans-serif';
            this.ctx.fillText('Start typing to see your brat cover...', this.canvas.width / 2, this.canvas.height - 30);
            this.ctx.globalAlpha = 1;
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

        // Draw text
        highResCtx.fillStyle = textColor;
        highResCtx.font = '48px Arial, sans-serif';
        highResCtx.textAlign = 'center';
        highResCtx.textBaseline = 'middle';

        const text = this.settings.text.toLowerCase();
        const maxWidth = this.canvas.width * 0.8;
        
        if (highResCtx.measureText(text).width > maxWidth) {
            this.drawWrappedTextOnContext(highResCtx, text, this.canvas.width / 2, this.canvas.height / 2, maxWidth, 58);
        } else {
            highResCtx.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
        }

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

    showShareModal() {
        if (this.shareModal) {
            this.shareModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hideShareModal() {
        if (this.shareModal) {
            this.shareModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    shareToTwitter() {
        const text = `Check out my brat-style album cover! 🎨✨\n\nMade with Brat Generator 💚\n\n#brat #charliXCX #bratSummer`;
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'width=600,height=400');
        this.hideShareModal();
    }

    shareToInstagram() {
        alert('To share on Instagram:\n\n1. Right-click the image and save it\n2. Open Instagram and create a new post\n3. Upload your saved image\n4. Add #brat #bratSummer hashtags!');
        this.hideShareModal();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LiveBratGenerator();

    // Mobile navigation toggle
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

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