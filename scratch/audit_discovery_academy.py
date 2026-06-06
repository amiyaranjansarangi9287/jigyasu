import json
import os

locales_dir = 'D:/vision_agentic/jigyasu/apps/hub/src/learnos/i18n/locales'
with open(os.path.join(locales_dir, 'en.json'), 'r', encoding='utf-8') as f:
    en_data = json.load(f)

discovery_rewrites = {
    "algebra-scales": {
        "hook": "The ancient scales of Justice are unbalanced! You must solve the missing variables to restore harmony."
    },
    "cell-city": {
        "hook": "Welcome to Cell City! You are the Mayor of a microscopic metropolis. Manage the Mitochondria power plants to keep the city alive."
    },
    "chemical-balancer": {
        "hook": "A dangerous chemical reaction is about to erupt! Only you can balance the atomic equations to stabilize the formula."
    }
}

academy_rewrites = {
    "trigonometry-circle": {
        "hook": "Unlock the secrets of the stars! Ancient astronomers used these exact triangles to map the galaxy."
    },
    "projectile-motion": {
        "hook": "Launch the rover to Mars! Calculate the perfect trajectory and velocity to land safely."
    },
    "wave-interference": {
        "hook": "The radio signals are jamming! Understand the peaks and valleys of waves to clear the communication channels."
    }
}

tiny_rewrites = {
    "toddler": {
        "description": "Welcome to the softest, safest play area where tiny hands can explore shapes, colors, and the magic of cause-and-effect!"
    },
    "sensory": {
        "description": "Splash, squish, and pop! Dive into a world of sensory wonders designed to spark joy and curiosity."
    },
    "music": {
        "description": "Tap the drums and ring the bells! Let's discover the rhythm of the universe together."
    }
}

# Apply Discovery
if 'discovery' in en_data and 'modules' in en_data['discovery']:
    for m_id, rewrites in discovery_rewrites.items():
        if m_id in en_data['discovery']['modules']:
            if 'narrative' in en_data['discovery']['modules'][m_id]:
                en_data['discovery']['modules'][m_id]['narrative']['hook'] = rewrites['hook']

# Apply Academy
if 'academy' in en_data and 'modules' in en_data['academy']:
    for m_id, rewrites in academy_rewrites.items():
        if m_id in en_data['academy']['modules']:
            if 'narrative' in en_data['academy']['modules'][m_id]:
                en_data['academy']['modules'][m_id]['narrative']['hook'] = rewrites['hook']

# Apply Tiny
if 'tiny' in en_data and 'zones' in en_data['tiny']:
    for z_id, rewrites in tiny_rewrites.items():
        if z_id in en_data['tiny']['zones']:
            en_data['tiny']['zones'][z_id]['description'] = rewrites['description']

# Save EN
with open(os.path.join(locales_dir, 'en.json'), 'w', encoding='utf-8') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)
    
print("Phase 3: Discovery, Academy, and Tiny Audit Complete.")
