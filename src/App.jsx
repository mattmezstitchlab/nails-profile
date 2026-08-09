import { useState, useRef, useEffect } from 'react'

// ---------- MOCK DATA ----------
const FINGERS = ['Pouce','Index','Majeur','Annulaire','Auriculaire']
const HANDS = ['Gauche','Droite']
const SHAPES = ['Almond','Oval','Square','Coffin','Naturelle']
const STYLES = ['Minimal','French','Chrome','Luxury','Floral','Gothic','Kawaii','Y2K','Nature','Wedding','Art','Abstract']
const PALETTES = [
  { name: 'Sunset', colors: ['#FF2B6E','#FF8C42','#FFD23F','#0A2463'] },
  { name: 'Ocean', colors: ['#0A2463','#247BA0','#72DDF7','#F8F9FA'] },
  { name: 'Pearl', colors: ['#F8F6F3','#E8E0D8','#C9ADA7','#9A8C98'] },
  { name: 'Chrome Noir', colors: ['#0F0F0F','#484848','#A0A0A0','#FFFFFF'] },
]

function mockNails() {
  return Array.from({length:10}).map((_,i)=>{
    const finger = FINGERS[i%5]
    const hand = HANDS[Math.floor(i/5)]
    return {
      id: i,
      finger: `${finger} ${hand}`,
      short: finger,
      hand,
      width: (11.2 + Math.random()*4).toFixed(1),
      height: (13.5 + Math.random()*6).toFixed(1),
      shape: SHAPES[Math.floor(Math.random()*SHAPES.length)],
      confidence: 94 + Math.floor(Math.random()*5),
      orientation: ( -5 + Math.random()*10).toFixed(1)
    }
  })
}

