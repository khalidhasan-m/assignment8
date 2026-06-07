"use client";

import React from 'react';
import { Divider, Link } from "@heroui/react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 px-6 bg-default-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h2 className="text-xl font-bold">My Awesome App</h2>
          <p className="text-sm text-default-500">
            © {currentYear} All rights reserved.
          </p>
        </div>

        {/* Links Section */}
        <div className="flex gap-6">
          <Link href="/about" color="foreground" size="sm">About</Link>
          <Link href="/privacy" color="foreground" size="sm">Privacy</Link>
          <Link href="/contact" color="foreground" size="sm">Contact</Link>
        </div>
      </div>
      
      <Divider className="my-6" />

      <div className="text-center text-xs text-default-400">
        Built with Next.js and HeroUI
      </div>
    </footer>
  );
};

export default Footer;