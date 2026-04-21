import { useEffect, useState, useRef } from 'react'

export default function CoinSplash({ onDone }) {
  const [hiding, setHiding] = useState(false)
  const [landed, setLanded] = useState(false)
  const canvasRef = useRef(null)

  useEffect(() => {
    const t1 = setTimeout(() => setLanded(true), 2624)
    const t2 = setTimeout(() => {
      setHiding(true)
      setTimeout(onDone, 700)
    }, 3400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h
    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 72 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.2,
      vy: -(Math.random() * 0.32 + 0.08),
      vx: (Math.random() - 0.5) * 0.12,
      phase: Math.random() * Math.PI * 2,
      dph: 0.014 + Math.random() * 0.022,
      a: Math.random() * 0.3 + 0.05,
    }))

    let raf
    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.phase += p.dph
        p.x += p.vx
        p.y += p.vy
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w }
        if (p.x < -4) p.x = w + 4
        if (p.x > w + 4) p.x = -4
        const alpha = p.a * (0.4 + 0.6 * Math.abs(Math.sin(p.phase)))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212,168,42,${alpha.toFixed(3)})`
        ctx.fill()
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  const label = 'CSEdge — loading...'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#070707',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 36,
      opacity: hiding ? 0 : 1,
      visibility: hiding ? 'hidden' : 'visible',
      transition: 'opacity 0.7s ease, visibility 0.7s ease',
      overflow: 'hidden',
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />

      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 65% 65% at 50% 50%, transparent 20%, rgba(0,0,0,0.78) 100%)',
      }} />

      <div className="cs-amb" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600&display=swap');

        .cs-amb {
          position: absolute;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(212,168,42,0.07) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          animation: ambPulse 2.4s ease-in-out infinite;
        }
        @keyframes ambPulse {
          0%,100% { transform: scale(1);    opacity: 0.6; }
          50%      { transform: scale(1.13); opacity: 1; }
        }

        .coin-lift {
          position: absolute; inset: 0;
          animation: liftArc 3.2s cubic-bezier(0.33, 0, 0.66, 1) forwards;
        }
        @keyframes liftArc {
          0%   { transform: translateY(60px);   opacity: 0; }
          4%   { opacity: 1; }
          44%  { transform: translateY(-200px); }
          82%  { transform: translateY(0px); }
          87%  { transform: translateY(-18px); }
          93%  { transform: translateY(0px); }
          96%  { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }

        .coin-spin {
          width: 120px; height: 120px;
          position: relative;
          transform-style: preserve-3d;
          animation: spinFlip 3.2s linear forwards, coinGlow 3.2s ease forwards;
        }
        @keyframes spinFlip {
          0%   { transform: rotateY(0deg); }
          84%  { transform: rotateY(2160deg); }
          100% { transform: rotateY(2160deg); }
        }
        @keyframes coinGlow {
          0%   { filter: drop-shadow(0 0 0px   rgba(212,168,42,0)); }
          5%   { filter: drop-shadow(0 0 14px  rgba(212,168,42,0.5)); }
          44%  { filter: drop-shadow(0 0 28px  rgba(255,210,60,0.85))
                         drop-shadow(0 0 50px  rgba(212,168,42,0.32)); }
          82%  { filter: drop-shadow(0 0 20px  rgba(212,168,42,0.62)); }
          84%  { filter: drop-shadow(0 0 46px  rgba(255,224,80,1))
                         drop-shadow(0 0 70px  rgba(212,168,42,0.55)); }
          93%  { filter: drop-shadow(0 0 11px  rgba(212,168,42,0.38)); }
          100% { filter: drop-shadow(0 0 9px   rgba(212,168,42,0.28)); }
        }

        .cs-face {
          position: absolute; inset: 0;
          border-radius: 50%;
          backface-visibility: hidden;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
        }
        .cs-heads {
          background: radial-gradient(circle at 35% 32%, #fae97a, #d4a82a 48%, #8a6510);
          border: 3px solid #c49a20;
          box-shadow:
            inset 0 3px 8px rgba(255,255,200,0.45),
            inset 0 -4px 8px rgba(0,0,0,0.45),
            inset 0 0 20px rgba(180,130,0,0.3);
        }
        .cs-tails {
          background: radial-gradient(circle at 35% 32%, #ece4d4, #b4a484 48%, #706248);
          border: 3px solid #a09060;
          box-shadow:
            inset 0 3px 8px rgba(255,255,255,0.3),
            inset 0 -4px 8px rgba(0,0,0,0.35);
          transform: rotateY(180deg);
        }

        .cs-glint {
          position: absolute;
          inset: -20px;
          background: linear-gradient(
            112deg,
            transparent 26%,
            rgba(255,255,255,0.68) 45%,
            rgba(255,255,240,0.18) 52%,
            transparent 64%
          );
          animation: glintSweep 3.2s ease forwards;
          pointer-events: none;
        }
        @keyframes glintSweep {
          0%,9% { transform: translateX(-200%); }
          30%   { transform: translateX(200%); }
          78%   { transform: translateX(-200%); }
          88%   { transform: translateX(200%); }
          100%  { transform: translateX(200%); }
        }

        @keyframes shadowAnim {
          0%   { transform: scaleX(0.05); opacity: 0; }
          4%   { opacity: 0.1; }
          44%  { transform: scaleX(0.15); opacity: 0.1; }
          82%  { transform: scaleX(1);    opacity: 0.55; }
          87%  { transform: scaleX(0.7);  opacity: 0.35; }
          93%  { transform: scaleX(1);    opacity: 0.55; }
          96%  { transform: scaleX(0.85); opacity: 0.42; }
          100% { transform: scaleX(1);    opacity: 0.55; }
        }
        .cs-shadow {
          width: 120px; height: 16px;
          background: radial-gradient(ellipse, rgba(255,190,40,0.45) 0%, transparent 68%);
          border-radius: 50%;
          animation: shadowAnim 3.2s cubic-bezier(0.33, 0, 0.66, 1) forwards;
          margin-top: 4px;
        }

        .landing-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(255,205,55,0.92);
          pointer-events: none;
          animation: ringExpand 0.62s ease-out both;
        }
        .landing-ring-2 {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 1.5px solid rgba(212,168,42,0.52);
          pointer-events: none;
          animation: ringExpand 0.78s 0.1s ease-out both;
        }
        @keyframes ringExpand {
          0%   { transform: scale(1); opacity: 0; }
          7%   { opacity: 1; }
          100% { transform: scale(3.8); opacity: 0; }
        }

        .burst-dot {
          position: absolute;
          border-radius: 50%;
          top: 50%; left: 50%;
          pointer-events: none;
        }
        .bd-big {
          width: 6px; height: 6px;
          margin: -3px 0 0 -3px;
          background: #f5c842;
          box-shadow: 0 0 6px rgba(255,200,50,0.9);
        }
        .bd-small {
          width: 3px; height: 3px;
          margin: -1.5px 0 0 -1.5px;
          background: #fff8a0;
          box-shadow: 0 0 4px rgba(255,240,100,0.85);
        }

        .bp-0 { animation: bp0 0.58s ease-out forwards; }
        .bp-1 { animation: bp1 0.50s ease-out forwards; }
        .bp-2 { animation: bp2 0.58s ease-out forwards; }
        .bp-3 { animation: bp3 0.50s ease-out forwards; }
        .bp-4 { animation: bp4 0.58s ease-out forwards; }
        .bp-5 { animation: bp5 0.50s ease-out forwards; }
        .bp-6 { animation: bp6 0.58s ease-out forwards; }
        .bp-7 { animation: bp7 0.50s ease-out forwards; }

        @keyframes bp0 { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(0,-74px);opacity:0} }
        @keyframes bp1 { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(52px,-52px);opacity:0} }
        @keyframes bp2 { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(74px,0);opacity:0} }
        @keyframes bp3 { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(52px,52px);opacity:0} }
        @keyframes bp4 { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(0,74px);opacity:0} }
        @keyframes bp5 { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(-52px,52px);opacity:0} }
        @keyframes bp6 { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(-74px,0);opacity:0} }
        @keyframes bp7 { 0%{transform:translate(0,0);opacity:1} 100%{transform:translate(-52px,-52px);opacity:0} }

        .cs-label {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c8a32a;
          display: flex;
          position: relative;
          z-index: 1;
        }
        .cs-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(7px);
          animation: charIn 0.22s ease forwards;
        }
        @keyframes charIn {
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        perspective: '700px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          <div className="coin-lift">
            <div className="coin-spin">
              <div className="cs-face cs-heads">
                <div className="cs-glint" />
                <span style={{ fontSize: 44, lineHeight: 1 }}>⚡</span>
              </div>
              <div className="cs-face cs-tails">
                <span style={{
                  fontSize: 26, fontWeight: 600, color: '#3a2e18',
                  fontFamily: "'Rajdhani', sans-serif", letterSpacing: '0.04em',
                }}>CS</span>
              </div>
            </div>
          </div>

          {landed && (
            <>
              <div className="landing-ring" />
              <div className="landing-ring-2" />
              {Array.from({ length: 8 }, (_, i) => (
                <div
                  key={i}
                  className={`burst-dot ${i % 2 === 0 ? 'bd-big' : 'bd-small'} bp-${i}`}
                />
              ))}
            </>
          )}
        </div>

        <div className="cs-shadow" />
      </div>

      <div className="cs-label">
        {label.split('').map((ch, i) => (
          <span
            key={i}
            className="cs-char"
            style={{ animationDelay: `${2.72 + i * 0.04}s` }}
          >
            {ch === ' ' ? '\u00a0' : ch}
          </span>
        ))}
      </div>
    </div>
  )
}