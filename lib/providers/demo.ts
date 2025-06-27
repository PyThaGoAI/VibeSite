// Demo provider for frontend development
export class DemoProvider {
  private static demoModels = [
    { id: 'deepseek-chat', name: 'DeepSeek Chat (Demo)' },
    { id: 'deepseek-coder', name: 'DeepSeek Coder (Demo)' },
    { id: 'gpt-4', name: 'GPT-4 (Demo)' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Demo)' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet (Demo)' },
    { id: 'llama-2-70b', name: 'Llama 2 70B (Demo)' },
    { id: 'codellama-34b', name: 'CodeLlama 34B (Demo)' },
  ];

  private static demoHtmlTemplates = [
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern Landing Page</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        header {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 1rem 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            transition: opacity 0.3s;
        }
        
        .nav-links a:hover {
            opacity: 0.8;
        }
        
        .hero {
            padding: 120px 0 80px;
            text-align: center;
            color: white;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
            animation: fadeInUp 1s ease-out;
        }
        
        .hero p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
            animation: fadeInUp 1s ease-out 0.2s both;
        }
        
        .cta-button {
            display: inline-block;
            background: #ff6b6b;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 50px;
            font-weight: bold;
            transition: transform 0.3s, box-shadow 0.3s;
            animation: fadeInUp 1s ease-out 0.4s both;
        }
        
        .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(255, 107, 107, 0.4);
        }
        
        .features {
            padding: 80px 0;
            background: white;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .feature-card {
            text-align: center;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-radius: 50%;
            margin: 0 auto 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: white;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .nav-links {
                display: none;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav class="container">
            <div class="logo">TechCorp</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <section class="hero">
        <div class="container">
            <h1>Welcome to the Future</h1>
            <p>Innovative solutions for modern businesses. Transform your ideas into reality with our cutting-edge technology.</p>
            <a href="#features" class="cta-button">Get Started</a>
        </div>
    </section>

    <section class="features" id="features">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 1rem; font-size: 2.5rem; color: #333;">Our Features</h2>
            <p style="text-align: center; color: #666; margin-bottom: 3rem;">Discover what makes us different</p>
            
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Fast Performance</h3>
                    <p>Lightning-fast loading times and optimized performance for the best user experience.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">🔒</div>
                    <h3>Secure & Reliable</h3>
                    <p>Enterprise-grade security with 99.9% uptime guarantee for your peace of mind.</p>
                </div>
                
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Mobile First</h3>
                    <p>Responsive design that works perfectly on all devices, from mobile to desktop.</p>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
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

        // Add scroll effect to header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('header');
            if (window.scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.color = '#333';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.1)';
                header.style.color = 'white';
            }
        });
    </script>
