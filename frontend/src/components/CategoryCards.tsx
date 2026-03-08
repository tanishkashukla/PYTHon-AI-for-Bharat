import React from 'react';
import { 
  ShoppingBag, 
  Home, 
  Briefcase, 
  Users, 
  ShieldAlert,
  Heart,
  Car,
  HeartPulse,
  UserCheck,
  GraduationCap,
  Receipt,
  Gavel
} from 'lucide-react';
import { motion } from 'motion/react';

export const CATEGORIES = [
  { id: 'consumer_rights', label: { en: 'Consumer Rights', hi: 'उपभोक्ता अधिकार' }, icon: ShoppingBag, desc: { en: 'Defective products, refunds, unfair trades.', hi: 'दोषपूर्ण उत्पाद, धनवापसी, अनुचित व्यापार।' } },
  { id: 'property_housing', label: { en: 'Property & Housing', hi: 'संपत्ति और आवास' }, icon: Home, desc: { en: 'Rent disputes, ownership, land laws.', hi: 'किराया विवाद, स्वामित्व, भूमि कानून।' } },
  { id: 'family', label: { en: 'Family Matters', hi: 'पारिवारिक मामले' }, icon: Users, desc: { en: 'Marriage, divorce, inheritance, custody.', hi: 'विवाह, तलाक, विरासत, हिरासत।' } },
  { id: 'employment', label: { en: 'Employment Law', hi: 'रोजगार कानून' }, icon: Briefcase, desc: { en: 'Wages, termination, workplace rights.', hi: 'मजदूरी, समाप्ति, कार्यस्थल अधिकार।' } },
  { id: 'cyber_law', label: { en: 'Cyber Law', hi: 'साइबर कानून' }, icon: ShieldAlert, desc: { en: 'Online fraud, data theft, social media.', hi: 'ऑनलाइन धोखाधड़ी, डेटा चोरी, सोशल मीडिया।' } },
  { id: 'womens_rights', label: { en: "Women's Rights", hi: 'महिला अधिकार' }, icon: Heart, desc: { en: 'Legal protections, equality, safety.', hi: 'कानूनी सुरक्षा, समानता, सुरक्षा।' } },
  { id: 'motor_vehicle', label: { en: 'Motor Vehicle Act', hi: 'मोटर वाहन अधिनियम' }, icon: Car, desc: { en: 'Traffic rules, accidents, insurance.', hi: 'यातायात नियम, दुर्घटनाएं, बीमा।' } },
  { id: 'healthcare', label: { en: 'Healthcare Law', hi: 'स्वास्थ्य कानून' }, icon: HeartPulse, desc: { en: 'Patient rights, medical negligence.', hi: 'रोगी के अधिकार, चिकित्सा लापरवाही।' } },
  { id: 'senior_citizens', label: { en: 'Senior Citizens', hi: 'वरिष्ठ नागरिक' }, icon: UserCheck, desc: { en: 'Maintenance, protection of life.', hi: 'भरण-पोषण, जीवन की सुरक्षा।' } },
  { id: 'education', label: { en: 'Education Law', hi: 'शिक्षा कानून' }, icon: GraduationCap, desc: { en: 'Right to education, student rights.', hi: 'शिक्षा का अधिकार, छात्र अधिकार।' } },
  { id: 'tax_law', label: { en: 'Tax Law', hi: 'कर कानून' }, icon: Receipt, desc: { en: 'Income tax, GST, basic compliance.', hi: 'आयकर, जीएसटी, बुनियादी अनुपालन।' } },
  { id: 'criminal_law', label: { en: 'Criminal Law', hi: 'फौजदारी कानून' }, icon: Gavel, desc: { en: 'FIRs, bail, rights during arrest.', hi: 'एफआईआर, जमानत, गिरफ्तारी के अधिकार।' } },
];

interface CategoryCardsProps {
  language: 'en' | 'hi';
  onSelect: (id: string) => void;
  selectedCategory?: string;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({ language, onSelect, selectedCategory }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      {CATEGORIES.map((cat, idx) => (
        <motion.button
          key={cat.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ scale: 1.02, borderColor: 'rgba(90, 62, 43, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect(cat.id)}
          className={`flex flex-col items-start p-4 rounded-xl border transition-all text-left group ${
            selectedCategory === cat.id 
              ? 'bg-[#5a3e2b]/20 border-[#5a3e2b]/50 text-[#5a3e2b] glow-brown' 
              : 'bg-[#3d2b1f]/5 border-[#3d2b1f]/10 hover:bg-[#3d2b1f]/10'
          }`}
        >
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all ${
            selectedCategory === cat.id 
              ? 'bg-[#5a3e2b] text-[#f5f2ed]' 
              : 'bg-[#5a3e2b]/10 text-[#5a3e2b] group-hover:bg-[#5a3e2b]/20'
          }`}>
            <cat.icon size={20} />
          </div>
          <h3 className={`font-bold text-[11px] mb-1 uppercase tracking-wider ${selectedCategory === cat.id ? 'text-[#5a3e2b]' : 'text-[#5a3e2b]/80'}`}>
            {cat.label[language]}
          </h3>
          <p className={`text-[9px] leading-tight ${selectedCategory === cat.id ? 'text-[#5a3e2b]/60' : 'text-[#3d2b1f]/40'}`}>
            {cat.desc[language]}
          </p>
        </motion.button>
      ))}
    </div>
  );
};
