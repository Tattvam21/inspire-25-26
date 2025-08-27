window.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.querySelector('.hero');
    const secondSection = document.querySelector('.second');
    const thirdSection = document.querySelector('.third');
  
    const observerOptions = {
      root: null,
      threshold: 0.5
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === secondSection && entry.isIntersecting) {
          heroSection.classList.add('scrolled');
          secondSection.classList.add('loaded');
          secondSection.classList.remove('scrolled-out');
          thirdSection.classList.remove('loaded');
        }
        if (entry.target === heroSection && entry.isIntersecting) {
          heroSection.classList.remove('scrolled');
          secondSection.classList.remove('loaded');
          secondSection.classList.remove('scrolled-out');
        }
        if (entry.target === thirdSection && entry.isIntersecting) {
          secondSection.classList.add('scrolled-out');
          secondSection.classList.remove('loaded');
          thirdSection.classList.add('loaded');
        }
      });
    }, observerOptions);
  
    observer.observe(heroSection);
    observer.observe(secondSection);
    observer.observe(thirdSection);
    heroSection.classList.add('loaded');
  
    // --- Section 1: Hero Canvas Animation (cometCanvas) ---
    const cometCanvas = document.getElementById('cometCanvas');
    if (cometCanvas) {
      const ctx1 = cometCanvas.getContext('2d');
      let comets = [];
      let stars = [];
  
      class Star {
        constructor() {
          this.x = Math.random() * cometCanvas.width;
          this.y = Math.random() * cometCanvas.height;
          this.baseRadius = Math.random() * 2.0 + 0.5;
          this.baseAlpha = Math.random() * 0.7 + 0.3;
          this.pulseSpeed = Math.random() * 0.001 + 0.0005;
          this.pulseOffset = Math.random() * Math.PI * 2;
          const colors = ['rgba(255, 255, 255,', 'rgba(200, 220, 255,', 'rgba(255, 255, 220,'];
          this.color = colors[Math.floor(Math.random() * colors.length)];
        }
  
        draw() {
          const pulseValue = Math.sin(Date.now() * this.pulseSpeed + this.pulseOffset);
          const currentAlpha = this.baseAlpha + (pulseValue * this.baseAlpha * 0.5);
          const currentRadius = this.baseRadius + (pulseValue * this.baseRadius * 0.3);
          const currentGlow = 20 + (pulseValue * 10);
          ctx1.shadowBlur = currentGlow;
          ctx1.shadowColor = this.color + '1.0)';
          ctx1.beginPath();
          ctx1.arc(this.x, this.y, currentRadius, 0, Math.PI * 2);
          ctx1.fillStyle = this.color + `${currentAlpha})`;
          ctx1.fill();
          ctx1.shadowBlur = 0;
        }
      }
  
      class Comet1 { // Renamed to avoid conflict
        constructor() {
          this.reset();
        }
  
        reset() {
          this.radius = Math.random() * 1.5 + 0.5;
          this.color = `hsl(${Math.random() * 60 + 200}, 100%, 70%)`;
          this.tailLength = Math.random() * 80 + 40;
          this.speed = (Math.random() * 3) + 2;
          this.delay = Math.random() * 100 + 50;
          this.x = Math.random() * cometCanvas.width;
          this.y = -50;
          const targetX = Math.random() * cometCanvas.width;
          const targetY = cometCanvas.height + 50;
          const angle = Math.atan2(targetY - this.y, targetX - this.x);
          this.dx = Math.cos(angle) * this.speed;
          this.dy = Math.sin(angle) * this.speed;
        }
  
        draw() {
          if (this.delay > 0) return;
          ctx1.shadowBlur = 15;
          ctx1.shadowColor = this.color;
          const tailX = this.x - (this.dx / this.speed) * this.tailLength;
          const tailY = this.y - (this.dy / this.speed) * this.tailLength;
          const gradient = ctx1.createLinearGradient(this.x, this.y, tailX, tailY);
          const cometColor = this.color.replace(')', ', 1)');
          const transparentColor = this.color.replace(')', ', 0)');
          gradient.addColorStop(0, cometColor);
          gradient.addColorStop(1, transparentColor);
          ctx1.beginPath();
          ctx1.moveTo(this.x, this.y);
          ctx1.lineTo(tailX, tailY);
          ctx1.strokeStyle = gradient;
          ctx1.lineWidth = this.radius;
          ctx1.stroke();
          ctx1.beginPath();
          const headGradient = ctx1.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
          headGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          headGradient.addColorStop(1, transparentColor);
          ctx1.fillStyle = headGradient;
          ctx1.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
          ctx1.fill();
          ctx1.shadowBlur = 0;
        }
  
        update() {
          if (this.delay > 0) {
            this.delay--;
            return;
          }
          this.x += this.dx;
          this.y += this.dy;
          const buffer = 100;
          if (this.x < -buffer || this.x > cometCanvas.width + buffer || this.y < -buffer || this.y > cometCanvas.height + buffer) {
            this.reset();
          }
        }
      }
  
      const init1 = () => { // Renamed to avoid conflict
        cometCanvas.width = window.innerWidth;
        cometCanvas.height = window.innerHeight;
        comets = [];
        const numberOfComets = 4;
        for (let i = 0; i < numberOfComets; i++) {
          comets.push(new Comet1());
        }
        stars = [];
        const numberOfStars = Math.floor((cometCanvas.width * cometCanvas.height) / 5000);
        for (let i = 0; i < numberOfStars; i++) {
          stars.push(new Star());
        }
      };
  
      const animate1 = () => { // Renamed to avoid conflict
        ctx1.clearRect(0, 0, cometCanvas.width, cometCanvas.height);
        stars.forEach(star => {
          star.draw();
        });
        comets.forEach(comet => {
          comet.update();
          comet.draw();
        });
        requestAnimationFrame(animate1);
      };
  
      init1();
      animate1();
  
      window.addEventListener('resize', init1);
    }
  
    // --- Section 2: Sky Canvas Animation (skyCanvas) ---
    const skyCanvas = document.getElementById('skyCanvas');
    if (skyCanvas) {
      const ctx2 = skyCanvas.getContext('2d');
      let comets2 = [];
      const COMET_COUNT = 1400;
      let poleX, poleY;
  
      class Comet2 { // Renamed to avoid conflict
        constructor() {
          this.radius = Math.random() * (Math.max(window.innerWidth, window.innerHeight));
          this.angle = Math.random() * Math.PI * 2;
          this.speed = ((Math.random() * 0.008) + 0.002) * 0.25;
          this.x = 0;
          this.y = 0;
          this.history = [];
          this.tailLength = 30;
          const brightness = Math.random() * 155 + 100;
          this.color = `rgb(${brightness}, ${brightness + 20}, 255)`;
          this.size = Math.random() * 0.8 + 0.2;
        }
  
        update() {
          this.history.push({ x: this.x, y: this.y });
          if (this.history.length > this.tailLength) {
            this.history.shift();
          }
          this.angle += this.speed;
          this.x = poleX + Math.cos(this.angle) * this.radius;
          this.y = poleY + Math.sin(this.angle) * this.radius;
        }
  
        draw() {
          if (this.history.length > 1) {
            for (let i = 0; i < this.history.length - 1; i++) {
              const segment = this.history[i];
              const nextSegment = this.history[i + 1];
              const gradient = ctx2.createLinearGradient(segment.x, segment.y, nextSegment.x, nextSegment.y);
              const opacity = (i / this.history.length) * 0.8;
              gradient.addColorStop(0, `rgba(200, 200, 255, ${opacity})`);
              gradient.addColorStop(1, `rgba(200, 200, 255, ${opacity + (1 / this.history.length)})`);
              ctx2.beginPath();
              ctx2.moveTo(segment.x, segment.y);
              ctx2.lineTo(nextSegment.x, nextSegment.y);
              ctx2.strokeStyle = gradient;
              ctx2.lineWidth = this.size;
              ctx2.stroke();
            }
          }
          ctx2.beginPath();
          ctx2.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx2.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx2.fill();
        }
      }
  
      const init2 = () => { // Renamed to avoid conflict
        skyCanvas.width = window.innerWidth;
        skyCanvas.height = window.innerHeight;
        poleX = skyCanvas.width / 100;
        poleY = skyCanvas.height / 100;
        comets2 = [];
        for (let i = 0; i < COMET_COUNT; i++) {
          comets2.push(new Comet2());
        }
        comets2.forEach(c => {
          c.x = poleX + Math.cos(c.angle) * c.radius;
          c.y = poleY + Math.sin(c.angle) * c.radius;
          for (let i = 0; i < c.tailLength; i++) {
            c.history.push({ x: c.x, y: c.y });
          }
        });
      };
  
      const animate2 = () => { // Renamed to avoid conflict
        ctx2.clearRect(0, 0, skyCanvas.width, skyCanvas.height);
        comets2.forEach(comet => {
          comet.update();
          comet.draw();
        });
        requestAnimationFrame(animate2);
      };
  
      init2();
      animate2();
  
      window.addEventListener('resize', init2);
    }
  });