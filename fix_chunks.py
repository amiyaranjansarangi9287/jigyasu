import os
import glob

apps_dir = 'D:/vision_agentic/jigyasu/apps'
apps = ['physics', 'chem', 'bio', 'math', 'cosmos', 'toys', 'camp', 'hub']

for app in apps:
    vite_path = os.path.join(apps_dir, app, 'vite.config.ts')
    if os.path.exists(vite_path):
        with open(vite_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check if manualChunks is already defined
        if 'manualChunks' not in content:
            # We want to insert build.rollupOptions.output.manualChunks inside defineConfig
            # Find the plugins array and insert before or after
            chunk_config = """
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'lucide': ['lucide-react']
        }
      }
    }
  },
"""
            if 'server:' in content:
                content = content.replace('server:', chunk_config + '  server:')
            else:
                content = content.replace('plugins: [', chunk_config + '  plugins: [')
            
            with open(vite_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Added manualChunks to {app}')
