'use client';

import { useState, useCallback } from 'react';

const CAT_COLORS = {
  'Beauty & Personal Care': '#c77dff',
  'Electronics': '#4cc9f0',
  'Home & Kitchen': '#06d6a0',
};

const CATEGORIES = ['all', 'Beauty & Personal Care', 'Electronics', 'Home & Kitchen'];
const CAT_LABELS = { all: 'All', 'Beauty & Personal Care': 'Beauty', 'Electronics': 'Electronics', 'Home & Kitchen': 'Home & Kitchen' };

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { msg, type }
  const [category, setCategory] = useState('all');
  const [fetchedAt, setFetchedAt] = useState(null);

  const fetchReport = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    setStatus({ msg: 'Searching Amazon bestsellers for ZIP 10019...', type: 'loading' });

    try {
      const res = await fetch('/api/report', { method: 'POST' });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Unknown error');
      setProducts(data.products);
      setFetchedAt(data.fetchedAt);
      setStatus({ msg: `Fetched ${data.products.length} products across 3 categories`, type: 'success' });
    } catch (err) {
      setStatus({ msg: `Error: ${err.message}`, type: 'error' });
    }
    setLoading(false);
  }, [loading]);

  const filtered = category === 'all' ? products : products.filter(p => p.category === category);
  const avgRating = products.length ? (products.reduce((s, p) => s + (parseFloat(p.rating) || 0), 0) / products.length).toFixed(1) : null;
  const fetchTime = fetchedAt ? new Date(fetchedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null;
  const fetchDate = fetchedAt ? new Date(fetchedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0a0f; --surface: #111118; --surface2: #1a1a24;
          --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
          --text: #f0eff8; --muted: #7a7990;
          --accent: #ff6b35; --accent2: #ffd166; --accent3: #06d6a0;
        }
        body { background: var(--bg); color: var(--text); font-family: 'Syne', sans-serif; min-height: 100vh; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 36, animation: 'fadeUp 0.4s ease both' }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.1 }}>
              Amazon <span style={{ color: 'var(--accent)' }}>Top Sellers</span><br />Daily Tracker
            </h1>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
              ZIP 10019 · NYC · Beauty · Electronics · Home &amp; Kitchen
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface2)', border: '1px solid var(--border2)', borderRadius: 8, padding: '8px 14px', fontFamily: 'DM Mono, monospace', fontSize: 12, color: 'var(--accent2)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent3)', boxShadow: '0 0 8px var(--accent3)', animation: 'pulse 2s infinite' }} />
            10019 · NYC
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap', animation: 'fadeUp 0.4s ease 0.1s both' }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: 4 }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '7px 16px', borderRadius: 7, fontFamily: 'Syne, sans-serif', fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: category === cat ? '1px solid var(--border2)' : '1px solid transparent',
                background: category === cat ? 'var(--surface2)' : 'transparent',
                color: category === cat ? 'var(--text)' : 'var(--muted)', transition: 'all 0.2s',
              }}>
                {CAT_LABELS[cat]}
              </button>
            ))}
          </div>
          <button onClick={fetchReport} disabled={loading} style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8,
            background: loading ? '#553322' : 'var(--accent)', color: '#fff', border: 'none',
            borderRadius: 8, padding: '10px 20px', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', opacity: loading ? 0.7 : 1,
          }}>
            {loading
              ? <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Fetching...</>
              : '⟳ Run Daily Report'
            }
          </button>
        </div>

        {/* Status bar */}
        {status && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
            padding: '12px 16px', fontFamily: 'DM Mono, monospace', fontSize: 12, marginBottom: 20,
            color: status.type === 'loading' ? 'var(--accent2)' : status.type === 'success' ? 'var(--accent3)' : '#ff4d6d',
            animation: 'fadeUp 0.3s ease both',
          }}>
            {status.type === 'loading'
              ? <span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
              : <span>{status.type === 'success' ? '✓' : '✗'}</span>
            }
            {status.msg}
          </div>
        )}

        {/* Summary strip */}
        {products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24, animation: 'fadeUp 0.4s ease both' }}>
            {[
              { label: 'Products Tracked', value: products.length },
              { label: 'Avg Rating', value: <>{avgRating}<span style={{ color: 'var(--accent)' }}>★</span></> },
              { label: 'Last Fetched', value: <span style={{ fontSize: 14 }}>{fetchTime}</span> },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 24px', color: 'var(--muted)' }}>
            <div style={{ fontSize: 44, opacity: 0.2, marginBottom: 14 }}>📦</div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>No data yet</h3>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 12, lineHeight: 1.7, maxWidth: 340, margin: '0 auto 20px' }}>
              Click "Run Daily Report" to fetch today's top selling products from Amazon for ZIP 10019.
            </p>
            <button onClick={fetchReport} style={{ background: 'transparent', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 8, padding: '10px 24px', fontFamily: 'Syne, sans-serif', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
              Fetch Today's Report →
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, animation: 'fadeUp 0.4s ease 0.2s both' }}>
            {filtered.map((p, i) => {
              const color = CAT_COLORS[p.category] || 'var(--accent)';
              const rev = p.reviews >= 1000 ? (p.reviews / 1000).toFixed(1) + 'k' : (p.reviews || '—');
              return (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 18, position: 'relative', overflow: 'hidden', transition: 'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; }}
                >
                  {/* top accent bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.8 }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, flex: 1 }}>{p.name}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color, background: color + '18', border: `1px solid ${color}35`, borderRadius: 4, padding: '3px 7px', flexShrink: 0 }}>#{p.rank}</div>
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, color: 'var(--muted)', marginBottom: 12 }}>
                    {p.brand}{p.badge ? <> · <span style={{ color }}>{p.badge}</span></> : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {[['Price', p.price || '—'], ['Rating', p.rating ? parseFloat(p.rating).toFixed(1) + ' ★' : '—'], ['Reviews', rev]].map(([label, val]) => (
                      <div key={label} style={{ background: 'var(--surface2)', borderRadius: 6, padding: '6px 10px', flex: 1 }}>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 3 }}>{label}</div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 13, fontWeight: 500 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                  {p.trend && p.trend !== 'stable' && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 10, fontFamily: 'DM Mono, monospace', fontSize: 10, padding: '3px 8px', borderRadius: 4, background: p.trend === 'up' ? 'rgba(6,214,160,0.1)' : 'rgba(255,77,109,0.1)', color: p.trend === 'up' ? 'var(--accent3)' : '#ff4d6d' }}>
                      {p.trend === 'up' ? '↑ Trending up' : '↓ Trending down'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        {fetchDate && (
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            Last updated: {fetchDate} at {fetchTime}
          </div>
        )}
      </div>
    </>
  );
}
