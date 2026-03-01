import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-sm mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
        <div>
          <span className="font-semibold text-slate-700">Hugo Melo</span>
          <span className="mx-2">·</span>
          <span>Demo portfolio — opérations solaire Luxembourg</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/Hugomelo123"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-slate-800 transition-colors"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/hugomelo123"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>
          <a
            href="mailto:hugo1297@gmail.com"
            className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors"
          >
            <Mail className="h-4 w-4" />
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
