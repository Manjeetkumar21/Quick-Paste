"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useParams, Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import {
  Copy,
  ArrowLeft,
  FileText,
  Calendar,
  Download,
  Share2,
  Sparkles,
  Eye,
  Terminal,
  Zap,
  Database,
} from "lucide-react"
import { useToast } from "../hooks/use-toast"

interface PasteData {
  id: string
  content: string
  createdAt: string
}

const ViewPaste: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [paste, setPaste] = useState<PasteData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
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

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const fetchPaste = async () => {
      if (!id) return

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const storedPaste = localStorage.getItem(`paste_${id}`)
        if (!storedPaste) {
          throw new Error("Paste not found")
        }

        const data = JSON.parse(storedPaste)
        setPaste(data)
      } catch (error) {
        setError("Failed to load paste. It may have been deleted or never existed.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaste()
  }, [id])

  const copyToClipboard = async () => {
    if (!paste) return

    try {
      await navigator.clipboard.writeText(paste.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Quantum Clone Complete!",
        description: "Data successfully copied...",
      })
    } catch (error) {
      toast({
        title: "Transmission Error",
        description: "Failed to clone data to neural buffer",
        variant: "destructive",
      })
    }
  }

  const downloadAsFile = () => {
    if (!paste) return

    const blob = new Blob([paste.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `quantum-data-${paste.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      toast({
        title: "Quantum Link Transmitted!",
        description: "Shared link copied...",
      })
    } catch (error) {
      toast({
        title: "Transmission Failed",
        description: "Unable to copy quantum link",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.3 }} />

        <div className="text-center z-10">
          <div className="relative mb-8">
            <div
              className="animate-spin rounded-full h-20 w-20 border-4 border-cyan-500/30 border-t-cyan-500 mx-auto"
              style={{ boxShadow: "0 0 30px rgba(0,255,255,0.5)" }}
            ></div>
            <div
              className="absolute inset-0 rounded-full h-20 w-20 border-4 border-purple-500/20 border-t-purple-500 mx-auto animate-spin"
              style={{
                animationDirection: "reverse",
                animationDuration: "1.5s",
                boxShadow: "0 0 30px rgba(128,0,255,0.5)",
              }}
            ></div>
            <div
              className="absolute inset-0 rounded-full h-20 w-20 border-4 border-pink-500/10 border-t-pink-500 mx-auto animate-spin"
              style={{ animationDuration: "2s", boxShadow: "0 0 30px rgba(255,0,128,0.5)" }}
            ></div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4 font-mono">
            QUANTUM RETRIEVAL
          </h2>
          <p className="text-cyan-400 font-mono text-lg">Accessing neural data stream...</p>
          <p className="text-gray-500 font-mono text-sm mt-2">Decrypting quantum matrix</p>
        </div>
      </div>
    )
  }

  if (error || !paste) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.3 }} />

        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
            style={{ background: "radial-gradient(circle, rgba(255,0,0,0.2) 0%, transparent 70%)" }}
          ></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse"
            style={{
              background: "radial-gradient(circle, rgba(255,165,0,0.2) 0%, transparent 70%)",
              animationDelay: "1s",
            }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 py-8 z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Card
              className="border-0 bg-gray-900/80 backdrop-blur-xl border border-red-500/50"
              style={{ boxShadow: "0 0 50px rgba(255,0,0,0.3)" }}
            >
              <CardContent className="py-16">
                <div
                  className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse"
                  style={{ boxShadow: "0 0 30px rgba(255,0,0,0.5)" }}
                >
                  <FileText className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-red-400 mb-6 font-mono">NEURAL LINK SEVERED</h1>
                <p className="text-gray-400 mb-8 text-lg leading-relaxed font-mono">{error}</p>
                <Link to="/">
                  <Button
                    className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white px-8 py-4 font-mono"
                    style={{ boxShadow: "0 0 30px rgba(0,255,255,0.5)" }}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    ESTABLISH NEW LINK
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen bg-black text-white relative overflow-hidden flex flex-col">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.3 }} />

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

      <header
        className="relative border-b border-cyan-500/30 bg-black/80 backdrop-blur-xl sticky top-0 z-50"
        style={{ boxShadow: "0 0 30px rgba(0,255,255,0.3)" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-4 hover:opacity-80 transition-all duration-300 group">
              <div
                className="p-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300"
                style={{ boxShadow: "0 0 30px rgba(0,255,255,0.5)" }}
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-white font-mono">RETURN TO QUANTUM CORE</span>
                <p className="text-xs text-cyan-400 font-mono">Neural link established</p>
              </div>
            </Link>
            <div className="sm:flex hidden items-center gap-4">
              <div
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full border border-cyan-500/50"
                style={{ boxShadow: "0 0 15px rgba(0,255,255,0.3)" }}
              >
                <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-sm text-cyan-300 font-mono">ID: {paste.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-auto">
        <div className="relative container mx-auto px-4 py-8 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 text-center">
            <div
              className="inline-flex items-center gap-3 px-6 sm:py-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full mb-6"
              style={{ boxShadow: "0 0 30px rgba(0,255,0,0.3)" }}
            >
              <Database className="sm:w-5 w-3 text-green-400 animate-pulse" />
              <span className="text-green-300 font-mono sm:text-sm text-xs tracking-wider">QUANTUM DATA RETRIEVED</span>
            </div>
            <h1 className="sm:text-5xl text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent mb-6 font-mono">
              NEURAL STREAM ACTIVE
            </h1>
            <p className="text-gray-400 sm:text-xl text-sm font-mono">
              TIMESTAMP: {new Date(paste.createdAt).toLocaleString()} • DATA SIZE: {paste.content.length} BYTES •
              QUANTUM STATE: ENTANGLED
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <Button
              onClick={copyToClipboard}
              className={`bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 transition-all duration-300 font-mono ${copied ? "scale-105" : ""}`}
              style={{ boxShadow: copied ? "0 0 50px rgba(0,255,0,0.8)" : "0 0 30px rgba(0,255,0,0.5)" }}
            >
              <Copy className="w-5 h-5 mr-2" />
              {copied ? "COPIED!" : "COPY DATA"}
            </Button>
            <Button
              onClick={downloadAsFile}
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:text-cyan-300 px-8 py-4 bg-transparent font-mono border"
              style={{ boxShadow: "0 0 20px rgba(0,255,255,0.3)" }}
            >
              <Download className="w-5 h-5 mr-2" />
              EXTRACT FILE
            </Button>
            <Button
              onClick={shareLink}
              className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 px-8 py-4 bg-transparent font-mono border"
              style={{ boxShadow: "0 0 20px rgba(128,0,255,0.3)" }}
            >
              <Share2 className="w-5 h-5 mr-2" />
              SHARE NEURAL LINK
            </Button>
          </div>

          <Card
            className="border-0 bg-gray-900/80 backdrop-blur-xl border border-cyan-500/30 overflow-hidden"
            style={{ boxShadow: "0 0 50px rgba(0,255,255,0.3)" }}
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
                    <Terminal className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white sm:text-2xl text-lg font-mono">QUANTUM DATA STREAM</CardTitle>
                    <CardDescription className="text-cyan-400 mt-1 font-mono">
                      {paste.content.length} BYTES • {paste.content.split("\n").length} LINES • &nbsp;
                      {paste.content.split(" ").filter((word) => word.length > 0).length} TOKENS
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative">
                <div
                  className="bg-black/60 p-8 max-h-[70vh] overflow-auto"
                  style={{ boxShadow: "inset 0 0 30px rgba(0,255,255,0.1)" }}
                >
                  <pre className="whitespace-pre-wrap text-sm text-green-400 font-mono leading-relaxed">
                    {paste.content}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-16 text-center">
            <div
              className="p-12 bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-3xl"
              style={{ boxShadow: "0 0 50px rgba(128,0,255,0.2)" }}
            >
              <h3 className="sm:text-4xl text-md font-bold text-white mb-6 font-mono">ESTABLISH YOUR NEURAL LINK</h3>
              <p className="text-gray-400 mb-8 max-w-3xl mx-auto sm:text-lg text-sm font-mono leading-relaxed">
                Join the quantum network and share your data streams instantly with our
                <span className="text-cyan-400"> neural encrypted</span> transmission protocols.
              </p>
              <Link to="/">
                <Button
                  className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 text-white sm:px-12 px-4 sm:py-4 py-2 sm:text-lg text-sm font-mono rounded-lg"
                  style={{ boxShadow: "0 0 40px rgba(0,255,255,0.5)" }}
                >
                  <Zap className="sm:w-6 w-4  mr-3 animate-pulse" />
                  INITIALIZE QUANTUM CORE
                </Button>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ViewPaste
