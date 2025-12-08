import React, { useState, useEffect } from 'react'
import logo from '../../assets/logo.png'

const Home = () => {
  const AQUA = '#1ac7c7'
  const AQUA_LIGHT = '#e8ffff'
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [query, setQuery] = useState('')
  const [priceMax, setPriceMax] = useState(999)
  const [listings] = useState(() => {
    const bases = [
      'Cozy Studio', 'Modern Apartment', 'Sea-view Apartment', 'Sunny Loft',
      'Charming Bungalow', 'Urban Flat', 'Garden Suite', 'Penthouse'
    ]
    const cities = ['Downtown', 'Harbor', 'Uptown', 'Midtown', 'Old Town', 'Riverside']
    // use picsum.photos seeded images for deterministic fake photos (30 rooms)
    return Array.from({ length: 30 }, (_, i) => {
      const id = i + 1
      const base = bases[i % bases.length]
      const city = cities[i % cities.length]
      const price = 40 + ((i * 13) % 160)
      return {
        id,
        title: `${base} ${id}`,
        price,
        beds: (i % 4) + 1,
        location: city,
        // deterministic fake image per room (800x600) and small thumbnail (420x280)
        img: `https://picsum.photos/seed/renthome-room-${id}/800/600`,
        thumb: `https://picsum.photos/seed/renthome-room-${id}/420/280`,
        rating: (4 + (i % 2) * 0.5).toFixed(1)
      }
    })
  })

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('renthome_user') || 'null')
    if (saved && saved.loggedIn) setUser(saved.profile)
  }, [])

  useEffect(() => {
    // global theme
    document.body.style.background = `linear-gradient(180deg, ${AQUA_LIGHT}, #ffffff 45%)`
    document.body.style.fontFamily = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue"'
    return () => { document.body.style.background = '' }
  }, [])

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
          .card { background: linear-gradient(180deg, #ffffff, #fbffff); border-radius: 16px; box-shadow: 0 28px 80px rgba(10,25,25,0.08); width: 540px; max-width: 96%; overflow: hidden; border: 1px solid rgba(10,180,180,0.06); }
          .brand { display:flex; gap:14px; align-items:center; padding:22px 26px; background: linear-gradient(90deg, ${AQUA}, #28d6d6); color: white; }
          .brand img { width:48px; height:48px; border-radius:10px; object-fit:cover; box-shadow: 0 8px 30px rgba(10,25,25,0.12); }
          .brand h1 { margin:0; font-size:20px; font-weight:900; letter-spacing:0.3px; }
          .form { padding:28px; }
          .field { display:flex; flex-direction:column; gap:8px; margin-bottom:14px; }
          .field input { padding:12px 14px; border-radius:12px; border:1px solid #e9f7f7; outline:none; background: #fbffff; transition: box-shadow .12s ease, transform .06s ease; }
          .field input:focus { box-shadow: 0 10px 30px rgba(26,199,199,0.08); border-color: ${AQUA}; transform: translateY(-1px); }
          .muted { color:#576; font-size:13px; margin-bottom:6px; }
          .btn { background:${AQUA}; color:white; padding:12px 18px; border-radius:12px; border:none; cursor:pointer; font-weight:800; box-shadow: 0 12px 30px rgba(26,199,199,0.14); }
          .link { background:transparent; border:none; color:${AQUA}; cursor:pointer; font-weight:700; }
          .alt { text-align:center; margin-top:12px; font-size:13px; color:#6b6b6b; }
        `}</style>

        <div className="card" role="dialog" aria-labelledby="auth-title">
          <div className="brand">
            {/* project logo (save the attached image to src/assets/logo.png) */}
            <img src={logo} alt="RentHome logo" style={{width:48, height:48, borderRadius:8, objectFit:'cover'}} />
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

  // Authenticated view: upgraded professional layout with photos
  return (
    <div style={{minHeight:'100vh', padding:'32px 24px', background:`linear-gradient(180deg, ${AQUA_LIGHT}, #ffffff 45%)`}}>
      <style>{`
        .layout { max-width:1200px; margin:0 auto; }
        .topbar { display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:22px; }
        .brandBlock { display:flex; gap:14px; align-items:center; }
        .logo { width:60px; height:60px; border-radius:12px; overflow:hidden; box-shadow: 0 12px 36px rgba(10,25,25,0.08); }
        .logo img { width:100%; height:100%; object-fit:cover; display:block; }
        .title { font-size:22px; font-weight:900; letter-spacing: -0.2px; }
        .sub { color:#4f6b6b; font-size:13px; }

        .controls { display:flex; gap:12px; align-items:center; margin-bottom:20px; flex-wrap:wrap; }
        .searchCard { background: linear-gradient(180deg, #ffffff, #fbffff); border-radius:14px; padding:10px 12px; box-shadow: 0 10px 30px rgba(12,30,30,0.04); display:flex; gap:12px; align-items:center; flex:1; min-width:260px; border:1px solid rgba(10,180,180,0.05); }
        .searchInput { flex:1; padding:12px 14px; border-radius:10px; border:1px solid #eef9f9; outline:none; background:transparent; font-size:14px; }
        .chip { background:#f6ffff; border-radius:999px; padding:8px 12px; color:${AQUA}; font-weight:700; border:1px solid rgba(26,199,199,0.06); }

        .profile { display:flex; gap:14px; align-items:center; }
        .avatar { width:48px; height:48px; background:${AQUA}; color:white; display:flex; align-items:center; justify-content:center; border-radius:10px; font-weight:800; font-size:16px; box-shadow: 0 8px 22px rgba(26,199,199,0.12); }

        .grid { display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:22px; margin-top:12px; }
        .card { background:white; border-radius:14px; overflow:hidden; box-shadow: 0 18px 50px rgba(10,20,20,0.06); transition: transform .18s ease, box-shadow .18s ease; display:flex; flex-direction:column; }
        .card:hover { transform: translateY(-8px); box-shadow: 0 34px 90px rgba(10,20,20,0.10); }
        .media { height:200px; position:relative; overflow:hidden; }
        .media img { width:100%; height:100%; object-fit:cover; display:block; transition: transform .5s ease; }
        .card:hover .media img { transform: scale(1.04); }
        .overlay { position:absolute; left:12px; top:12px; background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85)); padding:6px 10px; border-radius:10px; font-weight:700; color:#084; box-shadow: 0 8px 20px rgba(10,20,20,0.05); }
        .favorite { position:absolute; right:12px; top:12px; background: rgba(255,255,255,0.9); width:40px; height:40px; border-radius:10px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:18px; }
        .body { padding:16px; display:flex; flex-direction:column; gap:10px; flex:1; }
        .row { display:flex; justify-content:space-between; align-items:center; gap:12px; }
        .titleCard { font-weight:900; font-size:16px; }
        .meta { color:#6b6b6b; font-size:13px; }
        .price { color:${AQUA}; font-weight:900; font-size:16px; }
        .actions { display:flex; gap:10px; margin-top:6px; }
        .btnOutline { flex:1; padding:10px; border-radius:10px; border:1px solid #eef9f9; background:white; cursor:pointer; }
        .btnPrimary { flex:1; padding:10px; border-radius:10px; border:none; background:${AQUA}; color:white; font-weight:800; box-shadow: 0 12px 30px rgba(26,199,199,0.12); cursor:pointer; }
        @media (max-width:820px){ .grid{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))} .media{height:160px} }
      `}</style>

      <div className="layout">
        <div className="topbar">
          <div className="brandBlock">
            <div className="logo">
              {/* project logo (save the attached image to src/assets/logo.png) */}
              <img src={logo} alt="RentHome" style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}} />
            </div>
            <div>
              <div className="title">RentHome</div>
              <div className="sub">Premium aquatic‑white rentals — curated & easy</div>
            </div>
          </div>

          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <div style={{fontSize:13, color:'#5f6b6b'}}>{results.length} stays</div>
            <div className="profile">
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:800}}>{user.name}</div>
                <div style={{fontSize:12, color:'#6b6b6b'}}>{user.email}</div>
              </div>
              <div className="avatar">{(user.name || 'G')[0].toUpperCase()}</div>
              <button onClick={handleLogout} style={{background:'transparent', border:'1px solid #eef9f9', padding:'8px 10px', borderRadius:10, cursor:'pointer'}}>Log out</button>
            </div>
          </div>
        </div>

        <div className="controls">
          <div className="searchCard" style={{flex:1}}>
            <input className="searchInput" placeholder="Search city, property, feature..." value={query} onChange={(e)=>setQuery(e.target.value)} />
            <button className="chip" onClick={()=>setQuery('')}>Reset</button>
          </div>

          <div style={{display:'flex', gap:10, alignItems:'center'}}>
            <div style={{display:'flex', gap:8, alignItems:'center'}} className="filter">
              <div style={{fontSize:13, color:'#6b6b6b'}}>Max price</div>
              <select value={priceMax} onChange={(e)=>setPriceMax(Number(e.target.value))} style={{padding:8, borderRadius:10, border:'1px solid #eef9f9', marginLeft:8}}>
                <option value={60}>$60</option>
                <option value={100}>$100</option>
                <option value={160}>$160</option>
                <option value={999}>Any</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:6}}>
          <h3 style={{margin:0}}>Available stays</h3>
          <div style={{color:'#6b6b6b'}}>Showing {results.length} results</div>
        </div>

        <div className="grid" aria-live="polite">
          {results.map(l => (
            <div className="card" key={l.id}>
              <div className="media" aria-hidden>
                <img src={l.img} alt={l.title} />
                <div className="overlay">{l.rating} ★ · {l.location}</div>
                <div className="favorite" title="Save">♡</div>
              </div>

              <div className="body">
                <div className="row">
                  <div>
                    <div className="titleCard">{l.title}</div>
                    <div className="meta">Beds: {l.beds} • {l.location}</div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div className="price">${l.price}/night</div>
                    <div style={{fontSize:12, color:'#8a8a8a'}}>Free cancellation</div>
                  </div>
                </div>

                <div style={{fontSize:13, color:'#6b6b6b'}}>Comfortable, modern interiors — reliable Wi‑Fi and flexible check‑in.</div>

                <div className="actions" aria-hidden>
                  <button className="btnOutline">Details</button>
                  <button className="btnPrimary">Book</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
