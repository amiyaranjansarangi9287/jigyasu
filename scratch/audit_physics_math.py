import json
import os

locales_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales'
with open(os.path.join(locales_dir, 'en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Physics Rewrites (Decoupling + Wonder-first)
physics_rewrites = {
    "projectile-motion": {"title": "Projectile Motion", "desc": "Launch projectiles and predict exactly where they'll land!"},
    "inclined-plane": {"title": "Inclined Plane", "desc": "How did ancient builders move giant stones? The secret is the ramp."},
    "pendulum-lab": {"title": "Pendulum Lab", "desc": "Unlock the rhythm of time hidden inside swinging pendulums."},
    "newtons-laws": {"title": "Newton's Laws", "desc": "Discover the invisible rules that control every single movement in the universe!"},
    "energy-skate": {"title": "Energy Skate Park", "desc": "Build the ultimate skate track and watch energy transform magically."},
    "collision-sim": {"title": "Collision Simulator", "desc": "Smash objects together to reveal the secret laws of momentum."},
    "wave-interference": {"title": "Wave Interference", "desc": "Watch invisible waves collide and dance to create incredible patterns."},
    "sound-waves": {"title": "Sound Waves", "desc": "See the invisible vibrations that travel through the air into your ears."},
    "doppler-effect": {"title": "Doppler Effect", "desc": "Why does a train horn change pitch as it passes? Uncover the acoustic illusion."},
    "standing-waves": {"title": "Standing Waves", "desc": "Trap waves in space to create perfectly still, mesmerizing patterns."},
    "resonance-lab": {"title": "Resonance Lab", "desc": "Find the secret frequency that can make a wine glass shatter!"},
    "circuit-builder": {"title": "Circuit Builder", "desc": "Harness the power of electrons to light up the dark."},
    "magnetic-fields": {"title": "Magnetic Fields", "desc": "Reveal the invisible forces that guide compasses across the Earth."},
    "ohms-law": {"title": "Ohm's Law", "desc": "Control the hidden rivers of electricity flowing through your circuits."},
    "em-induction": {"title": "EM Induction", "desc": "Turn motion into raw electrical power just like a massive dam!"},
    "motor-generator": {"title": "Motor & Generator", "desc": "Build the machines that power the entire modern world."},
    "heat-transfer": {"title": "Heat Transfer", "desc": "How does the sun's warmth reach us through the freezing vacuum of space?"},
    "gas-laws": {"title": "Gas Laws", "desc": "Squeeze, heat, and expand invisible gases to see how they fight back."},
    "heat-engine": {"title": "Heat Engine", "desc": "Turn fire and heat into unstoppable mechanical movement."},
    "phase-change": {"title": "Phase Change", "desc": "Watch molecules dance wildly as solid ice turns into ghost-like vapor."},
    "lens-sim": {"title": "Lens Simulator", "desc": "Bend light to your will and magnify the invisible world."},
    "mirror-lab": {"title": "Mirror Lab", "desc": "Trap and bounce laser beams in a hall of infinite reflections."},
    "prism-dispersion": {"title": "Prism & Dispersion", "desc": "Shatter pure white light into a brilliant, hidden rainbow."},
    "human-eye": {"title": "Human Eye", "desc": "Explore the biological camera that translates light into thoughts."},
    "interference-patterns": {"title": "Interference Patterns", "desc": "Prove that light acts like a wave by making it bend around corners."},
    "atomic-structure": {"title": "Atomic Structure", "desc": "Zoom in a billion times to see the building blocks of reality."},
    "photoelectric": {"title": "Photoelectric Effect", "desc": "Use light particles to literally knock electrons off solid metal!"},
    "quantum-tunneling": {"title": "Quantum Tunneling", "desc": "Watch particles perform the impossible magic trick of passing through solid walls."},
    "nuclear-decay": {"title": "Nuclear Decay", "desc": "Witness unstable atoms crack and release raw nuclear energy."},
    "buoyancy-lab": {"title": "Buoyancy Lab", "desc": "How can a massive steel cruise ship float while a tiny pebble sinks?"},
    "bernoulli": {"title": "Bernoulli's Principle", "desc": "Discover the invisible pressure that lifts 400-ton airplanes into the sky."},
    "viscosity": {"title": "Viscosity", "desc": "Race sticky honey against water to understand fluid friction."},
    "surface-tension": {"title": "Surface Tension", "desc": "See how water creates an invisible skin that insects can walk on!"},
    "orbital-mechanics": {"title": "Orbital Mechanics", "desc": "Calculate the perfect speed to trap a satellite in Earth's gravity."},
    "black-hole": {"title": "Black Hole", "desc": "Venture to the edge of a collapsed star where time itself stops."},
    "planetary-motion": {"title": "Planetary Motion", "desc": "Control the celestial dance of planets around the blazing sun."},
    "gravity-wells": {"title": "Gravity Wells", "desc": "Watch massive stars bend the very fabric of space and time."}
}

for m_id, content in physics_rewrites.items():
    en_data[f"physics.modules.{m_id}.title"] = content["title"]
    en_data[f"physics.modules.{m_id}.desc"] = content["desc"]

# Math Rewrites (Wonder-first)
math_rewrites = {
    "math_modules.SkillsAcademy.timesDesc": "Unlock the superpower of fast multiplication patterns!",
    "math_modules.SkillsAcademy.bondsDesc": "Discover the secret numbers that add up to perfection.",
    "math_modules.SkillsAcademy.fractionsDesc": "Slice pizzas and share the universe evenly.",
    "math_modules.NumberBondsGarden.subtitle": "Plant seeds and grow beautiful flowers by finding the perfect number pairs!",
    "math_modules.NumberCrunchGame.subtitle": "Race against the clock to solve math mysteries before time runs out!",
    "math_modules.WorksheetGenerator.subtitle": "Generate unlimited magical puzzles to train your brain offline.",
    "math_modules.TimesTableTrainer.subtitle": "Train your brain to see the hidden patterns of multiplication.",
    "math_modules.Visualizer3D.subtitle": "Stop guessing! Actually SEE how math works in three glorious dimensions.",
    "math.features.daily.description": "A fresh mathematical mystery delivered to you every single day.",
    "math.features.explorers.description": "Journey through beautiful interactive landscapes of logic.",
    "math.features.map.description": "Chart your path across the vast universe of numbers.",
    "math.features.visualizer.description": "Hold numbers in your hand and rotate them in 3D space.",
    "math.features.skills.description": "Forge an unbreakable foundation of essential math superpowers.",
    "math.features.advanced.description": "Unlock the secrets of the cosmos with higher-level algorithms.",
    "math.features.game.description": "Test your reflexes in high-speed number-crunching arenas.",
    "math.features.pattern.description": "Become a codebreaker and discover hidden sequences."
}

for key, content in math_rewrites.items():
    if key in en_data:
        en_data[key] = content

# Save EN
with open(os.path.join(locales_dir, 'en.json'), 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
    
print("Phase 5: Physics and Math Decoupling & Culturization Complete.")