const MARKET_ITEMS = [
  { id:1, name:'Sunset Ocean', creator:'@mika.nails', price:42, likes:1243, tries:892, img:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop', tag:'Tendance', colors:['#FF2B6E','#FF8C42','#0A2463'] },
  { id:2, name:'Wedding Pearl', creator:'@luna.studio', price:48, likes:982, tries:654, img:'https://images.unsplash.com/photo-1519017339289-e2035db53374?w=600&q=80&auto=format&fit=crop', tag:'Mariage', colors:['#F8F6F3','#E8E0D8','#C9ADA7'] },
  { id:3, name:'Chrome Noir', creator:'@noir.nails', price:39, likes:2103, tries:1204, img:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80&auto=format&fit=crop', tag:'Chrome', colors:['#0F0F0F','#A0A0A0','#FFFFFF'] },
  { id:4, name:'Kawaii Blush', creator:'@sugar.mae', price:35, likes:743, tries:421, img:'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80&auto=format&fit=crop', tag:'Kawaii', colors:['#FFB3CC','#FF8C42','#FFD23F'] },
  { id:5, name:'Gothic Veil', creator:'@velvet.goth', price:45, likes:654, tries:398, img:'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80&auto=format&fit=crop', tag:'Gothic', colors:['#1A1A1A','#6B0F1A','#D4A574'] },
  { id:6, name:'Minimal Line', creator:'@atelier.min', price:32, likes:543, tries:312, img:'https://images.unsplash.com/photo-1519017339289-e2035db53374?w=600&q=80&auto=format&fit=crop', tag:'Minimal', colors:['#FFFFFF','#0F0F0F','#E8E0D8'] },
]

function generateSet(prompt, palette, nails) {
  const base = palette?.colors || PALETTES[0].colors
  return nails.map((n,i)=>({
    id: i,
    nail: n,
    title: `Design ${String(i+1).padStart(2,'0')}`,
    colors: base,
    pattern: i%3===0 ? 'dégradé' : i%3===1 ? 'micro-motif' : 'uni texturé',
    fabricability: 88 + Math.floor(Math.random()*10),
    prompt: prompt || 'élégant, cohérent'
  }))
}

export default function App(){
  const [view, setView] = useState('home')
  const [scanMode, setScanMode] = useState('precision') // rapide | precision
  const [nailProfile, setNailProfile] = useState(null)
  const [scanned, setScanned] = useState(null) // for detection preview
  const [canvasMode, setCanvasMode] = useState('canvas') // main | canvas
  const [selectedNail, setSelectedNail] = useState(0)
  const [prompt, setPrompt] = useState('Je veux un design inspiré d’un coucher de soleil sur la mer, élégant, bleu nuit, corail et quelques détails dorés. Les cinq ongles doivent être différents mais appartenir au même univers.')
  const [selectedStyles, setSelectedStyles] = useState(['Minimal','Luxury'])
  const [selectedPalette, setSelectedPalette] = useState(PALETTES[0])
  const [inspiration, setInspiration] = useState(null)
  const [designSet, setDesignSet] = useState(null)
  const [activeProduct, setActiveProduct] = useState(null)
  const [fabricScore, setFabricScore] = useState(92)
  const [orders, setOrders] = useState([])
  const [creations, setCreations] = useState([
    { id:101, name:'Sunset Ocean', date:'9 août 2026', img: MARKET_ITEMS[0].img, sales: 12 },
    { id:102, name:'Wedding Pearl', date:'14 août 2026', img: MARKET_ITEMS[1].img, sales: 7 },
  ])
  const [publishMode, setPublishMode] = useState('privé')
  const [showAssistantTip, setShowAssistantTip] = useState(true)
  const fileRef = useRef(null)
  const inspRef = useRef(null)

  // simulate scanning
  const startScan = (mode) => {
    setScanMode(mode)
    setView('scan_camera')
  }
  const triggerCamera = () => fileRef.current?.click()
  const onPhoto = (e) => {
    const f = e.target.files?.[0]
    if(!f) return
    const url = URL.createObjectURL(f)
    setScanned(url)
    setView('scan_analysis')
    setTimeout(()=> setView('scan_detection'), 2200)
  }
  const validateDetection = () => {
    const nails = mockNails()
    setNailProfile({ id: Date.now(), nails, createdAt: new Date().toLocaleDateString('fr-FR'), hands: scanMode==='precision'? '2 mains':'1 main' })
    setView('profile')
  }

  const handleGenerate = () => {
    if(!nailProfile){ setView('scan_intro'); return }
    setView('generating')
    setTimeout(()=>{
      const set = generateSet(prompt, selectedPalette, nailProfile.nails)
      setDesignSet(set)
      setView('set')
    }, 2400)
  }

  const regenerateOne = (idx) => {
    if(!designSet) return
    const copy = [...designSet]
    copy[idx] = { ...copy[idx], colors: PALETTES[Math.floor(Math.random()*PALETTES.length)].colors, pattern: ['dégradé','micro-motif','uni'][Math.floor(Math.random()*3)] }
    setDesignSet(copy)
  }

  const doOrder = () => {
    const order = { id: Date.now(), set: designSet, total: 42, date: new Date().toLocaleDateString('fr-FR') }
    setOrders([order, ...orders])
    setView('orders')
  }

  const publishCreation = () => {
    if(!designSet) return
    const newC = { id: Date.now(), name: designSet[0]?.prompt.slice(0,18) || 'Nouvelle création', date: new Date().toLocaleDateString('fr-FR'), img: MARKET_ITEMS[0].img, sales:0, mode: publishMode }
    setCreations([newC, ...creations])
    setView('creations')
  }

  // ---------- UI HELPERS ----------
  const Nav = () => (
    <>
      {/* mobile bottom */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur border-t border-black/[0.06] lg:hidden">
        <div className="flex justify-around py-2 max-w-[480px] mx-auto">
          {[
            {k:'home', l:'Accueil', icon:'⌂'},
            {k:'studio', l:'Créer', icon:'✦'},
            {k:'market', l:'Explorer', icon:'◎'},
            {k:'creations', l:'Créations', icon:'▭'},
            {k:'profile_settings', l:'Profil', icon:'○'},
          ].map(t=>(
            <button key={t.k} onClick={()=> t.k==='studio' ? setView(nailProfile?'studio':'scan_intro') : setView(t.k==='profile_settings' ? (nailProfile?'profile':'profile_settings') : t.k)} className={`flex flex-col items-center gap-0.5 py-1 px-3 ${ (view===t.k || (t.k==='studio'&&['studio','set','editor','tryon','fabric','checkout'].includes(view))) ? 'text-[#FF2B6E]' : 'text-zinc-400'}`}>
              <span className={`w-7 h-7 grid place-items-center rounded-full text-[14px] ${(view===t.k)?'bg-[#FFF0F5]':''}`}>{t.icon}</span>
              <span className="text-[10px] font-medium tracking-wide">{t.l}</span>
            </button>
          ))}
        </div>
      </nav>
      {/* desktop sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-[220px] bg-white border-r border-black/[0.06] flex-col p-6 z-30">
        <div className="flex gap-1.5 font-black text-[16px] tracking-tight"><span>NAIL</span><span className="text-[#FF2B6E]">PROFILE</span></div>
        <p className="text-[11px] tracking-[0.18em] text-zinc-400 font-semibold mt-1">PAR IA • SUR MESURE</p>
        <div className="mt-10 space-y-1 text-sm">
          {[
            {k:'home', l:'Accueil'},
            {k:'profile', l:'Mon Nail Profile', need:true},
            {k:'canvas', l:'Canevas', need:true},
            {k:'studio', l:'Créer'},
            {k:'market', l:'Explorer'},
            {k:'creations', l:'Mes créations'},
            {k:'orders', l:'Commandes'},
          ].map(i=>(
            <button key={i.k} onClick={()=> setView(i.k)} className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between ${view===i.k?'bg-black text-white':'hover:bg-zinc-50 text-zinc-700'}`}>
              <span className="font-medium">{i.l}</span>{i.need && !nailProfile && <span className="text-[10px] bg-[#FF2B6E] text-white px-2 py-0.5 rounded-full">•</span>}
            </button>
          ))}
        </div>
        <div className="mt-auto p-4 rounded-2xl bg-[#FFF0F5] border border-[#FF2B6E]/10">
          <p className="text-xs font-semibold">Besoin d'aide ?</p>
          <p className="text-xs text-zinc-600 mt-1">L'IA peut analyser ton inspiration et proposer une palette.</p>
        </div>
      </aside>
    </>
  )

  const Header = ({transparent=false}) => (
    <header className={`sticky top-0 z-20 ${transparent?'bg-transparent':'bg-[#FFFBF9]/80 backdrop-blur border-b border-black/[0.04]'} `}>
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-5 lg:px-8 py-4 lg:ml-[220px]">
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight text-[18px] ${transparent?'text-white':'text-black'}`}>NAIL</span>
          <span className="font-black tracking-tight text-[18px] text-[#FF2B6E]">PROFILE</span>
          <span className="hidden sm:inline text-[10px] tracking-[0.2em] font-semibold text-zinc-400 ml-2">— PREMIUM BEAUTY TECH</span>
        </div>
        <div className="flex items-center gap-2">
          {nailProfile && <span className="hidden sm:inline-flex items-center gap-2 bg-white border border-black/5 rounded-full px-3 py-1.5 text-xs font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500"/> Profil prêt • {nailProfile.nails.length} ongles</span>}
          <button onClick={()=> setView(nailProfile? 'studio':'scan_intro')} className="bg-[#FF2B6E] text-white text-xs lg:text-sm font-semibold px-4 lg:px-5 py-2.5 rounded-full hover:bg-[#E62662] transition">Créer mon Nail Profile</button>
        </div>
      </div>
    </header>
  )

  // ---------- VIEWS ----------
  const HomeView = () => (
    <div>
      {/* HERO */}
      <section className="relative min-h-[86vh] lg:min-h-[88vh] flex flex-col bg-[#0a0a0a] overflow-hidden lg:ml-[220px]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1600&auto=format&fit=crop&q=80" alt="hero" className="w-full h-full object-cover object-[center_22%] opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/65" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 to-transparent" />
        </div>
        <div className="relative z-10 flex-1 flex flex-col justify-end px-5 lg:px-12 pb-10 lg:pb-14 max-w-[1440px] w-full mx-auto">
          <p className="text-white/70 text-[10px] lg:text-[11px] tracking-[0.24em] font-semibold mb-4">NAIL PROFILE — LA PREMIÈRE PLATEFORME D'ONGLES SUR MESURE PAR IA</p>
          <h1 className="font-black tracking-[-0.04em] leading-[0.88] text-white text-[40px] sm:text-[56px] lg:text-[78px] max-w-[720px]">
            Tes ongles<br/>deviennent<br/><span className="text-[#FFB3CC]">ton canevas.</span>
          </h1>
          <p className="text-white/80 text-[15px] lg:text-[17px] leading-relaxed mt-5 max-w-[560px]">Scanne tes mains, imagine ton design, nous l'adaptons à tes ongles. Précision millimétrique. Rendu Apple-like.</p>
          <div className="flex flex-col sm:flex-row gap-3 mt-7">
            <button onClick={()=> setView('scan_intro')} className="bg-[#FF2B6E] hover:bg-[#E62662] text-white font-semibold px-7 py-4 rounded-full text-[15px] w-full sm:w-auto">Créer mon Nail Profile →</button>
            <button onClick={()=> setView('market')} className="bg-white/10 backdrop-blur border border-white/20 text-white font-medium px-7 py-4 rounded-full text-[15px] hover:bg-white/15 transition w-full sm:w-auto">Explorer les créations</button>
          </div>
          <div className="mt-8 flex items-center gap-4 text-white/60 text-xs">
            <span className="flex items-center gap-2"><span className="w-8 h-[1px] bg-white/30"/>+12 483 profils créés</span>
            <span className="hidden sm:inline">• Livraison 48h • Fabrication France</span>
          </div>
        </div>
      </section>

      {/* Concept + 3 pillars + process (kept from previous but concise) */}
      <div className="lg:ml-[220px]">
        <section className="px-5 lg:px-12 py-12 lg:py-16 max-w-[1440px] mx-auto">
          <p className="text-[#FF2B6E] text-[12px] tracking-[0.32em] font-bold">CONCEPT</p>
          <div className="grid lg:grid-cols-2 gap-8 mt-3">
            <h2 className="font-black tracking-[-0.04em] leading-[0.95] text-[30px] lg:text-[52px]">Un ongle n'est pas un écran.<br/>C'est une forme.</h2>
            <p className="text-zinc-500 text-[15px] lg:text-[17px] leading-relaxed lg:pt-3">Nous ne générons pas une image. Nous créons un modèle numérique de tes vrais ongles, puis chaque design y est dessiné. Paramétrique. Fabricable. À toi.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              {k:'TES MAINS', t:'Scannées, pas devinées.', d:'10 ongles détectés, mesurés en mm, profil permanent.'},
              {k:'TON DESIGN', t:'Composé pour toi.', d:'Doigt par doigt, cohérence artistique + gabarits réels.'},
              {k:'TON FORMAT', t:'Adapté à tous.', d:'1 création → 10 versions selon ton profil.'},
            ].map(c=>(
              <div key={c.k} className="bg-white rounded-[20px] border border-black/[0.06] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <p className="text-[#FF2B6E] text-[10px] tracking-[0.28em] font-bold">{c.k}</p>
                <h3 className="font-bold text-[16px] mt-2">{c.t}</h3>
                <p className="text-zinc-500 text-[13px] mt-2 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 lg:px-12 pb-12 max-w-[1440px] mx-auto">
          <div className="bg-white rounded-[28px] border border-black/[0.06] p-6 lg:p-10 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="text-[#FF2B6E] text-[11px] tracking-[0.28em] font-bold">SCAN → MESURE → PROFILE → DESIGN → TRY-ON → FABRICATION</p>
              <h3 className="font-bold text-[22px] lg:text-[28px] leading-tight mt-2">UNE ACTION → UNE COMPRÉHENSION → UNE PROPOSITION.</h3>
              <p className="text-zinc-500 text-sm mt-3 leading-relaxed">Expérience visuelle, magique, zéro jargon. Tu montres tes mains, tu racontes ton envie, l'IA s'occupe du reste.</p>
              <button onClick={()=> setView('scan_intro')} className="mt-6 bg-black text-white px-6 py-3 rounded-full text-sm font-semibold">Commencer le scan</button>
            </div>
            <div className="flex-1 w-full bg-[#FFFBF9] rounded-[20px] p-4 border border-black/5">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-100 to-zinc-200 grid place-items-center text-zinc-400 text-xs">Aperçu main → 10 formes → designs</div>
              <div className="grid grid-cols-5 gap-2 mt-3">
                {Array.from({length:5}).map((_,i)=><div key={i} className="aspect-[3/4] rounded-xl bg-white border border-black/5 shadow-sm grid place-items-center text-[10px] text-zinc-500">{['Pouce','Index','Majeur','Annulaire','Auri'][i]}</div>)}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )

  const ScanIntro = () => (
    <div className="lg:ml-[220px] min-h-[70vh] flex flex-col">
      <Header/>
      <div className="px-5 lg:px-12 py-8 lg:py-12 max-w-[900px] mx-auto w-full flex-1">
        <button onClick={()=> setView('home')} className="text-sm text-zinc-500">← Retour</button>
        <p className="text-[#FF2B6E] text-[11px] tracking-[0.32em] font-bold mt-6">FLOW 01 — SCAN DES MAINS</p>
        <h2 className="font-black text-[32px] lg:text-[44px] tracking-[-0.03em] leading-[0.95] mt-2">Montre-moi ta main.</h2>
        <p className="text-zinc-500 mt-3">Place ta main dans le cadre. Choisis ton mode.</p>

        <div className="grid md:grid-cols-2 gap-4 mt-8">
          {[
            {id:'rapide', title:'Mode Rapide', desc:'Une seule main. 10 secondes. Idéal pour découvrir.', badge:'Recommandé pour commencer'},
            {id:'precision', title:'Mode Précision', desc:'Deux mains. Mesure des 10 ongles. Plus précis.', badge:'Le plus précis • Recommandé'},
          ].map(m=>(
            <button key={m.id} onClick={()=> setScanMode(m.id)} className={`text-left p-6 rounded-[20px] border-2 ${scanMode===m.id?'border-[#FF2B6E] bg-[#FFF0F5]':'border-black/5 bg-white'} transition`}>
              <p className="font-bold">{m.title}</p>
              <p className="text-sm text-zinc-500 mt-1">{m.desc}</p>
              <p className={`text-[11px] font-semibold mt-3 inline-flex px-2.5 py-1 rounded-full ${scanMode===m.id?'bg-[#FF2B6E] text-white':'bg-zinc-100 text-zinc-600'}`}>{m.badge}</p>
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[24px] border border-black/5 p-6 lg:p-8 mt-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
          <div className="aspect-[4/3] lg:aspect-[16/9] rounded-2xl border-2 border-dashed border-zinc-200 bg-[#FFFBF9] grid place-items-center relative overflow-hidden">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-white shadow grid place-items-center mx-auto">
                <span className="text-[#FF2B6E] text-2xl">◰</span>
              </div>
              <p className="text-sm font-medium mt-3">Place ta main dans le cadre</p>
              <p className="text-xs text-zinc-500">Paume ouverte, doigts légèrement écartés</p>
            </div>
            <div className="absolute inset-6 border border-[#FF2B6E]/20 rounded-[20px] pointer-events-none" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button onClick={triggerCamera} className="bg-[#FF2B6E] text-white font-semibold py-3.5 rounded-full">Prendre une photo</button>
            <button onClick={triggerCamera} className="bg-white border border-black/10 font-semibold py-3.5 rounded-full">Importer une photo</button>
          </div>
          <p className="text-[11px] text-zinc-400 text-center mt-3">Aucune photo conservée sans ton accord • RGPD</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={onPhoto} />
        <div className="flex gap-3 mt-6">
          <button onClick={()=> startScan(scanMode)} className="flex-1 bg-black text-white font-semibold py-3 rounded-full">Continuer en {scanMode}</button>
        </div>
      </div>
    </div>
  )

  const ScanCamera = () => (
    <div className="lg:ml-[220px] min-h-screen flex flex-col bg-black">
      <div className="flex items-center justify-between p-5 text-white">
        <button onClick={()=> setView('scan_intro')} className="text-sm">✕ Fermer</button>
        <span className="text-xs tracking-widest font-semibold">CAMÉRA • {scanMode.toUpperCase()}</span>
        <span className="text-xs opacity-60">1/2</span>
      </div>
      <div className="flex-1 relative grid place-items-center p-6">
        <div className="w-full max-w-[420px] aspect-[3/4] rounded-[28px] border-2 border-white/20 overflow-hidden relative bg-zinc-900">
          <img src={scanned || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&auto=format&fit=crop"} alt="cam" className="w-full h-full object-cover opacity-80" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="w-[78%] h-[68%] border-2 border-white/60 rounded-[28px] relative">
              <span className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-white rounded-tl-xl"/>
              <span className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-white rounded-tr-xl"/>
              <span className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-white rounded-bl-xl"/>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-white rounded-br-xl"/>
              <p className="absolute bottom-3 inset-x-0 text-center text-white text-xs font-medium">Place ta main ici</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6 flex flex-col items-center gap-4">
        <button onClick={triggerCamera} className="w-full max-w-[420px] bg-[#FF2B6E] text-white font-semibold py-4 rounded-full">Capturer</button>
        <button onClick={triggerCamera} className="text-white/60 text-xs">Importer depuis la galerie</button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhoto} />
      </div>
    </div>
  )

  const ScanAnalysis = () => (
    <div className="lg:ml-[220px] min-h-[70vh] grid place-items-center px-5 py-12">
      <div className="bg-white rounded-[28px] border border-black/5 p-8 lg:p-10 w-full max-w-[420px] text-center shadow-xl">
        <div className="w-20 h-20 rounded-full border-4 border-[#FF2B6E]/20 border-t-[#FF2B6E] animate-spin mx-auto" />
        <h3 className="font-bold text-lg mt-6">J'observe tes ongles…</h3>
        <p className="text-sm text-zinc-500 mt-1">L'IA isole chaque ongle • mesure millimétrique</p>
        <div className="mt-6 h-1.5 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-[#FF2B6E] animate-[progress_2.2s_ease-in-out] w-full"/></div>
        <p className="text-[11px] text-zinc-400 mt-3">Analyse sur l'appareil • aucune donnée envoyée</p>
      </div>
      <style>{`@keyframes progress{from{width:0%}to{width:100%}}`}</style>
    </div>
  )

  const ScanDetection = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[1100px] mx-auto">
        <p className="text-[#FF2B6E] text-[11px] tracking-[0.28em] font-bold">EXTRACTION • 5 ONGLES DÉTECTÉS</p>
        <h2 className="font-black text-[26px] lg:text-[32px] tracking-[-0.02em] mt-1">J'ai trouvé 5 ongles. <span className="text-zinc-400 font-medium text-[14px]">Confiance 98%</span></h2>
        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 mt-6">
          <div className="bg-white rounded-[24px] border border-black/5 p-4 shadow-sm">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 relative">
              {scanned && <img src={scanned} alt="scan" className="w-full h-full object-cover opacity-90" />}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                {[80,140,200,260,320].map((x,i)=>(
                  <g key={i}>
                    <ellipse cx={x} cy={120+i%2*30} rx={18} ry={26} fill="none" stroke="#FF2B6E" strokeWidth="2" strokeDasharray="6 4"/>
                    <text x={x} y={170+i%2*30} textAnchor="middle" fill="white" fontSize="9" fontWeight="700">{FINGERS[i]}</text>
                  </g>
                ))}
              </svg>
              <span className="absolute top-3 left-3 bg-[#FF2B6E] text-white text-[11px] font-bold px-3 py-1 rounded-full">98% • 5/5</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={()=> setView('scan_correction')} className="flex-1 bg-white border border-black/10 font-semibold py-3 rounded-full text-sm">Corriger un contour</button>
              <button onClick={validateDetection} className="flex-1 bg-[#FF2B6E] text-white font-semibold py-3 rounded-full text-sm">Valider ✓</button>
            </div>
          </div>
          <div className="bg-[#FFFBF9] rounded-[24px] border border-black/5 p-6">
            <h4 className="font-bold">Canevas • 5 ongles isolés</h4>
            <p className="text-xs text-zinc-500 mt-1">Chaque ongle devient un objet indépendant.</p>
            <div className="grid grid-cols-5 gap-2 mt-4">
              {FINGERS.map(f=>(
                <div key={f} className="bg-white rounded-xl border border-black/5 p-2 text-center">
                  <div className="aspect-[3/4] rounded-lg bg-gradient-to-b from-zinc-50 to-zinc-100 border border-black/5 grid place-items-center">
                    <div className="w-8 h-10 rounded-[8px] border-2 border-[#FF2B6E]/30 bg-white/60"/>
                  </div>
                  <p className="text-[10px] font-semibold mt-1">{f}</p>
                  <p className="text-[10px] text-emerald-600">98%</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl bg-white border border-black/5 text-xs text-zinc-600">
              💡 Tu peux déplacer un point, ajuster le contour, valider ou recommencer.
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const ScanCorrection = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[1100px] mx-auto">
        <h2 className="font-bold text-xl">Corriger un contour</h2>
        <p className="text-sm text-zinc-500">Glisse les points pour ajuster. Valide quand c'est parfait.</p>
        <div className="mt-6 bg-white rounded-[24px] border border-black/5 p-6 flex flex-col lg:flex-row gap-6">
          <div className="flex-1 aspect-[3/4] rounded-2xl bg-[#FFFBF9] border border-black/5 grid place-items-center relative">
            <div className="w-32 h-44 rounded-[18px] border-2 border-[#FF2B6E] bg-white relative">
              {[0,1,2,3,4,5,6,7].map(i=>(
                <span key={i} className="absolute w-3 h-3 bg-[#FF2B6E] rounded-full border-2 border-white shadow" style={{left: `${10 + (i%4)*25}%`, top: `${8 + Math.floor(i/4)*70}%`}}/>
              ))}
            </div>
            <p className="absolute bottom-3 text-xs text-zinc-500">Index • 12.8 × 16.4 mm</p>
          </div>
          <div className="flex-1 space-y-3">
            {['Déplacer un point','Ajuster la courbure','Valider','Recommencer'].map(a=>(
              <button key={a} onClick={()=> a==='Valider' && setView('scan_detection')} className={`w-full text-left px-4 py-3 rounded-xl border ${a==='Valider'?'bg-black text-white border-black':'bg-white border-black/10'}`}>{a}</button>
            ))}
            <button onClick={()=> setView('scan_detection')} className="w-full bg-[#FF2B6E] text-white font-semibold py-3 rounded-full mt-2">Terminer la correction</button>
          </div>
        </div>
      </div>
    </div>
  )

  const ProfileView = () => {
    if(!nailProfile) return <div className="lg:ml-[220px] p-12 text-center">Aucun profil. <button onClick={()=> setView('scan_intro')} className="text-[#FF2B6E] font-semibold">Scanner</button></div>
    return (
      <div className="lg:ml-[220px]">
        <Header/>
        <div className="px-5 lg:px-12 py-6 max-w-[1100px] mx-auto">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[#FF2B6E] text-[11px] tracking-[0.32em] font-bold">MON NAIL PROFILE</p>
              <h2 className="font-black text-[28px] lg:text-[36px] tracking-[-0.02em]">Ton profil est prêt.</h2>
              <p className="text-zinc-500 text-sm mt-1">À partir de maintenant, chaque création peut être adaptée à tes ongles. • {nailProfile.hands} • {nailProfile.createdAt}</p>
            </div>
            <button onClick={()=> setView('canvas')} className="hidden lg:inline-flex bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold">Voir le canevas →</button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mt-6">
            {nailProfile.nails.map(n=>(
              <div key={n.id} className="bg-white rounded-[18px] border border-black/[0.06] p-3 lg:p-4">
                <div className="aspect-[3/4] rounded-xl bg-gradient-to-b from-zinc-50 to-white border border-black/5 grid place-items-center relative">
                  <div className="w-[52%] h-[68%] rounded-[12px] border border-black/10 bg-white shadow-sm"/>
                  <span className="absolute top-2 right-2 text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-full font-semibold">{n.confidence}%</span>
                </div>
                <p className="font-bold text-xs mt-2">{n.finger}</p>
                <p className="text-[11px] text-zinc-500">{n.width} × {n.height} mm</p>
                <p className="text-[11px] font-medium">{n.shape} • {n.orientation}°</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-[#FFF0F5] rounded-2xl p-5 border border-[#FF2B6E]/10">
              <p className="font-semibold text-sm">Gabarits enregistrés</p>
              <p className="text-2xl font-black mt-1">10</p>
              <p className="text-xs text-zinc-500">Précision 0.1mm • Orientation incluse</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-black/5">
              <p className="font-semibold text-sm">Prochaine étape</p>
              <p className="text-sm text-zinc-600 mt-1">Crée ton premier set IA adapté à ton profil.</p>
              <button onClick={()=> setView('studio')} className="mt-3 bg-[#FF2B6E] text-white text-xs font-semibold px-4 py-2 rounded-full">Ouvrir le studio →</button>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-black/5">
              <p className="font-semibold text-sm">Ton profil est permanent</p>
              <p className="text-xs text-zinc-500 mt-1">Il s'appliquera automatiquement à toutes tes futures créations et aux designs du marketplace.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const CanvasView = () => {
    if(!nailProfile) return <div className="lg:ml-[220px] p-12 text-center">Crée d'abord ton profil.</div>
    return (
      <div className="lg:ml-[220px]">
        <Header/>
        <div className="px-5 lg:px-12 py-6 max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#FF2B6E] text-[11px] tracking-[0.28em] font-bold">NAIL CANVAS</p>
              <h2 className="font-black text-2xl tracking-[-0.02em]">Canevas central</h2>
            </div>
            <div className="flex bg-zinc-100 rounded-full p-1">
              {['main','canvas'].map(m=>(
                <button key={m} onClick={()=> setCanvasMode(m)} className={`px-4 py-1.5 rounded-full text-xs font-semibold ${canvasMode===m?'bg-white shadow text-black':'text-zinc-500'}`}>{m==='main'?'Main':'Canevas'}</button>
              ))}
            </div>
          </div>

          {canvasMode==='canvas' ? (
            <div className="mt-6 bg-white rounded-[24px] border border-black/5 p-4 lg:p-6">
              <div className="grid grid-cols-5 lg:grid-cols-10 gap-3">
                {nailProfile.nails.map((n,idx)=>(
                  <button key={n.id} onClick={()=> setSelectedNail(idx)} className={`rounded-2xl border-2 p-2 ${selectedNail===idx?'border-[#FF2B6E] bg-[#FFF0F5]':'border-black/5 bg-[#FFFBF9]'}`}>
                    <div className="aspect-[3/4] rounded-xl bg-white border border-black/5 grid place-items-center">
                      <div className="w-[56%] h-[62%] rounded-[10px] bg-gradient-to-br from-zinc-100 to-white border border-black/10"/>
                    </div>
                    <p className="text-[10px] font-bold mt-1 truncate">{n.short}</p>
                    <p className="text-[10px] text-zinc-500">{n.width}mm</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
                <div className="bg-[#FFFBF9] rounded-2xl p-6 border border-black/5 flex gap-6 items-center">
                  <div className="w-24 h-32 rounded-[14px] bg-white border border-black/10 shadow-sm grid place-items-center">
                    <div className="w-14 h-20 rounded-[10px] bg-gradient-to-br from-[#FF2B6E]/15 to-[#FF8C42]/15 border border-[#FF2B6E]/20"/>
                  </div>
                  <div>
                    <p className="font-bold">{nailProfile.nails[selectedNail].finger} • Sélectionné</p>
                    <p className="text-sm text-zinc-500 mt-1">{nailProfile.nails[selectedNail].width} × {nailProfile.nails[selectedNail].height} mm • {nailProfile.nails[selectedNail].shape}</p>
                    <div className="flex gap-2 mt-3">
                      <button className="text-xs bg-black text-white px-3 py-1.5 rounded-full">Zoomer</button>
                      <button className="text-xs bg-white border border-black/10 px-3 py-1.5 rounded-full">Masquer</button>
                      <button onClick={()=> setView('studio')} className="text-xs bg-[#FF2B6E] text-white px-3 py-1.5 rounded-full">Designer</button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="font-semibold">Actions</p>
                  <button className="w-full text-left px-4 py-2.5 rounded-xl bg-white border border-black/5">Comparer les deux mains</button>
                  <button className="w-full text-left px-4 py-2.5 rounded-xl bg-white border border-black/5">Changer le design</button>
                  <button onClick={()=> setView('studio')} className="w-full bg-[#FF2B6E] text-white font-semibold py-2.5 rounded-full mt-2">Créer un set IA →</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 bg-gradient-to-br from-[#FFF0F5] to-[#FFFBF9] rounded-[24px] border border-black/5 p-8 grid place-items-center aspect-[4/3] lg:aspect-[16/9]">
              <div className="text-center">
                <p className="font-bold">Rendu réaliste des deux mains</p>
                <p className="text-sm text-zinc-500">Try-on • avant/après • lumière</p>
                <div className="mt-6 flex justify-center gap-3">
                  <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80&auto=format&fit=crop" alt="hands" className="w-64 h-40 object-cover rounded-2xl shadow" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const StudioView = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[1100px] mx-auto">
        <p className="text-[#FF2B6E] text-[11px] tracking-[0.32em] font-bold">AI DESIGN STUDIO</p>
        <h2 className="font-black text-[28px] lg:text-[36px] tracking-[-0.02em]">Imagine ton set.</h2>
        <p className="text-zinc-500 text-sm mt-1">Un prompt naturel suffit. L'IA comprend ton intention artistique et adapte chaque ongle à ton gabarit.</p>

        {showAssistantTip && (
          <div className="mt-4 bg-[#FFF0F5] border border-[#FF2B6E]/10 rounded-2xl p-4 flex gap-3">
            <span className="w-8 h-8 rounded-full bg-white grid place-items-center flex-shrink-0">✦</span>
            <div className="flex-1">
              <p className="text-xs font-semibold">Assistant IA</p>
              <p className="text-xs text-zinc-600">Ton inspiration utilise principalement trois couleurs. Je peux créer une version plus minimaliste ou appliquer le même langage visuel aux 10 ongles.</p>
            </div>
            <button onClick={()=> setShowAssistantTip(false)} className="text-xs text-zinc-400">✕</button>
          </div>
        )}

        <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6 mt-6">
          <div className="bg-white rounded-[24px] border border-black/5 p-5 lg:p-6 shadow-sm">
            <textarea value={prompt} onChange={e=> setPrompt(e.target.value)} rows={4} className="w-full p-4 rounded-2xl bg-[#FFFBF9] border border-black/5 text-sm leading-relaxed focus:outline-none focus:border-[#FF2B6E]/30" placeholder="Décris ton envie..." />
            <div className="flex flex-wrap gap-2 mt-4">
              {STYLES.map(s=>(
                <button key={s} onClick={()=> setSelectedStyles(p=> p.includes(s)? p.filter(x=>x!==s) : [...p,s])} className={`px-3 py-1.5 rounded-full text-xs font-medium border ${selectedStyles.includes(s)?'bg-black text-white border-black':'bg-white border-black/10 text-zinc-600'}`}>{s}</button>
              ))}
            </div>

            <div className="grid grid-cols-4 gap-2 mt-5">
              {PALETTES.map(p=>(
                <button key={p.name} onClick={()=> setSelectedPalette(p)} className={`p-2 rounded-2xl border-2 ${selectedPalette.name===p.name?'border-[#FF2B6E]':'border-black/5'} bg-white`}>
                  <div className="flex gap-1">
                    {p.colors.map(c=> <span key={c} className="flex-1 h-6 rounded-full" style={{background:c}}/>)}
                  </div>
                  <p className="text-[11px] font-semibold mt-1">{p.name}</p>
                </button>
              ))}
            </div>

            <div className="mt-5 flex gap-3">
              <button onClick={()=> inspRef.current?.click()} className="flex-1 bg-white border border-black/10 font-medium py-3 rounded-full text-sm">Importer inspiration</button>
              <button onClick={handleGenerate} className="flex-1 bg-[#FF2B6E] text-white font-semibold py-3 rounded-full text-sm">Créer mon design →</button>
            </div>
            <input ref={inspRef} type="file" accept="image/*" className="hidden" onChange={e=>{ const f=e.target.files?.[0]; if(f) setInspiration(URL.createObjectURL(f)) }} />
            {inspiration && <img src={inspiration} alt="insp" className="mt-4 w-full h-36 object-cover rounded-2xl border border-black/5" />}
            <p className="text-[11px] text-zinc-400 mt-3">L'IA analyse couleurs, textures, formes, ambiance puis propose : “Créer un set inspiré de cette image.”</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-[24px] border border-black/5 p-5">
              <p className="font-semibold text-sm">Design paramétrique</p>
              <p className="text-xs text-zinc-500 mt-1">DESIGN ORIGINAL → MON GABARIT → DESIGN ADAPTÉ</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#FF2B6E] to-[#FF8C42]"/>
                <span className="text-zinc-300">→</span>
                <span className="w-12 h-12 rounded-xl border border-black/10 bg-white grid place-items-center text-[10px]">10<br/>mm</span>
                <span className="text-zinc-300">→</span>
                <span className="flex-1 h-12 rounded-xl bg-gradient-to-r from-[#FF2B6E] to-[#FF8C42] opacity-80"/>
              </div>
              <p className="text-xs text-emerald-600 mt-2">✓ Ce design a été adapté à ton Nail Profile.</p>
            </div>
            <div className="bg-black text-white rounded-[24px] p-5">
              <p className="font-semibold text-sm">Besoin d'une idée ?</p>
              <p className="text-xs text-white/70 mt-1">“Minimal line art, french revisitée, chrome futuriste…”</p>
              <button onClick={()=> setPrompt('Minimal line art, french revisitée avec micro-perles, très élégant, adapté à un mariage d’été.')} className="mt-3 bg-white text-black text-xs font-semibold px-4 py-2 rounded-full">Utiliser cet exemple</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const GeneratingView = () => (
    <div className="lg:ml-[220px] min-h-[70vh] grid place-items-center px-5 py-12">
      <div className="bg-white rounded-[28px] border border-black/5 p-8 w-full max-w-[520px] text-center shadow-xl">
        <div className="w-20 h-20 rounded-full border-4 border-[#FF2B6E]/20 border-t-[#FF2B6E] animate-spin mx-auto"/>
        <h3 className="font-bold text-lg mt-6">Je compose ton set…</h3>
        <p className="text-sm text-zinc-500 mt-1">Génération doigt par doigt • cohérence artistique préservée</p>
        <div className="grid grid-cols-5 gap-2 mt-6">
          {Array.from({length:10}).map((_,i)=><div key={i} className="aspect-[3/4] rounded-xl bg-[#FFFBF9] border border-black/5 animate-pulse" style={{animationDelay:`${i*0.1}s`}}/>)}
        </div>
        <p className="text-[11px] text-zinc-400 mt-4">Chaque design est adapté à ton gabarit réel.</p>
      </div>
    </div>
  )

  const SetView = () => {
    if(!designSet) return null
    return (
      <div className="lg:ml-[220px]">
        <Header/>
        <div className="px-5 lg:px-12 py-6 max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#FF2B6E] text-[11px] tracking-[0.28em] font-bold">SET GÉNÉRÉ • 10 DESIGNS</p>
              <h2 className="font-black text-2xl">Sunset Ocean — adapté à ton profil</h2>
              <p className="text-xs text-zinc-500">Cohérence globale • 10 variantes paramétriques</p>
            </div>
            <button onClick={()=> setView('tryon')} className="hidden lg:inline-flex bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold">Voir sur mes mains →</button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
            {designSet.map((d,idx)=>(
              <div key={d.id} className="bg-white rounded-[18px] border border-black/5 p-3">
                <div className="aspect-[3/4] rounded-xl overflow-hidden relative border border-black/5" style={{background: `linear-gradient(135deg, ${d.colors[0]}, ${d.colors[1]})`}}>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="w-12 h-16 rounded-[10px] bg-white/90 backdrop-blur border border-white shadow-sm grid place-items-center text-[10px] font-bold">{d.pattern}</span>
                  </div>
                  <span className="absolute top-2 left-2 bg-white/90 backdrop-blur text-[10px] font-bold px-2 py-0.5 rounded-full">{d.nail.short}</span>
                </div>
                <p className="font-semibold text-xs mt-2">{d.title}</p>
                <p className="text-[11px] text-zinc-500">{d.nail.width}×{d.nail.height}mm • {d.nail.shape}</p>
                <button onClick={()=> regenerateOne(idx)} className="mt-2 w-full bg-[#FFFBF9] border border-black/5 text-xs font-medium py-1.5 rounded-full">Régénérer cet ongle ↻</button>
              </div>
            ))}
          </div>

          <div className="flex flex-col lg:flex-row gap-3 mt-6">
            <button onClick={()=> setView('studio')} className="flex-1 bg-white border border-black/10 font-semibold py-3 rounded-full">Modifier le set</button>
            <button onClick={()=> setView('fabric')} className="flex-1 bg-[#FF2B6E] text-white font-semibold py-3 rounded-full">Vérifier la fabricabilité →</button>
          </div>
        </div>
      </div>
    )
  }

  const TryOnView = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[1100px] mx-auto">
        <h2 className="font-black text-2xl">Voir sur mes mains</h2>
        <p className="text-sm text-zinc-500">Rendu réaliste • avant/après • zoom • lumière</p>
        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-[24px] border border-black/5 p-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-900 relative">
              <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80&auto=format&fit=crop" className="w-full h-full object-cover" alt="tryon"/>
              <div className="absolute inset-0 flex gap-2 p-4 items-end justify-center">
                {designSet?.slice(0,5).map(d=>(
                  <span key={d.id} className="w-10 h-14 rounded-[10px] shadow-lg border-2 border-white" style={{background: `linear-gradient(135deg, ${d.colors[0]}, ${d.colors[1]})`}}/>
                ))}
              </div>
              <span className="absolute top-3 left-3 bg-white text-xs font-bold px-3 py-1 rounded-full">TRY-ON IA</span>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-zinc-100 font-medium py-2 rounded-full text-xs">Avant / Après</button>
              <button className="flex-1 bg-zinc-100 font-medium py-2 rounded-full text-xs">Zoom</button>
              <button className="flex-1 bg-zinc-100 font-medium py-2 rounded-full text-xs">Lumière</button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="font-semibold">Ajuster un ongle</p>
              <p className="text-xs text-zinc-500">Sélectionne un ongle pour le modifier sans toucher aux 9 autres.</p>
              <div className="grid grid-cols-5 gap-2 mt-3">
                {designSet?.slice(0,5).map((d,i)=><button key={d.id} className="aspect-[3/4] rounded-xl border border-black/5" style={{background: `linear-gradient(135deg, ${d.colors[0]}, ${d.colors[1]})`}} onClick={()=> regenerateOne(i)}/>)}
              </div>
            </div>
            <button onClick={()=> setView('fabric')} className="w-full bg-black text-white font-semibold py-3 rounded-full">Vérifier la fabrication →</button>
            <button onClick={()=> setView('set')} className="w-full bg-white border border-black/10 font-semibold py-3 rounded-full">Retour au set</button>
          </div>
        </div>
      </div>
    </div>
  )

  const FabricView = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[800px] mx-auto">
        <p className="text-[#FF2B6E] text-[11px] tracking-[0.28em] font-bold">VÉRIFICATION DE FABRICATION</p>
        <h2 className="font-black text-[28px] tracking-[-0.02em]">Fabricabilité {fabricScore}%</h2>
        <div className="mt-4 h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500" style={{width: `${fabricScore}%`}}/></div>

        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {[
            {k:'Couleurs compatibles', ok:true},
            {k:'Dimensions compatibles', ok:true},
            {k:'Motifs suffisamment détaillés', ok: fabricScore>90},
            {k:'Gabarits corrects', ok:true},
          ].map(i=>(
            <div key={i.k} className={`p-4 rounded-2xl border flex items-center gap-3 ${i.ok?'bg-emerald-50 border-emerald-200':'bg-amber-50 border-amber-200'}`}>
              <span className={`w-6 h-6 rounded-full grid place-items-center text-white text-xs ${i.ok?'bg-emerald-500':'bg-amber-500'}`}>{i.ok?'✓':'!'}</span>
              <span className="text-sm font-medium">{i.k}</span>
            </div>
          ))}
        </div>

        {fabricScore<92 && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <p className="text-sm font-semibold">Le motif de ton auriculaire contient trop de détails pour une reproduction parfaite.</p>
            <button onClick={()=> setFabricScore(96)} className="mt-3 bg-black text-white text-xs font-semibold px-4 py-2 rounded-full">Optimiser automatiquement</button>
          </div>
        )}
        {fabricScore>=92 && <p className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm">✨ Parfait — ton set est prêt à être fabriqué avec une précision premium.</p>}

        <div className="flex gap-3 mt-6">
          <button onClick={()=> setView('tryon')} className="flex-1 bg-white border border-black/10 font-semibold py-3 rounded-full">Retour</button>
          <button onClick={()=> setView('checkout')} className="flex-1 bg-[#FF2B6E] text-white font-semibold py-3 rounded-full">Continuer →</button>
        </div>
      </div>
    </div>
  )

  const CheckoutView = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[1000px] mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
        <div className="bg-white rounded-[24px] border border-black/5 p-6">
          <h2 className="font-black text-2xl">Ton set est prêt.</h2>
          <div className="grid grid-cols-5 gap-2 mt-4">
            {designSet?.map(d=>(
              <div key={d.id} className="aspect-[3/4] rounded-xl border border-black/5" style={{background: `linear-gradient(135deg, ${d.colors[0]}, ${d.colors[1]})`}}/>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <p className="font-semibold text-sm">Finition</p>
              <div className="flex gap-2 mt-2">
                {['Brillante','Mate','Chrome','Métallique'].map(f=>(
                  <button key={f} className="flex-1 py-2 rounded-full border text-xs font-medium bg-black text-white border-black">{f}</button>
                ))}
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm">Forme</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Naturelle','Almond','Oval','Square','Coffin'].map(f=>(
                  <span key={f} className="px-3 py-1.5 rounded-full border border-black/10 text-xs bg-white">{f}</span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#FFF0F5] border border-[#FF2B6E]/10">
              <p className="font-semibold text-sm">✓ Adapter à mon profil (recommandé)</p>
              <p className="text-xs text-zinc-600">10 ongles personnalisés • Design IA • Fabrication sur commande</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[24px] border border-black/5 p-6 h-fit">
          <h3 className="font-bold">Résumé</h3>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-zinc-500">Set Sunset Ocean</span><span className="font-medium">42€</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Fabrication premium</span><span className="font-medium">incluse</span></div>
            <div className="flex justify-between"><span className="text-zinc-500">Livraison 48h</span><span className="font-medium">5€</span></div>
            <div className="border-t border-black/5 pt-3 flex justify-between font-bold text-base"><span>Total</span><span>47€</span></div>
          </div>
          <button onClick={doOrder} className="w-full mt-6 bg-[#FF2B6E] text-white font-semibold py-3.5 rounded-full">Commander mon set →</button>
          <p className="text-[11px] text-zinc-400 text-center mt-2">Paiement sécurisé • Retour 14 jours</p>
        </div>
      </div>
    </div>
  )

  const MarketView = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[1440px] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <p className="text-[#FF2B6E] text-[11px] tracking-[0.32em] font-bold">MARKETPLACE</p>
            <h2 className="font-black text-[28px] lg:text-[36px] tracking-[-0.02em]">Explorer les créations</h2>
          </div>
          <div className="flex gap-2 overflow-auto pb-2">
            {['Tendances','Mariage','Minimal','Chrome','Art','Festival','Nature','Gothic','Y2K'].map(t=>(
              <span key={t} className="whitespace-nowrap px-4 py-1.5 rounded-full border border-black/10 bg-white text-xs font-medium">{t}</span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mt-6">
          {MARKET_ITEMS.map(item=>(
            <button key={item.id} onClick={()=> { setActiveProduct(item); setView('product')}} className="text-left bg-white rounded-[20px] border border-black/5 overflow-hidden hover:shadow-lg transition">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-[10px] font-bold px-2.5 py-1 rounded-full">{item.tag}</span>
                <span className="absolute bottom-3 right-3 bg-black text-white text-[11px] font-bold px-2.5 py-1 rounded-full">{item.price}€</span>
              </div>
              <div className="p-4">
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-xs text-zinc-500">{item.creator} • {item.likes} ♥ • {item.tries} essais</p>
                <div className="flex gap-1 mt-2">{item.colors.map(c=> <span key={c} className="w-4 h-4 rounded-full border border-black/5" style={{background:c}}/> )}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const ProductView = () => {
    if(!activeProduct) return null
    return (
      <div className="lg:ml-[220px]">
        <Header/>
        <div className="px-5 lg:px-12 py-6 max-w-[1100px] mx-auto">
          <button onClick={()=> setView('market')} className="text-sm text-zinc-500">← Retour marketplace</button>
          <div className="grid lg:grid-cols-2 gap-8 mt-4">
            <div className="aspect-[4/3] rounded-[24px] overflow-hidden bg-zinc-100">
              <img src={activeProduct.img} alt={activeProduct.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-[#FF2B6E] text-[11px] tracking-[0.28em] font-bold">CRÉATION • {activeProduct.tag.toUpperCase()}</p>
              <h2 className="font-black text-3xl mt-1">{activeProduct.name}</h2>
              <p className="text-sm text-zinc-500">par {activeProduct.creator} • {activeProduct.likes} favoris</p>
              <div className="flex gap-2 mt-4">
                <button onClick={()=> {
                  if(!nailProfile){ setView('scan_intro'); return }
                  // adapt to profile
                  const set = generateSet(activeProduct.name, {colors: activeProduct.colors}, nailProfile.nails)
                  setDesignSet(set); setView('set')
                }} className="flex-1 bg-[#FF2B6E] text-white font-semibold py-3 rounded-full">Essayer sur mes ongles</button>
                <button onClick={()=> { const set = generateSet(activeProduct.name, {colors: activeProduct.colors}, nailProfile?.nails || mockNails()); setDesignSet(set); setView('checkout')}} className="flex-1 bg-black text-white font-semibold py-3 rounded-full">Commander • {activeProduct.price}€</button>
              </div>
              <div className="mt-6 p-4 rounded-2xl bg-[#FFFBF9] border border-black/5 text-sm">
                <p className="font-semibold">Design paramétrique</p>
                <p className="text-xs text-zinc-600 mt-1">Cette création s'adaptera automatiquement à ton Nail Profile (10 gabarits).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const CreationsView = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[1100px] mx-auto">
        <h2 className="font-black text-2xl">Mes créations</h2>
        <div className="flex gap-2 mt-4">
          <button className="px-4 py-1.5 rounded-full bg-black text-white text-xs font-semibold">Toutes</button>
          <button onClick={()=> setView('market')} className="px-4 py-1.5 rounded-full bg-white border border-black/10 text-xs">Publiées</button>
          <button className="px-4 py-1.5 rounded-full bg-white border border-black/10 text-xs">Brouillons</button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {creations.map(c=>(
            <div key={c.id} className="bg-white rounded-[20px] border border-black/5 overflow-hidden">
              <img src={c.img} alt={c.name} className="w-full aspect-[4/3] object-cover" />
              <div className="p-4">
                <p className="font-bold text-sm">{c.name}</p>
                <p className="text-xs text-zinc-500">créé le {c.date} • {c.sales} commandes</p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-zinc-100 text-xs font-medium py-1.5 rounded-full">Dupliquer</button>
                  <button onClick={()=> setView('studio')} className="flex-1 bg-black text-white text-xs font-medium py-1.5 rounded-full">Modifier</button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={()=> setView('studio')} className="rounded-[20px] border-2 border-dashed border-zinc-200 bg-[#FFFBF9] grid place-items-center p-8 text-center">
            <span className="w-10 h-10 rounded-full bg-white shadow grid place-items-center">+</span>
            <p className="font-semibold text-sm mt-2">Créer une nouvelle création</p>
          </button>
        </div>
      </div>
    </div>
  )

  const OrdersView = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[800px] mx-auto">
        <h2 className="font-black text-2xl">Mes commandes</h2>
        {orders.length===0 ? <p className="text-sm text-zinc-500 mt-4">Aucune commande. <button onClick={()=> setView('studio')} className="text-[#FF2B6E] font-semibold">Créer un set</button></p> : (
          <div className="space-y-4 mt-6">
            {orders.map(o=>(
              <div key={o.id} className="bg-white rounded-[20px] border border-black/5 p-5 flex gap-4">
                <div className="flex gap-1">
                  {o.set.slice(0,5).map(d=> <span key={d.id} className="w-8 h-12 rounded-lg border border-black/5" style={{background: `linear-gradient(135deg, ${d.colors[0]}, ${d.colors[1]})`}}/>)}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Commande #{String(o.id).slice(-6)} • {o.date}</p>
                  <p className="text-xs text-zinc-500">10 ongles • Fabrication en cours • Livraison 48h</p>
                  <p className="text-sm font-semibold mt-1">{o.total+5}€ • Brillante • Almond</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full h-fit font-semibold">En fabrication</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const ProfileSettingsView = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[900px] mx-auto">
        <h2 className="font-black text-2xl">Mon Nail Profile</h2>
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 mt-6">
          <div className="bg-white rounded-[24px] border border-black/5 p-6">
            <p className="font-semibold">Mes mains</p>
            {nailProfile ? (
              <>
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {nailProfile.nails.slice(0,5).map(n=> <div key={n.id} className="aspect-[3/4] rounded-xl bg-[#FFFBF9] border border-black/5 grid place-items-center text-[10px]">{n.short}</div>)}
                </div>
                <p className="text-xs text-zinc-500 mt-3">10 gabarits • {nailProfile.createdAt}</p>
                <button onClick={()=> setView('scan_intro')} className="mt-4 w-full bg-white border border-black/10 font-medium py-2.5 rounded-full text-sm">Re-scanner mes mains</button>
              </>
            ) : (
              <>
                <p className="text-sm text-zinc-500 mt-2">Aucun profil. Scanne tes mains pour créer ton gabarit permanent.</p>
                <button onClick={()=> setView('scan_intro')} className="mt-4 w-full bg-[#FF2B6E] text-white font-semibold py-2.5 rounded-full">Créer mon Nail Profile</button>
              </>
            )}
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl border border-black/5 p-5">
              <p className="font-semibold text-sm">Sections</p>
              <div className="mt-2 space-y-1 text-sm">
                {['Mes designs','Mes commandes','Mes favoris','Mes créations'].map(s=>(
                  <button key={s} onClick={()=> s==='Mes commandes' ? setView('orders') : s==='Mes créations' ? setView('creations') : setView('market')} className="w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-50 flex justify-between"><span>{s}</span><span>→</span></button>
                ))}
              </div>
            </div>
            <div className="bg-[#FFF0F5] rounded-2xl p-5 border border-[#FF2B6E]/10">
              <p className="font-semibold text-sm">Ton profil est prêt pour toutes tes futures créations.</p>
              <p className="text-xs text-zinc-600 mt-1">Chaque nouveau design sera automatiquement adapté.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const PublishView = () => (
    <div className="lg:ml-[220px]">
      <Header/>
      <div className="px-5 lg:px-12 py-6 max-w-[700px] mx-auto">
        <h2 className="font-black text-2xl">Publier cette création</h2>
        <div className="mt-6 bg-white rounded-[24px] border border-black/5 p-6">
          <div className="grid grid-cols-5 gap-2">
            {designSet?.slice(0,5).map(d=> <div key={d.id} className="aspect-[3/4] rounded-xl" style={{background: `linear-gradient(135deg, ${d.colors[0]}, ${d.colors[1]})`}}/>)}
          </div>
          <div className="mt-6 space-y-3">
            {[
              {id:'privé', t:'Privé', d:'Uniquement pour moi'},
              {id:'public', t:'Public', d:'Publier dans la boutique'},
              {id:'créateur', t:'Créateur', d:'Permettre à d’autres de commander ce design (revenus)'},
            ].map(o=>(
              <button key={o.id} onClick={()=> setPublishMode(o.id)} className={`w-full text-left p-4 rounded-2xl border-2 ${publishMode===o.id?'border-[#FF2B6E] bg-[#FFF0F5]':'border-black/5 bg-white'}`}>
                <p className="font-semibold text-sm">{o.t}</p>
                <p className="text-xs text-zinc-500">{o.d}</p>
              </button>
            ))}
          </div>
          <button onClick={publishCreation} className="w-full mt-6 bg-black text-white font-semibold py-3 rounded-full">Publier →</button>
          <p className="text-[11px] text-zinc-400 text-center mt-2">Le système transforme ton design en modèle paramétrique adaptable.</p>
        </div>
      </div>
    </div>
  )

  // ---------- ROUTER ----------
  return (
    <div className="min-h-screen bg-[#FFFBF9] text-[#0F0F0F] font-sans antialiased selection:bg-[#FF2B6E] selection:text-white pb-16 lg:pb-0">
      <Nav/>
      {view==='home' && <HomeView/>}
      {view==='scan_intro' && <ScanIntro/>}
      {view==='scan_camera' && <ScanCamera/>}
      {view==='scan_analysis' && <ScanAnalysis/>}
      {view==='scan_detection' && <ScanDetection/>}
      {view==='scan_correction' && <ScanCorrection/>}
      {view==='profile' && <ProfileView/>}
      {view==='canvas' && <CanvasView/>}
      {view==='studio' && <StudioView/>}
      {view==='generating' && <GeneratingView/>}
      {view==='set' && <SetView/>}
      {view==='tryon' && <TryOnView/>}
      {view==='fabric' && <FabricView/>}
      {view==='checkout' && <CheckoutView/>}
      {view==='market' && <MarketView/>}
      {view==='product' && <ProductView/>}
      {view==='creations' && <CreationsView/>}
      {view==='orders' && <OrdersView/>}
      {view==='profile_settings' && <ProfileSettingsView/>}
      {view==='publish' && <PublishView/>}

      {/* floating CTA to publish from set */}
      {view==='set' && (
        <button onClick={()=> setView('publish')} className="fixed bottom-20 lg:bottom-6 right-5 bg-white border border-black/10 shadow-xl px-4 py-2.5 rounded-full text-xs font-semibold">Publier ce set →</button>
      )}

      {/* footer minimal */}
      {['home','market'].includes(view) && (
        <footer className="lg:ml-[220px] bg-[#0F0F0F] text-white px-5 lg:px-12 py-10">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row justify-between gap-8">
            <div>
              <div className="flex gap-1.5 font-black"><span>NAIL</span><span className="text-[#FF2B6E]">PROFILE</span></div>
              <p className="text-white/60 text-sm mt-2 max-w-[360px]">La première plateforme d'ongles sur mesure par IA. Scan → Profil → Design → Fabrication.</p>
            </div>
            <div className="text-xs text-white/60 space-y-1">
              <p>© 2026 Nail Profile • Apple-like beauty tech</p>
              <p>INTENTION → CRÉATION → ADAPTATION → FABRICATION</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
