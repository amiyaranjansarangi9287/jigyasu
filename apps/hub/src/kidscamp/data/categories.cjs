"use strict";
// CampCraft - Pillar and Category Definitions
Object.defineProperty(exports, "__esModule", { value: true });
exports.ageTiers = exports.categories = exports.pillars = void 0;
exports.pillars = [
    {
        id: 'toybox',
        name: 'ToyBox',
        icon: '🧸',
        color: '#FFD93D',
        gradientFrom: 'from-yellow-400',
        gradientTo: 'to-orange-400',
        description: 'Build amazing handcrafted toys from scratch'
    },
    {
        id: 'sciencelab',
        name: 'Interactive Labs',
        icon: '🧪',
        color: '#6BCB77',
        gradientFrom: 'from-green-400',
        gradientTo: 'to-emerald-500',
        description: 'Explore Jigyasu Labs: Physics, Chemistry, Biology and more!'
    },
    {
        id: 'artstudio',
        name: 'ArtStudio',
        icon: '🎨',
        color: '#FF6B9D',
        gradientFrom: 'from-pink-400',
        gradientTo: 'to-rose-500',
        description: 'Express your creativity through art and crafts'
    },
    {
        id: 'outdoorquest',
        name: 'Outdoor Activity',
        icon: '🌿',
        color: '#4D96FF',
        gradientFrom: 'from-blue-400',
        gradientTo: 'to-cyan-500',
        description: 'Explore nature and outdoor adventures'
    }
];
exports.categories = [
    // ToyBox categories
    { name: 'Building', icon: '🏗️', pillar: 'toybox' },
    { name: 'Plush', icon: '🧵', pillar: 'toybox' },
    { name: 'Vehicles', icon: '🚗', pillar: 'toybox' },
    { name: 'Puzzles', icon: '🧩', pillar: 'toybox' },
    { name: 'Games', icon: '🎲', pillar: 'toybox' },
    { name: 'Musical', icon: '🎵', pillar: 'toybox' },
    { name: 'Puppets', icon: '🎭', pillar: 'toybox' },
    // ScienceLab categories
    { name: 'Chemistry', icon: '⚗️', pillar: 'sciencelab' },
    { name: 'Physics', icon: '🔋', pillar: 'sciencelab' },
    { name: 'Biology', icon: '🌱', pillar: 'sciencelab' },
    { name: 'Engineering', icon: '⚙️', pillar: 'sciencelab' },
    // ArtStudio categories
    { name: 'Painting', icon: '🖌️', pillar: 'artstudio' },
    { name: 'Crafts', icon: '✂️', pillar: 'artstudio' },
    { name: 'Sculpture', icon: '🏺', pillar: 'artstudio' },
    { name: 'Paper Art', icon: '📄', pillar: 'artstudio' },
    // OutdoorQuest categories
    { name: 'Nature', icon: '🍃', pillar: 'outdoorquest' },
    { name: 'Garden', icon: '🌻', pillar: 'outdoorquest' },
    { name: 'Adventure', icon: '🧭', pillar: 'outdoorquest' },
    { name: 'Wildlife', icon: '🦋', pillar: 'outdoorquest' }
];
exports.ageTiers = [
    {
        id: '3-5',
        name: 'Little Explorers',
        icon: '🐣',
        ageRange: '3-5 years',
        description: 'Simple, sensory activities with parent guidance',
        color: 'from-pink-400 to-purple-400'
    },
    {
        id: '6-8',
        name: 'Junior Creators',
        icon: '🌟',
        ageRange: '6-8 years',
        description: 'Fun projects with clear step-by-step instructions',
        color: 'from-blue-400 to-indigo-400'
    },
    {
        id: '9-12',
        name: 'Adventure Builders',
        icon: '🚀',
        ageRange: '9-12 years',
        description: 'Complex projects for independent makers',
        color: 'from-orange-400 to-red-400'
    },
    {
        id: '13-17',
        name: 'Future Innovators',
        icon: '⚡',
        ageRange: '13-17 years',
        description: 'Advanced projects, coding, and real-world skills for teens',
        color: 'from-slate-600 to-zinc-800'
    },
    {
        id: '18+',
        name: 'Lifelong Learners',
        icon: '🎓',
        ageRange: '18+ years',
        description: 'Deep dives, professional skills, and advanced concepts',
        color: 'from-slate-800 to-zinc-950'
    }
];
