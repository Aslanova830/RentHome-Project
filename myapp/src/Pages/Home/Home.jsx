import React, { useState, useEffect, useRef } from 'react'

const Home = () => {
  const AQUA = '#1ac7c7'
  const AQUA_LIGHT = '#e8ffff'
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [query, setQuery] = useState('')
  const [priceMax, setPriceMax] = useState(999)
  // removed unused image loading state

  const [listings] = useState(() => {
    const bases = [
      'Cozy Studio', 'Modern Apartment', 'Sea-view Apartment', 'Sunny Loft',
      'Charming Bungalow', 'Urban Flat', 'Garden Suite', 'Penthouse'
    ]
    const cities = ['Downtown', 'Harbor', 'Uptown', 'Midtown', 'Old Town', 'Riverside']
    const queries = ['hotel room', 'apartment interior', 'bedroom interior', 'living room', 'modern interior', 'cozy bedroom']
    return Array.from({ length: 30 }, (_, i) => {
      const id = i + 1
      const q = queries[i % queries.length]
      return {
        id,
        title: `${bases[i % bases.length]} ${id}`,
        price: 40 + ((i * 13) % 160),
        beds: (i % 4) + 1,
        location: cities[i % cities.length],
        img: `https://source.unsplash.com/1200x800/?${encodeURIComponent(q)},interior&sig=${id}`,
        thumb: `https://picsum.photos/seed/rh-room-${id}/900/600`,
        rating: (4 + (i % 2) * 0.5).toFixed(1)
      }
    })
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('renthome_user') || 'null')
    if (saved && saved.loggedIn) setUser(saved.profile)
  }, [])

  useEffect(() => {
    document.body.style.background = `linear-gradient(180deg, ${AQUA_LIGHT}, #ffffff 45%)`
    document.body.style.fontFamily = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue"'
    return () => {
      document.body.style.background = ''
      document.body.style.fontFamily = ''
    }
  }, [])

  // ref to results section for search scrolling
  const resultsRef = useRef(null)

  const handleSearchClick = () => {
    // scroll to results then focus (safe, non-throwing)
    if (!resultsRef.current) return
    try {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch (err) {
      resultsRef.current.scrollIntoView()
    }
    // focus after a short delay so browser finishes scrolling (wrap in try/catch)
    setTimeout(() => {
      try { resultsRef.current.focus() } catch (e) { /* ignore focus errors */ }
    }, 380)
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const simpleSaveUser = (profile) => {
    localStorage.setItem('renthome_user', JSON.stringify({ loggedIn: true, profile }))
    setUser(profile)
  }

  const handleSignup = (e) => {
    e.preventDefault()
    if (!form.name || !form.email || form.password.length < 6) {
      alert('Please provide name, email and a password (min 6 chars).')
      return
    }
    const profile = { name: form.name.trim(), email: form.email.trim() }
    localStorage.setItem('renthome_credentials', JSON.stringify({ email: form.email, password: form.password, name: profile.name }))
    simpleSaveUser(profile)
  }

  const handleSignin = (e) => {
    e.preventDefault()
    const creds = JSON.parse(localStorage.getItem('renthome_credentials') || 'null')
    if (!creds || creds.email !== form.email || creds.password !== form.password) {
      alert('Invalid credentials. You can sign up first.')
      return
    }
    simpleSaveUser({ name: creds.name || 'Guest', email: creds.email })
  }

  const handleLogout = () => {
    localStorage.setItem('renthome_user', JSON.stringify({ loggedIn: false }))
    setUser(null)
    setForm({ name: '', email: '', password: '' })
  }

  const results = listings
    .filter(l => (l.title.toLowerCase().includes(query.toLowerCase()) || l.location.toLowerCase().includes(query.toLowerCase())))
    .filter(l => l.price <= priceMax)

  // image load handler removed (no longer used)

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}>
        <style>{`
          :root { --aqua: ${AQUA}; --aqua-light: ${AQUA_LIGHT}; }
          .auth-card { background: linear-gradient(180deg,#ffffff,#fbffff); border-radius: 16px; box-shadow: 0 28px 80px rgba(10,25,25,0.08); width: 560px; max-width: 96%; overflow: hidden; border:1px solid rgba(10,180,180,0.05); transform-origin:center; animation: fadeIn .42s ease both; }
          .brand { display:flex; gap:14px; align-items:center; padding:22px 26px; background: linear-gradient(90deg,var(--aqua), #28d6d6); color: white; }
          .brand img { width:48px; height:48px; border-radius:8px; object-fit:cover; box-shadow: 0 8px 30px rgba(10,25,25,0.12); }
          .brand h1 { margin:0; font-size:20px; font-weight:900; letter-spacing:0.3px; }
          .form { padding:28px; }
          .field { display:flex; flex-direction:column; gap:8px; margin-bottom:14px; }
          .field input { padding:12px 14px; border-radius:12px; border:1px solid #e9f7f7; outline:none; background: #fbffff; transition: box-shadow .18s ease, transform .08s ease; }
          .field input:focus { box-shadow: 0 10px 30px rgba(26,199,199,0.12); border-color: var(--aqua); transform: translateY(-2px); }
          .muted { color:#576; font-size:13px; margin-bottom:6px; }
          .btn { background:var(--aqua); color:white; padding:12px 18px; border-radius:12px; border:none; cursor:pointer; font-weight:800; box-shadow: 0 12px 36px rgba(26,199,199,0.14); transition: transform .12s ease, box-shadow .12s ease; }
          .btn:hover { transform: translateY(-3px); box-shadow: 0 18px 48px rgba(26,199,199,0.16); }
          .link { background:transparent; border:none; color:var(--aqua); cursor:pointer; font-weight:700; }
          .alt { text-align:center; margin-top:12px; font-size:13px; color:#6b6b6b; }
          @keyframes fadeIn { from { opacity:0; transform: translateY(8px) scale(.998) } to { opacity:1; transform: translateY(0) scale(1) } }
        `}</style>

        <div className="auth-card" role="dialog" aria-labelledby="auth-title">
          <div className="brand">
            <img src="/logo.png" alt="RentHome logo" onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src='https://picsum.photos/120/120?seed=logo' }} />
            <div>
              <h1 id="auth-title">RentHome</h1>
              <div style={{fontSize:13, opacity:0.95}}>Professional aquatic‑white booking</div>
            </div>
          </div>

          <div className="form">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10}}>
              <div style={{fontSize:18, fontWeight:800}}>{mode === 'signin' ? 'Welcome back' : 'Create account'}</div>
              <div style={{fontSize:13, color:'#6a6a6a'}}>Secure demo · no backend</div>
            </div>

            <form onSubmit={mode === 'signin' ? handleSignin : handleSignup}>
              {mode === 'signup' && (
                <div className="field">
                  <label className="muted">Name</label>
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                </div>
              )}

              <div className="field">
                <label className="muted">Email</label>
                <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="you@example.com" />
              </div>

              <div className="field">
                <label className="muted">Password</label>
                <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Minimum 6 characters" />
              </div>

              <div style={{display:'flex', gap:12, alignItems:'center', marginTop:6}}>
                <button type="submit" className="btn" style={{flex:1}}>{mode === 'signin' ? 'Sign in' : 'Create account'}</button>
                <button type="button" className="link" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                  {mode === 'signin' ? "Create account" : "Have an account? Sign in"}
                </button>
              </div>
            </form>

            <div className="alt">Demo only — credentials stored locally. Do not use real passwords.</div>
          </div>
        </div>
      </div>
    )
  }

  // ---- REPLACED: authenticated view with modern hero + animated search + upgraded cards ----
  return (
    <div style={{minHeight:'100vh', background:`linear-gradient(180deg, ${AQUA_LIGHT}, #ffffff 45%)`}}>
      <style>{`
        :root{
          --aqua: ${AQUA};
          --aqua-600: #14b9b9;
          --muted: #6b6b6b;
          --glass: rgba(255,255,255,0.72);
          --card-shadow: 0 18px 50px rgba(10,20,20,0.06);
        }

        *{box-sizing:border-box}
        body{margin:0}

        .container{max-width:1200px;margin:0 auto;padding:28px 20px 60px}
        /* ensure stacking context so search and hero don't hide results */
        .container{position:relative; z-index:1}

        .nav{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}
        .brand{display:flex;gap:14px;align-items:center}
        .logoBox{width:64px;height:64px;border-radius:12px;display:flex;align-items:center;justify-content:center; background:linear-gradient(135deg,var(--aqua),var(--aqua-600)); color:#fff; font-weight:900; font-size:18px; box-shadow: 0 8px 28px rgba(20,180,180,0.12)}
        .navLinks{display:flex;gap:18px;align-items:center;color:var(--muted);font-weight:600}
        .profile{display:flex;gap:12px;align-items:center}

        /* Hero */
        .hero{position:relative;border-radius:18px; overflow:hidden; display:block; margin-bottom:28px; background:linear-gradient(180deg, rgba(10,140,140,0.06), rgba(255,255,255,0.5));}
        .hero-bg{height:320px;background-image:linear-gradient(180deg, rgba(8,150,150,0.08), rgba(255,255,255,0.2)), url('https://images.unsplash.com/photo-1501117716987-c8e3c9e0b6ec?auto=format&fit=crop&w=1600&q=60'); background-size:cover;background-position:center; filter:contrast(1.02) saturate(.98); transform:translateZ(0); z-index:0}
        .hero-inner{position:relative;padding:28px; display:flex; gap:28px; align-items:flex-end; z-index:1}
        .greeting{background:var(--glass);backdrop-filter:blur(6px); padding:22px;border-radius:14px; box-shadow: 0 10px 30px rgba(10,20,20,0.06);max-width:640px}
        .greeting h1{margin:0;font-size:32px;color:#0b4; color:var(--aqua); font-weight:900; letter-spacing:-0.6px}
        .greeting p{margin:8px 0 0;color:var(--muted);font-size:15px}

        /* Search card */
        .searchCard{position:absolute;left:50%;transform:translateX(-50%);bottom:-30px;width:calc(100% - 80px);max-width:980px;background:white;border-radius:14px;padding:14px 18px;box-shadow: 0 20px 46px rgba(10,20,20,0.08);display:flex;gap:12px;align-items:center; z-index:2}
        .field{flex:1;display:flex;gap:10px;align-items:center;padding:10px;border-radius:10px;border:1px solid #eef9f9;background:#fbffff}
        .field input{border:0;outline:0;background:transparent;font-size:14px;width:100%}
        .searchBtn{background:var(--aqua);color:#fff;padding:10px 16px;border-radius:10px;border:0;font-weight:800;cursor:pointer;box-shadow:0 10px 30px rgba(26,199,199,0.12)}

        /* Results header */
        .resultsHeader{display:flex;justify-content:space-between;align-items:center;margin-top:52px;margin-bottom:12px}
        .resultsHeader h2{margin:0;font-size:20px}
        .resultsHeader .meta{color:var(--muted)}

        /* Grid & cards */
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
        .card{background:white;border-radius:12px;overflow:hidden;box-shadow:var(--card-shadow);display:flex;flex-direction:column;transition:transform .26s cubic-bezier(.2,.9,.3,1),box-shadow .26s;will-change:transform; z-index:3}
        .card:hover{transform:translateY(-10px);box-shadow:0 36px 90px rgba(10,20,20,0.12)}
        .card-media{height:180px;position:relative;overflow:hidden;background:#f2fbfb}
        .card-media img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease;display:block}
        .card:hover .card-media img{transform:scale(1.06)}
        .badge-location{position:absolute;left:12px;bottom:12px;background:rgba(0,0,0,0.5);color:white;padding:6px 10px;border-radius:8px;font-weight:700;font-size:13px}
        .card-body{padding:14px;display:flex;flex-direction:column;gap:10px;flex:1}
        .card-title{font-weight:900;font-size:15px}
        .card-meta{color:var(--muted);font-size:13px}
        .card-foot{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:auto}
        .price-pill{background:linear-gradient(90deg,var(--aqua),var(--aqua-600));color:white;padding:8px 12px;border-radius:12px;font-weight:900}

        /* animations */
        .card{opacity:0;transform:translateY(12px)}
        .card.show{opacity:1;transform:translateY(0);transition:transform .42s cubic-bezier(.2,.9,.3,1),opacity .42s}
        @media (max-width:720px){
          .hero-inner{flex-direction:column;align-items:flex-start;padding:18px}
          .greeting h1{font-size:22px}
          .searchCard{left:12px;transform:none;width:calc(100% - 24px);bottom:-26px}
        }
      `}</style>

      <div className="container">
        <header className="nav" role="banner">
          <div className="brand">
            <div className="logoBox" aria-hidden>RH</div>
            <div>
              <div style={{fontWeight:900,fontSize:18}}>RentHome</div>
              <div style={{color:'#6b6b6b',fontSize:13}}>Curated modern stays</div>
            </div>
          </div>

          <div style={{display:'flex',alignItems:'center',gap:14}}>
            <nav className="navLinks" aria-label="Primary navigation">
              <div>Home</div>
              <div>Destinations</div>
              <div>About</div>
              <div>Contact</div>
            </nav>
            <div className="profile">
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:800}}>{user.name}</div>
                <div style={{fontSize:12,color:'#6b6b6b'}}>{user.email}</div>
              </div>
              <div style={{width:44,height:44,borderRadius:10, background:'var(--aqua)',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:800}}>{(user.name||'G')[0].toUpperCase()}</div>
              <button onClick={handleLogout} style={{background:'transparent',border:'1px solid #eef9f9',padding:'8px 10px',borderRadius:10,cursor:'pointer'}}>Log out</button>
            </div>
          </div>
        </header>

        <section className="hero" aria-label="Hero">
          <div className="hero-bg" role="img" aria-hidden />
          <div className="hero-inner">
            <div className="greeting" style={{animation:'fadeIn .6s ease both'}}>
              <h1>Good morning, {user.name.split(' ')[0]}.</h1>
              <p>Discover beautiful, modern rooms & homes — handpicked and ready to book.</p>
            </div>

            <div style={{marginLeft:'auto',display:'flex',flexDirection:'column',gap:8}}>
              <div style={{background:'rgba(255,255,255,0.82)',padding:'10px 14px',borderRadius:12,boxShadow:'0 8px 22px rgba(10,20,20,0.06)',maxWidth:260}}>
                <div style={{fontSize:13,color:'var(--muted)',fontWeight:700}}>Top Picks</div>
                <div style={{fontWeight:900,fontSize:18,marginTop:6}}>Comfort & Style</div>
              </div>
            </div>
          </div>

          <div className="searchCard" role="search" aria-label="Search stays">
            <div className="field" aria-hidden>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M11 19a8 8 0 1 1 5.29-14.29A8 8 0 0 1 11 19z" stroke="#9ab" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <input placeholder="Where are you going? city, neighborhood, property..." value={query} onChange={(e)=>setQuery(e.target.value)} aria-label="Search location or property" />
            </div>

            <div className="field" style={{maxWidth:140}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 8h18" stroke="#9ab" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <input placeholder="Any dates" disabled />
            </div>

            <div style={{display:'flex',gap:10,alignItems:'center'}}>
              <button type="button" className="searchBtn" onClick={handleSearchClick} aria-label="Search and show results">Search</button>
            </div>
          </div>
        </section>

        {/* Why choose us + partners — small professional section */}
        <section className="why-choose" aria-label="Why choose RentHome" style={{marginTop:48}}>
          <style>{`
            .why { display:flex; gap:18px; align-items:stretch; margin-bottom:26px; flex-wrap:wrap; }
            .feature { flex:1; min-width:200px; background:linear-gradient(180deg, rgba(255,255,255,0.9), #fbffff); border-radius:12px; padding:18px; box-shadow:0 12px 30px rgba(10,20,20,0.04); display:flex; gap:12px; align-items:flex-start; }
            .feature-icon { width:44px; height:44px; border-radius:10px; background:var(--aqua); color:white; display:flex; align-items:center; justify-content:center; font-weight:800; }
            .feature h4 { margin:0; font-size:15px; font-weight:900; }
            .feature p { margin:6px 0 0; color:var(--muted); font-size:13px; }
            .partners { display:flex; gap:18px; align-items:center; margin-top:6px; flex-wrap:wrap; }
            .partner { opacity:.86; filter:grayscale(.2); width:92px; height:28px; display:flex; align-items:center; justify-content:center; }
          `}</style>

          <div className="why" aria-hidden>
            <div className="feature">
              <div className="feature-icon">€</div>
              <div>
                <h4>Competitive prices</h4>
                <p>Best-in-class rates and transparent fees — curated for value and comfort.</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🔒</div>
              <div>
                <h4>Secure booking</h4>
                <p>Safe demo checkout and protected stored preferences (local only).</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">✨</div>
              <div>
                <h4>Seamless experience</h4>
                <p>Fast search, clear listings and pleasant UI that feels professional.</p>
              </div>
            </div>
          </div>

          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:20,flexWrap:'wrap'}}>
            <div style={{color:'var(--muted)',fontWeight:700}}>Our partners</div>
            <div className="partners" aria-hidden>
              <img className="partner" src="https://picsum.photos/seed/partner1/180/40" alt="partner" />
              <img className="partner" src="https://picsum.photos/seed/partner2/180/40" alt="partner" />
              <img className="partner" src="https://picsum.photos/seed/partner3/180/40" alt="partner" />
              <img className="partner" src="https://picsum.photos/seed/partner4/180/40" alt="partner" />
            </div>
          </div>
        </section>

        <div className="resultsHeader">
          <h2>Available stays</h2>
          <div className="meta">{results.length} options · Filters: max ${priceMax === 999 ? 'Any' : priceMax}</div>
        </div>

        <main className="grid" aria-live="polite" id="results" tabIndex={-1} ref={resultsRef} role="main">
          {results.map((l, idx) => (
            <article
              key={l.id}
              className={`card ${'show'}`}
              style={{animationDelay:`${(idx % 8) * 60}ms`}}
            >
              <div className="card-media" role="img" aria-label={l.title}>
                <img
                  src={l.img}
                  alt={l.title}
                  loading="lazy"
                  onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=`https://picsum.photos/seed/rh-room-${l.id}/1200/800`; }}
                />
                <div className="badge-location">{l.rating} ★ • {l.location}</div>
              </div>

              <div className="card-body">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:12}}>
                  <div>
                    <div className="card-title">{l.title}</div>
                    <div className="card-meta">Beds: {l.beds} · Free cancellation · Wi‑Fi</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="price-pill">${l.price}</div>
                    <div style={{fontSize:12,color:'var(--muted)',marginTop:6}}>per night</div>
                  </div>
                </div>

                <div style={{color:'var(--muted)',fontSize:13}}>Modern, comfortable rooms with curated amenities and fast check‑in.</div>

                <div className="card-foot">
                  <button style={{padding:'10px 12px',borderRadius:10,border:'1px solid #eef9f9',background:'white',cursor:'pointer'}}>Details</button>
                  <button style={{padding:'10px 12px',borderRadius:10,border:'none',background:'var(--aqua)',color:'#fff',fontWeight:800,cursor:'pointer'}}>Book</button>
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>
    </div>
  )
  // ---- end replaced section ----
}

export default Home
