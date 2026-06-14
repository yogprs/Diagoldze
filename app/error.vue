<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import gsap from 'gsap'
import type { NuxtError } from '#app'

// Define props for error
const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })

const containerRef = ref<HTMLElement | null>(null)
const number4aRef = ref<HTMLElement | null>(null)
const number0Ref = ref<HTMLElement | null>(null)
const number4bRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const btnRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let animationFrameId: number

onMounted(() => {
  // GSAP Animations
  const tl = gsap.timeline()
  
  // Reset initial states
  gsap.set([number4aRef.value, number0Ref.value, number4bRef.value], { 
    y: -150, 
    opacity: 0,
    rotationX: 90
  })
  
  gsap.set(textRef.value, { y: 50, opacity: 0 })
  gsap.set(btnRef.value, { scale: 0.8, opacity: 0 })

  // Animate 404
  tl.to(number4aRef.value, {
    y: 0,
    opacity: 1,
    rotationX: 0,
    duration: 0.8,
    ease: "back.out(1.7)"
  })
  .to(number0Ref.value, {
    y: 0,
    opacity: 1,
    rotationX: 0,
    duration: 0.8,
    ease: "back.out(1.7)"
  }, "-=0.6")
  .to(number4bRef.value, {
    y: 0,
    opacity: 1,
    rotationX: 0,
    duration: 0.8,
    ease: "back.out(1.7)"
  }, "-=0.6")

  // Animate texts and button
  .to(textRef.value, {
    y: 0,
    opacity: 1,
    duration: 0.6,
    ease: "power3.out"
  }, "-=0.2")
  .to(btnRef.value, {
    scale: 1,
    opacity: 1,
    duration: 0.5,
    ease: "back.out(2)"
  }, "-=0.3")

  // Floating animation for the numbers
  gsap.to(number4aRef.value, {
    y: -15,
    rotation: -2,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 1
  })
  gsap.to(number0Ref.value, {
    y: 15,
    rotation: 2,
    duration: 2.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 1.2
  })
  gsap.to(number4bRef.value, {
    y: -15,
    rotation: -2,
    duration: 2.2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    delay: 1.4
  })

  // Simple particle system in canvas for background
  initParticles()
})

onBeforeUnmount(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})

// Optional particle background
const initParticles = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  let width = canvas.width = window.innerWidth
  let height = canvas.height = window.innerHeight

  const particles: any[] = []

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.1
    })
  }

  const render = () => {
    ctx.clearRect(0, 0, width, height)
    particles.forEach(p => {
      p.x += p.vx
      p.y += p.vy

      if (p.x < 0 || p.x > width) p.vx *= -1
      if (p.y < 0 || p.y > height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`
      ctx.fill()
    })
    animationFrameId = requestAnimationFrame(render)
  }

  render()

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  })
}

// Mouse move effect for parallax
const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return
  const { clientX, clientY } = e
  const { innerWidth, innerHeight } = window

  const xPos = (clientX / innerWidth - 0.5) * 30
  const yPos = (clientY / innerHeight - 0.5) * 30

  gsap.to([number4aRef.value, number0Ref.value, number4bRef.value], {
    x: xPos,
    y: yPos,
    duration: 1,
    ease: "power2.out"
  })
}
</script>

<template>
  <div 
    ref="containerRef"
    class="relative flex flex-col items-center justify-center min-h-screen bg-[#09090b] text-white overflow-hidden selection:bg-amber-500 selection:text-gray-900 font-sans"
    @mousemove="handleMouseMove"
  >
    <!-- Background Canvas -->
    <canvas ref="canvasRef" class="absolute inset-0 pointer-events-none opacity-40"></canvas>

    <!-- Ambient Glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

    <div class="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-5xl">
      <!-- Error Number -->
      <div 
        v-if="error?.statusCode === 404"
        class="flex items-center justify-center gap-2 md:gap-6 text-[120px] sm:text-[180px] md:text-[250px] font-black leading-none tracking-tighter" 
        style="perspective: 1000px;"
      >
        <div ref="number4aRef" class="bg-clip-text text-transparent bg-gradient-to-br from-amber-300 to-amber-600 drop-shadow-2xl">4</div>
        <div ref="number0Ref" class="bg-clip-text text-transparent bg-gradient-to-br from-gray-200 to-gray-600 drop-shadow-2xl">0</div>
        <div ref="number4bRef" class="bg-clip-text text-transparent bg-gradient-to-br from-amber-300 to-amber-600 drop-shadow-2xl">4</div>
      </div>
      <div 
        v-else
        class="flex items-center justify-center text-[120px] sm:text-[180px] md:text-[250px] font-black leading-none tracking-tighter" 
        style="perspective: 1000px;"
      >
        <div ref="number0Ref" class="bg-clip-text text-transparent bg-gradient-to-br from-rose-400 to-rose-700 drop-shadow-2xl">{{ error?.statusCode || 'Error' }}</div>
      </div>

      <!-- Description -->
      <div ref="textRef" class="mt-8 flex flex-col items-center gap-4">
        <h1 class="text-3xl md:text-5xl font-bold text-gray-100 tracking-tight">
          {{ error?.statusCode === 404 ? 'Halaman tidak ditemukan' : 'Terjadi kesalahan' }}
        </h1>
        <p class="text-base md:text-xl text-gray-400 max-w-2xl leading-relaxed">
          {{ error?.statusMessage || "Halaman yang Anda cari mungkin telah dihapus, namanya diubah, atau sementara tidak tersedia." }}
        </p>
      </div>

      <!-- Button -->
      <div ref="btnRef" class="mt-12 z-20">
        <button 
          @click="handleError" 
          class="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-gray-950 transition-all duration-300 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full hover:from-amber-300 hover:to-amber-400 hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-[#09090b] overflow-hidden"
        >
          <!-- Shine effect -->
          <div class="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          
          <Icon name="lucide:arrow-left" class="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span class="text-lg">Kembali ke Beranda</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
