// CampCraft - All Activities Data

import { AgeRange, Difficulty, PillarId } from './categories';

export interface Material {
  name: string;
  quantity?: string;
  optional?: boolean;
  substituteFor?: string;
}

export interface LearningMoment {
  type: 'fact' | 'observation' | 'prediction';
  prompt: string;
  options?: string[];
  optionImages?: string[];
  correctFeedback?: string;
}

export interface ActivityStep {
  title: string;
  description: string;
  tip?: string;
  duration: string;
  parentHelp?: boolean;
  learningMoment?: LearningMoment;
}

export interface Activity {
  id: string;
  name: string;
  pillar: PillarId;
  category: string;
  ageRange: AgeRange;
  demoMedia?: string;
  difficulty: Difficulty;
  timeToMake: string;
  description: string;
  materials: Material[];
  image: string;
  featured?: boolean;
  rating: number;
  reviewCount: number;
  steps: ActivityStep[];
  safetyNotes: string[];
  learningOutcomes: string[];
  crossPillar?: string[];
  isPremium?: boolean;
  url?: string;
}

// ============================================
// 🧸 TOYBOX ACTIVITIES (24)
// ============================================

const toyboxActivities: Activity[] = [
  {
    id: 'toybox-rainbow-blocks',
    name: 'Rainbow Stacking Blocks',
    pillar: 'toybox',
    category: 'Building',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '1-2 hours',
    description: 'Create a beautiful set of rainbow-colored wooden blocks perfect for stacking, sorting, and creative play. These timeless toys spark imagination and help develop fine motor skills.',
    image: '/images/blocks.webp',
    featured: true,
    rating: 4.9,
    reviewCount: 156,
    materials: [
      { name: 'Wooden blocks or lumber scraps', quantity: '12-20 pieces' },
      { name: 'Sandpaper', quantity: 'Fine and medium grit' },
      { name: 'Non-toxic acrylic paint', quantity: 'Rainbow colors' },
      { name: 'Clear sealant', quantity: '1 can', optional: true },
      { name: 'Paintbrushes', quantity: '3-4' }
    ],
    steps: [
      {
        title: 'Prepare the Wood',
        description: 'Start by selecting your wooden pieces. If using lumber scraps, cut them into various shapes - rectangles, squares, triangles, and arches. Sand all surfaces smooth, starting with medium grit sandpaper and finishing with fine grit. Pay special attention to edges and corners to ensure they are rounded and safe for little hands.',
        tip: 'Pre-cut wooden blocks from craft stores work great and save time!',
        duration: '30 min'
      },
      {
        title: 'Plan Your Rainbow',
        description: 'Lay out your blocks and decide which colors will go on each piece. A classic rainbow progression (red, orange, yellow, green, blue, purple) works beautifully. Consider painting blocks of similar sizes in the same color for a cohesive set.',
        tip: 'Take a photo of your layout plan for reference while painting.',
        duration: '10 min',
        learningMoment: {
          type: 'observation',
          prompt: 'Look closely at the layers! Which liquid is sitting at the very bottom?',
          options: ['Water', 'Oil', 'Honey'],
          correctFeedback: 'Right! Honey is the most dense, so it sinks to the very bottom!'
        }
      },
      {
        title: 'Apply Base Coats',
        description: 'Paint each block with its designated color. Apply thin, even coats and let dry completely between applications. Most blocks will need 2-3 coats for full coverage.',
        tip: 'Use a cardboard box to hold blocks upright while drying.',
        duration: '45 min',
        parentHelp: true
      },
      {
        title: 'Add Details (Optional)',
        description: 'Once base coats are dry, add fun details like dots, stripes, or simple patterns. You can also leave them solid for a classic look.',
        duration: '20 min'
      },
      {
        title: 'Seal and Finish',
        description: 'Apply a clear, non-toxic sealant to protect the paint and make blocks more durable. Let dry completely (24 hours recommended) before play.',
        tip: 'Water-based polyurethane is safe once fully cured.',
        duration: '15 min',
        parentHelp: true
      }
    ],
    safetyNotes: [
      'Use only non-toxic, child-safe paints and sealants',
      'Ensure all edges are well-sanded and smooth',
      'Adult supervision required for cutting and sealing',
      'Allow full curing time before giving to children'
    ],
    learningOutcomes: [
      'Fine motor skills',
      'Color recognition',
      'Spatial awareness',
      'Creative thinking'
    ]
  },
  {
    id: 'toybox-wooden-car',
    name: 'Classic Wooden Car',
    pillar: 'toybox',
    category: 'Vehicles',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '2-3 hours',
    description: 'Build a timeless wooden toy car with spinning wheels. This project teaches basic woodworking skills and results in a durable toy that can be passed down for generations.',
    image: '/images/wooden-car.webp',
    featured: true,
    rating: 4.8,
    reviewCount: 124,
    materials: [
      { name: 'Wood block', quantity: '6" x 3" x 2"' },
      { name: 'Wooden wheels', quantity: '4 pieces' },
      { name: 'Wooden dowels', quantity: '2 pieces, 4" each' },
      { name: 'Sandpaper', quantity: 'Various grits' },
      { name: 'Wood glue' },
      { name: 'Non-toxic paint', optional: true }
    ],
    steps: [
      {
        title: 'Shape the Car Body',
        description: 'Draw the car profile on your wood block - a simple curved top works best. Using a saw or pre-cut the shape, then sand all surfaces smooth.',
        duration: '45 min',
        parentHelp: true
      },
      {
        title: 'Drill Axle Holes',
        description: 'Mark where the axle holes will go on both sides of the car body. Drill straight through, ensuring holes align perfectly.',
        tip: 'Use a drill press for perfectly aligned holes.',
        duration: '15 min',
        parentHelp: true
      },
      {
        title: 'Prepare Wheels and Axles',
        description: 'Sand the wheels smooth. Cut dowels to length for axles, leaving room for wheels plus a small gap.',
        duration: '20 min'
      },
      {
        title: 'Assemble the Car',
        description: 'Insert axles through the car body. Attach wheels to each end with a dab of wood glue. Ensure wheels spin freely.',
        tip: 'Don\'t use too much glue - wheels need to spin!',
        duration: '20 min'
      },
      {
        title: 'Paint and Finish',
        description: 'Once glue is dry, paint your car in your favorite colors. Add details like windows, headlights, or racing stripes. Apply sealant and let cure.',
        duration: '40 min'
      }
    ],
    safetyNotes: [
      'Adult supervision required for all cutting and drilling',
      'Wear safety glasses when using power tools',
      'Use non-toxic finishes only'
    ],
    learningOutcomes: [
      'Basic woodworking',
      'Wheel and axle mechanics',
      'Planning and execution',
      'Fine motor skills'
    ]
  },
  {
    id: 'toybox-plush-bear',
    name: 'Cuddly Plush Bear',
    pillar: 'toybox',
    category: 'Plush',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '3-4 hours',
    description: 'Sew your own adorable teddy bear with soft fabric and button eyes. A perfect cuddly companion that makes a wonderful gift.',
    image: '/images/plush-bear.webp',
    rating: 4.7,
    reviewCount: 98,
    materials: [
      { name: 'Soft fabric (fleece or felt)', quantity: '1/2 yard' },
      { name: 'Stuffing', quantity: '1 bag polyester filling' },
      { name: 'Thread', quantity: 'Matching color' },
      { name: 'Buttons', quantity: '2 for eyes' },
      { name: 'Embroidery thread', quantity: 'For nose and mouth' },
      { name: 'Needle and pins' },
      { name: 'Scissors' }
    ],
    steps: [
      {
        title: 'Cut Pattern Pieces',
        description: 'Print or draw a simple bear pattern. Cut out body (2), arms (4), legs (4), ears (4), and head pieces from your fabric.',
        duration: '30 min'
      },
      {
        title: 'Sew Body Parts',
        description: 'With right sides together, sew arm pairs, leg pairs, and ears. Leave openings for turning. Turn right side out.',
        duration: '45 min'
      },
      {
        title: 'Create the Face',
        description: 'Attach button eyes securely. Embroider a simple nose and smile using satin stitch.',
        tip: 'For younger children, embroider eyes instead of buttons for safety.',
        duration: '30 min'
      },
      {
        title: 'Assemble the Bear',
        description: 'Sew head pieces together, attaching ears. Join body pieces, inserting arms and legs as you go. Leave opening for stuffing.',
        duration: '45 min'
      },
      {
        title: 'Stuff and Close',
        description: 'Fill bear firmly with stuffing, shaping as you go. Hand-stitch the opening closed with a ladder stitch.',
        duration: '30 min'
      }
    ],
    safetyNotes: [
      'Secure button eyes very tightly or use embroidered eyes for young children',
      'Supervise needle use with younger sewers',
      'Check for loose threads or weak seams'
    ],
    learningOutcomes: [
      'Sewing skills',
      'Pattern reading',
      'Patience and attention to detail',
      'Gift-giving mindset'
    ]
  },
  {
    id: 'toybox-recycled-robot',
    name: 'Recycled Robot',
    pillar: 'toybox',
    category: 'Building',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '1-2 hours',
    description: 'Transform recyclable materials into an awesome robot friend! This eco-friendly project teaches creativity and environmental awareness.',
    image: '/images/robot.webp',
    rating: 4.6,
    reviewCount: 142,
    materials: [
      { name: 'Cardboard boxes', quantity: 'Various sizes' },
      { name: 'Bottle caps' },
      { name: 'Aluminum foil' },
      { name: 'Toilet paper rolls', quantity: '4 for limbs' },
      { name: 'Paint and markers' },
      { name: 'Glue gun', optional: true },
      { name: 'Craft glue' },
      { name: 'Pipe cleaners', optional: true }
    ],
    steps: [
      {
        title: 'Gather Materials',
        description: 'Collect various recyclables - boxes, bottles, caps, tubes. Clean everything thoroughly. Lay out materials and envision your robot.',
        duration: '15 min'
      },
      {
        title: 'Build the Body',
        description: 'Select a medium box for the body and a smaller one for the head. Cover with aluminum foil or paint silver for a robotic look.',
        duration: '25 min'
      },
      {
        title: 'Add Limbs',
        description: 'Attach toilet paper rolls or paper towel tubes as arms and legs. Secure with glue and reinforce with tape if needed.',
        duration: '20 min'
      },
      {
        title: 'Create the Face',
        description: 'Use bottle caps for eyes, buttons for a nose, and draw or add a mouth. Get creative with antennae using pipe cleaners!',
        duration: '20 min'
      },
      {
        title: 'Add Details',
        description: 'Decorate with buttons, dials, screens drawn on paper, or any creative additions. Name your robot!',
        duration: '20 min'
      }
    ],
    safetyNotes: [
      'Adult supervision required for hot glue gun',
      'Wash all recyclables before use',
      'Check for sharp edges on cans or lids'
    ],
    learningOutcomes: [
      'Environmental awareness',
      'Creative reuse',
      'Problem-solving',
      'Imaginative play'
    ]
  },
  {
    id: 'toybox-balsa-airplane',
    name: 'Balsa Wood Airplane',
    pillar: 'toybox',
    category: 'Vehicles',
    ageRange: '9-12',
    difficulty: 'Hard',
    timeToMake: '3-4 hours',
    description: 'Craft a beautiful balsa wood biplane that actually flies! Learn about aerodynamics while building this classic model.',
    image: '/images/airplane.webp',
    rating: 4.8,
    reviewCount: 87,
    materials: [
      { name: 'Balsa wood sheets', quantity: '3 sheets, 1/8" thick' },
      { name: 'Balsa wood sticks', quantity: 'Various sizes' },
      { name: 'Wood glue' },
      { name: 'Craft knife' },
      { name: 'Sandpaper' },
      { name: 'Paint', optional: true },
      { name: 'Rubber bands' }
    ],
    steps: [
      {
        title: 'Cut Wing Pieces',
        description: 'Trace wing templates onto balsa sheets. Carefully cut out upper and lower wings using a craft knife. Sand edges smooth.',
        duration: '40 min',
        parentHelp: true
      },
      {
        title: 'Build the Fuselage',
        description: 'Cut and assemble the body of the plane using balsa sticks. Create a frame that is sturdy but lightweight.',
        duration: '45 min'
      },
      {
        title: 'Attach Wings',
        description: 'Glue wings to fuselage at slight upward angles for better lift. Use struts between upper and lower wings.',
        tip: 'Let each glue joint dry before moving to the next.',
        duration: '30 min'
      },
      {
        title: 'Add Tail Assembly',
        description: 'Create and attach horizontal stabilizer and vertical tail fin. These are crucial for flight stability.',
        duration: '25 min'
      },
      {
        title: 'Finish and Test Fly',
        description: 'Sand entire plane smooth. Paint if desired. Add a propeller with rubber band power. Test fly and adjust as needed!',
        duration: '40 min'
      }
    ],
    safetyNotes: [
      'Adult supervision required for craft knife use',
      'Balsa wood splinters easily - handle with care',
      'Fly in open areas away from people'
    ],
    learningOutcomes: [
      'Aerodynamics basics',
      'Precision building',
      'Physics of flight',
      'Patience and persistence'
    ]
  },
  {
    id: 'toybox-dollhouse',
    name: 'Miniature Dollhouse',
    pillar: 'toybox',
    category: 'Building',
    ageRange: '9-12',
    difficulty: 'Hard',
    timeToMake: '4-6 hours',
    description: 'Construct a charming miniature dollhouse with multiple rooms. Add tiny furniture and decorations for endless imaginative play.',
    image: '/images/dollhouse.webp',
    rating: 4.9,
    reviewCount: 76,
    materials: [
      { name: 'Cardboard or foam board', quantity: 'Large sheets' },
      { name: 'Craft knife' },
      { name: 'Ruler' },
      { name: 'Glue' },
      { name: 'Scrapbook paper', quantity: 'For wallpaper' },
      { name: 'Paint' },
      { name: 'Small boxes', quantity: 'For furniture' }
    ],
    steps: [
      {
        title: 'Design Floor Plan',
        description: 'Sketch your dollhouse design. Decide on number of rooms and floors. Calculate measurements for walls and floors.',
        duration: '20 min'
      },
      {
        title: 'Cut Structural Pieces',
        description: 'Cut out walls, floors, and roof pieces from cardboard or foam board. Include window and door openings.',
        duration: '45 min',
        parentHelp: true
      },
      {
        title: 'Assemble Structure',
        description: 'Glue walls together, add floors to create stories. Install the roof. Reinforce corners with extra cardboard strips.',
        duration: '1 hour'
      },
      {
        title: 'Decorate Interior',
        description: 'Apply scrapbook paper as wallpaper. Paint trim and details. Add flooring paper or felt rugs.',
        duration: '1 hour'
      },
      {
        title: 'Create Furniture',
        description: 'Make tiny furniture from small boxes, spools, and scraps. Add beds, tables, chairs, and decorations.',
        duration: '1 hour'
      }
    ],
    safetyNotes: [
      'Adult supervision for cutting',
      'Use sharp blades carefully with cutting mat',
      'Small pieces may be choking hazards for young children'
    ],
    learningOutcomes: [
      'Architectural thinking',
      'Scale and proportion',
      'Interior design',
      'Long-term project planning'
    ]
  },
  {
    id: 'toybox-animal-puzzle',
    name: 'Wooden Animal Puzzle',
    pillar: 'toybox',
    category: 'Puzzles',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '1-2 hours',
    description: 'Create chunky wooden puzzles featuring adorable animals. Perfect for little hands learning shapes and problem-solving.',
    image: '/images/puzzle.webp',
    rating: 4.7,
    reviewCount: 118,
    materials: [
      { name: 'Plywood', quantity: '1/2" thick, 8" x 10"' },
      { name: 'Scroll saw or jigsaw' },
      { name: 'Sandpaper' },
      { name: 'Non-toxic paint' },
      { name: 'Clear sealant' }
    ],
    steps: [
      {
        title: 'Draw Design',
        description: 'Draw a simple animal shape on the plywood - elephant, cat, or dog work great. Keep shapes chunky with rounded edges.',
        duration: '15 min'
      },
      {
        title: 'Cut Outer Shape',
        description: 'Use a scroll saw to cut out the animal shape from the plywood. Sand all edges smooth.',
        duration: '20 min',
        parentHelp: true
      },
      {
        title: 'Create Puzzle Pieces',
        description: 'Draw puzzle piece divisions on the animal. Cut along these lines to create 4-8 interlocking pieces.',
        duration: '25 min',
        parentHelp: true
      },
      {
        title: 'Paint Pieces',
        description: 'Paint each puzzle piece in bright colors. You can paint both sides or just the top.',
        duration: '30 min'
      },
      {
        title: 'Seal and Assemble',
        description: 'Apply clear sealant to protect paint. Once dry, assemble your puzzle and test the fit!',
        duration: '20 min'
      }
    ],
    safetyNotes: [
      'Adult use only for power saws',
      'Sand thoroughly - no splinters',
      'Use child-safe paints and sealants'
    ],
    learningOutcomes: [
      'Problem-solving',
      'Shape recognition',
      'Hand-eye coordination',
      'Patience'
    ]
  },
  {
    id: 'toybox-train-set',
    name: 'Classic Train Set',
    pillar: 'toybox',
    category: 'Vehicles',
    ageRange: '9-12',
    difficulty: 'Hard',
    timeToMake: '4-5 hours',
    description: 'Build a complete wooden train set with engine, cars, and track pieces. A challenging project with rewarding results.',
    image: '/images/train.webp',
    rating: 4.8,
    reviewCount: 64,
    materials: [
      { name: 'Wood blocks', quantity: 'Various sizes' },
      { name: 'Wooden wheels', quantity: '20+' },
      { name: 'Dowels', quantity: 'For axles and connectors' },
      { name: 'Wood glue' },
      { name: 'Paint' },
      { name: 'Small hooks and eyes', quantity: 'For connecting cars' }
    ],
    steps: [
      {
        title: 'Design Train Cars',
        description: 'Sketch designs for engine, coal car, cargo cars, and caboose. Plan wheel placement and connection points.',
        duration: '20 min'
      },
      {
        title: 'Cut and Shape',
        description: 'Cut wood blocks to size for each car. Shape the engine with a rounded front. Sand everything smooth.',
        duration: '1 hour',
        parentHelp: true
      },
      {
        title: 'Add Wheels',
        description: 'Drill holes for axles. Insert dowels and attach wheels. Ensure wheels spin freely.',
        duration: '45 min',
        parentHelp: true
      },
      {
        title: 'Paint and Detail',
        description: 'Paint each car in classic train colors. Add windows, cargo details, and decorations.',
        duration: '1 hour'
      },
      {
        title: 'Connect Cars',
        description: 'Attach hooks to front and eyes to back of each car. Test connections. Create track pieces if desired.',
        duration: '30 min'
      }
    ],
    safetyNotes: [
      'Adult supervision for all cutting and drilling',
      'Check small parts are secure',
      'Test wheel attachment strength'
    ],
    learningOutcomes: [
      'Complex project planning',
      'Mechanical connections',
      'Precision work',
      'Transportation history'
    ]
  },
  {
    id: 'toybox-marble-run',
    name: 'Marble Run Adventure',
    pillar: 'toybox',
    category: 'Building',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '2-3 hours',
    description: 'Engineer an exciting marble run with twists, turns, and drops. Watch marbles race through your custom creation!',
    image: '/images/marble-run.webp',
    featured: true,
    rating: 4.9,
    reviewCount: 189,
    materials: [
      { name: 'Cardboard tubes', quantity: '10-15 various sizes' },
      { name: 'Cardboard sheets' },
      { name: 'Tape' },
      { name: 'Scissors' },
      { name: 'Marbles', quantity: '5-10' },
      { name: 'Base board' }
    ],
    steps: [
      {
        title: 'Plan Your Run',
        description: 'Sketch the path marbles will take. Plan starting height, turns, tunnels, and landing. Remember: gravity is your friend!',
        duration: '15 min'
      },
      {
        title: 'Create Track Pieces',
        description: 'Cut tubes in half lengthwise for open tracks. Cut various lengths. Create funnels and catch points.',
        duration: '30 min'
      },
      {
        title: 'Build Support Structure',
        description: 'Create cardboard supports to hold tracks at different heights. Build a sturdy base for everything.',
        duration: '30 min'
      },
      {
        title: 'Assemble the Run',
        description: 'Attach tracks to supports, ensuring smooth transitions. Test with marbles as you build. Adjust angles as needed.',
        duration: '45 min'
      },
      {
        title: 'Test and Improve',
        description: 'Run marbles through multiple times. Fix any stuck points. Add fun features like jumps or spinners!',
        duration: '30 min'
      }
    ],
    safetyNotes: [
      'Marbles are choking hazards - supervise young children',
      'Use scissors carefully',
      'Ensure structure is stable'
    ],
    learningOutcomes: [
      'Physics and gravity',
      'Engineering design',
      'Problem-solving',
      'Cause and effect'
    ],
    crossPillar: ['sciencelab-balloon-rocket']
  },
  {
    id: 'toybox-tangram',
    name: 'Tangram Puzzle Set',
    pillar: 'toybox',
    category: 'Puzzles',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '1 hour',
    description: 'Create the ancient Chinese puzzle of seven shapes that form endless patterns. A timeless brain teaser!',
    image: '/images/puzzle.webp',
    rating: 4.6,
    reviewCount: 92,
    materials: [
      { name: 'Foam board or wood', quantity: '6" x 6" square' },
      { name: 'Ruler' },
      { name: 'Pencil' },
      { name: 'Craft knife or saw' },
      { name: 'Paint or markers', optional: true }
    ],
    steps: [
      {
        title: 'Draw the Grid',
        description: 'Draw a 4x4 grid on your square. This helps position the seven tangram pieces correctly.',
        duration: '10 min'
      },
      {
        title: 'Mark Tangram Shapes',
        description: 'Following a tangram diagram, mark the seven shapes: 2 large triangles, 1 medium triangle, 2 small triangles, 1 square, 1 parallelogram.',
        duration: '10 min'
      },
      {
        title: 'Cut Pieces',
        description: 'Carefully cut along your marked lines to create the seven pieces. Sand or smooth edges.',
        duration: '20 min',
        parentHelp: true
      },
      {
        title: 'Color Pieces',
        description: 'Paint each piece a different color for visual appeal and easier identification.',
        duration: '15 min'
      },
      {
        title: 'Try Puzzles',
        description: 'Challenge yourself to make shapes - animals, people, objects. Look up tangram puzzles online for ideas!',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Adult supervision for cutting',
      'Small pieces can be choking hazards'
    ],
    learningOutcomes: [
      'Spatial reasoning',
      'Geometry basics',
      'Problem-solving',
      'Pattern recognition'
    ]
  },
  {
    id: 'toybox-3d-puzzle',
    name: '3D Animal Puzzle',
    pillar: 'toybox',
    category: 'Puzzles',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '2 hours',
    description: 'Build a 3D puzzle that assembles into an animal sculpture. Pieces slot together without glue!',
    image: '/images/puzzle.webp',
    rating: 4.7,
    reviewCount: 78,
    materials: [
      { name: 'Cardboard or foam board', quantity: '2-3 sheets' },
      { name: 'Template printout' },
      { name: 'Craft knife' },
      { name: 'Cutting mat' },
      { name: 'Paint', optional: true }
    ],
    steps: [
      {
        title: 'Print Templates',
        description: 'Find or create 3D puzzle templates. Print at full size. Choose an animal like an elephant or dinosaur.',
        duration: '10 min'
      },
      {
        title: 'Transfer to Board',
        description: 'Trace or glue templates to your cardboard or foam board. Mark all slot positions clearly.',
        duration: '20 min'
      },
      {
        title: 'Cut Pieces',
        description: 'Carefully cut out each piece including the slots. Slots should be as wide as your material thickness.',
        duration: '45 min',
        parentHelp: true
      },
      {
        title: 'Test Fit',
        description: 'Try assembling the puzzle. Adjust slots if pieces are too tight or loose.',
        duration: '20 min'
      },
      {
        title: 'Decorate and Finish',
        description: 'Disassemble, paint pieces, let dry, then reassemble your 3D sculpture!',
        duration: '30 min'
      }
    ],
    safetyNotes: [
      'Sharp blade use requires adult supervision',
      'Always cut on a cutting mat',
      'Cut away from your body'
    ],
    learningOutcomes: [
      '3D spatial thinking',
      'Assembly skills',
      'Following templates',
      'Fine motor control'
    ]
  },
  {
    id: 'toybox-chess-set',
    name: 'Wooden Chess Set',
    pillar: 'toybox',
    category: 'Games',
    ageRange: '9-12',
    difficulty: 'Hard',
    timeToMake: '6-8 hours',
    description: 'Carve and shape your own chess pieces, then build a board. A challenging project that creates a family heirloom!',
    image: '/images/blocks.webp',
    rating: 4.9,
    reviewCount: 54,
    materials: [
      { name: 'Wood blocks', quantity: 'Enough for 32 pieces' },
      { name: 'Plywood for board', quantity: '16" x 16"' },
      { name: 'Carving tools' },
      { name: 'Sandpaper' },
      { name: 'Paint or wood stain' },
      { name: 'Clear finish' }
    ],
    steps: [
      {
        title: 'Design Pieces',
        description: 'Sketch simplified designs for each piece type: King, Queen, Bishop, Knight, Rook, Pawn. Keep shapes recognizable but achievable.',
        duration: '30 min'
      },
      {
        title: 'Shape Pawns',
        description: 'Start with 16 pawns - the simplest pieces. Shape, sand smooth. Get consistent sizing.',
        duration: '1.5 hours',
        parentHelp: true
      },
      {
        title: 'Carve Major Pieces',
        description: 'Work on Kings, Queens, Bishops, Knights, and Rooks. Take your time on details.',
        duration: '3 hours',
        parentHelp: true
      },
      {
        title: 'Create Board',
        description: 'Mark 64 squares (8x8 grid) on plywood. Paint or stain alternating squares. Apply finish.',
        duration: '1.5 hours'
      },
      {
        title: 'Finish Pieces',
        description: 'Paint or stain pieces in two colors. Apply protective finish. Let cure completely.',
        duration: '1 hour'
      }
    ],
    safetyNotes: [
      'Carving tools are very sharp - adult only or close supervision',
      'Carve away from body',
      'Use proper ventilation with stains and finishes'
    ],
    learningOutcomes: [
      'Advanced woodworking',
      'Strategic game appreciation',
      'Patience and persistence',
      'Artistic expression'
    ]
  },
  {
    id: 'toybox-ring-toss',
    name: 'Ring Toss Game',
    pillar: 'toybox',
    category: 'Games',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '1 hour',
    description: 'Build a classic ring toss game for indoor or outdoor fun. Perfect for parties and family game nights!',
    image: '/images/blocks.webp',
    rating: 4.5,
    reviewCount: 108,
    materials: [
      { name: 'Wooden base', quantity: '12" x 12"' },
      { name: 'Wooden dowels', quantity: '5 pieces, 8" tall' },
      { name: 'Rope or embroidery hoops', quantity: 'For rings' },
      { name: 'Paint' },
      { name: 'Drill' }
    ],
    steps: [
      {
        title: 'Prepare Base',
        description: 'Sand wooden base smooth. Mark positions for 5 pegs - one center, four corners.',
        duration: '10 min'
      },
      {
        title: 'Install Pegs',
        description: 'Drill holes for dowels. Glue dowels into holes. Paint different colors or animals on each peg.',
        duration: '25 min',
        parentHelp: true
      },
      {
        title: 'Create Rings',
        description: 'Make rings from rope (form circles and tape/glue ends) or use embroidery hoops. Make 5-6 rings.',
        duration: '15 min'
      },
      {
        title: 'Decorate',
        description: 'Paint the base and pegs in bright colors. Add fun patterns or stickers.',
        duration: '20 min'
      },
      {
        title: 'Play!',
        description: 'Set up, stand back, and toss rings! See how many you can loop. Adjust distance for difficulty.',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Adult help needed for drilling',
      'Ensure pegs are secure before playing'
    ],
    learningOutcomes: [
      'Hand-eye coordination',
      'Distance estimation',
      'Patience',
      'Motor skills'
    ]
  },
  {
    id: 'toybox-memory-game',
    name: 'Memory Matching Game',
    pillar: 'toybox',
    category: 'Games',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '45 min',
    description: 'Create a personalized memory matching game with your own artwork. Great for brain training!',
    image: '/images/blocks.webp',
    rating: 4.6,
    reviewCount: 134,
    materials: [
      { name: 'Cardstock', quantity: '24-32 squares' },
      { name: 'Markers or crayons' },
      { name: 'Stickers', optional: true },
      { name: 'Clear contact paper', optional: true }
    ],
    steps: [
      {
        title: 'Cut Cards',
        description: 'Cut cardstock into equal-sized squares (2" x 2" works well). Make an even number - 24 or 32 cards.',
        duration: '10 min'
      },
      {
        title: 'Create Pairs',
        description: 'Draw matching images on pairs of cards. Use shapes, animals, letters, or family photos!',
        duration: '25 min'
      },
      {
        title: 'Add Backs',
        description: 'Decorate all card backs identically so pairs can\'t be identified from behind.',
        duration: '10 min'
      },
      {
        title: 'Protect (Optional)',
        description: 'Cover cards with clear contact paper or laminate for durability.',
        duration: '15 min'
      },
      {
        title: 'Play!',
        description: 'Shuffle and lay face down. Take turns flipping two cards. Try to match all the pairs!',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Scissors supervision for young children'
    ],
    learningOutcomes: [
      'Memory skills',
      'Concentration',
      'Visual recognition',
      'Turn-taking'
    ]
  },
  {
    id: 'toybox-kaleidoscope',
    name: 'Kaleidoscope',
    pillar: 'toybox',
    category: 'Building',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '1 hour',
    description: 'Build a working kaleidoscope with mirrors and colorful beads. See the world in beautiful patterns!',
    image: '/images/blocks.webp',
    rating: 4.7,
    reviewCount: 96,
    materials: [
      { name: 'Cardboard tube', quantity: '8-10" long' },
      { name: 'Mirror sheets or reflective paper', quantity: '3 strips' },
      { name: 'Clear plastic discs', quantity: '2' },
      { name: 'Beads and sequins' },
      { name: 'Tape' },
      { name: 'Decorative paper' }
    ],
    steps: [
      {
        title: 'Create Mirror Triangle',
        description: 'Cut three mirror strips that fit inside your tube. Tape them together to form a triangle, reflective sides facing in.',
        duration: '15 min'
      },
      {
        title: 'Prepare Tube',
        description: 'Cut a viewing hole in one end cap. The mirror triangle should fit snugly inside the tube.',
        duration: '10 min'
      },
      {
        title: 'Insert Mirrors',
        description: 'Carefully slide the mirror triangle into the tube. Secure in place.',
        duration: '10 min'
      },
      {
        title: 'Create Object Chamber',
        description: 'At the other end, sandwich beads and sequins between two clear plastic discs. Attach to tube end.',
        duration: '15 min'
      },
      {
        title: 'Decorate',
        description: 'Cover the outside with decorative paper. Add your name and designs!',
        duration: '15 min'
      }
    ],
    safetyNotes: [
      'Handle mirrors carefully - edges can be sharp',
      'Don\'t look at bright lights through kaleidoscope'
    ],
    learningOutcomes: [
      'Light and reflection',
      'Symmetry',
      'Pattern recognition',
      'Optics basics'
    ],
    crossPillar: ['sciencelab-invisible-ink']
  },
  {
    id: 'toybox-catapult',
    name: 'Wooden Catapult',
    pillar: 'toybox',
    category: 'Building',
    ageRange: '9-12',
    difficulty: 'Medium',
    timeToMake: '1.5 hours',
    description: 'Build a working catapult that launches small objects. Learn about lever physics and stored energy!',
    image: '/images/blocks.webp',
    rating: 4.8,
    reviewCount: 167,
    materials: [
      { name: 'Popsicle sticks', quantity: '15-20' },
      { name: 'Rubber bands', quantity: '5-6' },
      { name: 'Plastic spoon' },
      { name: 'Small pompoms or marshmallows', quantity: 'For launching' }
    ],
    steps: [
      {
        title: 'Create the Base',
        description: 'Stack 5-7 popsicle sticks and rubber band both ends. This creates a sturdy base.',
        duration: '10 min'
      },
      {
        title: 'Build Launch Arm',
        description: 'Take 2 sticks and rubber band only ONE end. Open the other end like scissors.',
        duration: '10 min'
      },
      {
        title: 'Combine Base and Arm',
        description: 'Insert the base stack perpendicular into the launch arm opening. Secure with rubber bands.',
        duration: '15 min'
      },
      {
        title: 'Add Launching Cup',
        description: 'Attach plastic spoon to the end of the launch arm with rubber bands.',
        duration: '10 min'
      },
      {
        title: 'Test and Adjust',
        description: 'Load, aim, and launch! Adjust rubber band tension and fulcrum position for better distance.',
        duration: '30 min'
      }
    ],
    safetyNotes: [
      'Only launch soft objects like pompoms',
      'Never aim at people or animals',
      'Launch in clear areas'
    ],
    learningOutcomes: [
      'Lever mechanics',
      'Potential and kinetic energy',
      'Engineering iteration',
      'Physics concepts'
    ],
    crossPillar: ['sciencelab-egg-drop']
  },
  {
    id: 'toybox-balancing-eagle',
    name: 'Balancing Eagle',
    pillar: 'toybox',
    category: 'Building',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '45 min',
    description: 'Create a bird that balances on its beak! Learn about center of gravity with this fun physics toy.',
    image: '/images/airplane.webp',
    rating: 4.5,
    reviewCount: 89,
    materials: [
      { name: 'Cardstock or cardboard' },
      { name: 'Scissors' },
      { name: 'Pennies or coins', quantity: '2' },
      { name: 'Tape' },
      { name: 'Markers for decoration' }
    ],
    steps: [
      {
        title: 'Draw Eagle Shape',
        description: 'Draw a simple eagle with spread wings on cardstock. Wings should extend outward and slightly downward.',
        duration: '10 min'
      },
      {
        title: 'Cut Out Shape',
        description: 'Carefully cut out your eagle. Keep the beak pointed.',
        duration: '10 min'
      },
      {
        title: 'Add Weights',
        description: 'Tape a penny under each wing tip. These create the counterbalance.',
        duration: '10 min'
      },
      {
        title: 'Find Balance Point',
        description: 'Adjust coin position until the eagle balances on its beak when placed on your finger.',
        duration: '10 min'
      },
      {
        title: 'Decorate',
        description: 'Color your eagle with markers. Try balancing on different surfaces!',
        duration: '10 min'
      }
    ],
    safetyNotes: [
      'Scissors supervision for young children'
    ],
    learningOutcomes: [
      'Center of gravity',
      'Balance and counterweight',
      'Physics experimentation',
      'Fine motor skills'
    ]
  },
  {
    id: 'toybox-paper-launcher',
    name: 'Paper Airplane Launcher',
    pillar: 'toybox',
    category: 'Vehicles',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '1 hour',
    description: 'Build a rubber band launcher that sends paper airplanes soaring! Combine engineering and flight.',
    image: '/images/airplane.webp',
    rating: 4.6,
    reviewCount: 123,
    materials: [
      { name: 'Cardboard' },
      { name: 'Rubber bands', quantity: '3-5 strong ones' },
      { name: 'Popsicle sticks' },
      { name: 'Paper', quantity: 'For airplanes' },
      { name: 'Tape and glue' }
    ],
    steps: [
      {
        title: 'Build Launch Track',
        description: 'Create a cardboard track about 12" long with raised edges to guide the airplane.',
        duration: '15 min'
      },
      {
        title: 'Create Tension System',
        description: 'Attach rubber bands to a crossbar at the back of the track. Create a pull-back mechanism.',
        duration: '20 min'
      },
      {
        title: 'Add Release Trigger',
        description: 'Design a simple trigger using popsicle sticks that holds and releases the rubber bands.',
        duration: '15 min'
      },
      {
        title: 'Make Paper Airplanes',
        description: 'Fold several paper airplanes. Test different designs to see which launches best.',
        duration: '15 min'
      },
      {
        title: 'Launch and Adjust',
        description: 'Load airplane, pull back, release! Adjust angle and tension for maximum distance.',
        duration: '20 min'
      }
    ],
    safetyNotes: [
      'Never aim at people',
      'Launch in open areas',
      'Be careful of snapping rubber bands'
    ],
    learningOutcomes: [
      'Mechanical engineering',
      'Aerodynamics',
      'Energy transfer',
      'Iterative design'
    ]
  },
  {
    id: 'toybox-kite',
    name: 'Diamond Kite',
    pillar: 'toybox',
    category: 'Vehicles',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '1.5 hours',
    description: 'Build a classic diamond kite that soars! Experience the joy of flight with this timeless project.',
    image: '/images/airplane.webp',
    rating: 4.7,
    reviewCount: 98,
    materials: [
      { name: 'Dowels or sticks', quantity: '2 pieces' },
      { name: 'Plastic bag or tissue paper' },
      { name: 'String', quantity: 'Lots for flying!' },
      { name: 'Tape' },
      { name: 'Scissors' },
      { name: 'Ribbon for tail' }
    ],
    steps: [
      {
        title: 'Create Frame',
        description: 'Cross two sticks - vertical longer than horizontal. Tie firmly at intersection point.',
        duration: '15 min'
      },
      {
        title: 'Add Outline',
        description: 'Run string around the outside of the frame, creating the kite shape. Secure at each stick end.',
        duration: '15 min'
      },
      {
        title: 'Cover with Skin',
        description: 'Lay frame on plastic or paper. Cut with extra margin, fold over frame, and tape secure.',
        duration: '20 min'
      },
      {
        title: 'Attach Flying Line',
        description: 'Tie flying string to the intersection point. Create a bridle for better control if needed.',
        duration: '15 min'
      },
      {
        title: 'Add Tail and Fly',
        description: 'Attach a ribbon tail for stability. Find wind, run, and launch your kite!',
        duration: '30 min'
      }
    ],
    safetyNotes: [
      'Never fly near power lines',
      'Fly in open areas away from trees',
      'Don\'t fly in storms'
    ],
    learningOutcomes: [
      'Aerodynamics',
      'Wind and weather',
      'Patience and persistence',
      'Outdoor appreciation'
    ],
  },
  {
    id: 'toybox-rainstick',
    name: 'Rainstick',
    pillar: 'toybox',
    category: 'Musical',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '45 min',
    description: 'Create a musical instrument that sounds like falling rain. Perfect for relaxation and rhythm activities!',
    image: '/images/blocks.webp',
    rating: 4.6,
    reviewCount: 112,
    materials: [
      { name: 'Cardboard tube', quantity: 'Paper towel or wrapping paper roll' },
      { name: 'Rice or small beans', quantity: '1/4 cup' },
      { name: 'Aluminum foil' },
      { name: 'Tape' },
      { name: 'Decorative paper' }
    ],
    steps: [
      {
        title: 'Seal One End',
        description: 'Cover one end of the tube tightly with paper and tape.',
        duration: '5 min'
      },
      {
        title: 'Create Internal Spiral',
        description: 'Crinkle aluminum foil into a long snake. Twist it into a spiral and insert into the tube.',
        tip: 'The foil creates the rain sound by slowing the rice.',
        duration: '10 min'
      },
      {
        title: 'Add Rice',
        description: 'Pour rice or beans into the tube. Experiment with amounts for different sounds.',
        duration: '5 min'
      },
      {
        title: 'Seal Other End',
        description: 'Close the open end securely with paper and tape. Shake to test - adjust if needed.',
        duration: '5 min'
      },
      {
        title: 'Decorate',
        description: 'Cover with decorative paper. Add designs inspired by rain, nature, or your own creativity!',
        duration: '20 min'
      }
    ],
    safetyNotes: [
      'Ensure ends are sealed tightly',
      'Small items inside can be choking hazards if opened'
    ],
    learningOutcomes: [
      'Sound and acoustics',
      'Rhythm and music',
      'Cultural instruments',
      'Sensory exploration'
    ],
  },
  {
    id: 'toybox-sock-puppet',
    name: 'Sock Puppet',
    pillar: 'toybox',
    category: 'Puppets',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '30 min',
    description: 'Transform an old sock into a fun puppet character. Perfect for storytelling and imaginative play!',
    image: '/images/plush-bear.webp',
    rating: 4.5,
    reviewCount: 145,
    materials: [
      { name: 'Clean sock' },
      { name: 'Googly eyes', quantity: '2' },
      { name: 'Felt scraps' },
      { name: 'Yarn', quantity: 'For hair' },
      { name: 'Fabric glue' },
      { name: 'Buttons', optional: true }
    ],
    steps: [
      {
        title: 'Plan Your Character',
        description: 'Decide what character your puppet will be - person, animal, monster? Gather materials in matching colors.',
        duration: '5 min'
      },
      {
        title: 'Add Eyes',
        description: 'Glue googly eyes or felt circles onto the toe area of the sock.',
        duration: '5 min'
      },
      {
        title: 'Create Mouth',
        description: 'Cut an oval of felt and glue inside the sock to create a mouth. Add a felt tongue if desired!',
        duration: '10 min'
      },
      {
        title: 'Add Features',
        description: 'Glue on yarn hair, felt ears, buttons, or other features to complete your character.',
        duration: '10 min'
      },
      {
        title: 'Put on a Show!',
        description: 'Once glue is dry, put your hand in and bring your puppet to life!',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Use fabric glue rather than hot glue with young children',
      'Buttons can be choking hazards - consider felt alternatives for young kids'
    ],
    learningOutcomes: [
      'Creative expression',
      'Storytelling',
      'Character development',
      'Communication skills'
    ],
  },
  {
    id: 'toybox-finger-puppets',
    name: 'Felt Finger Puppets',
    pillar: 'toybox',
    category: 'Puppets',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '1 hour',
    description: 'Create a set of adorable finger puppets from felt. Make a whole cast of characters for stories!',
    image: '/images/plush-bear.webp',
    rating: 4.7,
    reviewCount: 98,
    materials: [
      { name: 'Felt sheets', quantity: 'Various colors' },
      { name: 'Scissors' },
      { name: 'Fabric glue or needle and thread' },
      { name: 'Markers' },
      { name: 'Small embellishments', optional: true }
    ],
    steps: [
      {
        title: 'Cut Base Shapes',
        description: 'Cut two finger-sized rectangles with rounded tops for each puppet. These form the body.',
        duration: '15 min'
      },
      {
        title: 'Glue or Sew Edges',
        description: 'Join the two pieces along sides and top, leaving bottom open for your finger.',
        duration: '15 min'
      },
      {
        title: 'Add Faces',
        description: 'Cut tiny felt pieces for eyes, noses, mouths. Glue in place. Use markers for details.',
        duration: '15 min'
      },
      {
        title: 'Create Characters',
        description: 'Add ears for animals, hair for people, wings for birds. Get creative!',
        duration: '15 min'
      },
      {
        title: 'Perform Stories',
        description: 'Put puppets on all fingers and act out stories. Make a mini theater from a box!',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Supervise scissors use',
      'Use child-safe glue'
    ],
    learningOutcomes: [
      'Fine motor skills',
      'Storytelling',
      'Character creation',
      'Imagination'
    ]
  },
  {
    id: 'toybox-rubber-band-car',
    name: 'Rubber Band Car',
    pillar: 'toybox',
    category: 'Vehicles',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '45 min',
    description: 'Build a car powered by rubber band energy! Watch it zoom across the floor.',
    image: '/images/wooden-car.webp',
    rating: 4.6,
    reviewCount: 156,
    materials: [
      { name: 'Water bottle or small box' },
      { name: 'Bottle caps', quantity: '4 for wheels' },
      { name: 'Wooden skewers', quantity: '2 for axles' },
      { name: 'Rubber bands', quantity: '2-3' },
      { name: 'Tape' },
      { name: 'Scissors' }
    ],
    steps: [
      {
        title: 'Prepare the Body',
        description: 'Clean your bottle or box. Poke holes on each side for axles to pass through.',
        duration: '10 min'
      },
      {
        title: 'Install Axles',
        description: 'Push skewers through the holes. They should spin freely.',
        duration: '10 min'
      },
      {
        title: 'Attach Wheels',
        description: 'Poke holes in bottle cap centers. Push onto skewer ends. Secure with tape or glue.',
        duration: '10 min'
      },
      {
        title: 'Add Rubber Band Power',
        description: 'Hook rubber band around rear axle. Attach other end to front of car body.',
        duration: '10 min'
      },
      {
        title: 'Wind and Test!',
        description: 'Roll car backward to wind rubber band. Release and watch it go! Test how far it travels.',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Be careful with sharp skewer ends',
      'Don\'t aim at people when releasing'
    ],
    learningOutcomes: [
      'Stored energy',
      'Simple machines',
      'Engineering design',
      'Cause and effect'
    ],
    crossPillar: ['sciencelab-balloon-rocket']
  },
  {
    id: 'toybox-spinning-top',
    name: 'Wooden Spinning Top',
    pillar: 'toybox',
    category: 'Building',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '30 min',
    description: 'Craft a classic spinning top that twirls for ages. Decorate with colorful patterns that blend when spinning!',
    image: '/images/blocks.webp',
    rating: 4.4,
    reviewCount: 87,
    materials: [
      { name: 'Cardboard circles', quantity: '2-3 sizes' },
      { name: 'Wooden dowel or pencil' },
      { name: 'Markers' },
      { name: 'Glue' }
    ],
    steps: [
      {
        title: 'Create Disc',
        description: 'Cut a circle from cardboard, about 3-4 inches diameter. Ensure it\'s perfectly round.',
        duration: '5 min'
      },
      {
        title: 'Add Spindle',
        description: 'Poke a hole in exact center. Insert dowel or sharpened pencil. Glue in place.',
        tip: 'Center placement is crucial for good spinning!',
        duration: '10 min'
      },
      {
        title: 'Decorate Top',
        description: 'Draw colorful patterns - spirals, stripes, dots. Colors will blend when spinning!',
        duration: '10 min'
      },
      {
        title: 'Balance and Adjust',
        description: 'Spin test your top. If wobbly, check center alignment. Trim edges if uneven.',
        duration: '5 min'
      },
      {
        title: 'Spinning Exploration',
        description: 'Practice spinning technique. See how long you can keep it spinning!',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Pencil points can be sharp'
    ],
    learningOutcomes: [
      'Rotational physics',
      'Balance and symmetry',
      'Color blending',
      'Fine motor control'
    ]
  }
];

// ============================================
// 🔬 SCIENCELAB ACTIVITIES (12)
// ============================================

const sciencelabActivities: Activity[] = [
  {
    id: 'jigyasulab-physics',
    name: 'Physics Lab',
    pillar: 'sciencelab',
    category: 'Physics',
    ageRange: '9-12',
    difficulty: 'Medium',
    timeToMake: 'Interactive',
    description: 'Enter the Physics Lab and explore mechanics, optics, and energy interactively.',
    materials: [],
    image: '/images/hero-camp.webp',
    rating: 5.0,
    reviewCount: 412,
    steps: [],
    safetyNotes: [],
    learningOutcomes: ['Physics concepts', 'Scientific thinking'],
    url: '/physics'
  },
  {
    id: 'jigyasulab-chem',
    name: 'Chemistry Lab',
    pillar: 'sciencelab',
    category: 'Chemistry',
    ageRange: '9-12',
    difficulty: 'Hard',
    timeToMake: 'Interactive',
    description: 'Mix elements and observe reactions in our safe, virtual Chemistry Lab.',
    materials: [],
    image: '/images/slime.webp',
    rating: 4.9,
    reviewCount: 388,
    steps: [],
    safetyNotes: [],
    learningOutcomes: ['Chemical reactions', 'Molecular structures'],
    url: '/chem'
  },
  {
    id: 'jigyasulab-bio',
    name: 'Biology Lab',
    pillar: 'sciencelab',
    category: 'Biology',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: 'Interactive',
    description: 'Explore the wonders of life, cells, and ecosystems in the Biology Lab.',
    materials: [],
    image: '/images/nature-hunt.webp',
    rating: 4.8,
    reviewCount: 275,
    steps: [],
    safetyNotes: [],
    learningOutcomes: ['Anatomy', 'Ecosystems'],
    url: '/bio'
  },
  {
    id: 'jigyasulab-math',
    name: 'Math Lab',
    pillar: 'sciencelab',
    category: 'Engineering',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: 'Interactive',
    description: 'Solve puzzles and visualize mathematical concepts in a fun, interactive way.',
    materials: [],
    image: '/images/puzzle.webp',
    rating: 4.7,
    reviewCount: 156,
    steps: [],
    safetyNotes: [],
    learningOutcomes: ['Geometry', 'Problem solving'],
    url: '/math'
  },
  {
    id: 'jigyasulab-cosmos',
    name: 'Cosmos Lab',
    pillar: 'sciencelab',
    category: 'Physics',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: 'Interactive',
    description: 'Travel through space, explore planets, and understand the universe.',
    materials: [],
    image: '/images/hero-camp.webp',
    rating: 5.0,
    reviewCount: 501,
    steps: [],
    safetyNotes: [],
    learningOutcomes: ['Astronomy', 'Space exploration'],
    url: '/cosmos'
  },
  {
    id: 'sciencelab-volcano',
    name: 'Erupting Volcano',
    demoMedia: '/images/volcano-demo.webp',
    pillar: 'sciencelab',
    category: 'Chemistry',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '30 min',
    description: 'Create an explosive volcanic eruption using kitchen chemistry! Watch the foamy lava flow and learn about chemical reactions.',
    image: '/images/volcano.webp',
    featured: true,
    rating: 4.9,
    reviewCount: 234,
    materials: [
      { name: 'Baking soda', quantity: '3 tablespoons' },
      { name: 'Vinegar', quantity: '1 cup' },
      { name: 'Dish soap', quantity: 'A few drops' },
      { name: 'Food coloring', quantity: 'Red and orange' },
      { name: 'Play-doh or clay', quantity: 'For volcano shape' },
      { name: 'Plastic bottle or container' },
      { name: 'Tray or pan', quantity: 'To catch overflow' }
    ],
    steps: [
      {
        title: 'Build Your Volcano',
        description: 'Place plastic bottle on tray. Shape clay or play-doh around it to create a volcano mountain. Leave the bottle opening exposed at the top.',
        tip: 'Make it look realistic with ridges and a crater!',
        duration: '15 min'
      },
      {
        title: 'Add the Lava Base',
        description: 'Pour baking soda into the bottle. Add a few drops of dish soap and red/orange food coloring.',
        duration: '3 min',
        learningMoment: {
          type: 'fact',
          prompt: 'Did you know? Baking soda is a base and vinegar is an acid. When they meet, they throw a bubbly party!'
        }
      },
      {
        title: 'Prepare for Eruption',
        description: 'Make sure everyone can see! Have your vinegar ready to pour.',
        duration: '2 min',
        learningMoment: {
          type: 'prediction',
          prompt: 'What do you think will happen when the vinegar hits the baking soda?',
          options: ['It will freeze', 'It will make gas bubbles and erupt', 'It will turn into slime'],
          optionImages: ['/images/ice.webp', '/images/volcano.webp', '/images/slime.webp'],
          correctFeedback: 'Yes! They create carbon dioxide gas, which bubbles up and out!'
        }
      },
      {
        title: 'Eruption Time!',
        description: 'Pour vinegar into the bottle and step back. Watch the foamy lava erupt!',
        duration: '1 min',
        parentHelp: true
      },
      {
        title: 'Understand the Science',
        description: 'The baking soda (base) reacts with vinegar (acid) to create carbon dioxide gas, which makes the bubbles and foam!',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Do this experiment on a tray or outside - it gets messy!',
      'Vinegar can irritate eyes - don\'t get too close',
      'Adult supervision recommended'
    ],
    learningOutcomes: [
      'Acid-base reactions',
      'Chemical reactions',
      'Carbon dioxide production',
      'Scientific observation'
    ]
  },
  {
    id: 'sciencelab-density-tower',
    name: 'Rainbow Density Tower',
    pillar: 'sciencelab',
    category: 'Chemistry',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '30 min',
    description: 'Stack liquids in a rainbow! Learn about density as you create layers that magically don\'t mix.',
    image: '/images/crystal.webp',
    rating: 4.8,
    reviewCount: 156,
    materials: [
      { name: 'Honey', quantity: '1/4 cup' },
      { name: 'Corn syrup', quantity: '1/4 cup' },
      { name: 'Dish soap', quantity: '1/4 cup' },
      { name: 'Water', quantity: '1/4 cup' },
      { name: 'Vegetable oil', quantity: '1/4 cup' },
      { name: 'Rubbing alcohol', quantity: '1/4 cup' },
      { name: 'Food coloring' },
      { name: 'Tall clear glass or jar' }
    ],
    steps: [
      {
        title: 'Color Your Liquids',
        description: 'Add different food coloring to water, corn syrup, and rubbing alcohol. Honey and oil have natural colors.',
        duration: '5 min'
      },
      {
        title: 'Pour the Heaviest First',
        description: 'Start with honey at the bottom of your glass. Pour slowly down the side.',
        tip: 'Patience is key - pour very slowly!',
        duration: '3 min'
      },
      {
        title: 'Add Middle Layers',
        description: 'Carefully add corn syrup, then dish soap, then water. Pour down the side of the glass.',
        duration: '5 min'
      },
      {
        title: 'Top With Light Liquids',
        description: 'Add vegetable oil, then carefully add rubbing alcohol on top.',
        duration: '5 min'
      },
      {
        title: 'Experiment!',
        description: 'Try dropping small objects - where do they float? Predict based on density!',
        duration: '10 min'
      }
    ],
    safetyNotes: [
      'Don\'t drink any of these liquids!',
      'Rubbing alcohol requires adult handling',
      'Wash hands after experiment'
    ],
    learningOutcomes: [
      'Density concepts',
      'Liquid properties',
      'Scientific layering',
      'Prediction and observation'
    ]
  },
  {
    id: 'sciencelab-crystals',
    name: 'Crystal Growing',
    pillar: 'sciencelab',
    category: 'Chemistry',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '30 min + 3-5 days',
    description: 'Grow beautiful crystals from sugar, salt, or borax! Watch amazing structures form over several days.',
    image: '/images/crystal.webp',
    rating: 4.8,
    reviewCount: 145,
    materials: [
      { name: 'Borax, salt, or sugar', quantity: '1 cup' },
      { name: 'Hot water', quantity: '2 cups' },
      { name: 'Glass jar' },
      { name: 'String' },
      { name: 'Pencil' },
      { name: 'Pipe cleaners', optional: true },
      { name: 'Food coloring', optional: true }
    ],
    steps: [
      {
        title: 'Create Super-Saturated Solution',
        description: 'Have an adult pour hot water into jar. Add borax/salt/sugar slowly, stirring until no more dissolves.',
        duration: '10 min',
        parentHelp: true
      },
      {
        title: 'Prepare Crystal Seed',
        description: 'Tie string to pencil. Shape pipe cleaner into a form (star, heart) and tie to string. Or just use string.',
        duration: '5 min'
      },
      {
        title: 'Add Color (Optional)',
        description: 'Add food coloring to solution for colored crystals.',
        duration: '2 min',
        learningMoment: {
          type: 'observation',
          prompt: 'How does the glue feel right now before we add the magic ingredient?',
          options: ['Runny and sticky', 'Hard as a rock', 'Bouncy'],
          optionImages: ['/images/glue.webp', '/images/rock.webp', '/images/ball.webp'],
          correctFeedback: 'Yes, it is a runny liquid! We are about to change its state.'
        }
      },
      {
        title: 'Suspend and Wait',
        description: 'Lower string/pipe cleaner into solution. Rest pencil across jar top. Place somewhere still.',
        duration: '5 min'
      },
      {
        title: 'Watch and Wait',
        description: 'Check daily! Crystals form as water evaporates. Full growth takes 3-5 days.',
        duration: '3-5 days'
      }
    ],
    safetyNotes: [
      'Adult handles hot water only',
      'Borax is not edible - wash hands',
      'Don\'t move or disturb jar during growth'
    ],
    learningOutcomes: [
      'Crystallization process',
      'Saturation concepts',
      'Patience and observation',
      'Molecular structure'
    ]
  },
  {
    id: 'sciencelab-slime',
    name: 'Slime Factory',
    demoMedia: '/images/slime-demo.webp',
    pillar: 'sciencelab',
    category: 'Chemistry',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '15 min',
    description: 'Mix up oozy, stretchy, satisfying slime! Experiment with colors, glitter, and different consistencies.',
    image: '/images/slime.webp',
    featured: true,
    rating: 4.9,
    reviewCount: 312,
    materials: [
      { name: 'White school glue', quantity: '1/2 cup' },
      { name: 'Contact lens solution (with boric acid)', quantity: '1 tablespoon' },
      { name: 'Baking soda', quantity: '1/2 teaspoon' },
      { name: 'Food coloring' },
      { name: 'Glitter', optional: true },
      { name: 'Bowl and spoon' }
    ],
    steps: [
      {
        title: 'Mix Base',
        description: 'Pour glue into bowl. Add food coloring and glitter if desired. Stir well.',
        duration: '3 min'
      },
      {
        title: 'Add Activator',
        description: 'Sprinkle in baking soda and mix. Then add contact solution and stir rapidly.',
        duration: '3 min'
      },
      {
        title: 'Knead the Slime',
        description: 'Once slime forms, pick it up and knead with hands. It will become less sticky.',
        tip: 'If too sticky, add more contact solution. If too stiff, add more glue.',
        duration: '5 min'
      },
      {
        title: 'Test Properties',
        description: 'Stretch it slowly - does it pull? Pull fast - does it snap? Poke it - does it bounce?',
        duration: '5 min'
      },
      {
        title: 'Store Properly',
        description: 'Store in airtight container. Slime lasts 1-2 weeks with proper storage!',
        duration: '2 min'
      }
    ],
    safetyNotes: [
      'Wash hands after playing',
      'Don\'t eat slime',
      'Play on protected surface - slime can stain'
    ],
    learningOutcomes: [
      'Polymer chemistry',
      'Non-Newtonian fluids',
      'Following recipes',
      'Sensory exploration'
    ]
  },
  {
    id: 'sciencelab-balloon-rocket',
    name: 'Balloon Rocket',
    demoMedia: '/images/rocket-demo.webp',
    pillar: 'sciencelab',
    category: 'Physics',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '15 min',
    description: 'Launch a balloon across the room on a string! Learn about thrust and Newton\'s third law.',
    image: '/images/volcano.webp',
    rating: 4.7,
    reviewCount: 187,
    materials: [
      { name: 'Balloon' },
      { name: 'String', quantity: '10-15 feet' },
      { name: 'Straw' },
      { name: 'Tape' },
      { name: 'Two chairs or posts' }
    ],
    steps: [
      {
        title: 'Set Up Track',
        description: 'Thread string through straw. Tie string between two chairs, keeping it taut and level.',
        duration: '5 min'
      },
      {
        title: 'Prepare Balloon',
        description: 'Blow up balloon but don\'t tie it. Pinch the end to keep air in.',
        duration: '2 min'
      },
      {
        title: 'Attach to Straw',
        description: 'While someone holds the balloon closed, tape it to the straw on the string.',
        duration: '3 min'
      },
      {
        title: 'Launch!',
        description: 'Release the balloon and watch it zoom along the string!',
        duration: '1 min'
      },
      {
        title: 'Experiment',
        description: 'Try different balloon sizes, angles, or adding weight. What changes the speed?',
        duration: '10 min'
      }
    ],
    safetyNotes: [
      'Don\'t release balloons outdoors - harmful to wildlife',
      'Supervise young children with balloons'
    ],
    learningOutcomes: [
      'Newton\'s third law',
      'Thrust and propulsion',
      'Variables in experiments',
      'Cause and effect'
    ]
  },
  {
    id: 'sciencelab-invisible-ink',
    name: 'Invisible Ink Messages',
    pillar: 'sciencelab',
    category: 'Chemistry',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '20 min',
    description: 'Write secret messages that appear when heated! Perfect for spy games and learning about chemical changes.',
    image: '/images/crystal.webp',
    rating: 4.6,
    reviewCount: 123,
    materials: [
      { name: 'Lemon juice', quantity: '2-3 tablespoons' },
      { name: 'White paper' },
      { name: 'Cotton swab or paintbrush' },
      { name: 'Lamp or iron', quantity: 'Heat source' }
    ],
    steps: [
      {
        title: 'Prepare Ink',
        description: 'Squeeze lemon juice into a small bowl. This is your invisible ink!',
        duration: '3 min'
      },
      {
        title: 'Write Message',
        description: 'Dip cotton swab in lemon juice and write on white paper. Use enough juice to wet the paper.',
        duration: '5 min'
      },
      {
        title: 'Let Dry',
        description: 'Allow paper to dry completely. The message becomes invisible!',
        duration: '5 min'
      },
      {
        title: 'Reveal Message',
        description: 'Hold paper near (not touching!) a light bulb or have adult use warm iron. Message appears brown!',
        duration: '5 min',
        parentHelp: true
      },
      {
        title: 'Understand Why',
        description: 'Heat oxidizes the lemon juice, turning it brown. The acid weakens paper where you wrote!',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Adult supervision required for heat source',
      'Don\'t touch hot lamp or iron',
      'Keep paper safe distance from heat'
    ],
    learningOutcomes: [
      'Oxidation reactions',
      'Chemical changes',
      'Heat effects',
      'Secret communication history'
    ]
  },
  {
    id: 'sciencelab-magnetic-maze',
    name: 'Magnetic Maze',
    pillar: 'sciencelab',
    category: 'Physics',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '45 min',
    description: 'Build a maze and guide objects through using magnet power! Learn about magnetic forces.',
    image: '/images/crystal.webp',
    rating: 4.5,
    reviewCount: 89,
    materials: [
      { name: 'Cardboard box lid or shallow box' },
      { name: 'Strong magnets', quantity: '2' },
      { name: 'Paper clips or small metal objects' },
      { name: 'Straws or cardboard strips' },
      { name: 'Markers' },
      { name: 'Tape' }
    ],
    steps: [
      {
        title: 'Design Maze',
        description: 'Draw a maze path inside the box lid. Mark start and finish points.',
        duration: '10 min'
      },
      {
        title: 'Build Walls',
        description: 'Cut straws or cardboard strips and tape along maze walls to create barriers.',
        duration: '15 min'
      },
      {
        title: 'Add Obstacles',
        description: 'Include dead ends, tunnels, or challenges. Make it tricky but solvable!',
        duration: '10 min'
      },
      {
        title: 'Test Magnetic Control',
        description: 'Place paper clip in maze. Hold magnet under the box and move it. The clip follows!',
        duration: '5 min'
      },
      {
        title: 'Play and Race',
        description: 'Navigate through the maze using only the magnet. Time yourself or race friends!',
        duration: '∞'
      }
    ],
    safetyNotes: [
      'Keep strong magnets away from electronics',
      'Supervise small magnet use with young children'
    ],
    learningOutcomes: [
      'Magnetic fields',
      'Forces at a distance',
      'Problem-solving',
      'Hand-eye coordination'
    ]
  },
  {
    id: 'sciencelab-solar-oven',
    name: 'Solar Oven S\'mores',
    pillar: 'sciencelab',
    category: 'Engineering',
    ageRange: '6-12',
    difficulty: 'Medium',
    timeToMake: '1 hour + cooking',
    description: 'Harness the sun\'s power to cook s\'mores! Learn about solar energy and heat concentration.',
    image: '/images/volcano.webp',
    rating: 4.8,
    reviewCount: 134,
    materials: [
      { name: 'Pizza box' },
      { name: 'Aluminum foil' },
      { name: 'Plastic wrap' },
      { name: 'Black paper' },
      { name: 'Tape and scissors' },
      { name: 'Graham crackers, chocolate, marshmallows' }
    ],
    steps: [
      {
        title: 'Create Flap',
        description: 'Cut three sides of a square in box lid, leaving one side as hinge. Fold flap up.',
        duration: '10 min'
      },
      {
        title: 'Line with Foil',
        description: 'Cover the flap\'s inner surface with aluminum foil, shiny side out. Smooth flat.',
        duration: '10 min'
      },
      {
        title: 'Create Window',
        description: 'Tape plastic wrap over the hole created by the flap. This traps heat inside.',
        duration: '10 min'
      },
      {
        title: 'Prepare Interior',
        description: 'Line bottom of box with black paper (absorbs heat). Add more foil on inner sides.',
        duration: '10 min'
      },
      {
        title: 'Cook S\'mores!',
        description: 'Place s\'more ingredients inside. Angle toward sun, prop flap to reflect light in. Wait 30-60 min!',
        duration: '30-60 min'
      }
    ],
    safetyNotes: [
      'Only use on sunny days',
      'Contents get hot - use oven mitts',
      'Adult supervision when opening'
    ],
    learningOutcomes: [
      'Solar energy',
      'Heat absorption and reflection',
      'Renewable energy concepts',
      'Engineering design'
    ],
  },
  {
    id: 'sciencelab-dancing-raisins',
    name: 'Dancing Raisins',
    pillar: 'sciencelab',
    category: 'Chemistry',
    ageRange: '3-12',
    difficulty: 'Easy',
    timeToMake: '10 min',
    description: 'Watch raisins dance up and down in a glass! A simple experiment that demonstrates gas bubbles and density.',
    image: '/images/volcano.webp',
    rating: 4.4,
    reviewCount: 98,
    materials: [
      { name: 'Clear soda (Sprite or club soda)', quantity: '1 glass' },
      { name: 'Raisins', quantity: 'Small handful' },
      { name: 'Clear glass or jar' }
    ],
    steps: [
      {
        title: 'Pour Soda',
        description: 'Fill a clear glass about 3/4 full with clear carbonated soda.',
        duration: '1 min'
      },
      {
        title: 'Drop Raisins',
        description: 'Drop 5-8 raisins into the soda. They\'ll sink to the bottom at first.',
        duration: '1 min'
      },
      {
        title: 'Watch the Dance',
        description: 'Wait a minute - raisins start to rise, then fall, then rise again!',
        duration: '5 min'
      },
      {
        title: 'Understand Why',
        description: 'CO2 bubbles stick to wrinkly raisins, making them float. At top, bubbles pop and raisins sink!',
        duration: '3 min'
      },
      {
        title: 'Try Variations',
        description: 'Test other small objects - what else dances? Try different sodas.',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Don\'t drink the soda after experiment'
    ],
    learningOutcomes: [
      'Density and buoyancy',
      'Carbon dioxide properties',
      'Observation skills',
      'Scientific prediction'
    ]
  },
  {
    id: 'sciencelab-static-butterfly',
    name: 'Static Electricity Butterfly',
    pillar: 'sciencelab',
    category: 'Physics',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '20 min',
    description: 'Make a butterfly\'s wings flutter using static electricity! No batteries needed - just science!',
    image: '/images/crystal.webp',
    rating: 4.5,
    reviewCount: 76,
    materials: [
      { name: 'Tissue paper' },
      { name: 'Cardstock' },
      { name: 'Balloon' },
      { name: 'Scissors' },
      { name: 'Markers' }
    ],
    steps: [
      {
        title: 'Create Body',
        description: 'Cut a butterfly body shape from cardstock. Make it sturdy - this is the base.',
        duration: '5 min'
      },
      {
        title: 'Cut Tissue Wings',
        description: 'Cut delicate wing shapes from tissue paper. Make them light and thin.',
        duration: '5 min'
      },
      {
        title: 'Attach Wings',
        description: 'Tape wings to body at center only. Wings should be free to move on edges.',
        duration: '5 min'
      },
      {
        title: 'Charge Balloon',
        description: 'Blow up balloon and rub vigorously on your hair or wool sweater.',
        duration: '2 min'
      },
      {
        title: 'Make Wings Flutter',
        description: 'Hold charged balloon near tissue wings - watch them rise toward it! Move balloon to make them flutter.',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Latex allergy caution with balloons'
    ],
    learningOutcomes: [
      'Static electricity',
      'Electric charges',
      'Attraction forces',
      'Conductors vs insulators'
    ]
  },
  {
    id: 'sciencelab-water-cycle',
    name: 'Water Cycle in a Bag',
    pillar: 'sciencelab',
    category: 'Biology',
    ageRange: '6-12',
    difficulty: 'Easy',
    timeToMake: '15 min + observation',
    description: 'Create a mini water cycle in a plastic bag! Watch evaporation, condensation, and precipitation happen.',
    image: '/images/crystal.webp',
    rating: 4.6,
    reviewCount: 112,
    materials: [
      { name: 'Ziplock bag', quantity: 'Quart size' },
      { name: 'Water', quantity: '1/4 cup' },
      { name: 'Blue food coloring' },
      { name: 'Tape' },
      { name: 'Sunny window' }
    ],
    steps: [
      {
        title: 'Draw Scene',
        description: 'Draw clouds at top of bag, sun, and waves at bottom using permanent marker.',
        duration: '5 min'
      },
      {
        title: 'Add Water',
        description: 'Pour water into bag with blue food coloring. This is your ocean!',
        duration: '2 min'
      },
      {
        title: 'Seal and Mount',
        description: 'Seal bag tightly. Tape to sunny window at eye level.',
        duration: '3 min'
      },
      {
        title: 'Observe Changes',
        description: 'Check throughout the day. Water evaporates, condenses on bag, and "rains" down!',
        duration: 'Ongoing'
      },
      {
        title: 'Label the Cycle',
        description: 'Add labels: evaporation (water rising), condensation (droplets forming), precipitation (drops falling).',
        duration: '5 min'
      }
    ],
    safetyNotes: [
      'Ensure bag is sealed to prevent leaks'
    ],
    learningOutcomes: [
      'Water cycle stages',
      'Evaporation and condensation',
      'Solar energy effects',
      'Earth science basics'
    ],
  },
  {
    id: 'sciencelab-egg-drop',
    name: 'Egg Drop Challenge',
    pillar: 'sciencelab',
    category: 'Engineering',
    ageRange: '9-12',
    difficulty: 'Hard',
    timeToMake: '1 hour',
    description: 'Design a contraption to protect an egg from a high drop! Classic engineering challenge that teaches impact absorption.',
    image: '/images/volcano.webp',
    rating: 4.9,
    reviewCount: 167,
    materials: [
      { name: 'Raw eggs', quantity: '2-3 for testing' },
      { name: 'Straws' },
      { name: 'Balloons' },
      { name: 'Cotton balls' },
      { name: 'Bubble wrap' },
      { name: 'Rubber bands' },
      { name: 'Tape' },
      { name: 'Small box' }
    ],
    steps: [
      {
        title: 'Study the Problem',
        description: 'Understand forces: impact, gravity, momentum. What slows falls? What absorbs shock?',
        duration: '10 min'
      },
      {
        title: 'Design Your Device',
        description: 'Sketch ideas. Consider: padding, parachute, crumple zones, suspension systems.',
        duration: '10 min'
      },
      {
        title: 'Build Prototype',
        description: 'Construct your egg protection device. Secure egg inside with cushioning materials.',
        duration: '30 min'
      },
      {
        title: 'Test Drop',
        description: 'Start from low height. If successful, go higher! Document results.',
        duration: '10 min',
        parentHelp: true
      },
      {
        title: 'Iterate',
        description: 'If egg breaks, analyze why. Improve design and test again!',
        duration: 'Ongoing'
      }
    ],
    safetyNotes: [
      'Do drops outside - eggs are messy!',
      'Adult supervision for high drops',
      'Wash hands after handling raw eggs'
    ],
    learningOutcomes: [
      'Engineering design process',
      'Force and impact',
      'Iterative improvement',
      'Problem-solving'
    ]
  }
];

// ============================================
// 🎨 ARTSTUDIO ACTIVITIES (12)
// ============================================

export const activities: Activity[] = [
  ...toyboxActivities.map((a, i) => ({ ...a, isPremium: i >= 12 })),
  ...sciencelabActivities.map((a, i) => ({ ...a, isPremium: i >= 6 })),
];

export const getActivitiesByPillar = (pillar: PillarId): Activity[] => {
  return activities.filter(a => a.pillar === pillar);
};

export const getActivitiesByAge = (age: AgeRange): Activity[] => {
  return activities.filter(a => {
    // Handle age range matching logic
    if (a.ageRange === age) return true;
    if (a.ageRange === '3-12') return true;
    if (a.ageRange === '6-12' && (age === '6-8' || age === '9-12')) return true;
    if (a.ageRange === '3-8' && (age === '3-5' || age === '6-8')) return true;
    return false;
  });
};

export const getFeaturedActivities = (): Activity[] => {
  return activities.filter(a => a.featured);
};

export const getActivityById = (id: string): Activity | undefined => {
  return activities.find(a => a.id === id);
};
