// src/crosscutting/data/mistakeMuseumContent.ts

export interface MistakeExhibit {
  id: string;
  wrongBelief: string;
  period: string;
  whySense: string;
  overturned: string;
  indianConnection: string;
  emoji: string;
  quote: string;
}

export const MISTAKE_EXHIBITS: MistakeExhibit[] = [
  {
    id: 'earth-center',
    wrongBelief: 'Earth is the center of the universe',
    period: '~3000 years (Aristotle to Copernicus)',
    whySense: 'Everything appears to move around us. The sun rises and sets.',
    overturned: 'Copernicus (1543) proposed heliocentrism. Galileo observed Jupiter\'s moons. Kepler showed elliptical orbits.',
    indianConnection: 'Aryabhata (499 CE) proposed Earth rotates on its axis — over 1000 years before Copernicus.',
    emoji: '🌍',
    quote: 'Being wrong is how knowledge grows.',
  },
  {
    id: 'flat-earth',
    wrongBelief: 'The Earth is flat',
    period: 'Ancient times to ~500 BCE',
    whySense: 'The ground looks flat. The horizon looks like a straight line.',
    overturned: 'Pythagoras (500 BCE) reasoned Earth must be spherical. Ships disappear hull-first over horizon.',
    indianConnection: 'Ancient Indian texts describe Earth as spherical. Varahamihira (6th century) calculated Earth\'s circumference.',
    emoji: '🌏',
    quote: 'The horizon is not an edge — it is a curve.',
  },
  {
    id: 'four-elements',
    wrongBelief: 'Everything is made of earth, water, fire, and air',
    period: '~2000 years (Empedocles to 1700s)',
    whySense: 'These four things are everywhere. Wood burns (fire + air) and leaves ash (earth).',
    overturned: 'Lavoisier (1789) identified chemical elements. Dalton (1803) proposed atomic theory.',
    indianConnection: 'Indian philosophy had Pancha Mahabhuta — five elements including akasha (space/ether).',
    emoji: '🔥',
    quote: 'Four elements became 118. The story is not over.',
  },
  {
    id: 'bloodletting',
    wrongBelief: 'Disease is caused by imbalance of four humors; bloodletting cures it',
    period: '~2000 years (Hippocrates to 1800s)',
    whySense: 'Some patients improved after bloodletting (placebo or reducing blood pressure).',
    overturned: 'Germ theory (Pasteur, 1860s) showed diseases are caused by microorganisms.',
    indianConnection: 'Ayurveda describes three doshas (Vata, Pitta, Kapha) — a more nuanced system than four humors.',
    emoji: '🩸',
    quote: 'A treatment that persists for 2000 years must feel like it works.',
  },
  {
    id: 'phlogiston',
    wrongBelief: 'Burning releases a substance called "phlogiston"',
    period: '1667 to 1770s',
    whySense: 'Things lose mass when they burn. Ash weighs less than wood.',
    overturned: 'Lavoisier showed burning is combination with oxygen. Things actually gain mass from air.',
    indianConnection: 'The concept of Agni (fire) in Indian philosophy as transformation, not release.',
    emoji: '🔬',
    quote: 'Sometimes what you think is leaving is actually arriving.',
  },
  {
    id: 'static-species',
    wrongBelief: 'Species never change — they are fixed and eternal',
    period: 'Ancient times to 1859',
    whySense: 'Cats always have kittens. Oak trees always grow from acorns.',
    overturned: 'Darwin\'s Origin of Species (1859) showed natural selection drives change over generations.',
    indianConnection: 'Indian concept of cyclic time and transformation — everything changes over vast timescales.',
    emoji: '🦎',
    quote: 'The only constant is change — even in life itself.',
  },
  {
    id: 'miasma',
    wrongBelief: 'Disease spreads through "bad air" (miasma)',
    period: 'Ancient times to 1880s',
    whySense: 'Disease is worse near swamps and dirty areas where air smells bad.',
    overturned: 'John Snow (1854) traced cholera to a water pump. Pasteur proved germ theory.',
    indianConnection: 'Sushruta (600 BCE) emphasized cleanliness and boiling water — practical hygiene before germ theory.',
    emoji: '💨',
    quote: 'The air was not the problem — the water was.',
  },
  {
    id: 'caloric',
    wrongBelief: 'Heat is a fluid called "caloric" that flows from hot to cold',
    period: '1700s to 1840s',
    whySense: 'Heat flows like water. Hot things cool down. Cold things warm up.',
    overturned: 'Joule (1840s) showed heat is energy, not a substance. Temperature is molecular motion.',
    indianConnection: 'The concept of Tapas (heat/energy) in Indian thought as transformative force.',
    emoji: '🌡️',
    quote: 'Heat is not a thing — it is motion.',
  },
  {
    id: 'atom-indivisible',
    wrongBelief: 'Atoms are indivisible — the smallest possible thing',
    period: '1803 to 1897',
    whySense: 'The word "atom" means "uncuttable." Chemistry works with whole atoms.',
    overturned: 'Thomson discovered electrons (1897). Rutherford found the nucleus (1911).',
    indianConnection: 'Kanada (6th century BCE) proposed paramanu — atoms that combine but are themselves indivisible.',
    emoji: '⚛️',
    quote: 'Even the smallest thing has parts within it.',
  },
  {
    id: 'light-particle-only',
    wrongBelief: 'Light is only made of particles (corpuscles)',
    period: '1704 to 1801',
    whySense: 'Light travels in straight lines. It casts sharp shadows. Particles do that.',
    overturned: 'Young\'s double-slit experiment (1801) showed light behaves as a wave. Later: both wave and particle.',
    indianConnection: 'Indian optics (Nyaya school) debated whether light is particle or wave — centuries before Europe.',
    emoji: '💡',
    quote: 'Light is both. And neither. It is something deeper.',
  },
];
