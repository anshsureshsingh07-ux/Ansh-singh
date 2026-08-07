import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, MapPin, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { AUTHOR_INFO } from '../data/authorData';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitted(true);
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.7 } });
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 bg-slate-950/60">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Send className="w-3.5 h-3.5" />
            <span>Correspondence</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-slate-100 tracking-tight">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">Touch</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
            Have thoughts on Ansh's books, media queries, or literary collaborations? Send a direct message!
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

              <div className="space-y-4 text-sm text-slate-300 mb-8">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Direct Email</span>
                    <a href={`mailto:${AUTHOR_INFO.socials.email}`} className="font-medium text-slate-200 hover:text-amber-300">
                      {AUTHOR_INFO.socials.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Location</span>
                    <p className="font-medium text-slate-200">Surat, Gujarat, India</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs italic text-slate-400">
              "Every message from a reader is a spark of inspiration that fuels the next chapter."
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 p-8 rounded-3xl bg-slate-900/90 border border-amber-500/20 shadow-2xl">
            {!submitted ? (
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

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-amber-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            ) : (
              <div className="py-12 text-center animate-in zoom-in-95">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-slate-100 mb-2">Message Sent Successfully!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto mb-6">
                  Thank you for reaching out, {name}. Ansh has received your note and will respond to your email soon!
                </p>
                <button
                  onClick={() => { setSubmitted(false); setName(''); setEmail(''); setMessage(''); setSubject(''); }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
                >
                  Send Another Message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