</body>
</html>`,

    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            color: #333;
        }
        
        .dashboard {
            display: grid;
            grid-template-columns: 250px 1fr;
            min-height: 100vh;
        }
        
        .sidebar {
            background: #2c3e50;
            color: white;
            padding: 2rem 0;
        }
        
        .sidebar h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: #3498db;
        }
        
        .nav-item {
            padding: 1rem 2rem;
            cursor: pointer;
            transition: background 0.3s;
        }
        
        .nav-item:hover {
            background: #34495e;
        }
        
        .nav-item.active {
            background: #3498db;
        }
        
        .main-content {
            padding: 2rem;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
        }
        
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .metric-card {
            background: white;
            padding: 1.5rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
        }
        
        .metric-card:hover {
            transform: translateY(-5px);
        }
        
        .metric-value {
            font-size: 2rem;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .metric-label {
            color: #7f8c8d;
            margin-top: 0.5rem;
        }
        
        .chart-container {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
        }
        
        .chart {
            height: 300px;
            background: linear-gradient(45deg, #3498db, #2ecc71);
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.2rem;
        }
        
        @media (max-width: 768px) {
            .dashboard {
                grid-template-columns: 1fr;
            }
            
            .sidebar {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard">
        <aside class="sidebar">
            <h2>Dashboard</h2>
            <div class="nav-item active">📊 Analytics</div>
            <div class="nav-item">👥 Users</div>
            <div class="nav-item">💰 Revenue</div>
            <div class="nav-item">⚙️ Settings</div>
        </aside>
        
        <main class="main-content">
            <header class="header">
                <h1>Analytics Overview</h1>
                <div>Welcome back, Admin!</div>
            </header>
            
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value">12,345</div>
                    <div class="metric-label">Total Users</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-value">$45,678</div>
                    <div class="metric-label">Revenue</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-value">89.5%</div>
                    <div class="metric-label">Conversion Rate</div>
                </div>
                
                <div class="metric-card">
                    <div class="metric-value">1,234</div>
                    <div class="metric-label">Active Sessions</div>
                </div>
            </div>
            
            <div class="chart-container">
                <h3>Revenue Trend</h3>
                <div class="chart">
                    📈 Interactive Chart Would Go Here
                </div>
            </div>
        </main>
    </div>

    <script>
        // Simulate real-time data updates
        function updateMetrics() {
            const metrics = document.querySelectorAll('.metric-value');
            metrics.forEach(metric => {
                const currentValue = parseInt(metric.textContent.replace(/[^0-9]/g, ''));
                const change = Math.floor(Math.random() * 10) - 5;
                const newValue = Math.max(0, currentValue + change);
                
                if (metric.textContent.includes('$')) {
                    metric.textContent = '$' + newValue.toLocaleString();
                } else if (metric.textContent.includes('%')) {
                    metric.textContent = newValue + '%';
                } else {
                    metric.textContent = newValue.toLocaleString();
                }
            });
        }
        
        // Update metrics every 5 seconds
        setInterval(updateMetrics, 5000);
        
        // Navigation functionality
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            });
        });
    </script>
</body>
</html>`,

    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Creative Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            overflow-x: hidden;
        }
        
        .hero {
            height: 100vh;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
        }
        
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .hero-content h1 {
            font-size: 4rem;
            margin-bottom: 1rem;
            animation: fadeInUp 1s ease-out;
        }
        
        .hero-content p {
            font-size: 1.5rem;
            animation: fadeInUp 1s ease-out 0.3s both;
        }
        
        .portfolio-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .project-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
        }
        
        .project-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .project-image {
            height: 250px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
        }
        
        .project-content {
            padding: 2rem;
        }
        
        .project-title {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #2c3e50;
        }
        
        .project-description {
            color: #7f8c8d;
            margin-bottom: 1rem;
        }
        
        .project-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .tag {
            background: #ecf0f1;
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            font-size: 0.8rem;
            color: #2c3e50;
        }
        
        .about-section {
            background: #2c3e50;
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }
        
        .contact-form {
            max-width: 600px;
            margin: 4rem auto;
            padding: 2rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: bold;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 1rem;
            border: 2px solid #ecf0f1;
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #3498db;
        }
        
        .submit-btn {
            background: linear-gradient(45deg, #3498db, #2ecc71);
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.3s;
        }
        
        .submit-btn:hover {
            transform: translateY(-2px);
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .hero-content h1 {
                font-size: 2.5rem;
            }
            
            .portfolio-grid {
                grid-template-columns: 1fr;
                padding: 2rem 1rem;
            }
        }
    </style>
</head>
<body>
    <section class="hero">
        <div class="hero-content">
            <h1>John Doe</h1>
            <p>Creative Designer & Developer</p>
        </div>
    </section>

    <section class="portfolio-grid">
        <div class="project-card">
            <div class="project-image">🎨</div>
            <div class="project-content">
                <h3 class="project-title">Brand Identity Design</h3>
                <p class="project-description">Complete brand identity package including logo, colors, and typography for a tech startup.</p>
                <div class="project-tags">
                    <span class="tag">Branding</span>
                    <span class="tag">Logo Design</span>
                    <span class="tag">Typography</span>
                </div>
            </div>
        </div>

        <div class="project-card">
            <div class="project-image">📱</div>
            <div class="project-content">
                <h3 class="project-title">Mobile App UI</h3>
                <p class="project-description">Modern and intuitive mobile app interface design with focus on user experience.</p>
                <div class="project-tags">
                    <span class="tag">UI Design</span>
                    <span class="tag">Mobile</span>
                    <span class="tag">UX</span>
                </div>
            </div>
        </div>

        <div class="project-card">
            <div class="project-image">🌐</div>
            <div class="project-content">
                <h3 class="project-title">E-commerce Website</h3>
                <p class="project-description">Full-stack e-commerce solution with modern design and seamless user experience.</p>
                <div class="project-tags">
                    <span class="tag">Web Development</span>
                    <span class="tag">E-commerce</span>
                    <span class="tag">React</span>
                </div>
            </div>
        </div>
    </section>

    <section class="about-section">
        <div style="max-width: 800px; margin: 0 auto;">
            <h2 style="font-size: 2.5rem; margin-bottom: 2rem;">About Me</h2>
            <p style="font-size: 1.2rem; line-height: 1.8;">
                I'm a passionate designer and developer with over 5 years of experience creating 
                beautiful and functional digital experiences. I specialize in brand identity, 
                web development, and user interface design.
            </p>
        </div>
    </section>

    <section class="contact-form">
        <h2 style="text-align: center; margin-bottom: 2rem; font-size: 2.5rem;">Get In Touch</h2>
        <form>
            <div class="form-group">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" required>
            </div>
            
            <div class="form-group">
                <label for="message">Message</label>
                <textarea id="message" name="message" rows="5" required></textarea>
            </div>
            
            <button type="submit" class="submit-btn">Send Message</button>
        </form>
    </section>

    <script>
        // Smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Form submission
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            this.reset();
        });

        // Project card animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.project-card').forEach(card => {
            observer.observe(card);
        });
    </script>
