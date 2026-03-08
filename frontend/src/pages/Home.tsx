import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  ArrowRight,
  Shield,
  BookOpen,
  Gavel,
  Briefcase,
  ShieldAlert,
  Users,
  Car,
  HeartPulse,
  UserCheck,
  GraduationCap,
  Receipt,
  Heart
} from 'lucide-react';
import { motion } from 'motion/react';
import { LanguageToggle } from '../components/LanguageToggle';
import { CustomCursor } from '../components/CustomCursor';
import { ThemeToggle } from '../components/ThemeToggle';
import { generateSessionId } from '../lib/api';

export default function Home() {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [sessionId] = useState(generateSessionId());
  const navigate = useNavigate();

  const labels = {
    en: {
      name: 'KnowYourRights',
      heroTitle: 'LEGAL CLARITY',
      heroSubtitle: 'FOR EVERY CITIZEN',
      tagline: 'Empowering Indian citizens with simplified legal knowledge.',
      cta: 'GET LEGAL CLARITY',
      features: [
        { icon: Shield, title: 'Consumer Rights', desc: 'Protect yourself against unfair trade practices.' },
        { icon: BookOpen, title: 'Property Law', desc: 'Understand land titles, rentals, and ownership.' },
        { icon: Users, title: 'Family Matters', desc: 'Guidance on marriage, divorce, and inheritance.' },
        { icon: Briefcase, title: 'Employment Law', desc: 'Rights regarding wages, termination, and workplace.' },
        { icon: ShieldAlert, title: 'Cyber Law', desc: 'Protection against online fraud and data theft.' },
        { icon: Heart, title: "Women's Rights", desc: 'Legal protections and equality in society.' },
        { icon: Car, title: 'Motor Vehicle Act', desc: 'Traffic rules, accidents, and insurance claims.' },
        { icon: HeartPulse, title: 'Healthcare Law', desc: 'Patient rights and medical negligence guidance.' },
        { icon: UserCheck, title: 'Senior Citizens', desc: 'Rights to maintenance and protection of life.' },
        { icon: GraduationCap, title: 'Education Law', desc: 'Right to education and student protections.' },
        { icon: Receipt, title: 'Tax Law', desc: 'Understanding income tax and GST basics.' },
        { icon: Gavel, title: 'Criminal Law', desc: 'Understand FIRs, bail, and rights during arrest.' }
      ],
      disclaimer: 'KnowYourRightsAI provides legal information, not legal advice. Always consult a qualified professional for specific cases.'
    },
    hi: {
      name: 'KnowYourRights',
      heroTitle: 'कानूनी स्पष्टता',
      heroSubtitle: 'हर नागरिक के लिए',
      tagline: 'सरलीकृत कानूनी ज्ञान के साथ भारतीय नागरिकों को सशक्त बनाना।',
      cta: 'कानूनी स्पष्टता प्राप्त करें',
      features: [
        { icon: Shield, title: 'उपभोक्ता अधिकार', desc: 'अनुचित व्यापार प्रथाओं के खिलाफ खुद को सुरक्षित रखें।' },
        { icon: BookOpen, title: 'संपत्ति कानून', desc: 'भूमि शीर्षक, किराए और स्वामित्व को समझें।' },
        { icon: Users, title: 'पारिवारिक मामले', desc: 'विवाह, तलाक और विरासत पर मार्गदर्शन।' },
        { icon: Briefcase, title: 'रोजगार कानून', desc: 'मजदूरी, समाप्ति और कार्यस्थल से संबंधित अधिकार।' },
        { icon: ShieldAlert, title: 'साइबर कानून', desc: 'ऑनलाइन धोखाधड़ी और डेटा चोरी से सुरक्षा।' },
        { icon: Heart, title: 'महिला अधिकार', desc: 'समाज में कानूनी सुरक्षा और समानता।' },
        { icon: Car, title: 'मोटर वाहन अधिनियम', desc: 'यातायात नियम, दुर्घटनाएं और बीमा दावे।' },
        { icon: HeartPulse, title: 'स्वास्थ्य कानून', desc: 'रोगी के अधिकार और चिकित्सा लापरवाही मार्गदर्शन।' },
        { icon: UserCheck, title: 'वरिष्ठ नागरिक', desc: 'भरण-पोषण और जीवन की सुरक्षा का अधिकार।' },
        { icon: GraduationCap, title: 'शिक्षा कानून', desc: 'शिक्षा का अधिकार और छात्र सुरक्षा।' },
        { icon: Receipt, title: 'कर कानून', desc: 'आयकर और जीएसटी की बुनियादी समझ।' },
        { icon: Gavel, title: 'फौजदारी कानून', desc: 'एफआईआर, जमानत और गिरफ्तारी के दौरान अधिकारों को समझें।' }
      ],
      disclaimer: 'KnowYourRightsAI कानूनी जानकारी प्रदान करता है, कानूनी सलाह नहीं। विशिष्ट मामलों के लिए हमेशा एक योग्य पेशेवर से परामर्श लें।'
    }
  };

  const l = labels[language];

  return (
    <div className="min-h-screen bg-white text-[#3d2b1f] font-sans selection:bg-[#5a3e2b]/10 overflow-x-hidden bg-grain dark:bg-[#f5f2ed] transition-colors duration-300">
      <CustomCursor />
      {/* Navigation - Changed from fixed to absolute to scroll with page */}
      <nav className="absolute top-0 w-full z-50 px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Scale className="text-[#5a3e2b]" size={20} />
          <span className="text-xs font-black uppercase tracking-[0.3em]">{l.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <LanguageToggle language={language} onToggle={setLanguage} />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-2 mb-8">
              <motion.h1 
                className="text-[15vw] lg:text-[100px] leading-[0.85] font-black tracking-tighter uppercase"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {l.heroTitle}
              </motion.h1>
              <motion.h1 
                className="text-[15vw] lg:text-[100px] leading-[0.85] font-black tracking-tighter uppercase text-[#5a3e2b]"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {l.heroSubtitle}
              </motion.h1>
            </div>
            
            <motion.p 
              className="text-lg lg:text-xl text-[#3d2b1f]/60 max-w-md mb-10 font-medium leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {l.tagline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <button 
                onClick={() => navigate('/assistant')}
                className="group flex items-center gap-4 bg-[#5a3e2b] text-[#f5f2ed] px-8 py-4 rounded-full font-black uppercase text-xs tracking-widest hover:bg-[#3d2b1f] transition-all duration-500 shadow-sm"
              >
                {l.cta}
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative aspect-square lg:aspect-auto lg:h-[600px] rounded-[40px] overflow-hidden border border-[#5a3e2b]/10"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=1000" 
              alt="Legal Statue"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 dark:opacity-80"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent dark:from-[#f5f2ed]" />
            
            {/* Floating Info Card */}
            <motion.div 
              className="absolute bottom-8 left-8 right-8 glass-brown p-6 rounded-3xl border border-[#5a3e2b]/10"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#5a3e2b] flex items-center justify-center text-[#f5f2ed]">
                  <Scale size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#5a3e2b]">AI Legal Assistant</h3>
                  <p className="text-xs text-[#3d2b1f]/60 font-bold">Available 24/7 for your queries</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <section className="mt-32 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {l.features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-[32px] border border-[#5a3e2b]/10 hover:border-[#5a3e2b]/30 transition-colors group"
            >
              <feature.icon className="text-[#5a3e2b] mb-6 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="text-lg font-black uppercase tracking-tight mb-3">{feature.title}</h3>
              <p className="text-sm text-[#3d2b1f]/60 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-[#5a3e2b]/10">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-8">
            <Scale className="text-[#5a3e2b]" size={24} />
            <span className="text-sm font-black uppercase tracking-[0.4em]">{l.name}</span>
          </div>
          <p className="text-[10px] text-[#3d2b1f]/40 font-bold uppercase tracking-[0.3em] max-w-2xl leading-relaxed">
            {l.disclaimer}
          </p>
        </div>
      </footer>
    </div>
  );
}
