/* ===== Messages Page ===== */
import { useState, useEffect } from 'react';
import { getConversations, getMessages, sendMessage } from '../services/api';

const defaultConvos = [
  { id: 1, name: 'TechCorp Inc.',   initial: 'T', color: '#6366f1', lastMsg: 'We can ship the laptops next Monday.', time: '2m ago',   unread: 2, online: true  },
  { id: 2, name: 'HealthFirst NGO', initial: 'H', color: '#10b981', lastMsg: 'Please confirm your delivery address.', time: '1h ago',   unread: 1, online: false },
];

export default function MessagesPage({ navigate }) {
  const [convos, setConvos] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch conversations
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        setLoading(true);
        const data = await getConversations();
        const formatted = data.conversations?.map(c => ({
          id: c.user._id,
          name: c.user.name,
          initial: c.user.name.charAt(0),
          color: '#6366f1', // Placeholder
          lastMsg: c.lastMsg,
          time: 'Recently',
          unread: c.unread,
          online: true
        })) || defaultConvos;
        setConvos(formatted);
        if (formatted.length > 0 && !active) setActive(formatted[0]);
      } catch (err) {
        console.error('Failed to fetch conversations:', err);
        setConvos(defaultConvos);
        if (defaultConvos.length > 0 && !active) setActive(defaultConvos[0]);
      } finally {
        setLoading(false);
      }
    };
    fetchConvos();
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!active) return;
    const fetchMessages = async () => {
      try {
        const data = await getMessages(active.id);
        const formatted = data.messages?.map(m => ({
          from: m.sender === active.id ? 'them' : 'me',
          text: m.text,
          time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })) || [];
        setMessages(formatted);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [active]);

  const send = async () => {
    if (!input.trim() || !active) return;
    const tempMsg = { from: 'me', text: input.trim(), time: 'Now' };
    setMessages(prev => [...prev, tempMsg]);
    const textToSend = input.trim();
    setInput('');

    try {
      await sendMessage({ receiver: active.id, text: textToSend });
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  if (!active && !loading) return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>💬</div>
      <h2 style={{ color: '#f1f5f9' }}>No conversations yet</h2>
      <p style={{ color: '#64748b' }}>Start by browsing resources and contacting donors.</p>
      <button className="btn btn-primary" style={{ marginTop: '20px' }} onClick={() => navigate('browse')}>Browse Resources</button>
    </div>
  );

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', color: '#f1f5f9', marginBottom: '4px' }}>Messages 💬</h1>
        <p style={{ color: '#64748b', fontSize: '14px' }}>Communicate with donors and clients</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '20px', height: 'calc(100vh - 200px)', minHeight: '600px' }}>
        {/* Conversation list */}
        <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <input type="text" className="form-input" placeholder="🔍 Search conversations..." style={{ padding: '10px 16px', fontSize: '13px' }} />
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {convos.map(c => (
              <div key={c.id} onClick={() => setActive(c)}
                style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.03)', cursor: 'pointer', background: active?.id === c.id ? 'rgba(99,102,241,0.1)' : 'transparent', borderLeft: active?.id === c.id ? '4px solid #6366f1' : '4px solid transparent', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: 'white' }}>{c.initial}</div>
                    {c.online && <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid #0d0f22' }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#f1f5f9', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{c.time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{c.lastMsg}</span>
                      {c.unread > 0 && <span style={{ background: '#6366f1', color: 'white', borderRadius: '9999px', fontSize: '10px', fontWeight: '800', padding: '2px 8px', marginLeft: '8px' }}>{c.unread}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat window */}
        {active ? (
          <div className="card" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg, #6366f1, #8b5cf6)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: '800', color: 'white' }}>{active.initial}</div>
                {active.online && <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', border: '2px solid #0d0f22' }} />}
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#f1f5f9' }}>{active.name}</div>
                <div style={{ fontSize: '11px', color: active.online ? '#10b981' : '#64748b' }}>{active.online ? '● Active Now' : 'Offline'}</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button className="btn btn-secondary btn-sm" style={{ padding: '8px 12px' }}>📞</button>
                <button className="btn btn-secondary btn-sm" style={{ padding: '8px 12px' }}>🔍</button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ maxWidth: '70%', padding: '12px 18px', borderRadius: msg.from === 'me' ? '20px 20px 4px 20px' : '20px 20px 20px 4px', background: msg.from === 'me' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(30,34,64,0.9)', border: msg.from === 'me' ? 'none' : '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <p style={{ fontSize: '14px', color: '#f1f5f9', margin: 0, lineHeight: '1.6' }}>{msg.text}</p>
                    <span style={{ fontSize: '10px', color: msg.from === 'me' ? 'rgba(255,255,255,0.6)' : '#64748b', display: 'block', marginTop: '6px', textAlign: msg.from === 'me' ? 'right' : 'left' }}>{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', opacity: 0.6 }}>📎</button>
              <input
                type="text" className="form-input" placeholder="Type your message..."
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                style={{ flex: 1, padding: '12px 20px', borderRadius: '14px' }}
              />
              <button className="btn btn-primary" onClick={send} disabled={!input.trim()} style={{ padding: '12px 24px' }}>Send →</button>
            </div>
          </div>
        ) : (
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
            <p>Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

