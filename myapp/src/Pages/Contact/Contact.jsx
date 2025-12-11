import React, { useState, useEffect } from 'react'

const Contact = () => {
  const AQUA = '#1ac7c7'
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const prev = document.body.style.background
    document.body.style.background = 'linear-gradient(180deg, #e8ffff, #ffffff 40%)'
    return () => { document.body.style.background = prev || '' }
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const validate = ({ name, email, message }) => {
    if (!name.trim() || !email.trim() || !message.trim()) return 'Please fill name, email and message.'
    // simple email check
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Enter a valid email.'
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const err = validate(form)
    if (err) { setStatus({ type: 'error', msg: err }); return }
    try {
      const saved = JSON.parse(localStorage.getItem('renthome_contacts') || '[]')
      saved.unshift({ ...form, createdAt: new Date().toISOString() })
      localStorage.setItem('renthome_contacts', JSON.stringify(saved))
      setStatus({ type: 'ok', msg: 'Thanks — your message was saved (demo).' })
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (e) {
      setStatus({ type: 'error', msg: 'Could not save message locally.' })
    }
    setTimeout(() => setStatus(null), 4500)
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto', color: '#073' }}>
      <style>{`
        :root { --aqua: ${AQUA}; --muted: #6b6b6b; }
        .hero { position:relative; height:340px; display:flex; align-items:flex-end; border-radius:12px; overflow:hidden; margin:22px 20px 60px; box-shadow: 0 30px 80px rgba(10,20,20,0.06); }
        .hero-bg { position:absolute; inset:0; background-image: url('https://images.unsplash.com/photo-1501117716987-c8e3c9e0b6ec?auto=format&fit=crop&w=1600&q=60'); background-size:cover; background-position:center; filter: saturate(.95) contrast(.98); transform: scale(1.02); }
        .hero-overlay { position:absolute; inset:0; background:linear-gradient(180deg, rgba(8,140,140,0.08), rgba(255,255,255,0.18)); }
        .hero-inner { position:relative; padding:28px 32px; display:flex; gap:18px; align-items:center; width:100%; }
        .greeting { background:rgba(255,255,255,0.86); padding:22px 20px; border-radius:12px; max-width:820px; box-shadow: 0 12px 30px rgba(10,20,20,0.06); }
        .greeting h1{ margin:0; font-size:28px; color:var(--aqua); font-weight:900 }
        .greeting p{ margin:8px 0 0; color:var(--muted) }

        .form-card { width:100%; max-width:980px; margin:-48px auto 28px; padding:18px; border-radius:14px; background:#fff; box-shadow: 0 24px 56px rgba(10,20,20,0.08); display:flex; gap:22px; align-items:flex-start; flex-wrap:wrap; }
        .form { flex:1; min-width:280px; }
        .field { display:flex; flex-direction:column; margin-bottom:12px; }
        .field label{ font-size:13px; color:var(--muted); margin-bottom:6px }
        .field input, .field textarea { padding:12px 14px; border-radius:10px; border:1px solid #eef9f9; font-size:14px; outline:none; background:#fbffff; }
        .field textarea { min-height:120px; resize:vertical }
        .actions { display:flex; gap:12px; align-items:center; margin-top:8px }
        .btn { background:var(--aqua); color:#fff; padding:12px 16px; border-radius:10px; border:0; font-weight:800; cursor:pointer }
        .btn-ghost { background:#fff; border:1px solid #eef9f9; padding:10px 12px; border-radius:10px; cursor:pointer }

        .info { width:320px; min-width:260px; display:flex; flex-direction:column; gap:12px; }
        .info .card { background:linear-gradient(180deg,#fbffff,#ffffff); padding:12px; border-radius:10px; box-shadow:0 8px 22px rgba(10,20,20,0.04); }
        .features { display:flex; gap:12px; margin:26px 20px; flex-wrap:wrap; justify-content:center }
        .feature { width:240px; background:#fff; padding:18px; border-radius:12px; box-shadow:0 12px 30px rgba(10,20,20,0.04); text-align:center }
        .feature h4{ margin:0 0 8px; font-size:15px; font-weight:900 }
        .status { padding:10px 12px; border-radius:10px; font-weight:700 }
        .ok { background:linear-gradient(90deg, #dffaf0,#e7fff6); color:#056c4a }
        .err { background:#fff1f0; color:#8b1c1c }

        @media (max-width:920px){ .info{ width:100%; order:2 } .form-card{ padding:14px; margin-top:-36px } .hero{ height:260px } .greeting h1{ font-size:20px } }
      `}</style>

      <div className="hero" role="img" aria-label="Contact hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-inner container">
          <div className="greeting">
            <h1>Get in touch</h1>
            <p>Have a question or need help? Send a message — we respond fast (demo).</p>
          </div>
        </div>
      </div>

      <div className="form-card container" role="region" aria-labelledby="contact-form">
        <form className="form" id="contact-form" onSubmit={handleSubmit} noValidate>
          <div style={{display:'flex', gap:12, flexWrap:'wrap'}}>
            <div style={{flex:1, minWidth:160}} className="field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
            </div>

            <div style={{flex:1, minWidth:160}} className="field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" type="email" />
            </div>
          </div>

          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input id="subject" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject (optional)" />
          </div>

          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help…" />
          </div>

          <div className="actions">
            <button className="btn" type="submit">Send message</button>
            <button type="button" className="btn-ghost" onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setStatus(null) }}>Reset</button>
            {status && (
              <div className={`status ${status.type === 'ok' ? 'ok' : 'err'}`} role="status">{status.msg}</div>
            )}
          </div>
        </form>

        <aside className="info" aria-hidden>
          <div className="card">
            <strong>Customer care</strong>
            <div style={{marginTop:6, color:'#6b6b6b'}}>Mon — Fri, 9:00 — 18:00</div>
            <div style={{marginTop:10, fontWeight:800}}>+1 (555) 123‑4567</div>
            <div style={{marginTop:6, color:'#6b6b6b'}}>support@renthome.example</div>
          </div>

          <div className="card">
            <strong>Office</strong>
            <div style={{marginTop:6, color:'#6b6b6b'}}>123 Modern Ave, Suite 500</div>
            <div style={{marginTop:8}}><small style={{color:'#6b6b6b'}}>City, Country</small></div>
          </div>

          <div className="card">
            <strong>Quick links</strong>
            <div style={{marginTop:8, display:'flex', flexDirection:'column', gap:6}}>
              <a href="/services">Services</a>
              <a href="/about">About us</a>
              <a href="/">Browse stays</a>
            </div>
          </div>
        </aside>
      </div>

      <div className="features container" aria-hidden>
        <div className="feature">
          <h4>Secure</h4>
          <div style={{color:'#6b6b6b'}}>We never send your data externally in this demo.</div>
        </div>
        <div className="feature">
          <h4>Fast replies</h4>
          <div style={{color:'#6b6b6b'}}>Typical response time under 24 hours (demo promise).</div>
        </div>
        <div className="feature">
          <h4>Friendly team</h4>
          <div style={{color:'#6b6b6b'}}>We aim to make booking pleasant and reliable.</div>
        </div>
      </div>
    </div>
  )
}

export default Contact
