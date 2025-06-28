"use client"

import { useState, useEffect } from "react"
import { 
  Code2, 
  Sparkles, 
  Heart, 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Globe, 
  Zap,
  Star,
  ArrowUp,
  Coffee,
  Palette,
  Brain,
  Rocket,
  Shield,
  Users,
  Crown,
  Diamond,
  Gem
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function PremiumFooter() {
  const [currentYear] = useState(new Date().getFullYear())
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Handle scroll to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle mouse movement for interactive effects
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const features = [
    { icon: Brain, text: "AI-Powered", color: "from-purple-500 via-pink-500 to-red-500", description: "Advanced neural networks" },
    { icon: Zap, text: "Lightning Fast", color: "from-yellow-500 via-orange-500 to-red-500", description: "Instant generation" },
    { icon: Shield, text: "Enterprise Secure", color: "from-green-500 via-blue-500 to-purple-500", description: "Bank-level security" },
    { icon: Users, text: "Developer Friendly", color: "from-blue-500 via-purple-500 to-pink-500", description: "Built for creators" }
  ]

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-300", gradient: "from-gray-600 to-gray-800" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-blue-400", gradient: "from-blue-400 to-blue-600" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-500", gradient: "from-blue-500 to-blue-700" },
    { icon: Mail, href: "#", label: "Email", color: "hover:text-purple-400", gradient: "from-purple-500 to-pink-500" }
  ]

  const quickLinks = [
    { label: "Documentation", href: "#", icon: Code2 },
    { label: "API Reference", href: "#", icon: Rocket },
    { label: "Examples", href: "#", icon: Sparkles },
    { label: "Tutorials", href: "#", icon: Brain }
  ]

  const resources = [
    { label: "Blog", href: "#", icon: Globe },
    { label: "Community", href: "#", icon: Users },
    { label: "Support", href: "#", icon: Heart },
    { label: "Changelog", href: "#", icon: Star }
  ]

  return (
    <footer 
      className="relative w-full mt-auto overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Ultra Premium Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_50%)]" />
        <div 
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)`
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)`
          }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 w-full">
        {/* Top Section with Enhanced Features */}
        <div className="w-full border-t border-purple-500/20 bg-black/60 backdrop-blur-xl">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4 gradient-text">Why Choose PythaGO AI?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Experience the future of web development with our cutting-edge AI platform
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group flex flex-col items-center text-center p-8 rounded-3xl glass-strong hover:glass transition-all duration-500 hover:scale-105 hover-lift"
                >
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 neon-glow`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors mb-2">
                    {feature.text}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-purple-200 transition-colors">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Main Footer Links */}
        <div className="w-full bg-black/80 backdrop-blur-xl border-t border-purple-500/10">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              
              {/* Enhanced Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center neon-glow">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Diamond className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold gradient-text">PythaGO AI</h3>
                    <p className="text-lg text-purple-300 font-semibold">Ultra Premium Code Generator 2025</p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                  Transform your ideas into beautiful, functional websites using the power of artificial intelligence. 
                  Build anything with AI magic and experience the future of web development.
                </p>

                {/* Enhanced Social Links */}
                <div className="flex items-center space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className={`w-14 h-14 rounded-2xl glass-strong flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover-lift group`}
                    >
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${social.gradient} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute`}>
                        <social.icon className="w-4 h-4 text-white" />
                      </div>
                      <social.icon className="w-6 h-6 group-hover:opacity-0 transition-opacity duration-300" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Enhanced Quick Links */}
              <div>
                <h4 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <Rocket className="w-6 h-6 mr-3 text-purple-400" />
                  Quick Links
                </h4>
                <ul className="space-y-4">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="flex items-center space-x-3 text-gray-400 hover:text-purple-300 transition-all duration-300 hover:translate-x-2 transform group"
                      >
                        <link.icon className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                        <span className="text-lg">{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Enhanced Resources */}
              <div>
                <h4 className="text-2xl font-bold text-white mb-8 flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-purple-400" />
                  Resources
                </h4>
                <ul className="space-y-4">
                  {resources.map((resource, index) => (
                    <li key={index}>
                      <a 
                        href={resource.href}
                        className="flex items-center space-x-3 text-gray-400 hover:text-purple-300 transition-all duration-300 hover:translate-x-2 transform group"
                      >
                        <resource.icon className="w-5 h-5 group-hover:text-purple-400 transition-colors" />
                        <span className="text-lg">{resource.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Ultra Premium Bottom Section */}
        <div className="w-full bg-black/90 backdrop-blur-xl border-t border-purple-500/20">
          <div className="w-full max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
              
              {/* Enhanced Copyright */}
              <div className="flex items-center space-x-4 text-gray-400">
                <span className="text-lg">© {currentYear} PythaGO AI.</span>
                <span className="hidden sm:inline text-lg">Made with</span>
                <Heart className="w-5 h-5 text-red-500 animate-pulse" />
                <span className="hidden sm:inline text-lg">for developers worldwide</span>
              </div>

              {/* Enhanced Status & Version */}
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-lg text-gray-400">All systems operational</span>
                </div>
                
                <div className="flex items-center space-x-3 px-6 py-3 rounded-2xl glass-strong">
                  <Gem className="w-5 h-5 text-purple-400" />
                  <span className="text-lg text-purple-300 font-bold">v2025.1</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110 neon-glow group"
          size="icon"
        >
          <ArrowUp className="w-6 h-6 text-white group-hover:animate-bounce" />
        </Button>
      )}

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              background: `radial-gradient(circle, ${
                ['#8B5CF6', '#A855F7', '#C084FC', '#E879F9'][Math.floor(Math.random() * 4)]
              } 0%, transparent 70%)`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </footer>
  )
}