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
  Users
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
    { icon: Brain, text: "AI-Powered", color: "from-purple-500 to-pink-500" },
    { icon: Zap, text: "Lightning Fast", color: "from-yellow-500 to-orange-500" },
    { icon: Shield, text: "Secure", color: "from-green-500 to-emerald-500" },
    { icon: Users, text: "User-Friendly", color: "from-blue-500 to-cyan-500" }
  ]

  const socialLinks = [
    { icon: Github, href: "#", label: "GitHub", color: "hover:text-gray-300" },
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-blue-400" },
    { icon: Linkedin, href: "#", label: "LinkedIn", color: "hover:text-blue-500" },
    { icon: Mail, href: "#", label: "Email", color: "hover:text-purple-400" }
  ]

  const quickLinks = [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Examples", href: "#" },
    { label: "Tutorials", href: "#" }
  ]

  const resources = [
    { label: "Blog", href: "#" },
    { label: "Community", href: "#" },
    { label: "Support", href: "#" },
    { label: "Changelog", href: "#" }
  ]

  return (
    <footer 
      className="relative w-full mt-auto overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
        <div 
          className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        />
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 w-full">
        {/* Top Section with Features */}
        <div className="w-full border-t border-purple-500/20 bg-black/40 backdrop-blur-xl">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="group flex flex-col items-center text-center p-4 sm:p-6 rounded-2xl glass hover:glass-strong transition-all duration-300 hover:scale-105"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="w-full bg-black/60 backdrop-blur-xl border-t border-purple-500/10">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold gradient-text">PythaGO AI</h3>
                    <p className="text-sm text-purple-300">Premium Code Generator</p>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-md">
                  Transform your ideas into beautiful, functional websites using the power of artificial intelligence. 
                  Build anything with AI magic.
                </p>

                {/* Social Links */}
                <div className="flex items-center space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className={`w-10 h-10 rounded-xl glass flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:scale-110 hover:glass-strong`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Rocket className="w-5 h-5 mr-2 text-purple-400" />
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {quickLinks.map((link, index) => (
                    <li key={index}>
                      <a 
                        href={link.href}
                        className="text-gray-400 hover:text-purple-300 transition-colors duration-300 text-sm sm:text-base hover:translate-x-1 transform inline-block"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-purple-400" />
                  Resources
                </h4>
                <ul className="space-y-3">
                  {resources.map((resource, index) => (
                    <li key={index}>
                      <a 
                        href={resource.href}
                        className="text-gray-400 hover:text-purple-300 transition-colors duration-300 text-sm sm:text-base hover:translate-x-1 transform inline-block"
                      >
                        {resource.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full bg-black/80 backdrop-blur-xl border-t border-purple-500/20">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              
              {/* Copyright */}
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>© {currentYear} PythaGO AI.</span>
                <span className="hidden sm:inline">Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span className="hidden sm:inline">for developers</span>
              </div>

              {/* Status & Version */}
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">All systems operational</span>
                </div>
                
                <div className="flex items-center space-x-2 px-3 py-1 rounded-full glass">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-300">v2.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25 transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <ArrowUp className="w-5 h-5 text-white" />
        </Button>
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </footer>
  )
}