</body>
</html>`
  ];

  static getRandomTemplate(): string {
    const randomIndex = Math.floor(Math.random() * this.demoHtmlTemplates.length);
    return this.demoHtmlTemplates[randomIndex];
  }

  static async getModels() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.demoModels;
  }

  static async generateCode(prompt: string, model: string, customSystemPrompt?: string | null, maxTokens?: number): Promise<ReadableStream<Uint8Array>> {
    const textEncoder = new TextEncoder();
    
    return new ReadableStream({
      async start(controller) {
        try {
          // Simulate thinking process if using thinking model
          if (customSystemPrompt?.includes('<think>') || model.includes('thinking') || model.includes('coder')) {
            const thinkingContent = `<think>
The user wants me to create a ${prompt.toLowerCase().includes('landing') ? 'landing page' : prompt.toLowerCase().includes('dashboard') ? 'dashboard' : 'portfolio website'}. 

Let me analyze the requirements:
- ${prompt.toLowerCase().includes('modern') ? 'Modern design aesthetic' : 'Clean and professional design'}
- ${prompt.toLowerCase().includes('responsive') ? 'Responsive layout for all devices' : 'Mobile-friendly design'}
- ${prompt.toLowerCase().includes('interactive') ? 'Interactive elements and animations' : 'Smooth user experience'}

I'll structure this with:
1. HTML5 semantic structure
2. CSS3 with modern features like flexbox/grid
3. JavaScript for interactivity
4. Responsive design principles
5. Accessibility considerations

The color scheme will be modern and professional, using gradients and smooth transitions.
</think>

`;
            
            // Send thinking content first
            for (let i = 0; i < thinkingContent.length; i += 3) {
              const chunk = thinkingContent.slice(i, i + 3);
              controller.enqueue(textEncoder.encode(chunk));
              await new Promise(resolve => setTimeout(resolve, 20));
            }
          }

          // Get appropriate template based on prompt
          let template = this.getRandomTemplate();
          
          if (prompt.toLowerCase().includes('dashboard') || prompt.toLowerCase().includes('analytics')) {
            template = this.demoHtmlTemplates[1]; // Dashboard template
          } else if (prompt.toLowerCase().includes('portfolio') || prompt.toLowerCase().includes('creative')) {
            template = this.demoHtmlTemplates[2]; // Portfolio template
          } else {
            template = this.demoHtmlTemplates[0]; // Landing page template
          }

          // Simulate streaming by sending chunks
          const chunkSize = 50;
          for (let i = 0; i < template.length; i += chunkSize) {
            const chunk = template.slice(i, i + chunkSize);
            controller.enqueue(textEncoder.encode(chunk));
            
            // Add realistic delay between chunks
            await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 20));
          }

          controller.close();
        } catch (error) {
          console.error('Demo provider error:', error);
          controller.error(error);
        }
      }
    });
  }
}