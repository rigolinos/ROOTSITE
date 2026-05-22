# Root Code — Projeto Next.js Cinematográfico

## Contexto
Site institucional da **Root Code (Deep Roots)** — uma software house com filosofia "Eficiência Silenciosa".
Experiência cinematográfica premium com GSAP 3, ScrollTrigger e Lenis Smooth Scroll.

## Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (tokens via @theme)
- GSAP 3 + ScrollTrigger
- Lenis (smooth scroll)

## Paleta de Cores
- Forest Green: #1B3022 (primary)
- Sage: #98A99A (secondary)
- Off-White: #F2F4F2 (tertiary)
- Glow: #4ADE80 (accent)
- Gold: #C8A96E (stats/premium)
- BG Dark: #0A0F0D (background)

## Tipografia
- Manrope: 300-800 weights
- Display: clamp(3rem, 8vw, 7rem)
- Section titles: clamp(2rem, 5vw, 4rem)

## Regras de Motion Design (INVIOLÁVEIS)
1. Duração mínima: 0.8s — o site deve respirar
2. Eases PROIBIDAS: "linear", "ease-in-out", "power1"
3. Eases OBRIGATÓRIAS: "expo.out", "power4.out", "power3.out"
4. Stagger chars: 0.08s, cards: 0.25s
5. Elementos secundários revelam APÓS conteúdo principal estabilizar
6. Scrub values entre 1 e 1.5

## Integração Crítica
Lenis RAF DEVE estar sincronizado com GSAP ticker.

## Mobile
- smoothTouch: false (sempre)
- 100dvh em vez de 100vh
- ScrollTrigger.normalizeScroll(true) como safety net
