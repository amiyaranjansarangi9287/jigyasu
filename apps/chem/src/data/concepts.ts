/**
 * Concept data for all science topics
 * Organized by grade band with narration scripts
 */

export interface Concept {
  id: string
  title: string
  emoji: string
  grade: '2-6' | '6-10'
  category: string
  shortDesc: string
  longDesc: string
  hasMusic: boolean
  musicMood: 'wonder' | 'calm' | 'nature' | 'space'
  narration: NarrationStep[]
}

export interface NarrationStep {
  text: string
  delay?: number
}

export const concepts: Concept[] = [
  // ═══════════════════════════════════════════
  // CLASS 2-6 (18 concepts — COMPLETE)
  // ═══════════════════════════════════════════

  {
    id: 'states-of-matter',
    title: 'States of Matter',
    emoji: '🧊',
    grade: '2-6',
    category: 'Physics',
    shortDesc: 'Solids, liquids, and gases — how particles behave',
    longDesc: 'Everything around you is made of tiny particles. How they move determines if something is solid, liquid, or gas.',
    hasMusic: true,
    musicMood: 'calm',
    narration: [
      { text: "Everything you see is made of tiny particles — too small to see, but they're always moving." },
      { text: "In a solid, like ice, the particles are packed tight and just vibrate in place. They can't move around." },
      { text: "When you heat it up, the particles get more energy and start sliding past each other. That's when ice becomes water — a liquid." },
      { text: "Heat it even more, and the particles fly apart completely. That's water turning into steam — a gas." },
      { text: "Try the temperature slider. Watch how the particles change their behavior as you add heat." },
    ],
  },

  {
    id: 'fractions',
    title: 'Fractions',
    emoji: '🍕',
    grade: '2-6',
    category: 'Math',
    shortDesc: 'Understanding parts of a whole visually',
    longDesc: 'Fractions show us how many parts of something we have. See them come alive with shapes and colors.',
    hasMusic: false,
    musicMood: 'calm',
    narration: [
      { text: "A fraction is just a way of saying 'part of something.' If you cut a pizza into 4 equal slices and take 1, you have one-fourth." },
      { text: "The bottom number tells you how many equal parts the whole is divided into." },
      { text: "The top number tells you how many of those parts you have." },
      { text: "Use the sliders to change the fraction and watch the shape fill up. Notice how one-half is the same as two-fourths." },
    ],
  },

  {
    id: 'day-night',
    title: 'Day and Night',
    emoji: '🌍',
    grade: '2-6',
    category: 'Science',
    shortDesc: 'Why we have day and night on Earth',
    longDesc: 'Earth spins like a top, and that spinning gives us day and night.',
    hasMusic: true,
    musicMood: 'space',
    narration: [
      { text: "Earth is always spinning — like a giant top rotating in space. One full spin takes 24 hours." },
      { text: "The side facing the Sun gets daylight. The side facing away gets nighttime." },
      { text: "As Earth spins, your location moves from the dark side into the light side — that's sunrise." },
      { text: "Then you move across the lit side during the day, and eventually back into darkness — that's sunset." },
      { text: "Watch the animation. See how the light and dark areas move as Earth rotates." },
    ],
  },

  {
    id: 'water-cycle',
    title: 'Water Cycle',
    emoji: '💧',
    grade: '2-6',
    category: 'Science',
    shortDesc: 'How water moves through nature',
    longDesc: 'Water never disappears — it just changes form and travels in an endless cycle.',
    hasMusic: true,
    musicMood: 'nature',
    narration: [
      { text: "Water is always on a journey. It never disappears — it just changes where it is and what form it takes." },
      { text: "First, the Sun heats water in oceans and lakes. The water turns into invisible vapor and rises into the air. This is called evaporation." },
      { text: "High up in the sky, the vapor cools down and turns back into tiny water droplets. These droplets form clouds. This is called condensation." },
      { text: "When the clouds get heavy with water, the drops fall back down as rain or snow. This is called precipitation." },
      { text: "The water flows into rivers and oceans, and the cycle starts all over again. It's been happening for billions of years." },
    ],
  },

  {
    id: 'magnets',
    title: 'Magnets',
    emoji: '🧲',
    grade: '2-6',
    category: 'Physics',
    shortDesc: 'How magnets attract and repel',
    longDesc: 'Magnets have invisible force fields that can pull or push other objects.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "Every magnet has two ends — a north pole and a south pole. You can't have one without the other." },
      { text: "When opposite poles meet — north and south — they attract. They pull toward each other." },
      { text: "When the same poles meet — north and north, or south and south — they repel. They push away from each other." },
      { text: "The invisible force around a magnet is called a magnetic field. You can't see it, but it's always there." },
      { text: "Move the magnets around and watch how the field lines change. Notice what happens when you bring different poles together." },
    ],
  },

  {
    id: 'float-sink',
    title: 'Float and Sink',
    emoji: '🚢',
    grade: '2-6',
    category: 'Science',
    shortDesc: 'Why some things float and others sink',
    longDesc: "It's not about weight — it's about density. Learn why heavy ships float but small stones sink.",
    hasMusic: true,
    musicMood: 'calm',
    narration: [
      { text: "Why does a huge ship float but a tiny stone sinks? It's not about how heavy something is." },
      { text: "It's about density — how tightly packed the stuff inside an object is." },
      { text: "If an object is less dense than water, it floats. If it's more dense, it sinks." },
      { text: "A ship is mostly hollow space filled with air, so its overall density is less than water. That's why it floats." },
      { text: "A stone is solid all the way through, packed tight. Its density is more than water, so it sinks." },
      { text: "Try changing the density slider and watch what happens to different objects." },
    ],
  },

  {
    id: 'light-shadows',
    title: 'Light and Shadows',
    emoji: '🔦',
    grade: '2-6',
    category: 'Physics',
    shortDesc: 'How light creates shadows',
    longDesc: 'Shadows form when light is blocked. See how the angle and distance change shadow size.',
    hasMusic: true,
    musicMood: 'wonder',
    narration: [
      { text: "Light travels in straight lines. When something blocks those lines, a shadow appears behind it." },
      { text: "The closer an object is to the light source, the bigger its shadow becomes." },
      { text: "Move the object farther from the light, and the shadow gets smaller and sharper." },
      { text: "The angle of the light matters too. Low angles make long shadows — that's why shadows are longest in the morning and evening." },
      { text: "Drag the light source around and watch how the shadow changes size and shape." },
    ],
  },

  {
    id: 'photosynthesis',
    title: 'Photosynthesis',
    emoji: '🌿',
    grade: '2-6',
    category: 'Biology',
    shortDesc: 'How plants make food from sunlight',
    longDesc: 'Plants are nature\'s kitchens — they cook their own food using sunlight, water, and air.',
    hasMusic: true,
    musicMood: 'nature',
    narration: [
      { text: "Plants are amazing — they make their own food, and they don't need a kitchen to do it." },
      { text: "Inside every leaf are tiny green parts called chloroplasts. Think of them as little kitchens." },
      { text: "The plant takes in three things: sunlight from above, carbon dioxide from the air, and water from the roots." },
      { text: "Using sunlight as energy, the plant mixes carbon dioxide and water together to make glucose — that's sugar, which is plant food." },
      { text: "And here's the best part — the plant releases oxygen as a bonus. That's the air we breathe." },
      { text: "So plants feed themselves AND give us oxygen. Try the sunlight slider to see how light affects the process." },
    ],
  },

  {
    id: 'shapes',
    title: 'Shapes & Geometry',
    emoji: '📐',
    grade: '2-6',
    category: 'Math',
    shortDesc: 'Exploring basic shapes and their properties',
    longDesc: 'Triangles, squares, circles — see how shapes are built and what makes each one special.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "Every shape has special properties that make it unique. Let's explore them." },
      { text: "A triangle always has 3 sides and 3 corners. No matter how you stretch it, those 3 sides never change." },
      { text: "A square has 4 equal sides and 4 perfect corners. All sides are the same length." },
      { text: "A circle has no corners at all — just one continuous curved line. Every point on the edge is the same distance from the center." },
      { text: "Use the controls to change the number of sides and watch how the shape transforms." },
    ],
  },

  {
    id: 'multiplication',
    title: 'Multiplication',
    emoji: '✖️',
    grade: '2-6',
    category: 'Math',
    shortDesc: 'Visual multiplication with arrays',
    longDesc: 'See multiplication as groups of objects arranged in rows and columns.',
    hasMusic: false,
    musicMood: 'calm',
    narration: [
      { text: "Multiplication is really just a fast way of adding the same number over and over." },
      { text: "When you see 3 times 4, think of it as 3 groups of 4 items." },
      { text: "You can arrange them in rows and columns — 3 rows with 4 items in each row." },
      { text: "Count all the items and you get 12. That's what 3 times 4 equals." },
      { text: "Change the numbers with the sliders and watch the array grow or shrink. Notice how 3 times 4 gives the same result as 4 times 3." },
    ],
  },

  {
    id: 'number-line',
    title: 'Number Line',
    emoji: '📏',
    grade: '2-6',
    category: 'Math',
    shortDesc: 'Understanding numbers on a line',
    longDesc: 'Numbers have positions on a line. See addition and subtraction as movement.',
    hasMusic: false,
    musicMood: 'calm',
    narration: [
      { text: "Imagine numbers laid out on a line, like marks on a ruler. Zero is in the middle." },
      { text: "Moving to the right means adding — you're going to bigger numbers." },
      { text: "Moving to the left means subtracting — you're going to smaller numbers." },
      { text: "Addition is like taking steps forward. Subtraction is like taking steps backward." },
      { text: "Try the controls to see how numbers move along the line. Watch how addition and subtraction are opposites." },
    ],
  },

  {
    id: 'sound-waves',
    title: 'Sound Waves',
    emoji: '🔊',
    grade: '2-6',
    category: 'Physics',
    shortDesc: 'How sound travels as waves',
    longDesc: 'Sound is vibrations traveling through air. See how pitch and volume change the wave.',
    hasMusic: true,
    musicMood: 'wonder',
    narration: [
      { text: "Sound is actually vibrations moving through the air. When you speak, your vocal cords vibrate." },
      { text: "These vibrations push air molecules, which push the next ones, creating a wave that travels to someone's ear." },
      { text: "High-pitched sounds, like a whistle, have waves that are close together — we call this high frequency." },
      { text: "Low-pitched sounds, like a drum, have waves that are spread apart — low frequency." },
      { text: "Loud sounds have tall waves. Soft sounds have short waves." },
      { text: "Adjust the pitch and volume sliders to see how the wave changes shape." },
    ],
  },

  {
    id: 'solar-system',
    title: 'Solar System',
    emoji: '🪐',
    grade: '2-6',
    category: 'Science',
    shortDesc: 'Planets orbiting the Sun',
    longDesc: 'Our solar system has 8 planets, each orbiting the Sun at different speeds and distances.',
    hasMusic: true,
    musicMood: 'space',
    narration: [
      { text: "Our solar system is like a giant cosmic dance. The Sun is at the center, and 8 planets orbit around it." },
      { text: "Mercury is closest to the Sun — it zips around in just 88 days. Neptune is farthest — it takes 165 years to complete one orbit." },
      { text: "The closer a planet is to the Sun, the faster it moves. That's because the Sun's gravity is stronger nearby." },
      { text: "Earth is the third planet from the Sun — not too close, not too far. That's just right for liquid water and life." },
      { text: "Watch the planets move. Notice how the inner planets race around while the outer ones take their time." },
    ],
  },

  {
    id: 'plant-growth',
    title: 'Plant Growth',
    emoji: '🌱',
    grade: '2-6',
    category: 'Biology',
    shortDesc: 'How a seed becomes a plant',
    longDesc: 'From a tiny seed to a full plant — see the stages of growth step by step.',
    hasMusic: true,
    musicMood: 'nature',
    narration: [
      { text: "Every big plant started as a tiny seed. Inside that seed is everything the plant needs to begin growing." },
      { text: "First, the seed needs water. It soaks up water and swells. The outer shell cracks open." },
      { text: "A tiny root pushes down into the soil, anchoring the plant and drinking more water." },
      { text: "Then a shoot pushes up toward the light. Once it reaches the surface, leaves unfold to catch sunlight." },
      { text: "With sunlight, water, and air, the plant grows bigger and bigger. Eventually, it makes flowers and new seeds." },
      { text: "Use the slider to watch the plant grow from seed to full plant." },
    ],
  },

  {
    id: 'senses',
    title: 'Five Senses',
    emoji: '👁️',
    grade: '2-6',
    category: 'Biology',
    shortDesc: 'How we see, hear, touch, taste, and smell',
    longDesc: 'Your body has five amazing tools for understanding the world around you.',
    hasMusic: true,
    musicMood: 'calm',
    narration: [
      { text: "Your body has five special tools called senses. They help you understand everything around you." },
      { text: "Your eyes catch light and send pictures to your brain. That's how you see colors, shapes, and movement." },
      { text: "Your ears catch vibrations in the air and turn them into sounds — music, voices, birds singing." },
      { text: "Your skin feels pressure, temperature, and texture. It tells you if something is hot, cold, soft, or rough." },
      { text: "Your nose detects tiny particles in the air — that's how you smell flowers, food, and rain." },
      { text: "Your tongue tastes chemicals in food — sweet, sour, salty, bitter, and umami." },
    ],
  },

  {
    id: 'simple-machines',
    title: 'Simple Machines',
    emoji: '⚙️',
    grade: '2-6',
    category: 'Physics',
    shortDesc: 'Levers, pulleys, and inclined planes',
    longDesc: 'Simple machines make work easier. See how they multiply your force.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "Simple machines are clever tools that make work easier. They've been used for thousands of years." },
      { text: "A lever is like a seesaw. Push down on one end, and the other end goes up. You can lift heavy things with less effort." },
      { text: "A pulley uses a wheel and rope to lift things. Pull down on the rope, and the load goes up." },
      { text: "An inclined plane is a ramp. Instead of lifting something straight up, you push it up a slope — it takes less force." },
      { text: "Each simple machine trades distance for force. You move farther, but you push less hard." },
    ],
  },

  {
    id: 'habitats',
    title: 'Animal Habitats',
    emoji: '🦁',
    grade: '2-6',
    category: 'Biology',
    shortDesc: 'Where animals live and why',
    longDesc: 'Different animals need different homes. Explore forests, oceans, deserts, and more.',
    hasMusic: true,
    musicMood: 'nature',
    narration: [
      { text: "Every animal has a home called a habitat. It's the place where the animal finds food, water, and shelter." },
      { text: "Forests are home to deer, bears, and birds. Trees provide food and hiding places." },
      { text: "Oceans are home to fish, whales, and coral. The water provides food and protection." },
      { text: "Deserts are home to camels, lizards, and snakes. These animals have special tricks to survive with very little water." },
      { text: "Arctic regions are home to polar bears, penguins, and seals. Thick fur and fat keep them warm in freezing temperatures." },
      { text: "Each animal is perfectly suited to its habitat. That's why you won't find a polar bear in the desert." },
    ],
  },

  {
    id: 'pi',
    title: 'Understanding Pi',
    emoji: '🥧',
    grade: '2-6',
    category: 'Math',
    shortDesc: 'What Pi really means visually',
    longDesc: 'Pi is the magic number that connects a circle\'s width to its edge. See it in action.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "Pi is a special number — it's the same for every circle in the universe, no matter how big or small." },
      { text: "Pi tells you how many times the width of a circle fits around its edge. The answer is always about 3.14." },
      { text: "That means if you wrap a string around a circle, it takes about 3 and a bit widths to go all the way around." },
      { text: "Watch the animation. See how the diameter wraps around the circumference. It fits 3 times with a little bit left over." },
      { text: "Change the circle size and notice — Pi stays the same. It's always 3.14159... forever." },
    ],
  },

  // ═══════════════════════════════════════════
  // CLASS 6-10 (20 concepts — COMPLETE)
  // ═══════════════════════════════════════════

  {
    id: 'gravity-spacetime',
    title: 'Gravity & Spacetime',
    emoji: '🌌',
    grade: '6-10',
    category: 'Physics',
    shortDesc: 'How gravity bends space and time',
    longDesc: 'Gravity isn\'t a force pulling — it\'s the bending of space itself. See Einstein\'s insight visualized.',
    hasMusic: true,
    musicMood: 'space',
    narration: [
      { text: "For centuries, people thought gravity was a force that pulled objects together. Then Einstein changed everything." },
      { text: "He showed that gravity is actually the bending of space itself. Imagine space as a stretchy fabric." },
      { text: "When you place a heavy object like the Sun on this fabric, it creates a dip. Planets roll around this dip — that's what we call orbit." },
      { text: "The heavier the object, the deeper the dip. A black hole creates such a deep dip that nothing can escape." },
      { text: "Watch how the grid bends around the mass. Notice how smaller objects follow the curves created by larger ones." },
    ],
  },

  {
    id: 'atoms',
    title: 'Atomic Structure',
    emoji: '⚛️',
    grade: '6-10',
    category: 'Chemistry',
    shortDesc: 'Protons, neutrons, and electrons',
    longDesc: 'Everything is made of atoms. See the tiny nucleus and the electrons orbiting around it.',
    hasMusic: true,
    musicMood: 'wonder',
    narration: [
      { text: "Everything you see is made of atoms — incredibly tiny building blocks that are mostly empty space." },
      { text: "At the center is the nucleus, made of protons and neutrons packed tightly together." },
      { text: "Whizzing around the nucleus are electrons — tiny particles that move incredibly fast in specific orbits." },
      { text: "The number of protons determines what element the atom is. One proton is hydrogen. Six protons is carbon. Eight is oxygen." },
      { text: "Electrons can jump between orbits when they absorb or release energy. That's how light is created." },
      { text: "Change the number of protons and electrons to see different elements." },
    ],
  },

  {
    id: 'cell-structure',
    title: 'Cell Structure',
    emoji: '🔬',
    grade: '6-10',
    category: 'Biology',
    shortDesc: 'The building blocks of life',
    longDesc: 'Every living thing is made of cells. Explore the organelles inside a cell.',
    hasMusic: true,
    musicMood: 'nature',
    narration: [
      { text: "Every living thing — from bacteria to blue whales — is made of cells. They're the smallest units of life." },
      { text: "The cell membrane is like a security guard. It decides what enters and leaves the cell." },
      { text: "The nucleus is the control center. It contains DNA — the instruction manual for building and running the cell." },
      { text: "Mitochondria are the powerhouses. They convert food into energy the cell can use." },
      { text: "The endoplasmic reticulum is like a factory — it builds proteins and transports them around the cell." },
      { text: "Hover over each part to learn what it does. Notice how everything works together to keep the cell alive." },
    ],
  },

  {
    id: 'digestive-system',
    title: 'Digestive System',
    emoji: '🫁',
    grade: '6-10',
    category: 'Biology',
    shortDesc: 'How food becomes energy',
    longDesc: 'Follow food on its journey through your body — from mouth to energy.',
    hasMusic: true,
    musicMood: 'nature',
    narration: [
      { text: "When you eat food, it goes on an incredible journey through your body that takes about 24 to 72 hours." },
      { text: "It starts in the mouth, where teeth break food into small pieces and saliva starts breaking down starches." },
      { text: "The food travels down the esophagus into the stomach, where strong acids break it down into a thick liquid." },
      { text: "Next, it enters the small intestine — over 6 meters long! This is where nutrients are absorbed into your bloodstream." },
      { text: "The large intestine removes water from what's left, and the waste exits the body." },
      { text: "Watch the food travel through each organ. See how each part plays a specific role in digestion." },
    ],
  },

  {
    id: 'blood-circulation',
    title: 'Blood Circulation',
    emoji: '❤️',
    grade: '6-10',
    category: 'Biology',
    shortDesc: 'How blood flows through your body',
    longDesc: 'Your heart pumps blood through 100,000 kilometers of vessels. See the journey.',
    hasMusic: true,
    musicMood: 'calm',
    narration: [
      { text: "Your heart is an incredible pump that never stops. It beats about 100,000 times every day." },
      { text: "Blood carries oxygen from your lungs to every cell in your body. Without oxygen, cells can't make energy." },
      { text: "The right side of the heart pumps blood to the lungs to pick up oxygen. The blood turns bright red." },
      { text: "The left side pumps oxygen-rich blood out to the entire body through arteries." },
      { text: "After delivering oxygen, the blood returns through veins, now darker because it needs more oxygen." },
      { text: "Watch the blood flow. Red blood goes out from the heart, blue blood returns to get more oxygen." },
    ],
  },

  {
    id: 'newtons-laws',
    title: 'Newton\'s Laws of Motion',
    emoji: '🍎',
    grade: '6-10',
    category: 'Physics',
    shortDesc: 'The three laws that govern motion',
    longDesc: 'Newton discovered three simple rules that explain how everything moves.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "Newton discovered three laws that explain how everything moves — from a rolling ball to a rocket launch." },
      { text: "First law: An object at rest stays at rest, and an object in motion stays in motion, unless a force acts on it. This is called inertia." },
      { text: "Second law: Force equals mass times acceleration. The heavier something is, the more force you need to move it." },
      { text: "Third law: For every action, there's an equal and opposite reaction. When you push on something, it pushes back." },
      { text: "Try the interactive examples. Push objects of different masses and see how they respond." },
    ],
  },

  {
    id: 'electricity',
    title: 'Electricity & Circuits',
    emoji: '⚡',
    grade: '6-10',
    category: 'Physics',
    shortDesc: 'How electric circuits work',
    longDesc: 'Electricity is the flow of electrons. Build circuits and see the current flow.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "Electricity is the flow of tiny particles called electrons through a material like copper wire." },
      { text: "For electricity to flow, you need a complete loop — a circuit. If the loop is broken, the flow stops." },
      { text: "A battery provides the push that makes electrons move. The positive and negative terminals create a difference that drives the flow." },
      { text: "When electrons flow through a bulb, they heat up a thin filament until it glows — that's how a light bulb works." },
      { text: "Build different circuits and watch the electrons flow. Try adding more bulbs and see what happens." },
    ],
  },

  {
    id: 'food-chain',
    title: 'Food Chain',
    emoji: '🌾',
    grade: '6-10',
    category: 'Biology',
    shortDesc: 'Energy flow in ecosystems',
    longDesc: 'Energy passes from one organism to another in a chain. See who eats whom.',
    hasMusic: true,
    musicMood: 'nature',
    narration: [
      { text: "In nature, energy flows from one organism to another in what we call a food chain." },
      { text: "It always starts with the Sun. Plants capture sunlight and turn it into food through photosynthesis." },
      { text: "Herbivores eat the plants. A rabbit eats grass, a deer eats leaves." },
      { text: "Carnivores eat the herbivores. A fox eats the rabbit, a lion eats the deer." },
      { text: "At each step, some energy is lost as heat. That's why there are fewer top predators than plants." },
      { text: "Decomposers like bacteria and fungi break down dead organisms, returning nutrients to the soil for plants." },
    ],
  },

  {
    id: 'moon-phases',
    title: 'Moon Phases',
    emoji: '🌙',
    grade: '6-10',
    category: 'Science',
    shortDesc: 'Why the Moon changes shape',
    longDesc: 'The Moon doesn\'t change shape — we just see different parts of its sunlit side.',
    hasMusic: true,
    musicMood: 'space',
    narration: [
      { text: "The Moon doesn't produce its own light. It reflects sunlight — and that's why it appears to change shape." },
      { text: "As the Moon orbits Earth, we see different portions of its sunlit side. That's what creates the phases." },
      { text: "When the Moon is between Earth and the Sun, we see the dark side — that's a new moon." },
      { text: "As it moves along, we see more of the lit side — waxing crescent, first quarter, waxing gibbous." },
      { text: "When Earth is between the Moon and Sun, we see the full lit side — a full moon." },
      { text: "Then the cycle reverses — waning gibbous, last quarter, waning crescent — back to new moon." },
      { text: "One complete cycle takes about 29.5 days. Drag the Moon around its orbit to see the phases change." },
    ],
  },

  {
    id: 'pythagorean',
    title: 'Pythagorean Theorem',
    emoji: '📐',
    grade: '6-10',
    category: 'Math',
    shortDesc: 'a² + b² = c² visualized',
    longDesc: 'The relationship between the sides of a right triangle, shown visually.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "The Pythagorean theorem is one of the most useful formulas in mathematics. It works for every right triangle." },
      { text: "It says that if you square the two shorter sides and add them together, you get the square of the longest side." },
      { text: "In other words: a squared plus b squared equals c squared." },
      { text: "Watch the squares built on each side. The area of the two smaller squares exactly equals the area of the largest square." },
      { text: "Change the triangle shape and notice — the relationship always holds. It's true for every right triangle, forever." },
    ],
  },

  {
    id: 'chemistry-reactions',
    title: 'Chemical Reactions',
    emoji: '🧪',
    grade: '6-10',
    category: 'Chemistry',
    shortDesc: 'How atoms rearrange to form new substances',
    longDesc: 'Chemical reactions break and form bonds. Watch atoms rearrange in real time.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "A chemical reaction is when substances change into completely different substances. The atoms rearrange themselves." },
      { text: "The starting materials are called reactants. The new materials formed are called products." },
      { text: "For example, when hydrogen and oxygen react, they form water. The atoms don't disappear — they just rearrange." },
      { text: "Energy is involved too. Some reactions release energy — they get hot. Others absorb energy — they get cold." },
      { text: "Watch the atoms break apart and form new bonds. Notice that the total number of atoms stays the same." },
    ],
  },

  {
    id: 'dna-replication',
    title: 'DNA Replication',
    emoji: '🧬',
    grade: '6-10',
    category: 'Biology',
    shortDesc: 'How DNA copies itself',
    longDesc: 'DNA unzips and makes a copy of itself. See the molecular machinery at work.',
    hasMusic: true,
    musicMood: 'nature',
    narration: [
      { text: "DNA is the instruction manual for life. Every cell in your body contains a complete copy of your DNA." },
      { text: "DNA looks like a twisted ladder — a double helix. The rungs are made of four chemicals: A, T, C, and G." },
      { text: "A always pairs with T, and C always pairs with G. This pairing rule is the key to how DNA copies itself." },
      { text: "When a cell divides, the DNA unzips down the middle. Each half serves as a template for a new matching half." },
      { text: "The result is two identical DNA molecules — one for each new cell." },
      { text: "Watch the DNA unzip and rebuild. See how the base pairing rule ensures perfect copies." },
    ],
  },

  {
    id: 'kinetic-energy',
    title: 'Kinetic & Potential Energy',
    emoji: '🎢',
    grade: '6-10',
    category: 'Physics',
    shortDesc: 'Energy of motion and stored energy',
    longDesc: 'Energy transforms between motion and position. See it on a roller coaster.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "Energy comes in two main forms: kinetic energy — the energy of motion, and potential energy — stored energy." },
      { text: "Think of a roller coaster. At the top of the hill, it has maximum potential energy — it's high up and ready to fall." },
      { text: "As it drops, potential energy converts to kinetic energy. The higher the drop, the faster it goes." },
      { text: "At the bottom, all the potential energy has become kinetic energy — the coaster is at its fastest." },
      { text: "Energy is never created or destroyed — it just changes form. This is called conservation of energy." },
      { text: "Watch the energy bars change as the coaster moves. Notice how the total always stays the same." },
    ],
  },


  {
    id: 'periodic-table',
    title: 'Periodic Table',
    emoji: '🔬',
    grade: '6-10',
    category: 'Chemistry',
    shortDesc: 'Organization of all elements',
    longDesc: 'Every element has a place. See patterns in the periodic table.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "The periodic table organizes all 118 known elements by their properties." },
      { text: "Elements in the same column share similar behavior. That's why sodium and potassium react similarly with water." },
      { text: "The rows tell you how many electron shells an atom has. The columns tell you how many electrons are in the outer shell." },
      { text: "Metals are on the left, non-metals on the right, and metalloids in between." },
      { text: "Explore the table and discover patterns. Notice how properties change as you move across and down." },
    ],
  },

  {
    id: 'waves-light',
    title: 'Light Waves',
    emoji: '🌈',
    grade: '6-10',
    category: 'Physics',
    shortDesc: 'The electromagnetic spectrum',
    longDesc: 'Light is a wave with different wavelengths creating different colors.',
    hasMusic: true,
    musicMood: 'wonder',
    narration: [
      { text: "Light is actually a wave — but unlike sound waves, light waves can travel through empty space." },
      { text: "Different wavelengths of light create different colors. Red has the longest wavelength, violet the shortest." },
      { text: "Visible light is just a tiny part of the electromagnetic spectrum. Radio waves are longer, X-rays are shorter." },
      { text: "When white light passes through a prism, it splits into a rainbow because each color bends at a different angle." },
      { text: "Adjust the wavelength slider to see how the wave changes and what color it produces." },
    ],
  },

  {
    id: 'evolution',
    title: 'Evolution',
    emoji: '🦎',
    grade: '6-10',
    category: 'Biology',
    shortDesc: 'How species change over time',
    longDesc: 'Natural selection shapes life over millions of years. See it in action.',
    hasMusic: true,
    musicMood: 'nature',
    narration: [
      { text: "Evolution is the process by which species change over time through natural selection." },
      { text: "In any population, individuals vary. Some are faster, some are slower, some are better camouflaged." },
      { text: "Those with advantageous traits are more likely to survive and reproduce. Their offspring inherit those traits." },
      { text: "Over many generations, the population shifts toward the advantageous traits." },
      { text: "Given enough time — millions of years — these small changes add up to entirely new species." },
      { text: "Watch the population change over generations. See how the environment shapes which traits survive." },
    ],
  },

  {
    id: 'plate-tectonics',
    title: 'Plate Tectonics',
    emoji: '🌋',
    grade: '6-10',
    category: 'Science',
    shortDesc: 'How Earth\'s crust moves',
    longDesc: 'Earth\'s surface is made of moving plates. See how they cause earthquakes and volcanoes.',
    hasMusic: true,
    musicMood: 'space',
    narration: [
      { text: "Earth's surface isn't one solid piece — it's broken into giant slabs called tectonic plates." },
      { text: "These plates float on hot, soft rock beneath them. They move very slowly — about the speed your fingernails grow." },
      { text: "When plates pull apart, magma rises and creates new crust. This happens at mid-ocean ridges." },
      { text: "When plates crash together, one slides under the other, creating mountains and volcanoes." },
      { text: "When plates slide past each other, they get stuck and then suddenly release — that's an earthquake." },
      { text: "Watch the plates move and see how their interactions shape the surface of our planet." },
    ],
  },

  {
    id: 'acids-bases',
    title: 'Acids and Bases',
    emoji: '🧫',
    grade: '6-10',
    category: 'Chemistry',
    shortDesc: 'The pH scale explained',
    longDesc: 'Acids and bases are opposites. See how the pH scale measures them.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "Acids and bases are two types of chemicals that are complete opposites." },
      { text: "Acids taste sour — like lemons and vinegar. Bases taste bitter and feel slippery — like soap." },
      { text: "The pH scale measures how acidic or basic something is, from 0 to 14." },
      { text: "Below 7 is acidic. 7 is neutral — that's pure water. Above 7 is basic." },
      { text: "When an acid and a base mix, they neutralize each other and form salt and water." },
      { text: "Move the pH slider and watch how the solution changes color and properties." },
    ],
  },

  {
    id: 'respiration',
    title: 'Cellular Respiration',
    emoji: '🫀',
    grade: '6-10',
    category: 'Biology',
    shortDesc: 'How cells make energy from food',
    longDesc: 'Every cell burns food with oxygen to make energy. See the process inside a cell.',
    hasMusic: true,
    musicMood: 'calm',
    narration: [
      { text: "Every cell in your body needs energy to function. It gets that energy through a process called cellular respiration." },
      { text: "The cell takes glucose — sugar from food — and combines it with oxygen from your blood." },
      { text: "This reaction releases energy that the cell can use, plus carbon dioxide and water as waste products." },
      { text: "The equation is the reverse of photosynthesis: glucose plus oxygen produces carbon dioxide, water, and energy." },
      { text: "This happens in tiny structures called mitochondria — the powerhouses of the cell." },
      { text: "Watch the molecules interact inside the mitochondrion. See how energy is released step by step." },
    ],
  },

  {
    id: 'optics',
    title: 'Lenses and Optics',
    emoji: '🔍',
    grade: '6-10',
    category: 'Physics',
    shortDesc: 'How lenses bend light',
    longDesc: 'Lenses focus or spread light. See how convex and concave lenses work.',
    hasMusic: false,
    musicMood: 'wonder',
    narration: [
      { text: "Lenses are pieces of glass or plastic that bend light in specific ways." },
      { text: "A convex lens is thicker in the middle. It bends light rays inward, bringing them to a focus point." },
      { text: "This is how magnifying glasses work — they concentrate light to make things look bigger." },
      { text: "A concave lens is thinner in the middle. It bends light rays outward, spreading them apart." },
      { text: "This is how glasses for nearsighted people work — they spread light before it enters the eye." },
      { text: "Switch between lens types and watch how the light rays change direction." },
    ],
  },
]

export const categories = [...new Set(concepts.map(c => c.category))]

export const getConceptsByGrade = (grade: '2-6' | '6-10') =>
  concepts.filter(c => c.grade === grade)

export const getConceptById = (id: string) =>
  concepts.find(c => c.id === id)

export const getStats = () => {
  const grade26 = concepts.filter(c => c.grade === '2-6')
  const grade610 = concepts.filter(c => c.grade === '6-10')
  return {
    '2-6': { total: grade26.length, live: grade26.length, status: 'COMPLETE' },
    '6-10': { total: 20, live: 20, status: 'COMPLETE' },
  }
}
