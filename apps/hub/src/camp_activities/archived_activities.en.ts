// Archived Activities

import { AgeRange, Difficulty, PillarId } from './archived_categories';

export interface Material { name: string; quantity?: string; optional?: boolean; substituteFor?: string; }
export interface ActivityStep { title: string; description: string; tip?: string; duration: string; parentHelp?: boolean; }
export interface Activity { id: string; name: string; pillar: PillarId; category: string; ageRange: AgeRange; difficulty: Difficulty; timeToMake: string; description: string; materials: Material[]; image: string; featured?: boolean; rating: number; reviewCount: number; steps: ActivityStep[]; safetyNotes: string[]; learningOutcomes: string[]; crossPillar?: string[]; isPremium?: boolean; url?: string; }

const artstudioActivities: Activity[] = [
  {
    id: 'artstudio-finger-paint',
    name: 'Finger Paint Masterpiece',
    pillar: 'artstudio',
    category: 'Painting',
    ageRange: '3-5',
    difficulty: 'Easy',
    timeToMake: '20 min',
    description: 'Get messy with finger paints! Create colorful artwork while developing fine motor skills and sensory exploration.',
    image: '/images/finger-paint.webp',
    featured: true,
    rating: 4.8,
    reviewCount: 198,
    materials: [
      { name: 'Finger paints', quantity: 'Various colors' },
      { name: 'Large paper', quantity: 'Several sheets' },
      { name: 'Smock or old shirt' },
      { name: 'Plastic tablecloth' },
      { name: 'Water bowl and towels' }
    ],
    steps: [
      {
        title: 'Set Up Space',
        description: 'Cover table with plastic. Put on smock. Tape paper down so it doesn\'t move.',
        duration: '5 min',
        parentHelp: true
      },
      {
        title: 'Explore Colors',
        description: 'Start with one color. Dip fingers and make marks. Try dots, lines, swirls!',
        duration: '5 min'
      },
      {
        title: 'Mix Colors',
        description: 'Add another color. See what happens when they blend! Yellow + blue = ?',
        duration: '5 min'
      },
      {
        title: 'Try Techniques',
        description: 'Use whole hand, just fingertips, sides of hands. Make prints and patterns.',
        duration: '5 min'
      },
      {
        title: 'Clean Up',
        description: 'Wash hands. Let painting dry flat. Display your masterpiece!',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Use non-toxic, washable paints',
      'Supervise to prevent paint eating',
      'Protect floor and furniture'
    ],
    learningOutcomes: [
      'Sensory exploration',
      'Color mixing',
      'Fine motor development',
      'Creative expression'
    ]
  },
  {
    id: 'artstudio-nature-collage',
    name: 'Nature Collage',
    pillar: 'artstudio',
    category: 'Crafts',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '30 min',
    description: 'Collect treasures from nature and arrange them into beautiful artwork! Combines outdoor exploration with creativity.',
    image: '/images/nature-hunt.webp',
    rating: 4.6,
    reviewCount: 134,
    materials: [
      { name: 'Leaves, flowers, twigs' },
      { name: 'Cardstock or cardboard', quantity: 'For base' },
      { name: 'White glue' },
      { name: 'Optional: contact paper' }
    ],
    steps: [
      {
        title: 'Nature Walk',
        description: 'Go outside and collect natural items: leaves, petals, small twigs, seeds, grass.',
        tip: 'Look for different colors, textures, and shapes!',
        duration: '10 min'
      },
      {
        title: 'Sort Treasures',
        description: 'Lay out your collection. Group by color, size, or type.',
        duration: '5 min'
      },
      {
        title: 'Plan Design',
        description: 'Arrange items on your paper WITHOUT gluing. Try different layouts.',
        duration: '5 min'
      },
      {
        title: 'Glue in Place',
        description: 'Once happy with design, glue items down one by one. Press gently.',
        duration: '10 min'
      },
      {
        title: 'Preserve (Optional)',
        description: 'Cover with clear contact paper to preserve, or let dry and display!',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Don\'t pick protected plants',
      'Wash hands after collecting',
      'Check for insects before bringing items inside'
    ],
    learningOutcomes: [
      'Nature appreciation',
      'Design and composition',
      'Texture exploration',
      'Environmental awareness'
    ],
    crossPillar: ['outdoorquest-nature-hunt']
  },
  {
    id: 'artstudio-tiedye',
    name: 'Tie-Dye T-Shirt',
    pillar: 'artstudio',
    category: 'Crafts',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '1 hour + dry time',
    description: 'Create a groovy tie-dye shirt with swirls of color! Learn folding techniques for different patterns.',
    image: '/images/tiedye.webp',
    rating: 4.9,
    reviewCount: 223,
    materials: [
      { name: 'White cotton t-shirt' },
      { name: 'Fabric dye kit', quantity: 'Multiple colors' },
      { name: 'Rubber bands', quantity: '10-20' },
      { name: 'Plastic bags' },
      { name: 'Gloves' },
      { name: 'Plastic tablecloth' }
    ],
    steps: [
      {
        title: 'Wet the Shirt',
        description: 'Soak shirt in water and wring out until damp. This helps dye spread evenly.',
        duration: '5 min'
      },
      {
        title: 'Create Pattern',
        description: 'For spiral: pinch center and twist entire shirt. For stripes: fold accordion-style. Secure with rubber bands.',
        tip: 'Tighter bands = sharper lines. More bands = more white space.',
        duration: '10 min'
      },
      {
        title: 'Mix Dyes',
        description: 'Prepare dyes according to package. Wear gloves from this point on!',
        duration: '10 min',
        parentHelp: true
      },
      {
        title: 'Apply Color',
        description: 'Squeeze dye onto shirt sections. Use different colors in different areas. Flip and do back too.',
        duration: '15 min'
      },
      {
        title: 'Wait and Rinse',
        description: 'Bag the shirt and wait 6-24 hours. Rinse under cold water until water runs clear. Remove bands and wash.',
        duration: '24 hours'
      }
    ],
    safetyNotes: [
      'Wear gloves - dye stains!',
      'Work outdoors or on protected surface',
      'Wash separately first few times'
    ],
    learningOutcomes: [
      'Pattern creation',
      'Color theory',
      'Following multi-step processes',
      'Patience and delayed gratification'
    ]
  },
  {
    id: 'artstudio-paper-plate-animals',
    name: 'Paper Plate Animals',
    pillar: 'artstudio',
    category: 'Crafts',
    ageRange: '3-8',
    difficulty: 'Easy',
    timeToMake: '25 min',
    description: 'Transform simple paper plates into adorable animals! Great for parties or imaginative play.',
    image: '/images/finger-paint.webp',
    rating: 4.5,
    reviewCount: 167,
    materials: [
      { name: 'Paper plates', quantity: '1-2 per animal' },
      { name: 'Paint or markers' },
      { name: 'Construction paper' },
      { name: 'Googly eyes' },
      { name: 'Glue and scissors' },
      { name: 'Pipe cleaners', optional: true }
    ],
    steps: [
      {
        title: 'Choose Animal',
        description: 'Pick your favorite animal! Lion, pig, frog, cat, and owl are great starters.',
        duration: '2 min'
      },
      {
        title: 'Paint Base',
        description: 'Paint the plate the main color of your animal. Let dry.',
        duration: '10 min'
      },
      {
        title: 'Cut Features',
        description: 'Cut ears, noses, whiskers, beaks from construction paper.',
        duration: '5 min'
      },
      {
        title: 'Assemble Face',
        description: 'Glue on googly eyes and paper features. Add details with markers.',
        duration: '10 min'
      },
      {
        title: 'Add Extras',
        description: 'Attach popsicle stick for a mask, or hang as decoration!',
        duration: '3 min'
      }
    ],
    safetyNotes: [
      'Supervise scissor use',
      'Use washable paints'
    ],
    learningOutcomes: [
      'Animal recognition',
      'Following instructions',
      'Fine motor skills',
      'Creative expression'
    ]
  },
  {
    id: 'artstudio-rock-painting',
    name: 'Rock Painting',
    pillar: 'artstudio',
    category: 'Painting',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '30 min',
    description: 'Turn ordinary rocks into colorful treasures! Paint animals, patterns, or inspirational words.',
    image: '/images/nature-hunt.webp',
    rating: 4.7,
    reviewCount: 145,
    materials: [
      { name: 'Smooth rocks', quantity: '3-5' },
      { name: 'Acrylic paint', quantity: 'Various colors' },
      { name: 'Paintbrushes', quantity: 'Various sizes' },
      { name: 'Clear sealant', optional: true },
      { name: 'Pencil for sketching' }
    ],
    steps: [
      {
        title: 'Find Rocks',
        description: 'Look for smooth, flat rocks. Wash and dry them completely.',
        duration: '5 min'
      },
      {
        title: 'Plan Design',
        description: 'Lightly sketch your design with pencil. Animals, mandalas, and words work great!',
        duration: '5 min'
      },
      {
        title: 'Paint Base',
        description: 'Paint background color. Let dry completely before adding details.',
        duration: '5 min'
      },
      {
        title: 'Add Details',
        description: 'Paint your design. Start with larger shapes, add small details last.',
        duration: '15 min'
      },
      {
        title: 'Seal and Share',
        description: 'Optional: apply clear coat. Hide rocks for others to find or keep as decoration!',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Use acrylic paints - they\'re waterproof when dry',
      'Seal if placing outdoors'
    ],
    learningOutcomes: [
      'Painting techniques',
      'Working with 3D surfaces',
      'Community kindness (rock hiding)',
      'Nature appreciation'
    ],
    crossPillar: ['outdoorquest-nature-hunt']
  },
  {
    id: 'artstudio-origami-zoo',
    name: 'Origami Zoo',
    pillar: 'artstudio',
    category: 'Paper Art',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '45 min',
    description: 'Fold paper into amazing animals with the ancient art of origami! Create a whole zoo of creatures.',
    image: '/images/tiedye.webp',
    rating: 4.6,
    reviewCount: 112,
    materials: [
      { name: 'Origami paper', quantity: 'Multiple colors' },
      { name: 'Markers', optional: true }
    ],
    steps: [
      {
        title: 'Start Simple',
        description: 'Begin with an easy fold like a dog face or fish. Learn basic folds: valley, mountain, squash.',
        duration: '10 min'
      },
      {
        title: 'Practice Precision',
        description: 'Fold carefully - crisp creases make better animals! Line up edges exactly.',
        tip: 'Use fingernail to crease sharply.',
        duration: '10 min'
      },
      {
        title: 'Try Animals',
        description: 'Make a frog that jumps! A bird that flaps! A crane for good luck!',
        duration: '20 min'
      },
      {
        title: 'Add Details',
        description: 'Use markers to add eyes, spots, or patterns to your animals.',
        duration: '5 min'
      },
      {
        title: 'Create Display',
        description: 'Arrange your zoo on a shelf or make a mobile to hang!',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Paper cuts possible - fold carefully'
    ],
    learningOutcomes: [
      'Following diagrams',
      'Spatial reasoning',
      'Patience and precision',
      'Japanese cultural art'
    ]
  },
  {
    id: 'artstudio-salt-painting',
    name: 'Salt Painting',
    pillar: 'artstudio',
    category: 'Painting',
    ageRange: '3-8',
    difficulty: 'Easy',
    timeToMake: '30 min',
    description: 'Create magical raised designs using glue and salt, then add color and watch it spread!',
    image: '/images/finger-paint.webp',
    rating: 4.5,
    reviewCount: 89,
    materials: [
      { name: 'Cardstock', quantity: 'Dark colors work best' },
      { name: 'White glue' },
      { name: 'Table salt', quantity: '1/2 cup' },
      { name: 'Liquid watercolors or food coloring' },
      { name: 'Dropper or paintbrush' }
    ],
    steps: [
      {
        title: 'Draw with Glue',
        description: 'Squeeze glue in lines to create a design - rainbow, name, shapes. Keep lines thick.',
        duration: '5 min'
      },
      {
        title: 'Add Salt',
        description: 'While glue is wet, pour salt over entire design. Shake off excess.',
        duration: '5 min'
      },
      {
        title: 'Let Set',
        description: 'Wait a few minutes for glue to start setting with salt stuck on.',
        duration: '5 min'
      },
      {
        title: 'Add Color',
        description: 'Drop liquid color onto salt. Watch it spread along the lines like magic!',
        duration: '10 min'
      },
      {
        title: 'Dry and Display',
        description: 'Let dry completely (overnight is best). Handle gently - salt can fall off.',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Don\'t eat the salt after coloring',
      'Work on protected surface'
    ],
    learningOutcomes: [
      'Absorption concepts',
      'Color spreading',
      'Fine motor control',
      'Process art'
    ]
  },
  {
    id: 'artstudio-pasta-jewelry',
    name: 'Pasta Jewelry',
    pillar: 'artstudio',
    category: 'Crafts',
    ageRange: '3-8',
    difficulty: 'Easy',
    timeToMake: '30 min',
    description: 'Design and create colorful necklaces and bracelets from painted pasta! Wearable art for any outfit.',
    image: '/images/tiedye.webp',
    rating: 4.4,
    reviewCount: 134,
    materials: [
      { name: 'Tubular pasta (penne, rigatoni)', quantity: '30-40 pieces' },
      { name: 'Acrylic paint or food coloring' },
      { name: 'String or yarn', quantity: '2 feet per piece' },
      { name: 'Ziplock bags', optional: true }
    ],
    steps: [
      {
        title: 'Color Pasta',
        description: 'Paint pasta or shake in bags with food coloring and rubbing alcohol. Let dry completely.',
        duration: '10 min + drying'
      },
      {
        title: 'Plan Pattern',
        description: 'Lay out pasta beads and plan your color pattern before stringing.',
        duration: '5 min'
      },
      {
        title: 'String Beads',
        description: 'Thread pasta onto string. Tie a bead at one end first to stop others falling off.',
        duration: '10 min'
      },
      {
        title: 'Create Closure',
        description: 'Tie ends together for necklace, or add clasps for fancier finish.',
        duration: '5 min'
      },
      {
        title: 'Model and Gift',
        description: 'Wear your creation proudly or make gifts for friends and family!',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Pasta jewelry is not edible after painting',
      'Handle gently - pasta can crack'
    ],
    learningOutcomes: [
      'Pattern creation',
      'Fine motor skills (threading)',
      'Color combinations',
      'Gift-making mindset'
    ]
  },
  {
    id: 'artstudio-scratch-art',
    name: 'Scratch Art Cards',
    pillar: 'artstudio',
    category: 'Crafts',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '45 min',
    description: 'Create rainbow scratch art from scratch! Layer colors, cover with black, then scratch to reveal hidden rainbows.',
    image: '/images/tiedye.webp',
    rating: 4.7,
    reviewCount: 98,
    materials: [
      { name: 'Cardstock' },
      { name: 'Crayons', quantity: 'Various colors' },
      { name: 'Black acrylic paint or black crayon' },
      { name: 'Dish soap', quantity: 'A drop' },
      { name: 'Toothpick or wooden stylus' }
    ],
    steps: [
      {
        title: 'Color Base Layer',
        description: 'Cover entire paper with heavy crayon in bright colors. Press hard! No white showing.',
        duration: '10 min'
      },
      {
        title: 'Add Black Layer',
        description: 'Mix tiny bit of dish soap into black paint. Paint over all the crayon. Or use black crayon (harder work!).',
        duration: '10 min'
      },
      {
        title: 'Let Dry',
        description: 'If using paint, let dry completely before scratching.',
        duration: '10 min'
      },
      {
        title: 'Scratch Design',
        description: 'Use toothpick to scratch away black, revealing rainbow colors beneath!',
        duration: '15 min'
      },
      {
        title: 'Create Cards',
        description: 'Make greeting cards, bookmarks, or framed art with your scratch designs!',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Toothpicks are pointy - use carefully',
      'Work on protected surface'
    ],
    learningOutcomes: [
      'Layering technique',
      'Subtractive art process',
      'Planning and patience',
      'Fine motor control'
    ]
  },
  {
    id: 'artstudio-suncatcher',
    name: 'Tissue Paper Suncatcher',
    pillar: 'artstudio',
    category: 'Crafts',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '40 min',
    description: 'Create stained glass-style art that catches sunlight! Beautiful colors glow when hung in a window.',
    image: '/images/tiedye.webp',
    rating: 4.6,
    reviewCount: 87,
    materials: [
      { name: 'Clear contact paper', quantity: '2 sheets' },
      { name: 'Tissue paper', quantity: 'Various colors' },
      { name: 'Black cardstock', quantity: 'For frame' },
      { name: 'Scissors' },
      { name: 'Hole punch and string' }
    ],
    steps: [
      {
        title: 'Cut Frame',
        description: 'Cut a frame shape from black cardstock - circle, heart, or rectangle with center removed.',
        duration: '10 min'
      },
      {
        title: 'Prepare Contact Paper',
        description: 'Cut contact paper slightly larger than frame. Peel backing and lay sticky side up.',
        duration: '5 min'
      },
      {
        title: 'Add Tissue Paper',
        description: 'Tear or cut tissue paper pieces. Press onto contact paper in colorful pattern.',
        duration: '15 min'
      },
      {
        title: 'Seal and Frame',
        description: 'Place second contact paper on top, sticky side down. Press to seal. Trim to frame and attach frame.',
        duration: '10 min'
      },
      {
        title: 'Hang in Window',
        description: 'Punch hole in top, add string, and hang where sunlight will shine through!',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Scissors supervision for younger kids',
      'Contact paper is tricky - take your time'
    ],
    learningOutcomes: [
      'Light and color',
      'Design composition',
      'Following multi-step process',
      'Decorative crafting'
    ]
  },
  {
    id: 'artstudio-clay-pots',
    name: 'Clay Pinch Pots',
    pillar: 'artstudio',
    category: 'Sculpture',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '1 hour + dry time',
    description: 'Shape air-dry clay into beautiful bowls and pots using the ancient pinch pot technique!',
    image: '/images/finger-paint.webp',
    rating: 4.7,
    reviewCount: 109,
    materials: [
      { name: 'Air-dry clay', quantity: '1 lb' },
      { name: 'Water bowl' },
      { name: 'Acrylic paint' },
      { name: 'Paintbrushes' },
      { name: 'Rolling pin', optional: true }
    ],
    steps: [
      {
        title: 'Prepare Clay',
        description: 'Knead clay until soft and pliable. Roll into a ball about the size of your fist.',
        duration: '5 min'
      },
      {
        title: 'Create Opening',
        description: 'Push thumb into center of ball. Slowly rotate and pinch walls between thumb (inside) and fingers (outside).',
        duration: '15 min'
      },
      {
        title: 'Shape the Pot',
        description: 'Keep pinching and rotating. Even thickness is key! Smooth cracks with wet finger.',
        tip: 'Keep walls no thinner than 1/4 inch.',
        duration: '15 min'
      },
      {
        title: 'Add Details',
        description: 'Create texture with tools. Add handles, feet, or decorative elements.',
        duration: '10 min'
      },
      {
        title: 'Dry and Paint',
        description: 'Let dry completely (2-3 days). Paint with acrylics once fully dried.',
        duration: '15 min + drying'
      }
    ],
    safetyNotes: [
      'Air-dry clay is non-toxic',
      'Handle dried pieces gently - they\'re fragile',
      'Not food-safe unless using special glazes'
    ],
    learningOutcomes: [
      'Sculpting techniques',
      'Hand strength and control',
      'Historical pottery methods',
      '3D art creation'
    ]
  },
  {
    id: 'artstudio-collaborative-mural',
    name: 'Collaborative Mural',
    pillar: 'artstudio',
    category: 'Painting',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '1 hour',
    description: 'Create a large artwork together! Everyone contributes to one big painting.',
    image: '/images/finger-paint.webp',
    rating: 4.5,
    reviewCount: 67,
    materials: [
      { name: 'Large paper roll or joined sheets', quantity: '4-6 feet' },
      { name: 'Paint, markers, crayons' },
      { name: 'Tape' },
      { name: 'Smocks for everyone' }
    ],
    steps: [
      {
        title: 'Set Up Canvas',
        description: 'Roll out paper on floor or tape to wall. Make it BIG - this is a group project!',
        duration: '5 min'
      },
      {
        title: 'Choose Theme',
        description: 'Decide on a theme together: underwater, space, garden, cityscape, or abstract!',
        duration: '5 min'
      },
      {
        title: 'Assign Sections',
        description: 'Each person gets an area to work on. Plan how sections will connect.',
        duration: '5 min'
      },
      {
        title: 'Create Together',
        description: 'Everyone works simultaneously! Add to each other\'s areas if invited.',
        duration: '40 min'
      },
      {
        title: 'Add Final Touches',
        description: 'Step back, see what\'s missing. Add connecting elements together.',
        duration: '10 min'
      }
    ],
    safetyNotes: [
      'Supervise shared materials',
      'Respect everyone\'s work'
    ],
    learningOutcomes: [
      'Collaboration skills',
      'Respecting others\' work',
      'Group planning',
      'Large-scale art thinking'
    ]
  }
];

// ============================================
// 🌿 OUTDOORQUEST ACTIVITIES (12)
// ============================================


const outdoorquestActivities: Activity[] = [
  {
    id: 'outdoorquest-nature-hunt',
    name: 'Nature Scavenger Hunt',
    pillar: 'outdoorquest',
    category: 'Nature',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '30 min',
    description: 'Explore the outdoors with a checklist of natural treasures to find! Perfect for backyards, parks, or nature trails.',
    image: '/images/nature-hunt.webp',
    featured: true,
    rating: 4.9,
    reviewCount: 234,
    materials: [
      { name: 'Scavenger hunt checklist', quantity: 'Printable included!' },
      { name: 'Bag or basket' },
      { name: 'Magnifying glass', optional: true },
      { name: 'Pencil or crayon' }
    ],
    steps: [
      {
        title: 'Print Checklist',
        description: 'Use our checklist or create your own: pinecone, feather, smooth rock, flower, etc.',
        duration: '5 min'
      },
      {
        title: 'Go Outside!',
        description: 'Head to backyard, park, or nature trail. Bring your checklist and collection bag.',
        duration: '2 min'
      },
      {
        title: 'Start Hunting',
        description: 'Check off items as you find them. Collect items you can take (no picking protected plants!).',
        tip: 'Look up, down, and all around - treasures are everywhere!',
        duration: '20 min'
      },
      {
        title: 'Observe Closely',
        description: 'Use magnifying glass to examine finds. What details do you notice?',
        duration: '5 min'
      },
      {
        title: 'Share Discoveries',
        description: 'Show what you found! Learn names of plants and animals you discovered.',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Stay on paths and in sight of adults',
      'Don\'t touch unknown plants or animals',
      'Watch for poison ivy/oak',
      'Leave wildlife alone'
    ],
    learningOutcomes: [
      'Nature identification',
      'Observation skills',
      'Physical activity',
      'Environmental appreciation'
    ],
    crossPillar: ['artstudio-nature-collage']
  },
  {
    id: 'outdoorquest-bug-hotel',
    name: 'Bug Hotel',
    pillar: 'outdoorquest',
    category: 'Wildlife',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '45 min',
    description: 'Build a cozy habitat for beneficial insects! Create shelter for ladybugs, bees, and other garden helpers.',
    image: '/images/nature-hunt.webp',
    rating: 4.7,
    reviewCount: 123,
    materials: [
      { name: 'Wooden crate or tin can' },
      { name: 'Sticks and twigs' },
      { name: 'Pinecones' },
      { name: 'Bamboo pieces or paper straws' },
      { name: 'Dried leaves' },
      { name: 'String or wire' }
    ],
    steps: [
      {
        title: 'Find a Base',
        description: 'Use a clean tin can, small wooden box, or bundle of sticks tied together.',
        duration: '5 min'
      },
      {
        title: 'Gather Materials',
        description: 'Collect natural materials: hollow sticks, pinecones, bark, dried leaves, etc.',
        duration: '10 min'
      },
      {
        title: 'Fill the Hotel',
        description: 'Pack materials tightly into your base. Different insects like different spaces!',
        tip: 'Hollow tubes for solitary bees, pinecones for ladybugs.',
        duration: '15 min'
      },
      {
        title: 'Secure Contents',
        description: 'Make sure everything is packed tight. Add wire or more sticks if needed.',
        duration: '5 min'
      },
      {
        title: 'Place in Garden',
        description: 'Position in a sheltered spot facing south. Off the ground prevents flooding.',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Don\'t disturb guests once they move in',
      'Place away from high-traffic areas',
      'Check for existing insect nests before gathering materials'
    ],
    learningOutcomes: [
      'Insect ecology',
      'Habitat creation',
      'Beneficial insects',
      'Environmental stewardship'
    ]
  },
  {
    id: 'outdoorquest-pressed-flowers',
    name: 'Pressed Flower Art',
    pillar: 'outdoorquest',
    category: 'Nature',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '30 min + drying',
    description: 'Preserve beautiful flowers and leaves by pressing! Create bookmarks, cards, or framed art.',
    image: '/images/nature-hunt.webp',
    rating: 4.6,
    reviewCount: 98,
    materials: [
      { name: 'Fresh flowers and leaves' },
      { name: 'Heavy books' },
      { name: 'Parchment or newspaper' },
      { name: 'Frame or cardstock', optional: true },
      { name: 'Clear contact paper', optional: true }
    ],
    steps: [
      {
        title: 'Collect Specimens',
        description: 'Pick flowers and leaves on a dry day. Choose flat flowers or ones you can flatten.',
        duration: '10 min'
      },
      {
        title: 'Prepare for Pressing',
        description: 'Place flowers between parchment paper. Arrange flat - don\'t overlap.',
        duration: '5 min'
      },
      {
        title: 'Press in Books',
        description: 'Put paper with flowers inside heavy book. Stack more books on top.',
        duration: '5 min'
      },
      {
        title: 'Wait Patiently',
        description: 'Leave for 1-2 weeks. Check occasionally. Change paper if damp.',
        duration: '1-2 weeks'
      },
      {
        title: 'Create Art',
        description: 'Carefully remove pressed flowers. Arrange on cards, bookmarks, or frame!',
        duration: '15 min'
      }
    ],
    safetyNotes: [
      'Don\'t pick from protected areas',
      'Pressed flowers are delicate',
      'Some plants cause skin irritation'
    ],
    learningOutcomes: [
      'Botanical knowledge',
      'Patience and delayed gratification',
      'Preservation techniques',
      'Nature appreciation'
    ]
  },
  {
    id: 'outdoorquest-bird-feeder',
    name: 'Pinecone Bird Feeder',
    pillar: 'outdoorquest',
    category: 'Wildlife',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '20 min',
    description: 'Make a simple bird feeder to attract feathered friends to your yard! Watch and learn about different bird species.',
    image: '/images/nature-hunt.webp',
    rating: 4.8,
    reviewCount: 187,
    materials: [
      { name: 'Large pinecone' },
      { name: 'Peanut butter', quantity: '1/4 cup' },
      { name: 'Birdseed', quantity: '1 cup' },
      { name: 'String or yarn', quantity: '12 inches' },
      { name: 'Plate for rolling' }
    ],
    steps: [
      {
        title: 'Tie Hanger',
        description: 'Tie string securely around top of pinecone for hanging.',
        duration: '3 min'
      },
      {
        title: 'Apply Peanut Butter',
        description: 'Spread peanut butter all over pinecone, getting into the scales.',
        tip: 'Use a butter knife or your hands (messy but fun!).',
        duration: '5 min'
      },
      {
        title: 'Add Seeds',
        description: 'Roll coated pinecone in birdseed, pressing seeds into peanut butter.',
        duration: '5 min'
      },
      {
        title: 'Hang Outside',
        description: 'Hang from a tree branch where you can watch from a window.',
        duration: '5 min'
      },
      {
        title: 'Bird Watch',
        description: 'Keep a journal of birds that visit! Learn their names and songs.',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Check for nut allergies before using peanut butter',
      'Alternative: use vegetable shortening',
      'Place where squirrels can\'t easily reach'
    ],
    learningOutcomes: [
      'Bird identification',
      'Wildlife care',
      'Patience and observation',
      'Ecosystem understanding'
    ]
  },
  {
    id: 'outdoorquest-mud-kitchen',
    name: 'Mud Kitchen Play',
    pillar: 'outdoorquest',
    category: 'Adventure',
    ageRange: '3-8',
    difficulty: 'Easy',
    timeToMake: 'Open-ended',
    description: 'Set up an outdoor play kitchen for messy, imaginative mud cooking! A classic childhood experience.',
    image: '/images/nature-hunt.webp',
    rating: 4.5,
    reviewCount: 145,
    materials: [
      { name: 'Old pots and pans' },
      { name: 'Wooden spoons' },
      { name: 'Measuring cups' },
      { name: 'Water source' },
      { name: 'Dirt area' },
      { name: 'Natural additions', quantity: 'Leaves, sticks, petals' }
    ],
    steps: [
      {
        title: 'Set Up Kitchen',
        description: 'Find a good spot near dirt and water. Arrange your tools. A small table helps!',
        duration: '10 min'
      },
      {
        title: 'Prepare Ingredients',
        description: 'Gather water, dirt, and natural add-ins like leaves, petals, seeds.',
        duration: '5 min'
      },
      {
        title: 'Create Recipes',
        description: 'Make mud pies, dirt soup, nature stew! Mix, stir, pour, and create.',
        duration: '∞'
      },
      {
        title: 'Serve and Play',
        description: 'Set up a pretend restaurant. Serve your creations to stuffed animal guests!',
        duration: '∞'
      },
      {
        title: 'Clean Up',
        description: 'Hose off tools and hands. Some dirty play is good!',
        duration: '10 min'
      }
    ],
    safetyNotes: [
      'Wash hands thoroughly after play',
      'Don\'t actually eat mud creations!',
      'Check area for broken glass or harmful items'
    ],
    learningOutcomes: [
      'Imaginative play',
      'Sensory exploration',
      'Scientific mixing',
      'Outdoor comfort'
    ]
  },
  {
    id: 'outdoorquest-shadow-tracing',
    name: 'Shadow Tracing Art',
    pillar: 'outdoorquest',
    category: 'Adventure',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '20 min',
    description: 'Use the sun to create art! Trace shadows of objects, toys, or even friends for unique silhouette artwork.',
    image: '/images/nature-hunt.webp',
    rating: 4.4,
    reviewCount: 76,
    materials: [
      { name: 'Sidewalk chalk' },
      { name: 'Sunny day' },
      { name: 'Objects to trace', quantity: 'Toys, plants, etc.' },
      { name: 'Paper and pencil', optional: true }
    ],
    steps: [
      {
        title: 'Find Shadows',
        description: 'Go outside on a sunny day. Notice how everything has a shadow!',
        duration: '3 min'
      },
      {
        title: 'Position Objects',
        description: 'Place toys, plants, or pose yourself to create interesting shadow shapes.',
        duration: '5 min'
      },
      {
        title: 'Trace Outlines',
        description: 'Use chalk to trace around shadow edges on pavement.',
        duration: '10 min'
      },
      {
        title: 'Add Details',
        description: 'Color in your traced shadows. Add features, patterns, or backgrounds.',
        duration: '10 min'
      },
      {
        title: 'Notice Changes',
        description: 'Come back later - have shadows moved? Try tracing the same object at different times!',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Wear sunscreen on sunny days',
      'Stay hydrated',
      'Don\'t look directly at the sun'
    ],
    learningOutcomes: [
      'Sun and shadows',
      'Time and Earth rotation',
      'Art techniques',
      'Scientific observation'
    ]
  },
  {
    id: 'outdoorquest-cloud-watching',
    name: 'Cloud Watching Journal',
    pillar: 'outdoorquest',
    category: 'Nature',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '30 min',
    description: 'Lie back and watch the clouds! Learn cloud types, spot shapes, and create an imagination journal.',
    image: '/images/nature-hunt.webp',
    rating: 4.3,
    reviewCount: 89,
    materials: [
      { name: 'Blanket' },
      { name: 'Journal or paper' },
      { name: 'Crayons or colored pencils' },
      { name: 'Cloud identification chart', optional: true }
    ],
    steps: [
      {
        title: 'Find a Spot',
        description: 'Lay blanket in open area with good sky view. Lie on your back.',
        duration: '3 min'
      },
      {
        title: 'Observe Clouds',
        description: 'Watch the clouds move. What shapes do you see? Animals? Faces? Objects?',
        duration: '10 min'
      },
      {
        title: 'Learn Cloud Types',
        description: 'Identify clouds: fluffy cumulus, wispy cirrus, layered stratus. What\'s up there today?',
        duration: '5 min'
      },
      {
        title: 'Draw and Write',
        description: 'Sketch the shapes you see. Write stories about cloud characters.',
        duration: '15 min'
      },
      {
        title: 'Predict Weather',
        description: 'Different clouds mean different weather. What do today\'s clouds tell us?',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Don\'t cloud watch during storms',
      'Wear sunglasses on bright days',
      'Apply sunscreen'
    ],
    learningOutcomes: [
      'Meteorology basics',
      'Imagination and creativity',
      'Relaxation',
      'Weather prediction'
    ]
  },
  {
    id: 'outdoorquest-fairy-garden',
    name: 'Fairy Garden',
    pillar: 'outdoorquest',
    category: 'Garden',
    ageRange: '3-12',
    difficulty: 'Medium',
    timeToMake: '1 hour',
    description: 'Create a miniature magical garden for fairies! Use tiny plants, pebbles, and handmade accessories.',
    image: '/images/nature-hunt.webp',
    rating: 4.8,
    reviewCount: 156,
    materials: [
      { name: 'Container or garden corner' },
      { name: 'Potting soil' },
      { name: 'Small plants or moss' },
      { name: 'Pebbles and small stones' },
      { name: 'Tiny decorations', quantity: 'Shells, acorns, small figurines' }
    ],
    steps: [
      {
        title: 'Choose Location',
        description: 'Pick a container (pot, wooden box) or a corner of the yard for your fairy garden.',
        duration: '5 min'
      },
      {
        title: 'Add Soil and Base',
        description: 'Fill with potting soil. Add pebbles for a path. Create landscape with hills or flat areas.',
        duration: '15 min'
      },
      {
        title: 'Plant Greenery',
        description: 'Add small plants, moss, or ground cover. Think about scale - everything should be tiny!',
        duration: '15 min'
      },
      {
        title: 'Create Features',
        description: 'Make tiny houses from sticks, furniture from acorn caps, fences from twigs.',
        duration: '20 min'
      },
      {
        title: 'Add Inhabitants',
        description: 'Place fairy figurines, or leave empty for imagination! Add final decorative touches.',
        duration: '10 min'
      }
    ],
    safetyNotes: [
      'Wash hands after handling soil',
      'Small pieces can be choking hazards for young children'
    ],
    learningOutcomes: [
      'Gardening basics',
      'Miniature design',
      'Imaginative play',
      'Caring for living things'
    ]
  },
  {
    id: 'outdoorquest-obstacle-course',
    name: 'Backyard Obstacle Course',
    pillar: 'outdoorquest',
    category: 'Adventure',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '30 min setup',
    description: 'Design and conquer your own obstacle course! Jump, crawl, balance, and race through challenges.',
    image: '/images/nature-hunt.webp',
    rating: 4.6,
    reviewCount: 178,
    materials: [
      { name: 'Hula hoops' },
      { name: 'Pool noodles' },
      { name: 'Cones or markers' },
      { name: 'Rope or string' },
      { name: 'Buckets' },
      { name: 'Balls' },
      { name: 'Timer', optional: true }
    ],
    steps: [
      {
        title: 'Plan Your Course',
        description: 'Decide on 5-8 obstacles. Include different movements: jumping, crawling, throwing, balancing.',
        duration: '5 min'
      },
      {
        title: 'Set Up Obstacles',
        description: 'Examples: hoop jump, noodle limbo, cone weave, bucket ball toss, rope hop.',
        duration: '15 min'
      },
      {
        title: 'Create Start/Finish',
        description: 'Mark clear start and finish lines. Number obstacles if doing them in order.',
        duration: '5 min'
      },
      {
        title: 'Test Run',
        description: 'Run through once yourself. Is it challenging but doable? Adjust difficulty.',
        duration: '5 min'
      },
      {
        title: 'Race!',
        description: 'Time yourself, race friends, or try to beat your own record!',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Check ground for hazards',
      'Age-appropriate challenges',
      'No obstacles near hard surfaces',
      'Warm up before running'
    ],
    learningOutcomes: [
      'Physical fitness',
      'Course design',
      'Sportsmanship',
      'Problem-solving'
    ]
  },
  {
    id: 'outdoorquest-leaf-rubbing',
    name: 'Leaf Rubbing Art',
    pillar: 'outdoorquest',
    category: 'Nature',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '20 min',
    description: 'Create beautiful impressions of leaves using crayons! A simple nature art activity perfect for all ages.',
    image: '/images/nature-hunt.webp',
    rating: 4.5,
    reviewCount: 134,
    materials: [
      { name: 'Fresh leaves', quantity: 'Various shapes' },
      { name: 'White paper' },
      { name: 'Crayons', quantity: 'Unwrapped' }
    ],
    steps: [
      {
        title: 'Collect Leaves',
        description: 'Gather leaves with interesting shapes and strong veins. Fresh leaves work best.',
        duration: '5 min'
      },
      {
        title: 'Position Leaves',
        description: 'Place leaves vein-side up under paper. Use tape to hold paper still.',
        duration: '3 min'
      },
      {
        title: 'Rub with Crayon',
        description: 'Rub crayon side across paper over leaf. The leaf pattern appears!',
        tip: 'Use side of unwrapped crayon for best results.',
        duration: '10 min'
      },
      {
        title: 'Create Composition',
        description: 'Make multiple rubbings to create a forest, tree, or abstract design.',
        duration: '10 min'
      },
      {
        title: 'Identify Leaves',
        description: 'Look up what trees your leaves came from. Label your artwork!',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Wash hands after handling leaves',
      'Avoid poison ivy/oak'
    ],
    learningOutcomes: [
      'Plant identification',
      'Art technique',
      'Texture exploration',
      'Nature appreciation'
    ]
  },
  {
    id: 'outdoorquest-water-balloons',
    name: 'Water Balloon Games',
    pillar: 'outdoorquest',
    category: 'Adventure',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '30 min play',
    description: 'Cool off with exciting water balloon games! From toss to relay races, get ready to get wet!',
    image: '/images/nature-hunt.webp',
    rating: 4.7,
    reviewCount: 189,
    materials: [
      { name: 'Water balloons', quantity: '30-50' },
      { name: 'Water source' },
      { name: 'Buckets', quantity: '2-4' },
      { name: 'Open outdoor space' }
    ],
    steps: [
      {
        title: 'Fill Balloons',
        description: 'Fill balloons at outdoor faucet. Don\'t overfill - they pop too easily!',
        duration: '10 min'
      },
      {
        title: 'Balloon Toss',
        description: 'Partners toss balloon back and forth, stepping back after each catch. Who lasts longest?',
        duration: '10 min'
      },
      {
        title: 'Relay Race',
        description: 'Carry balloon on spoon across yard without dropping. Teams compete!',
        duration: '10 min'
      },
      {
        title: 'Target Practice',
        description: 'Draw chalk targets. Throw balloons at targets for points!',
        duration: '10 min'
      },
      {
        title: 'Clean Up',
        description: 'IMPORTANT: Pick up all balloon pieces - they\'re harmful to wildlife!',
        duration: '10 min'
      }
    ],
    safetyNotes: [
      'ALWAYS clean up balloon pieces',
      'Balloons are choking hazards',
      'Don\'t throw at faces',
      'Watch for slippery areas'
    ],
    learningOutcomes: [
      'Teamwork',
      'Gross motor skills',
      'Sportsmanship',
      'Environmental responsibility (cleanup)'
    ]
  },
  {
    id: 'outdoorquest-stargazing',
    name: 'Stargazing Night',
    pillar: 'outdoorquest',
    category: 'Nature',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '1 hour',
    description: 'Explore the night sky! Learn constellations, spot planets, and maybe catch a shooting star.',
    image: '/images/nature-hunt.webp',
    rating: 4.8,
    reviewCount: 145,
    materials: [
      { name: 'Blanket' },
      { name: 'Star chart or app' },
      { name: 'Red flashlight', optional: true },
      { name: 'Binoculars', optional: true },
      { name: 'Hot cocoa', optional: true }
    ],
    steps: [
      {
        title: 'Choose Location',
        description: 'Find dark spot away from lights. Backyard works if lights are off!',
        duration: '5 min'
      },
      {
        title: 'Let Eyes Adjust',
        description: 'Wait 10-15 minutes for eyes to adapt to darkness. Avoid looking at bright lights.',
        duration: '15 min'
      },
      {
        title: 'Find North Star',
        description: 'Locate Big Dipper, then follow pointer stars to Polaris, the North Star.',
        duration: '10 min'
      },
      {
        title: 'Hunt Constellations',
        description: 'Use star chart to find Orion, Cassiopeia, and seasonal constellations.',
        duration: '20 min'
      },
      {
        title: 'Watch for Movement',
        description: 'Satellites cross slowly. Shooting stars streak fast. Planets don\'t twinkle!',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Stay in safe areas at night',
      'Adult supervision required',
      'Bring bug spray',
      'Dress warmly'
    ],
    learningOutcomes: [
      'Astronomy basics',
      'Navigation history',
      'Patience and observation',
      'Wonder and curiosity'
    ]
  }
];

// ============================================
// COMBINED EXPORTS
// ============================================

