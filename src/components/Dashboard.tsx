"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
  Copy,
  Share2,
  FileText,
  Zap,
  Shield,
  Maximize2,
  Minimize2,
  Sparkles,
  Cpu,
  Wifi,
  Database,
  Terminal,
  Rocket,
  Star,
} from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { cn } from "../lib/utils"

const Dashboard: React.FC = () => {
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shareUrl, setShareUrl] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isTyping, setIsTyping] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Particle animation effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
    }> = []

    const colors = ["#00ffff", "#ff00ff", "#ffff00", "#ff0080", "#8000ff"]

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.opacity
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Typing indicator
  useEffect(() => {
    if (content) {
      setIsTyping(true)
      const timer = setTimeout(() => setIsTyping(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [content])

  const handleSave = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to share",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      const pasteData = {
        id,
        content,
        createdAt: new Date().toISOString(),
      }

      localStorage.setItem(`paste_${id}`, JSON.stringify(pasteData))

      const url = `${window.location.origin}/${id}`
      setShareUrl(url)

      toast({
        title: "Success!",
        description: "Your content has been saved and is ready to share",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleNewPaste = () => {
    setContent("")
    setShareUrl("")
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden flex flex-col">
      {/* Animated Particle Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.8 }} />

      {/* Dynamic Background Grid */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.2)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Futuristic Glow Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
            background: "radial-gradient(circle, rgba(0,255,255,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle, rgba(128,0,255,0.2) 0%, transparent 70%)" }}
        ></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
          style={{
            background: "radial-gradient(circle, rgba(255,0,128,0.2) 0%, transparent 70%)",
            animationDelay: "1s",
          }}
        ></div>
      </div>

      {/* Header */}
      <header
        className="relative border-b border-cyan-500/30 bg-black bg-opacity-30 backdrop-blur-lg sticky top-0 z-50"
        style={{ boxShadow: "0 0 30px rgba(0,255,255,0.3)" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div
                  className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                  style={{ boxShadow: "0 0 30px rgba(0,255,255,0.5)" }}
                >
                  <Zap className="w-7 h-7 text-white animate-pulse" />
                </div>
                <div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-ping"
                  style={{ boxShadow: "0 0 10px rgba(0,255,0,0.8)" }}
                ></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Quick Paste
                </h1>
                <p className="text-xs text-cyan-400 font-mono tracking-wider">NEURAL LINK ACTIVE</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full border border-green-500/50"
                style={{ boxShadow: "0 0 15px rgba(0,255,0,0.3)" }}
              >
                <Shield className="w-4 h-4 text-green-400 animate-pulse" />
                <span className="text-green-300 font-mono text-sm">SECURE</span>
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full border border-blue-500/50"
                style={{ boxShadow: "0 0 15px rgba(0,100,255,0.3)" }}
              >
                <Wifi className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-blue-300 font-mono text-sm">ONLINE</span>
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full border border-purple-500/50"
                style={{ boxShadow: "0 0 15px rgba(128,0,255,0.3)" }}
              >
                <Cpu className="w-4 h-4 text-purple-400 animate-spin" />
                <span className="text-purple-300 font-mono text-sm">QUANTUM</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="overflow-auto flex-1">
          <div className="relative container mx-auto px-4 py-8 z-10">
        {!isFullscreen && (
          <>
            {/* Hero Section */}
            <div className="text-center mb-16">
              <div
                className="inline-flex items-center gap-3 px-6 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full mb-8"
                style={{ boxShadow: "0 0 30px rgba(128,0,255,0.3)" }}
              >
                <Rocket className="w-5 h-5 text-purple-400" />
                <span className="text-purple-300 font-mono text-sm tracking-wider">NEXT GEN SHARING PROTOCOL</span>
              </div>
              <h2 className="text-7xl font-bold mb-8 leading-tight">
                <span className="bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent animate-pulse">
                  QUANTUM
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  DATA STREAM
                </span>
              </h2>
              <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-8">
                Experience the future of instant data sharing with our
                <span className="text-cyan-400 font-bold"> quantum-encrypted</span> neural network.
                <br />
                <span className="text-purple-400 font-bold">Instantaneous</span> •
                <span className="text-pink-400 font-bold"> Secure</span> •
                <span className="text-green-400 font-bold"> Limitless</span>
              </p>
            </div>

            {/* Futuristic Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {[
                { icon: Terminal, label: "NEURAL LINKS", value: "ACTIVE", color: "cyan" },
                { icon: Database, label: "QUANTUM STORAGE", value: "UNLIMITED", color: "purple" },
                { icon: Zap, label: "TRANSFER SPEED", value: "INSTANT", color: "pink" },
                { icon: Shield, label: "ENCRYPTION", value: "QUANTUM", color: "green" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-6 bg-gray-900/50 backdrop-blur-sm border rounded-2xl hover:scale-105 transition-all duration-500 group"
                  style={{
                    borderColor:
                      stat.color === "cyan"
                        ? "rgba(0,255,255,0.3)"
                        : stat.color === "purple"
                          ? "rgba(128,0,255,0.3)"
                          : stat.color === "pink"
                            ? "rgba(255,0,128,0.3)"
                            : "rgba(0,255,0,0.3)",
                    boxShadow: `0 0 30px ${
                      stat.color === "cyan"
                        ? "rgba(0,255,255,0.1)"
                        : stat.color === "purple"
                          ? "rgba(128,0,255,0.1)"
                          : stat.color === "pink"
                            ? "rgba(255,0,128,0.1)"
                            : "rgba(0,255,0,0.1)"
                    }`,
                  }}
                >
                  <stat.icon
                    className={`w-10 h-10 mx-auto mb-4 transition-all duration-300`}
                    style={{
                      color:
                        stat.color === "cyan"
                          ? "#00ffff"
                          : stat.color === "purple"
                            ? "#8000ff"
                            : stat.color === "pink"
                              ? "#ff0080"
                              : "#00ff00",
                    }}
                  />
                  <div
                    className={`text-2xl font-bold mb-2 font-mono`}
                    style={{
                      color:
                        stat.color === "cyan"
                          ? "#00ffff"
                          : stat.color === "purple"
                            ? "#8000ff"
                            : stat.color === "pink"
                              ? "#ff0080"
                              : "#00ff00",
                    }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-mono text-sm tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Main Content */}
        <div className={cn("grid gap-8 transition-all duration-700", isFullscreen ? "grid-cols-1" : "lg:grid-cols-3")}>
          {/* Editor Section */}
          <div className={cn("transition-all duration-700", isFullscreen ? "col-span-1" : "lg:col-span-2")}>
            <Card
              className="border-0 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 overflow-hidden"
              style={{ boxShadow: "0 0 50px rgba(0,255,255,0.2)" }}
            >
              <CardHeader
                className="bg-gray-800/80 border-b border-cyan-500/30"
                style={{ boxShadow: "0 0 20px rgba(0,255,255,0.2)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center"
                      style={{ boxShadow: "0 0 20px rgba(0,255,255,0.5)" }}
                    >
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl font-mono">
                        NEURAL INTERFACE
                        {isTyping && <span className="ml-2 text-green-400 animate-pulse">●</span>}
                      </CardTitle>
                      <CardDescription className="text-cyan-400 font-mono text-sm">
                        QUANTUM DATA INPUT STREAM
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="text-cyan-400 hover:text-white hover:bg-cyan-500/20 border border-cyan-500/30"
                    style={{ boxShadow: "0 0 10px rgba(0,255,255,0.3)" }}
                  >
                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <Textarea
                    placeholder=">>> INITIALIZING QUANTUM DATA STREAM...

▶ NEURAL INTERFACE READY
▶ TRANSFER PROTOCOL: INSTANTANEOUS

PASTE YOUR DATA:
• Source code fragments
• Configuration matrices  
• Documentation streams
• Neural thought patterns
• Quantum data structures

>>> AWAITING INPUT..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={cn(
                      "resize-none border-0 bg-black/50 text-green-400 placeholder:text-gray-600 focus:ring-2 focus:ring-cyan-500/50 font-mono text-sm leading-relaxed transition-all duration-300",
                      isFullscreen ? "min-h-[calc(100vh-250px)]" : "min-h-[600px]",
                    )}
                    style={{ boxShadow: "inset 0 0 20px rgba(0,255,255,0.1)" }}
                  />
                  {content && (
                    <div className="absolute top-4 right-4 flex gap-2">
                      <div
                        className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs text-cyan-400 border border-cyan-500/50 font-mono"
                        style={{ boxShadow: "0 0 10px rgba(0,255,255,0.3)" }}
                      >
                        {content.length} BYTES
                      </div>
                      <div
                        className="px-3 py-1 bg-black/80 backdrop-blur-sm rounded-full text-xs text-purple-400 border border-purple-500/50 font-mono"
                        style={{ boxShadow: "0 0 10px rgba(128,0,255,0.3)" }}
                      >
                        {content.split("\n").length} LINES
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 bg-gray-900/50 border-t border-cyan-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-sm font-mono">
                      <span className="text-cyan-400">{content.length} BYTES</span>
                      <span className="text-purple-400">•</span>
                      <span className="text-purple-400">{content.split("\n").length} LINES</span>
                      <span className="text-pink-400">•</span>
                      <span className="text-pink-400">
                        {content.split(" ").filter((word) => word.length > 0).length} TOKENS
                      </span>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={handleNewPaste}
                        disabled={!content && !shareUrl}
                        className="border-red-500/50 text-red-400 hover:bg-red-500/20 hover:text-red-300 bg-transparent font-mono"
                        style={{ boxShadow: "0 0 10px rgba(255,0,0,0.2)" }}
                      >
                        Clear
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isLoading || !content.trim()}
                        className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white transition-all duration-300 font-mono"
                        style={{ boxShadow: "0 0 30px rgba(0,255,255,0.5)" }}
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                            Save & Share
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          {!isFullscreen && (
            <div className="space-y-8">
              {shareUrl && (
                <Card
                  className="border-0 bg-green-900/30 backdrop-blur-xl border border-green-500/50 overflow-hidden animate-pulse"
                  style={{ boxShadow: "0 0 50px rgba(0,255,0,0.3)" }}
                >
                  <CardHeader className="bg-green-800/40 border-b border-green-500/50">
                    <CardTitle className="flex items-center gap-3 text-green-400 font-mono">
                      <div
                        className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center"
                        style={{ boxShadow: "0 0 20px rgba(0,255,0,0.5)" }}
                      >
                        <Share2 className="w-4 h-4 text-white animate-pulse" />
                      </div>
                      TRANSMISSION COMPLETE
                    </CardTitle>
                    <CardDescription className="text-green-300/80 font-mono">QUANTUM LINK ESTABLISHED</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div
                      className="p-4 bg-black/60 rounded-xl border border-green-500/30 backdrop-blur-sm"
                      style={{ boxShadow: "inset 0 0 20px rgba(0,255,0,0.1)" }}
                    >
                      <p className="text-sm font-mono break-all text-green-300 leading-relaxed">{shareUrl}</p>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(shareUrl, "Quantum link")}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-mono hover:cursor-pointer"
                      style={{ boxShadow: "0 0 30px rgba(0,255,0,0.5)" }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      COPY QUANTUM LINK
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Enhanced Features */}
              <Card
                className="border-0 bg-gray-900/80 backdrop-blur-xl border border-purple-500/30"
                style={{ boxShadow: "0 0 50px rgba(128,0,255,0.2)" }}
              >
                <CardHeader>
                  <CardTitle className="text-purple-400 flex items-center gap-2 font-mono">
                    <Sparkles className="w-5 h-5" />
                    QUANTUM FEATURES
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { icon: Zap, title: "NEURAL SPEED", desc: "Quantum transmission protocols", color: "cyan" },
                      { icon: Copy, title: "INSTANT CLONE", desc: "One-click molecular duplication", color: "green" },
                      { icon: Shield, title: "QUANTUM SHIELD", desc: "Unbreakable encryption matrix", color: "purple" },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 group"
                        style={{
                          background: `linear-gradient(to right, ${
                            feature.color === "cyan"
                              ? "rgba(0,255,255,0.1)"
                              : feature.color === "green"
                                ? "rgba(0,255,0,0.1)"
                                : "rgba(128,0,255,0.1)"
                          }, ${
                            feature.color === "cyan"
                              ? "rgba(0,255,255,0.05)"
                              : feature.color === "green"
                                ? "rgba(0,255,0,0.05)"
                                : "rgba(128,0,255,0.05)"
                          })`,
                          borderColor:
                            feature.color === "cyan"
                              ? "rgba(0,255,255,0.3)"
                              : feature.color === "green"
                                ? "rgba(0,255,0,0.3)"
                                : "rgba(128,0,255,0.3)",
                          boxShadow: `0 0 20px ${
                            feature.color === "cyan"
                              ? "rgba(0,255,255,0.2)"
                              : feature.color === "green"
                                ? "rgba(0,255,0,0.2)"
                                : "rgba(128,0,255,0.2)"
                          }`,
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:animate-pulse"
                          style={{
                            background: `linear-gradient(to right, ${
                              feature.color === "cyan" ? "#00ffff" : feature.color === "green" ? "#00ff00" : "#8000ff"
                            }, ${
                              feature.color === "cyan" ? "#00cccc" : feature.color === "green" ? "#00cc00" : "#6600cc"
                            })`,
                            boxShadow: `0 0 15px ${
                              feature.color === "cyan"
                                ? "rgba(0,255,255,0.3)"
                                : feature.color === "green"
                                  ? "rgba(0,255,0,0.3)"
                                  : "rgba(128,0,255,0.3)"
                            }`,
                          }}
                        >
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p
                            className="font-bold font-mono"
                            style={{
                              color:
                                feature.color === "cyan"
                                  ? "#00ffff"
                                  : feature.color === "green"
                                    ? "#00ff00"
                                    : "#8000ff",
                            }}
                          >
                            {feature.title}
                          </p>
                          <p className="text-sm text-gray-400">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card
                className="border-0 bg-cyan-900/20 backdrop-blur-xl border border-cyan-500/30"
                style={{ boxShadow: "0 0 50px rgba(0,255,255,0.2)" }}
              >
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center gap-2 font-mono">
                    <Terminal className="w-5 h-5" />
                    SYSTEM STATUS
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm font-mono space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">NEURAL LINK:</span>
                      <span className="text-green-400">ACTIVE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">QUANTUM STATE:</span>
                      <span className="text-cyan-400">ENTANGLED</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">UPTIME:</span>
                      <span className="text-pink-400">30 mins</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
          </div>
      </div>
    </div>
  )
}

export default Dashboard
