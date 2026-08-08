"use client";

import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

export default function ThankYouPage() {
  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] p-4 animate-in fade-in zoom-in duration-500">
      {windowDimension.width > 0 && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
          className="z-50"
        />
      )}
      
      <div className="bg-card border shadow-sm rounded-3xl p-8 md:p-12 max-w-lg w-full text-center relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-4 text-foreground">
            Thank You!
          </h1>
          
          <p className="text-muted-foreground text-lg mb-8">
            Your message has been successfully sent. We appreciate your feedback and will review your suggestions shortly!
          </p>

          <Link href="/" className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 w-full md:w-auto">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
