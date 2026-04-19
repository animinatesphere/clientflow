import { useState } from 'react';
import { ChevronRight, X, Users, ShoppingBag, MessageCircle, Zap } from 'lucide-react';
import Modal from '../ui/Modal';

export default function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(0);

  const SLIDES = [
    {
      title: "Welcome to ClientFlow! 🚀",
      desc: "Run your WhatsApp business like a pro Nigerian vendor. Let's show you how it works in 30 seconds.",
      icon: <Zap size={48} color="var(--green)" />,
      color: "var(--green)"
    },
    {
      title: "Save Every Customer",
      desc: "Never lose a contact again. Add customers with names and tags like 'VIP' or 'New'. Each person gets their own business card.",
      icon: <Users size={48} color="var(--blue)" />,
      color: "var(--blue)"
    },
    {
      title: "Track Your Money",
      desc: "Stop using notebooks! Track orders from 'Pending' to 'Paid' to 'Delivered'. Your revenue dashboard updates automatically.",
      icon: <ShoppingBag size={48} color="var(--amber)" />,
      color: "var(--amber)"
    },
    {
      title: "Instant WhatsApp Links",
      desc: "No more searching for names in WhatsApp. Just click the message icon and we'll open the right chat with your message ready.",
      icon: <MessageCircle size={48} color="var(--green)" />,
      color: "var(--green)"
    }
  ];

  const current = SLIDES[step];

  return (
    <Modal onClose={onClose} title="Quick Guide">
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ 
          width: 100, height: 100, 
          background: `${current.color}10`, 
          border: `2px solid ${current.color}30`,
          borderRadius: 24,
          display: 'flex', alignItems: 'center', justifyCenter: 'center',
          margin: '0 auto 24px',
          animation: 'floatCard 4s ease-in-out infinite',
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          {current.icon}
        </div>

        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 12 }}>{current.title}</h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 32 }}>
          {current.desc}
        </p>

        {/* Progress Dots */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{ 
              width: i === step ? 24 : 8, 
              height: 8, 
              background: i === step ? current.color : 'var(--bg-hover)', 
              borderRadius: 99,
              transition: 'all 0.3s ease'
            }} />
          ))}
        </div>

        <button 
          className="lp-cta-btn" 
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => step < SLIDES.length - 1 ? setStep(step + 1) : onClose()}
        >
          <span>{step === SLIDES.length - 1 ? "Start Using ClientFlow" : "Next Step"}</span>
          <ChevronRight size={18} />
          <div className="lp-cta-shine" />
        </button>
      </div>
    </Modal>
  );
}
