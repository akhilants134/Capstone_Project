/* ===== Messages Page ===== */
import { useState } from 'react';

const CONVOS = [
  { id: 1, name: 'TechCorp Inc.',   initial: 'T', color: '#6366f1', lastMsg: 'We can ship the laptops next Monday.', time: '2m ago',   unread: 2, online: true  },
  { id: 2, name: 'HealthFirst NGO', initial: 'H', color: '#10b981', lastMsg: 'Please confirm your delivery address.', time: '1h ago',   unread: 1, online: false },
  { id: 3, name: 'EduGrant Org',    initial: 'E', color: '#f59e0b', lastMsg: 'The course access codes are ready.',   time: '3h ago',   unread: 0, online: true  },
  { id: 4, name: 'FoodBank India',  initial: 'F', color: '#8b5cf6', lastMsg: 'Delivery was successful. Thank you!',  time: 'Yesterday', unread: 0, online: false },
  { id: 5, name: 'GrantHub',        initial: 'G', color: '#ef4444', lastMsg: 'Your application is under review.',   time: '2 days ago', unread: 0, online: false },
];

const MSGS_BY_ID = {
  1: [
    { from: 'them', text: 'Hello! We saw your request for laptops. We have 5 MacBook Pros available.', time: '10:00 AM' },
    { from: 'me',   text: 'That is wonderful! Can you tell me more about the condition and specs?', time: '10:05 AM' },
    { from: 'them', text: 'They are 2021 M1 models, 16GB RAM, 512GB SSD. All in excellent condition.', time: '10:08 AM' },
    { from: 'me',   text: 'Perfect. How soon can we arrange the handover?', time: '10:12 AM' },
    { from: 'them', text: 'We can ship the laptops next Monday.', time: '10:15 AM' },
  ],
  2: [
    { from: 'them', text: 'Hi! We matched your medical supplies request.', time: 'Yesterday' },
    { from: 'me',   text: 'Great! What is included in the kits?', time: 'Yesterday' },
    { from: 'them', text: 'Bandages, antiseptics, gloves, thermometers and basic medications.', time: 'Yesterday' },
    { from: 'them', text: 'Please confirm your delivery address.', time: '9:00 AM' },
  ],
};

export default function MessagesPage({ navigate }) {
  const [active, setActive] = useState(CONVOS[0]);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(MSGS_BY_ID);

  const currentMsgs = messages[active.id] || [];

  const send = () => {
    if (!input.trim()) return;
    const newMsg = { from: 'me', text: input.trim(), time: 'Now' };
    setMessages(prev => ({ ...prev, [active.id]: [...(prev[active.id] || []), newMsg] }));
    setInput('');
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '4px' }}>Messages 💬</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Communicate with donors and clients</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '16px', height: '600px' }}>
        {/* Conversation list */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
            <input type="text" className="form-input" placeholder="🔍 Search messages..." style={{ padding: '9px 14px', fontSize: '13px' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {CONVOS.map(c => (
              <div key={c.id} onClick={() => setActive(c)}
                style={{ padding: '14px 16px', borderBottom: '1px solid rgba(99,102,241,0.06)', cursor: 'pointer', background: active.id === c.id ? 'rgba(99,102,241,0.1)' : 'transparent', borderLeft: active.id === c.id ? '3px solid #6366f1' : '3px solid transparent', transition: 'all 0.15s' }}
                onMouseEnter={e => { if (active.id !== c.id) e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
                onMouseLeave={e => { if (active.id !== c.id) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${c.color}, ${c.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: 'white', fontFamily: 'Outfit,sans-serif' }}>{c.initial}</div>
                    {c.online && <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid #0d0f22' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
                      <span style={{ fontSize: '10px', color: '#475569', flexShrink: 0, marginLeft: '6px' }}>{c.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                      <span style={{ fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{c.lastMsg}</span>
                      {c.unread > 0 && <span style={{ background: '#6366f1', color: 'white', borderRadius: '9999px', fontSize: '10px', fontWeight: '700', padding: '1px 6px', flexShrink: 0 }}>{c.unread}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Chat header */}
          <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${active.color}, ${active.color}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '700', color: 'white' }}>{active.initial}</div>
              {active.online && <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid #13152b' }} />}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9' }}>{active.name}</div>
              <div style={{ fontSize: '11px', color: active.online ? '#10b981' : '#64748b' }}>{active.online ? '● Online' : 'Offline'}</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary btn-sm">📞 Call</button>
              <button className="btn btn-secondary btn-sm">🔍 Search</button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {currentMsgs.length === 0 && (
              <div style={{ textAlign: 'center', margin: 'auto', color: '#64748b' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px' }}>💬</div>
                <p style={{ fontSize: '14px' }}>Start the conversation!</p>
              </div>
            )}
            {currentMsgs.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '70%', padding: '10px 16px', borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', background: msg.from === 'me' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(30,34,64,0.9)', border: msg.from === 'me' ? 'none' : '1px solid rgba(99,102,241,0.2)' }}>
                  <p style={{ fontSize: '13px', color: '#f1f5f9', margin: 0, lineHeight: '1.5' }}>{msg.text}</p>
                  <span style={{ fontSize: '10px', color: msg.from === 'me' ? 'rgba(255,255,255,0.6)' : '#475569', display: 'block', marginTop: '4px', textAlign: msg.from === 'me' ? 'right' : 'left' }}>{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(99,102,241,0.1)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px' }}>📎</button>
            <input
              type="text" className="form-input" placeholder="Type a message..."
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              style={{ flex: 1, padding: '10px 16px' }}
            />
            <button className="btn btn-primary btn-sm" onClick={send} disabled={!input.trim()}>Send →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
