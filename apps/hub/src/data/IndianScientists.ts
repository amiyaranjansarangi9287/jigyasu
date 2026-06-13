// src/data/IndianScientists.ts
// Indian Scientific Heritage Database
// Mission Alignment: Identity Value - "Indian scientists, Indian examples, Indian languages, Indian realities"

export interface IndianScientist {
  id: string;
  name: string;
  nameHindi?: string;
  nameTamil?: string;
  nameTelugu?: string;
  nameKannada?: string;
  nameOdia?: string;
  field: string;
  contribution: string;
  year?: number;
  era?: 'ancient' | 'medieval' | 'modern' | 'contemporary';
  imageUrl?: string;
  story: string;
  relatedConcepts: string[];
  region?: string;
  gender?: 'male' | 'female';
}

export const INDIAN_SCIENTISTS: IndianScientist[] = [
  // Ancient Scientists
  {
    id: 'aryabhata',
    name: 'Aryabhata',
    nameHindi: 'आर्यभट',
    nameTamil: 'ஆரியபட்டா',
    nameTelugu: 'ఆర్యభట్ట',
    nameKannada: 'ಆರ್ಯಭಟ',
    nameOdia: 'ଆର୍ୟଭଟ',
    field: 'Mathematics & Astronomy',
    contribution: 'Described that Earth rotates on its axis and orbits the Sun. Described gravity as a natural attraction toward Earth.',
    year: 476,
    era: 'ancient',
    story: 'Aryabhata was born in Kusumapura (modern-day Patna). At just 23 years old, he wrote the Aryabhatiya, a revolutionary text that proposed Earth rotates on its axis - a radical idea 1,500 years ago! He also calculated the value of π (pi) to 4 decimal places.',
    relatedConcepts: ['gravity', 'astronomy', 'pi', 'rotation', 'solar-system'],
    region: 'Bihar',
    gender: 'male',
  },
  {
    id: 'brahmagupta',
    name: 'Brahmagupta',
    nameHindi: 'ब्रह्मगुप्त',
    nameTamil: 'பிரம்குப்தா',
    nameTelugu: 'బ్రహ్మగుప్త',
    nameKannada: 'ಬ್ರಹ್ಮಗುಪ್ತ',
    nameOdia: 'ବ୍ରହ୍ମଗୁପ୍ତ',
    field: 'Mathematics',
    contribution: 'First to define zero as a number and developed rules for arithmetic with zero. Described gravity as an attractive force.',
    year: 598,
    era: 'ancient',
    story: 'Brahmagupta was born in Ujjain, Madhya Pradesh. He was the first mathematician to treat zero as a number, not just a placeholder. His book Brahmasphutasiddhanta introduced the concept of negative numbers and described gravity as an attractive force.',
    relatedConcepts: ['zero', 'negative-numbers', 'gravity', 'arithmetic'],
    region: 'Madhya Pradesh',
    gender: 'male',
  },
  {
    id: 'sushruta',
    name: 'Sushruta',
    nameHindi: 'सुश्रुत',
    nameTamil: 'சுஷ்ருதா',
    nameTelugu: 'సుశ్రుత',
    nameKannada: 'ಸುಶ್ರುತ',
    nameOdia: 'ସୁଶ୍ରୁତ',
    field: 'Medicine & Surgery',
    contribution: 'Father of surgery. Developed over 300 surgical procedures including cataract surgery and rhinoplasty.',
    year: -600,
    era: 'ancient',
    story: 'Sushruta lived in Varanasi around 600 BCE. His text Sushruta Samhita described over 300 surgical procedures, including cataract surgery and rhinoplasty (nose reconstruction). He invented over 120 surgical instruments - many still used today!',
    relatedConcepts: ['human-body', 'surgery', 'medicine', 'anatomy'],
    region: 'Uttar Pradesh',
    gender: 'male',
  },
  {
    id: 'varahamihira',
    name: 'Varahamihira',
    nameHindi: 'वराहमिहिर',
    nameTamil: 'வராகமிஹிரா',
    nameTelugu: 'వరాహమిహిర',
    nameKannada: 'ವರಾಹಮಿಹಿರ',
    nameOdia: 'ବରାହମିହିର',
    field: 'Astronomy',
    contribution: 'Predicted eclipses and calculated planetary movements. Wrote Brihat Samhita covering architecture, temples, and astronomy.',
    year: 505,
    era: 'ancient',
    story: 'Varahamihira was a polymath from Ujjain. He could predict eclipses accurately and calculated the movement of planets. His book Brihat Samhita covered everything from astronomy to architecture to temple construction - showing how science connects to daily life.',
    relatedConcepts: ['eclipses', 'planets', 'astronomy', 'architecture'],
    region: 'Madhya Pradesh',
    gender: 'male',
  },

  // Medieval Scientists
  {
    id: 'bhaskara-ii',
    name: 'Bhaskara II',
    nameHindi: 'भास्कर द्वितीय',
    nameTamil: 'பாஸ்கரா II',
    nameTelugu: 'భాస్కర II',
    nameKannada: 'ಭಾಸ್ಕರ II',
    nameOdia: 'ଭାସ୍କର II',
    field: 'Mathematics',
    contribution: 'First to describe differential calculus and introduced the concept of infinity.',
    year: 1114,
    era: 'medieval',
    story: 'Bhaskara II was born in Bijapur, Karnataka. He was the first mathematician to describe differential calculus concepts independently in India. His book Lilavati is famous for its mathematical problems presented through stories.',
    relatedConcepts: ['calculus', 'infinity', 'differential', 'mathematics'],
    region: 'Karnataka',
    gender: 'male',
  },
  {
    id: 'madhava',
    name: 'Madhava of Sangamagrama',
    nameHindi: 'माधव',
    nameTamil: 'மாதவா',
    nameTelugu: 'మాధవ',
    nameKannada: 'ಮಾಧವ',
    nameOdia: 'ମାଧଵ',
    field: 'Mathematics',
    contribution: 'Founder of Kerala School of Astronomy and Mathematics. Discovered infinite series for π and sine functions.',
    year: 1350,
    era: 'medieval',
    story: 'Madhava lived in Kerala and founded the famous Kerala School of Mathematics. He discovered infinite series for π (pi) and sine functions independently in India. His work laid the foundation for calculus.',
    relatedConcepts: ['pi', 'sine', 'infinite-series', 'calculus'],
    region: 'Kerala',
    gender: 'male',
  },

  // Modern Scientists
  {
    id: 'j-c-bose',
    name: 'Jagadish Chandra Bose',
    nameHindi: 'जगदीश चंद्र बोस',
    nameTamil: 'ஜகதீஷ் சந்திர போஸ்',
    nameTelugu: 'జగదీష్ చంద్ర బోస్',
    nameKannada: 'ಜಗದೀಶ್ ಚಂದ್ರ ಬೋಸ್',
    nameOdia: 'ଜଗଦୀଶ ଚନ୍ଦ୍ର ବୋସ',
    field: 'Physics & Biology',
    contribution: 'Proved plants have life and can feel pain. Invented wireless communication before Marconi.',
    year: 1858,
    era: 'modern',
    story: 'J.C. Bose was born in Bengal. He proved that plants have life and can feel pain using his crescograph instrument. He also invented wireless communication - demonstrating it in 1895, two years before Marconi!',
    relatedConcepts: ['plants', 'wireless', 'radio-waves', 'biology'],
    region: 'West Bengal',
    gender: 'male',
  },
  {
    id: 'c-v-raman',
    name: 'C.V. Raman',
    nameHindi: 'सी.वी. रमन',
    nameTamil: 'சி.வி. ராமன்',
    nameTelugu: 'సి.వి. రామన్',
    nameKannada: 'ಸಿ.ವಿ. ರಾಮನ್',
    nameOdia: 'ସି.ଭି. ରାମନ୍',
    field: 'Physics',
    contribution: 'Discovered Raman Effect - how light scatters when passing through matter. First Indian to win Nobel Prize in Science.',
    year: 1888,
    era: 'modern',
    story: 'C.V. Raman was born in Tamil Nadu. He discovered the Raman Effect - how light changes color when passing through different materials. This discovery won him the Nobel Prize in 1930, making him the first Indian to win a Nobel in science!',
    relatedConcepts: ['light', 'scattering', 'spectrum', 'physics'],
    region: 'Tamil Nadu',
    gender: 'male',
  },
  {
    id: 's-n-bose',
    name: 'Satyendra Nath Bose',
    nameHindi: 'सत्येन्द्र नाथ बोस',
    nameTamil: 'சத்யேந்திர நாத் போஸ்',
    nameTelugu: 'సత్యేంద్ర నాథ్ బోస్',
    nameKannada: 'ಸತ್ಯೇಂದ್ರ ನಾಥ್ ಬೋಸ್',
    nameOdia: 'ସତ୍ୟେନ୍ଦ୍ର ନାଥ ବୋସ',
    field: 'Physics',
    contribution: 'Discovered Bose-Einstein statistics. Worked with Einstein on quantum mechanics.',
    year: 1894,
    era: 'modern',
    story: 'S.N. Bose was born in Kolkata. He discovered a new type of particle behavior now called "bosons" in his honor. He sent his work to Albert Einstein, who was so impressed he translated it into German and published it!',
    relatedConcepts: ['quantum', 'particles', 'statistics', 'physics'],
    region: 'West Bengal',
    gender: 'male',
  },
  {
    id: 'meghnad-saha',
    name: 'Meghnad Saha',
    nameHindi: 'मेघनाद साहा',
    nameTamil: 'மெக்நாத் சாஹா',
    nameTelugu: 'మేఘనాద్ సాహా',
    nameKannada: 'ಮೇಘನಾದ್ ಸಾಹಾ',
    nameOdia: 'ମେଘନାଦ ସାହା',
    field: 'Physics',
    contribution: 'Developed Saha ionization equation explaining stellar spectra and star classification.',
    year: 1893,
    era: 'modern',
    story: 'Meghnad Saha was born in Bangladesh (then part of India). His equation explained how stars produce different colors of light based on their temperature. This helped astronomers classify stars and understand the universe better!',
    relatedConcepts: ['stars', 'temperature', 'spectrum', 'astronomy'],
    region: 'Bangladesh',
    gender: 'male',
  },

  // Women Scientists
  {
    id: 'kadambini-ganguly',
    name: 'Kadambini Ganguly',
    nameHindi: 'कादंबिनी गांगुली',
    nameTamil: 'காதம்பினி கங்குலி',
    nameTelugu: 'కాదంబిని గాంగులీ',
    nameKannada: 'ಕಾದಂಬಿನಿ ಗಾಂಗುಲಿ',
    nameOdia: 'କାଦମ୍ବିନୀ ଗାଂଗୁଲୀ',
    field: 'Medicine',
    contribution: 'One of the first female doctors in India. Pioneered women in medicine.',
    year: 1861,
    era: 'modern',
    story: 'Kadambini Ganguly was born in Kolkata. She was one of the first two female graduates in India and one of the first female doctors. She fought against societal norms to pursue medicine, inspiring generations of women scientists.',
    relatedConcepts: ['medicine', 'women-in-science', 'biology'],
    region: 'West Bengal',
    gender: 'female',
  },
  {
    id: 'asima-chatterjee',
    name: 'Asima Chatterjee',
    nameHindi: 'असीमा चटर्जी',
    nameTamil: 'அஸிமா சட்டர்ஜி',
    nameTelugu: 'అసిమా ఛటర్జీ',
    nameKannada: 'ಅಸಿಮಾ ಚಟರ್జಿ',
    nameOdia: 'ଅସିମା ଚାଟର୍ଜୀ',
    field: 'Chemistry',
    contribution: 'Pioneered research on anti-malarial drugs and anti-epileptic drugs from Indian plants.',
    year: 1917,
    era: 'modern',
    story: 'Asima Chatterjee was born in Kolkata. She was the first Indian woman to receive a PhD in science. She researched medicinal plants to develop anti-malarial and anti-epileptic drugs, showing how traditional Indian knowledge connects to modern medicine.',
    relatedConcepts: ['chemistry', 'medicine', 'plants', 'drugs'],
    region: 'West Bengal',
    gender: 'female',
  },

  // Contemporary Scientists
  {
    id: 'apj-abdul-kalam',
    name: 'A.P.J. Abdul Kalam',
    nameHindi: 'ए.पी.जे. अब्दुल कलाम',
    nameTamil: 'ஏ.பி.ஜே. அப்துல் கலாம்',
    nameTelugu: 'ఎ.పి.జె. అబ్దుల్ కలాం',
    nameKannada: 'ಎ.ಪಿ.ಜೆ. ಅಬ್ದುಲ್ ಕಲಾಂ',
    nameOdia: 'ଏ.ପି.ଜେ. ଅବଦୁଲ କଲାମ',
    field: 'Aerospace & Engineering',
    contribution: 'Father of Indian missile program. Developed India\'s first satellite launch vehicle.',
    year: 1931,
    era: 'contemporary',
    story: 'A.P.J. Abdul Kalam was born in Rameswaram, Tamil Nadu. He came from a poor family but became India\'s "Missile Man." He developed India\'s first satellite launch vehicle and later became President of India. He believed science should serve the common people.',
    relatedConcepts: ['rockets', 'satellites', 'space', 'engineering'],
    region: 'Tamil Nadu',
    gender: 'male',
  },
  {
    id: 'homi-bhabha',
    name: 'Homi Bhabha',
    nameHindi: 'होमी भाभा',
    nameTamil: 'ஹோமி பாபா',
    nameTelugu: 'హోమీ భాభా',
    nameKannada: 'ಹೋಮಿ ಭಾಭಾ',
    nameOdia: 'ହୋମି ଭାଭା',
    field: 'Nuclear Physics',
    contribution: 'Father of Indian nuclear program. Established Tata Institute of Fundamental Research.',
    year: 1909,
    era: 'modern',
    story: 'Homi Bhabha was born in Mumbai. He convinced Nehru that India needed nuclear technology for development. He established TIFR and BARC, laying the foundation for India\'s nuclear program. He believed science should be used for peaceful development.',
    relatedConcepts: ['nuclear', 'energy', 'physics', 'research'],
    region: 'Maharashtra',
    gender: 'male',
  },
  {
    id: 'vikram-sarabhai',
    name: 'Vikram Sarabhai',
    nameHindi: 'विक्रम साराभाई',
    nameTamil: 'விக்ரம் சாராபாய்',
    nameTelugu: 'విక్రమ్ సారాభాయ్',
    nameKannada: 'ವಿಕ್ರಮ್ ಸಾರಾಭಾಯ್',
    nameOdia: 'ବିକ୍ରମ ସାରାଭାଈ',
    field: 'Space Science',
    contribution: 'Father of Indian space program. Founded ISRO. Believed space technology should benefit common people.',
    year: 1919,
    era: 'modern',
    story: 'Vikram Sarabhai was born in Ahmedabad, Gujarat. He founded ISRO and believed India\'s space program should help ordinary people - through satellite communication, weather forecasting, and remote sensing. His vision made India a space superpower!',
    relatedConcepts: ['space', 'satellites', 'rockets', 'communication'],
    region: 'Gujarat',
    gender: 'male',
  },
];

// Helper function to get scientists by concept
export function getScientistsByConcept(concept: string): IndianScientist[] {
  const conceptLower = concept.toLowerCase();
  return INDIAN_SCIENTISTS.filter(scientist =>
    scientist.relatedConcepts.some(c => c.toLowerCase().includes(conceptLower))
  );
}

// Helper function to get scientists by era
export function getScientistsByEra(era: IndianScientist['era']): IndianScientist[] {
  return INDIAN_SCIENTISTS.filter(scientist => scientist.era === era);
}

// Helper function to get scientists by region
export function getScientistsByRegion(region: string): IndianScientist[] {
  const regionLower = region.toLowerCase();
  return INDIAN_SCIENTISTS.filter(scientist =>
    scientist.region?.toLowerCase().includes(regionLower)
  );
}

// Helper function to get scientists by gender
export function getScientistsByGender(gender: IndianScientist['gender']): IndianScientist[] {
  return INDIAN_SCIENTISTS.filter(scientist => scientist.gender === gender);
}
