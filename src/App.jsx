import { useState, useRef } from 'react'

export default function App() {
  const [showScan, setShowScan] = useState(false)
  const [scanDone, setScanDone] = useState(false)
  const scanRef = useRef(null)
  const fileRef = useRef(null)

  const scrollToScan = () => scanRef.current?.scrollIntoView({ behavior: 'smooth' })

  const handleScan = () => {
    if (fileRef.current) fileRef.current.click()
  }

  const onFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setShowScan(true)
    setTimeout(() => {
      setScanDone(true)
      setTimeout(() => setShowScan(false), 800)
    }, 1800)
  }

  return (
    <div className="min-h-screen bg-[#FFFBF9] text-naildark overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[88vh] lg:min-h-[92vh] flex flex-col bg-[#0a0a0a] overflow-hidden">
        {/* background image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=80"
            alt="manucure"
            className="w-full h-full object-cover object-[center_20%] opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        </div>

        {/* top bar */}
        <header className="relative z-20 flex items-center justify-between px-5 lg:px-10 py-5 max-w-[1440px] mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="text-white font-black tracking-tight text-[19px] lg:text-[20px]">NAIL</span>
            <span className="text-[#FF2B6E] font-black tracking-tight text-[19px] lg:text-[20px]">PROFILE</span>
          </div>
          <button
            onClick={scrollToScan}
            className="hidden sm:inline-flex bg-white text-black text-[13px] lg:text-[14px] font-semibold px-5 lg:px-6 py-[10px] rounded-full hover:bg-zinc-100 transition"
          >
            Créer mon Nail Profile
          </button>
          <button
            onClick={scrollToScan}
            className="sm:hidden bg-white text-black text-[12px] font-semibold px-4 py-2 rounded-full"
          >
            Créer
          </button>
        </header>

        {/* hero content */}
        <div className="relative z-10 flex-1 flex flex-col justify-end px-5 lg:px-10 pb-10 lg:pb-16 max-w-[1440px] mx-auto w-full">
          <p className="text-white/70 text-[10px] lg:text-[12px] tracking-[0.22em] font-semibold mb-4 lg:mb-6">
            NAIL PROFILE — LA PREMIÈRE PLATEFORME<br className="sm:hidden" /> D'ONGLES SUR MESURE PAR IA
          </p>
          <h1 className="font-black leading-[0.9] tracking-[-0.04em] text-white text-[42px] sm:text-[56px] lg:text-[84px] max-w-[680px]">
            Tes ongles.<br />
            Ton design.<br />
            <span className="text-[#FFB3CC]">Ton format.</span>
          </h1>
          <p className="text-white/80 text-[16px] lg:text-[18px] leading-relaxed mt-6 max-w-[560px] font-medium">
            Scanne tes mains. L'IA mesure tes ongles, crée un profil unique et compose un set de designs qui s'adaptent exactement à toi.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <button
              onClick={scrollToScan}
              className="inline-flex items-center justify-center gap-2 bg-[#FF2B6E] hover:bg-[#E62662] text-white font-semibold px-7 py-4 rounded-full text-[15px] transition w-full sm:w-auto"
            >
              Créer mon Nail Profile
              <span className="text-lg leading-none">→</span>
            </button>
            <button
              onClick={() => document.getElementById('concept')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center justify-center bg-white/10 backdrop-blur border border-white/20 text-white font-medium px-7 py-4 rounded-full text-[15px] hover:bg-white/20 transition w-full sm:w-auto"
            >
              Voir le concept
            </button>
          </div>
          <div className="mt-10 flex items-center gap-3 text-white/60 text-xs">
            <span className="w-8 h-[1px] bg-white/30" />
            <span>Déjà +12 483 Nail Profiles créés</span>
          </div>
        </div>
      </section>

      {/* CONCEPT */}
      <section id="concept" className="bg-[#FFFBF9] px-5 lg:px-10 py-14 lg:py-24 max-w-[1440px] mx-auto">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 items-start">
          <div>
            <p className="text-[#FF2B6E] text-[13px] tracking-[0.32em] font-bold mb-4">CONCEPT</p>
            <h2 className="font-black tracking-[-0.04em] leading-[0.95] text-[32px] sm:text-[44px] lg:text-[56px]">
              Un ongle n'est pas<br />un écran.<br />C'est une forme.
            </h2>
          </div>
          <div className="lg:pt-8">
            <p className="text-[#6B6B6B] text-[17px] lg:text-[19px] leading-relaxed">
              Les outils actuels génèrent des images de nail art. Nail Profile est différent&nbsp;: nous créons un modèle numérique de tes vrais ongles, puis chaque design y est dessiné directement. Pas de simulacre. Pas d'approximation. Un vrai produit, pensé pour toi.
            </p>
          </div>
        </div>

        {/* 3 cards */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 mt-12 lg:mt-16">
          {[
            {
              kicker: 'TES MAINS',
              title: 'Scannées, pas devinées.',
              desc: "L'IA détecte tes 10 ongles, mesure chaque forme en millimètres et enregistre un Nail Profile permanent.",
            },
            {
              kicker: 'TON DESIGN',
              title: 'Composé pour toi.',
              desc: 'Chaque set est généré doigt par doigt, en respectant la cohérence artistique ET tes dimensions réelles.',
            },
            {
              kicker: 'TON FORMAT',
              title: 'Adapté à tous les profils.',
              desc: "Une même création devient 10 versions différentes selon le Nail Profile. C'est du sur-mesure, pas du redimensionné.",
            },
          ].map((c) => (
            <div key={c.kicker} className="bg-white rounded-[20px] border border-black/[0.06] p-7 lg:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <p className="text-[#FF2B6E] text-[11px] tracking-[0.28em] font-bold mb-3">{c.kicker}</p>
              <h3 className="font-bold text-[20px] lg:text-[22px] leading-tight mb-3">{c.title}</h3>
              <p className="text-[#8A8A8A] text-[14px] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESSUS */}
      <section className="bg-[#FFF6F1] border-t border-black/[0.04] px-5 lg:px-10 py-14 lg:py-20">
        <div className="max-w-[1440px] mx-auto">
          <p className="text-[#FF2B6E] text-[13px] tracking-[0.32em] font-bold mb-4">PROCESSUS</p>
          <h2 className="font-black tracking-[-0.04em] leading-[0.95] text-[34px] sm:text-[48px] lg:text-[60px] max-w-[700px]">
            De la photo à la<br />commande,<br />en cinq étapes.
          </h2>

          {/* step 01 */}
          <div className="mt-12 lg:mt-16 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-[64px] lg:text-[80px] font-light text-black/10 leading-none">01</span>
              <h3 className="font-bold text-[26px] lg:text-[32px] leading-tight mt-1">Tes mains deviennent des données.</h3>
              <p className="text-[#8A8A8A] text-[15px] lg:text-[17px] leading-relaxed mt-3 max-w-[520px]">
                Une photo de tes mains suffit. L'IA détecte, isole et mesure chacun de tes 10 ongles — largeur, longueur, courbure, orientation.
              </p>
              <ul className="mt-5 space-y-2 text-[13px] text-[#6B6B6B]">
                <li className="flex gap-2"><span className="text-[#FF2B6E]">•</span> Photo prise en 10 secondes</li>
                <li className="flex gap-2"><span className="text-[#FF2B6E]">•</span> Précision millimétrique</li>
                <li className="flex gap-2"><span className="text-[#FF2B6E]">•</span> Aucune donnée revendue</li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 bg-[#FFCC00] rounded-[24px] overflow-hidden aspect-[4/3] lg:aspect-[1.15] relative flex items-end justify-center">
              <img
                src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80"
                alt="main jaune"
                className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
              />
              <div className="absolute inset-0 bg-[#FFD100]/20" />
              {/* hole effect */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[38%] h-[18%] bg-[#FFF6F1] rounded-t-[100%] blur-[0.5px]" />
              <img
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80"
                alt="hand"
                className="relative z-10 w-[42%] mb-[-6px] object-contain drop-shadow-xl"
                style={{ filter: 'contrast(1.05)' }}
              />
            </div>
          </div>

          {/* step 02 */}
          <div className="mt-10 lg:mt-12 grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            <div className="bg-gradient-to-br from-[#A8E0F0] via-[#88CDE8] to-[#F0C6D8] rounded-[24px] overflow-hidden aspect-[4/3] lg:aspect-[1.15] relative p-6 lg:p-10 flex flex-col justify-end">
              <div className="absolute top-6 right-6 w-24 h-24 rounded-full bg-white/20 blur-2xl" />
              <div className="relative bg-white rounded-2xl p-5 shadow-xl max-w-[340px]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-[#FF2B6E] flex items-center justify-center text-white text-xs font-bold">✓</div>
                  <span className="font-semibold text-sm">Nail Profile enregistré</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="aspect-[3/4] rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-200 border border-black/5 flex items-center justify-center text-[9px] font-medium text-zinc-500">
                      {8 + i}mm
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-zinc-500 mt-3 text-center">10 gabarits • précision 0.1mm</p>
              </div>
            </div>
            <div>
              <span className="text-[64px] lg:text-[80px] font-light text-black/10 leading-none">02</span>
              <h3 className="font-bold text-[26px] lg:text-[32px] leading-tight mt-1">Un Nail Profile, pour toujours.</h3>
              <p className="text-[#8A8A8A] text-[15px] lg:text-[17px] leading-relaxed mt-3 max-w-[520px]">
                Ton profil enregistre tes 10 gabarits. Chaque future création s'adaptera à tes dimensions réelles, pas à un modèle générique.
              </p>
            </div>
          </div>

          {/* steps 03-05 condensed */}
          <div className="grid md:grid-cols-3 gap-5 mt-10">
            {[
              { n: '03', t: 'L’IA compose', d: 'Tu choisis un univers, l’IA génère un set cohérent doigt par doigt, adapté à chaque gabarit.' },
              { n: '04', t: 'Tu prévisualises', d: 'Visualisation 3D ultra-réaliste sur tes vrais ongles. Zoom, rotation, lumière du jour.' },
              { n: '05', t: 'On fabrique', d: 'Impression haute précision + pose guidée. Livraison 48h, partout dans le monde.' },
            ].map((s) => (
              <div key={s.n} className="bg-white rounded-[20px] border border-black/[0.06] p-6">
                <span className="text-[36px] font-light text-black/10">{s.n}</span>
                <h4 className="font-bold text-[16px] mt-1">{s.t}</h4>
                <p className="text-[#8A8A8A] text-[13px] leading-relaxed mt-2">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SCAN */}
      <section ref={scanRef} id="creer" className="px-5 lg:px-10 py-12 lg:py-16 bg-[#FFFBF9]">
        <div className="max-w-[720px] mx-auto">
          <div className="bg-white rounded-[28px] border border-black/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8 lg:p-12 text-center">
            <div className="w-[88px] h-[88px] rounded-full bg-[#FFF0F5] flex items-center justify-center mx-auto mb-6">
              <div className="w-[56px] h-[56px] rounded-full bg-white shadow flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF2B6E" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M8 21H5a2 2 0 01-2-2v-3M16 21h3a2 2 0 002-2v-3" />
                  <path d="M9 12h6" strokeWidth="2" />
                </svg>
              </div>
            </div>
            <h3 className="font-black text-[26px] lg:text-[34px] tracking-[-0.02em]">Montre-moi ta main.</h3>
            <p className="text-[#8A8A8A] text-[15px] lg:text-[17px] leading-relaxed mt-3 max-w-[520px] mx-auto">
              Place ta main dans le cadre. L'IA va détecter, isoler et mesurer automatiquement chacun de tes ongles pour créer ton Nail Profile.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleScan}
                className="w-full bg-[#FF2B6E] hover:bg-[#E62662] text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition text-[16px]"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 00-2 2v9a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
                {scanDone ? 'Nail Profile créé ✓' : 'Commencer le scan'}
              </button>
              <p className="text-[11px] tracking-wide text-zinc-400">Aucune photo conservée sans ton accord • RGPD • Suppression en 1 clic</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
            {scanDone && (
              <div className="mt-6 p-4 rounded-2xl bg-[#FFF0F5] border border-[#FF2B6E]/15 text-left">
                <p className="font-semibold text-sm">✨ Ton Nail Profile est prêt !</p>
                <p className="text-xs text-zinc-600 mt-1">10 ongles mesurés • largeur moy. 12.4mm • longueur moy. 15.1mm</p>
                <div className="mt-3 flex gap-2">
                  <button className="flex-1 bg-black text-white text-xs font-semibold py-2.5 rounded-full">Explorer les designs</button>
                  <button className="flex-1 bg-white border border-black/10 text-xs font-semibold py-2.5 rounded-full" onClick={() => setScanDone(false)}>Re-scanner</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* scan modal */}
      {showScan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-8 w-full max-w-[360px] text-center">
            <div className="w-16 h-16 rounded-full border-4 border-[#FF2B6E]/20 border-t-[#FF2B6E] animate-spin mx-auto" />
            <p className="font-bold mt-5">Analyse en cours...</p>
            <p className="text-sm text-zinc-500 mt-1">Détection des 10 ongles • Mesure millimétrique</p>
            <div className="mt-4 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
              <div className="h-full bg-[#FF2B6E] animate-[progress_1.8s_ease-in-out]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom nav (mobile replica) */}
      <nav className="sticky bottom-0 z-30 bg-white border-t border-black/5 lg:hidden">
        <div className="flex justify-around py-2">
          {[
            { label: 'Accueil', active: true },
            { label: 'Créer', active: false },
            { label: 'Explorer', active: false },
            { label: 'Créations', active: false },
            { label: 'Profil', active: false },
          ].map((i) => (
            <button key={i.label} className={`flex flex-col items-center gap-1 py-1 px-3 ${i.active ? 'text-[#FF2B6E]' : 'text-zinc-400'}`}>
              <span className={`w-6 h-6 rounded-md flex items-center justify-center ${i.active ? 'bg-[#FFF0F5]' : ''}`}>
                {i.label === 'Accueil' && '⌂'}
                {i.label === 'Créer' && '◰'}
                {i.label === 'Explorer' && '◎'}
                {i.label === 'Créations' && '▭'}
                {i.label === 'Profil' && '○'}
              </span>
              <span className="text-[10px] font-medium">{i.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-[#0F0F0F] text-white px-5 lg:px-10 py-10">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between gap-8">
          <div>
            <div className="flex gap-2 font-black text-[18px]"><span>NAIL</span><span className="text-[#FF2B6E]">PROFILE</span></div>
            <p className="text-white/60 text-sm mt-2 max-w-[360px]">La première plateforme d'ongles sur mesure par IA. Scan → Profil → Design → Fabrication.</p>
          </div>
          <div className="flex gap-10 text-sm">
            <div className="space-y-2 text-white/70">
              <p className="font-semibold text-white">Produit</p>
              <p>Comment ça marche</p><p>Explorer</p><p>Tarifs</p>
            </div>
            <div className="space-y-2 text-white/70">
              <p className="font-semibold text-white">Légal</p>
              <p>Confidentialité</p><p>CGV</p><p>Contact</p>
            </div>
          </div>
        </div>
        <p className="max-w-[1440px] mx-auto text-white/40 text-xs mt-8 pt-6 border-t border-white/10">© 2026 Nail Profile — Fait avec amour pour les nail lovers. Tous droits réservés.</p>
      </footer>

      <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
    </div>
  )
}
