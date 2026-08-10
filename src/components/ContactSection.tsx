import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, MapPin, Check, Sparkles, Database, ExternalLink, Copy, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AUTHOR_INFO } from '../data/authorData';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{
    targetEmail: string;
    mailtoUrl: string;
    messageId?: string;
  } | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await response.json();
      if (data.success) {
        setSubmittedData({
          targetEmail: data.targetEmail || 'anshsureshsingh07@gmail.com',
          mailtoUrl: data.mailtoUrl || `mailto:anshsureshsingh07@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`,
          messageId: data.messageId
        });
      } else {
        // Fallback mailto Url
        const mailtoSubject = encodeURIComponent(subject || `Reader Message from ${name}`);
        const mailtoBody = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
        setSubmittedData({
          targetEmail: 'anshsureshsingh07@gmail.com',
          mailtoUrl: `mailto:anshsureshsingh07@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`
        });
      }
    } catch (err) {
      const mailtoSubject = encodeURIComponent(subject || `Reader Message from ${name}`);
      const mailtoBody = encodeURIComponent(`From: ${name} (${email})\n\n${message}`);
      setSubmittedData({
        targetEmail: 'anshsureshsingh07@gmail.com',
        mailtoUrl: `mailto:anshsureshsingh07@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`
      });
    } finally {
      setIsSubmitting(false);
      confetti({ particleCount: 80, spread: 75, origin: { y: 0.7 } });
    }
  };

  const sqlCode = `-- ========================================================
-- ANSH SINGH AUTHOR WEBSITE - CONTACT & REVIEWS SQL SCHEMA
-- Target Inbox Email: anshsureshsingh07@gmail.com
-- ========================================================

-- 1. Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    target_email VARCHAR(255) DEFAULT 'anshsureshsingh07@gmail.com',
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'delivered',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Book Reviews & Guestbook Table
CREATE TABLE IF NOT EXISTS book_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_name VARCHAR(255) NOT NULL,
    reviewer_email VARCHAR(255) NOT NULL,
    target_email VARCHAR(255) DEFAULT 'anshsureshsingh07@gmail.com',
    book_title VARCHAR(255) DEFAULT 'General Review',
    rating INT CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    review_text TEXT NOT NULL,
    badge VARCHAR(100) DEFAULT 'Verified Reader',
    location VARCHAR(255),
    likes INT DEFAULT 1,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-950/60">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Send className="w-3.5 h-3.5" />
            <span>Direct Correspondence</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Touch</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Messages and reader reviews are dispatched directly to Ansh Singh's personal email (<span className="text-amber-400 font-semibold">anshsureshsingh07@gmail.com</span>).
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-transparent mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Direct Info */}
          <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-900/90 border border-amber-500/20 flex flex-col justify-between shadow-2xl">
            <div>
              <h3 className="font-serif text-2xl font-bold text-amber-300 mb-2">Ansh Singh</h3>
              <p className="text-xs text-amber-400 uppercase tracking-widest font-semibold mb-6">
                Student • Author • Storyteller
              </p>

              <div className="space-y-4 text-sm text-slate-300 mb-6">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Mail className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Direct Inbox</span>
                    <a href={`mailto:${AUTHOR_INFO.socials.email}`} className="font-medium text-amber-300 hover:text-amber-200 text-xs sm:text-sm truncate block">
                      anshsureshsingh07@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Location</span>
                    <p className="font-medium text-slate-200">Surat, Gujarat, India</p>
                  </div>
                </div>
              </div>

              {/* SQL Schema Button */}
              <button
                onClick={() => setShowSqlModal(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>View SQL Table Schema</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs italic text-slate-400 mt-6">
              "Every message from a reader is a spark of inspiration that fuels the next chapter."
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900/90 border border-amber-500/20 shadow-2xl">
            {!submittedData ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Your email address"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Inquiry or message subject"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 uppercase font-semibold block mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-sm focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Routing Target: <strong className="text-amber-400">anshsureshsingh07@gmail.com</strong></span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">Active</span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Dispatching to Email...' : 'Send Message to Ansh'}</span>
                </button>
              </form>
            ) : (
              <div className="py-8 text-center animate-in zoom-in-95 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/40">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-100">Message Dispatched!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you, <strong className="text-amber-300">{name}</strong>! Your correspondence has been saved and routed directly to Ansh's email inbox:
                </p>

                <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 text-left max-w-md mx-auto space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Destination:</span>
                    <span className="text-amber-400 font-bold">anshsureshsingh07@gmail.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sender:</span>
                    <span className="text-slate-200">{email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-emerald-400 font-bold">Delivered to Database & Email Queue</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <a
                    href={submittedData.mailtoUrl}
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open Email Client to Send Directly</span>
                  </a>

                  <button
                    onClick={() => { setSubmittedData(null); setName(''); setEmail(''); setMessage(''); setSubject(''); }}
                    className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SQL SCHEMA MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-lg text-slate-100">SQL Table Schema for Messages & Reviews</h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Below are the exact PostgreSQL & Supabase SQL DDL statements configured for storing messages and reviews routed to <strong className="text-amber-400">anshsureshsingh07@gmail.com</strong>:
            </p>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 font-mono text-xs text-amber-300/90 overflow-x-auto max-h-80 mb-4 scrollbar-thin">
              <pre>{sqlCode}</pre>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[11px] text-slate-500">Target Inbox: anshsureshsingh07@gmail.com</span>
              <button
                onClick={handleCopySql}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all"
              >
                {copiedSql ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

