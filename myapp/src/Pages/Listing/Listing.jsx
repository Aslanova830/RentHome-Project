import React, { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

const makeListings = () => {
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
      img: `https://source.unsplash.com/1400x900/?${encodeURIComponent(q)},interior&sig=${id}`,
      rating: (4 + (i % 2) * 0.5).toFixed(1),
      desc: 'Stylish, comfortable room with modern amenities, high-speed Wi‑Fi and flexible check‑in.'
    }
  })
}

const Listing = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const listing = useMemo(() => makeListings().find(l => String(l.id) === String(id)), [id])

  if (!listing) {
    return (
      <div style={{padding:24, fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto'}}>
        <h2>Listing not found</h2>
        <Link to="/">Back to home</Link>
      </div>
    )
  }

  return (
    <div style={{minHeight:'100vh', background:'#f6ffff', padding:32, fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto'}}>
      <div style={{maxWidth:1100, margin:'0 auto', background:'#fff', borderRadius:14, overflow:'hidden', boxShadow:'0 30px 80px rgba(10,20,20,0.06)'}}>
        <div style={{height:420, overflow:'hidden', position:'relative'}}>
          <img src={listing.img} alt={listing.title} style={{width:'100%', height:'100%', objectFit:'cover', display:'block', transform:'scale(1)'}} onError={(e)=>{ e.currentTarget.onerror=null; e.currentTarget.src=`https://picsum.photos/seed/rh-room-${listing.id}/1400/900` }} />
          <button onClick={()=>navigate(-1)} style={{position:'absolute', left:16, top:16, padding:'8px 10px', borderRadius:10, border:'none', background:'rgba(255,255,255,0.86)', cursor:'pointer'}}>← Back</button>
        </div>

        <div style={{padding:22, display:'grid', gridTemplateColumns:'1fr 320px', gap:18, alignItems:'start'}}>
          <div>
            <h1 style={{margin:0, fontSize:22, fontWeight:900}}>{listing.title}</h1>
            <div style={{color:'#6b6b6b', marginTop:6}}>{listing.location} • {listing.beds} beds • {listing.rating} ★</div>
            <p style={{marginTop:12, color:'#546b6b'}}>{listing.desc}</p>

            <section style={{marginTop:18, display:'flex', gap:12}}>
              <button style={{padding:'10px 14px', borderRadius:10, border:'1px solid #eef9f9', background:'#fff', cursor:'pointer'}}>Contact host</button>
              <button style={{padding:'10px 14px', borderRadius:10, border:'none', background:'#1ac7c7', color:'#fff', fontWeight:800, cursor:'pointer'}}>Reserve now</button>
            </section>
          </div>

          <aside style={{background:'#fbffff', borderRadius:12, padding:16, boxShadow:'0 8px 24px rgba(10,20,20,0.04)'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{fontWeight:900, fontSize:18}}>${listing.price}</div>
              <div style={{color:'#6b6b6b', fontSize:13}}>per night</div>
            </div>

            <div style={{marginTop:12}}>
              <label style={{fontSize:13, color:'#6b6b6b'}}>Dates</label>
              <input placeholder="Select dates" disabled style={{width:'100%', marginTop:8, padding:10, borderRadius:8, border:'1px solid #eef9f9', background:'#fff'}}/>
            </div>

            <div style={{marginTop:12}}>
              <label style={{fontSize:13, color:'#6b6b6b'}}>Guests</label>
              <select style={{width:'100%', marginTop:8, padding:10, borderRadius:8, border:'1px solid #eef9f9', background:'#fff'}}>
                <option>1 guest</option>
                <option>2 guests</option>
                <option>3 guests</option>
              </select>
            </div>

            <div style={{marginTop:14}}>
              <button style={{width:'100%', padding:12, borderRadius:10, border:'none', background:'#1ac7c7', color:'#fff', fontWeight:900}}>Book</button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default Listing