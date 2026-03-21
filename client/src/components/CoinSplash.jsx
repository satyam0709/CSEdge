import { useEffect, useState } from 'react'
export default function CoinSplash({ onDone }) {
  const [hiding, setHiding] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true)
      setTimeout(onDone, 700)
    }, 3400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#0a0a0a',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 28,
      opacity: hiding ? 0 : 1,
      visibility: hiding ? 'hidden' : 'visible',
      transition: 'opacity 0.7s ease, visibility 0.7s ease'
    }}>
      <style>{`
        .coin-lift {
          width: 120px; height: 120px;
          animation: liftArc 3.2s cubic-bezier(0.33, 0, 0.66, 1) forwards;
        }

        @keyframes liftArc {
          0%   { transform: translateY(60px);  opacity: 0; }
          4%   { opacity: 1; }
          /* — Rise: 0% → 44% — */
          44%  { transform: translateY(-200px); }
          /* — Fall: 44% → 82% — */
          82%  { transform: translateY(0px); }
          /* — Bounce 1 — */
          87%  { transform: translateY(-18px); }
          /* — Bounce 2 — */
          93%  { transform: translateY(0px); }
          96%  { transform: translateY(-6px); }
          /* — Settle — */
          100% { transform: translateY(0px); }
        }

        .coin-spin {
          width: 120px; height: 120px;
          position: relative;
          transform-style: preserve-3d;
          /*
            6 full rotations = 2160deg over 2.6s of flight (4%–86%)
            Then holds position through the bounce.
            linear = perfectly constant flip speed
          */
          animation: spinFlip 3.2s linear forwards;
        }

        @keyframes spinFlip {
          0%   { transform: rotateY(0deg); }
          84%  { transform: rotateY(2160deg); }  /* exactly 6 flips by landing */
          100% { transform: rotateY(2160deg); }  /* hold — no spin during bounce */
        }

        .cs-face {
          position: absolute; inset: 0;
          border-radius: 50%;
          backface-visibility: hidden;
          display: flex; align-items: center; justify-content: center;
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

        /* rim edge for depth */
        .cs-rim {
          position: absolute; inset: -1px;
          border-radius: 50%;
          border: 2px solid rgba(220,180,60,0.5);
          pointer-events: none;
        }

        @keyframes shadowAnim {
          0%   { transform: scaleX(0.05); opacity: 0; }
          4%   { opacity: 0.1; }
          44%  { transform: scaleX(0.15); opacity: 0.1; }  /* coin at peak — shadow tiny */
          82%  { transform: scaleX(1);    opacity: 0.55; } /* landed — full shadow */
          87%  { transform: scaleX(0.7);  opacity: 0.35; } /* bounce up */
          93%  { transform: scaleX(1);    opacity: 0.55; } /* back down */
          96%  { transform: scaleX(0.85); opacity: 0.42; } /* small bounce */
          100% { transform: scaleX(1);    opacity: 0.55; }
        }

        .cs-shadow {
          width: 120px; height: 16px;
          background: radial-gradient(ellipse, rgba(255,190,40,0.45) 0%, transparent 68%);
          border-radius: 50%;
          animation: shadowAnim 3.2s cubic-bezier(0.33, 0, 0.66, 1) forwards;
          margin-top: -4px;
        }

        @keyframes labelIn {
          0%,78% { opacity: 0; transform: translateY(8px); }
          90%,100% { opacity: 1; transform: translateY(0); }
        }

        .cs-label {
          color: #c8a32a;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          font-family: sans-serif;
          animation: labelIn 3.2s ease forwards;
        }
      `}</style>

      {/* perspective wrapper — parent of coin-lift */}
      <div style={{ perspective: '700px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="coin-lift">
          <div className="coin-spin">
            {/* heads */}
            <div className="cs-face cs-heads">
              <div className="cs-rim" />
              <span style={{ fontSize: 44, lineHeight: 1 }}>⚡</span>
            </div>
            {/* tails */}
            <div className="cs-face cs-tails">
              <div className="cs-rim" />
              <span style={{
                fontSize: 26, fontWeight: 600, color: '#3a2e18',
                fontFamily: 'sans-serif', letterSpacing: '0.04em'
              }}>CS</span>
            </div>
          </div>
        </div>
        <div className="cs-shadow" />
      </div>

      <div className="cs-label">CSEdge — loading...</div>
    </div>
  )
}