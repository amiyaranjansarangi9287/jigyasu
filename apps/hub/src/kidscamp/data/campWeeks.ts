// CampCraft - Camp Week Schedules

export interface CampDay {
  day: number;
  title: string;
  activityId: string;
  pillar: 'toybox' | 'sciencelab' | 'artstudio' | 'outdoorquest';
  description: string;
}

export interface CampWeek {
  id: string;
  name: string;
  theme: string;
  icon: string;
  color: string;
  description: string;
  ageRange: '3-5' | '6-8' | '9-12' | '6-12' | 'all';
  days: CampDay[];
  showcaseDay: number; // Which day is the culminating activity
  materials: string[]; // Combined materials needed for the week
}

export const campWeeks: CampWeek[] = [
  {
    id: 'ocean-explorers',
    name: 'Ocean Explorers',
    theme: '🌊 Ocean Explorers',
    icon: '🌊',
    color: 'from-blue-400 to-cyan-500',
    description: 'Dive into a week of ocean-themed adventures! Create sea creatures, explore water science, and learn about marine life.',
    ageRange: 'all',
    days: [
      {
        day: 1,
        title: 'Paper Plate Fish',
        activityId: 'artstudio-paper-plate-animals',
        pillar: 'artstudio',
        description: 'Start your ocean adventure by creating colorful tropical fish from paper plates!'
      },
      {
        day: 2,
        title: 'Underwater Volcano',
        activityId: 'sciencelab-volcano',
        pillar: 'sciencelab',
        description: 'Create an underwater volcanic eruption! Learn about chemical reactions while making ocean-themed lava.'
      },
      {
        day: 3,
        title: 'Rainstick Waves',
        activityId: 'toybox-rainstick',
        pillar: 'toybox',
        description: 'Build a rainstick that sounds like ocean waves! Perfect for relaxation and music.'
      },
      {
        day: 4,
        title: 'Beach Treasure Hunt',
        activityId: 'outdoorquest-nature-hunt',
        pillar: 'outdoorquest',
        description: 'Go on a beach-themed scavenger hunt! Find shells, smooth rocks, and ocean treasures.'
      },
      {
        day: 5,
        title: 'Ocean Diorama Showcase',
        activityId: 'toybox-dollhouse',
        pillar: 'toybox',
        description: 'Combine everything you\'ve learned to create an ocean diorama featuring all your sea creatures!'
      }
    ],
    showcaseDay: 5,
    materials: [
      'Paper plates',
      'Baking soda & vinegar',
      'Cardboard tubes',
      'Rice or beans',
      'Blue paint',
      'Cardboard box',
      'Construction paper',
      'Shells or shell-shaped pasta',
      'Blue cellophane'
    ]
  },
  {
    id: 'space-mission',
    name: 'Space Mission',
    theme: '🚀 Space Mission',
    icon: '🚀',
    color: 'from-purple-500 to-indigo-600',
    description: 'Blast off into a galaxy of space exploration! Build rockets, learn about planets, and discover the mysteries of the universe.',
    ageRange: 'all',
    days: [
      {
        day: 1,
        title: 'Paper Rocket Ship',
        activityId: 'toybox-balsa-airplane',
        pillar: 'toybox',
        description: 'Design and build your own rocket ship! Learn about aerodynamics and space travel.'
      },
      {
        day: 2,
        title: 'Balloon Rocket Race',
        activityId: 'sciencelab-balloon-rocket',
        pillar: 'sciencelab',
        description: 'Launch balloon rockets across the room! Learn about thrust and Newton\'s third law.'
      },
      {
        day: 3,
        title: 'Galaxy Painting',
        activityId: 'artstudio-salt-painting',
        pillar: 'artstudio',
        description: 'Create stunning galaxy art with salt painting technique! Make stars sparkle and nebulas swirl.'
      },
      {
        day: 4,
        title: 'Stargazing Night',
        activityId: 'outdoorquest-stargazing',
        pillar: 'outdoorquest',
        description: 'Explore the real night sky! Find constellations and learn about distant stars and planets.'
      },
      {
        day: 5,
        title: 'Alien Puppet Show',
        activityId: 'toybox-sock-puppet',
        pillar: 'toybox',
        description: 'Create alien sock puppets and put on a space adventure puppet show! Use your imagination to tell stories from the cosmos.'
      }
    ],
    showcaseDay: 5,
    materials: [
      'Cardboard tubes',
      'Balloons',
      'String',
      'Straws',
      'Salt',
      'Watercolors',
      'Black paper',
      'Socks',
      'Googly eyes',
      'Felt',
      'Star chart or app'
    ]
  },
  {
    id: 'backyard-safari',
    name: 'Backyard Safari',
    theme: '🦋 Backyard Safari',
    icon: '🦋',
    color: 'from-green-400 to-emerald-500',
    description: 'Embark on a wild adventure in your own backyard! Discover insects, plants, and the fascinating ecosystem right outside your door.',
    ageRange: 'all',
    days: [
      {
        day: 1,
        title: 'Bug Hotel Construction',
        activityId: 'outdoorquest-bug-hotel',
        pillar: 'outdoorquest',
        description: 'Build a cozy home for beneficial insects! Learn about the bugs that help our gardens.'
      },
      {
        day: 2,
        title: 'Dancing Raisins Insects',
        activityId: 'sciencelab-dancing-raisins',
        pillar: 'sciencelab',
        description: 'Watch "bugs" dance up and down in soda! Learn about buoyancy and gases.'
      },
      {
        day: 3,
        title: 'Animal Masks',
        activityId: 'artstudio-paper-plate-animals',
        pillar: 'artstudio',
        description: 'Create masks of your favorite safari animals! Transform into lions, elephants, or butterflies.'
      },
      {
        day: 4,
        title: 'Nature Scavenger Hunt',
        activityId: 'outdoorquest-nature-hunt',
        pillar: 'outdoorquest',
        description: 'Explore your backyard safari! Find insects, plants, and animal tracks.'
      },
      {
        day: 5,
        title: 'Safari Binoculars & Field Guide',
        activityId: 'toybox-kaleidoscope',
        pillar: 'toybox',
        description: 'Create your own safari binoculars and nature field guide! Document all the creatures you discovered this week.'
      }
    ],
    showcaseDay: 5,
    materials: [
      'Sticks and twigs',
      'Pinecones',
      'Empty containers',
      'Clear soda',
      'Raisins',
      'Paper plates',
      'Paint',
      'Cardboard tubes',
      'Notebooks',
      'Magnifying glass'
    ]
  },
  {
    id: 'maker-week',
    name: 'Maker Week',
    theme: '🔧 Maker Week',
    icon: '🔧',
    color: 'from-orange-400 to-red-500',
    description: 'Put on your engineering hat! Build, experiment, and create amazing contraptions through hands-on making.',
    ageRange: '6-12',
    days: [
      {
        day: 1,
        title: 'Rubber Band Car',
        activityId: 'toybox-rubber-band-car',
        pillar: 'toybox',
        description: 'Build a car powered by rubber band energy! Learn about stored energy and motion.'
      },
      {
        day: 2,
        title: 'Catapult Challenge',
        activityId: 'toybox-catapult',
        pillar: 'toybox',
        description: 'Construct a working catapult! Learn about levers and launch pompoms across the room.'
      },
      {
        day: 3,
        title: 'Egg Drop Engineering',
        activityId: 'sciencelab-egg-drop',
        pillar: 'sciencelab',
        description: 'Design a device to protect an egg from a high drop! Apply engineering principles to solve real problems.'
      },
      {
        day: 4,
        title: 'Marble Run',
        activityId: 'toybox-marble-run',
        pillar: 'toybox',
        description: 'Engineer an epic marble run with twists, turns, and drops! Experiment with gravity and momentum.'
      },
      {
        day: 5,
        title: 'Invention Convention',
        activityId: 'toybox-recycled-robot',
        pillar: 'toybox',
        description: 'Showcase all your inventions! Create a new robot or contraption that combines what you\'ve learned.'
      }
    ],
    showcaseDay: 5,
    materials: [
      'Plastic bottles',
      'Bottle caps',
      'Rubber bands',
      'Popsicle sticks',
      'Plastic spoons',
      'Eggs',
      'Cushioning materials',
      'Cardboard tubes',
      'Marbles',
      'Recyclables'
    ]
  }
];

export const getCampWeekById = (id: string): CampWeek | undefined => {
  return campWeeks.find(w => w.id === id);
};

export const getCampWeeksByAge = (age: '3-5' | '6-8' | '9-12'): CampWeek[] => {
  return campWeeks.filter(w => w.ageRange === 'all' || w.ageRange === age);
};
