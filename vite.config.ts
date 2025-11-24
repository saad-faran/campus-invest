import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from "fs";

// Cross-platform function to copy directory recursively
function copyDir(src: string, dest: string) {
  if (!existsSync(src)) return;
  
  mkdirSync(dest, { recursive: true });
  const entries = readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

// Plugin to copy pages folder to dist
const copyPagesPlugin = () => {
  return {
    name: 'copy-pages',
    closeBundle() {
      const pagesSrc = path.resolve(__dirname, 'pages');
      const pagesDest = path.resolve(__dirname, 'dist', 'pages');
      
      if (existsSync(pagesSrc)) {
        try {
          copyDir(pagesSrc, pagesDest);
          console.log('✅ Copied pages folder to dist');
        } catch (error) {
          console.error('Error copying pages:', error);
        }
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(), 
    mode === "development" && componentTagger(),
    copyPagesPlugin()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: 'public',
}));
