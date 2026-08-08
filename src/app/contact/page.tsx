"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';

export default function ContactPage() {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");
    
    const formData = new FormData(event.currentTarget);
    formData.append("access_key", "0f5f90de-7021-4d02-bdbc-f55a51971131");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setResult("Success! Redirecting...");
        (event.target as HTMLFormElement).reset();
        router.push("/thank-you");
      } else {
        setResult("Error! Something went wrong.");
      }
    } catch (error) {
      setResult("Error! Failed to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </Link>
      
      <div className="bg-card border shadow-sm rounded-2xl p-6 md:p-10 relative overflow-hidden">
        {/* Subtle decorative gradient */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold font-heading mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Suggest or Request More Tools
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Have an idea for a new tool or found a bug? Let us know! Your feedback helps us grow.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-300 resize-none"
                placeholder="What new tool would you like to see? Or what can we improve?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:pointer-events-none disabled:scale-100 group"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              {!isSubmitting && <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
            </button>

            {result && (
              <div className={`p-4 rounded-xl flex items-center ${result.includes("Success") ? "bg-green-500/10 text-green-600 border border-green-500/20" : result.includes("Error") ? "bg-red-500/10 text-red-600 border border-red-500/20" : "bg-blue-500/10 text-blue-600 border border-blue-500/20"}`}>
                <p className="text-sm font-medium">{result}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
