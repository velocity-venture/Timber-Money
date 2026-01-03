import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Shield, Sparkles, CheckCircle2, BarChart3, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { LegalDisclaimer } from "@/components/LegalDisclaimer";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans selection:bg-timber-green/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-timber-navy/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-timber-green/20 flex items-center justify-center overflow-hidden border border-timber-green/30">
              <img 
                src="/mascot/timber_v2.png" 
                alt="Timber Money Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Timber<span className="text-timber-green">Money</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-timber-beige/80 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-timber-beige/80 hover:text-white transition-colors">How it Works</a>
            <a href="#pricing" className="text-sm font-medium text-timber-beige/80 hover:text-white transition-colors">Pricing</a>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" className="text-white hover:text-timber-green hover:bg-white/5">
                Log In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-timber-green hover:bg-timber-green/90 text-timber-navy font-bold shadow-lg shadow-timber-green/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-timber-navy">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-timber-navy -z-20"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 -z-10"></div>
          
          {/* Gradient Blobs */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-timber-green/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 -z-10 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-timber-yellow/10 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 -z-10"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-timber-green text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Sparkles className="w-4 h-4" />
                  <span>Meet Timber: Your AI Financial Guide</span>
                </div>
                
                <h1 className="font-heading font-bold text-5xl md:text-7xl leading-[1.1] text-white animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
                  Build Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-timber-green to-emerald-400">
                    Financial Dam
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-timber-beige/80 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                  Transform your shoebox of receipts into a fortress of wealth. 
                  Timber the Beaver helps you clear the "termites" (debt) and stack your "logs" (assets) automatically.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
                  <Link href="/auth">
                    <Button size="lg" className="w-full sm:w-auto bg-timber-green hover:bg-timber-green/90 text-timber-navy font-bold h-14 px-8 text-lg shadow-lg shadow-timber-green/25 transition-all hover:scale-105">
                      Start Building Free
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg backdrop-blur-sm">
                    <Play className="mr-2 w-5 h-5 fill-current" />
                    Watch Demo
                  </Button>
                </div>
                
                <div className="flex items-center gap-6 pt-4 text-sm text-timber-beige/60 animate-in fade-in slide-in-from-bottom-12 duration-700 delay-400">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-timber-green" />
                    <span>Bank-level Security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-timber-green"></div>
                    <span>No Credit Card Required</span>
                  </div>
                </div>
              </div>
              
              <div className="relative lg:h-[600px] flex items-center justify-center animate-in fade-in zoom-in duration-1000 delay-300">
                {/* Main Visual Composition */}
                <div className="relative w-full max-w-md lg:max-w-full aspect-square lg:aspect-auto">
                  {/* Floating Cards */}
                  <div className="absolute top-1/4 -left-8 md:-left-12 bg-white dark:bg-timber-navy p-4 rounded-2xl shadow-2xl border border-white/10 z-20 animate-float" style={{ animationDelay: "0s" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        🐛
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Termites Cleared</p>
                        <p className="text-lg font-bold text-foreground">-$1,240</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-1/4 -right-4 md:-right-8 bg-white dark:bg-timber-navy p-4 rounded-2xl shadow-2xl border border-white/10 z-20 animate-float" style={{ animationDelay: "2s" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-timber-green/20 flex items-center justify-center text-timber-green">
                        🪵
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Logs Stacked</p>
                        <p className="text-lg font-bold text-foreground">+$3,850</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mascot Centerpiece - Transparent Background */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center">
                      {/* Removed bg-gradient and border to ensure full transparency if needed, or keep subtle glow */}
                      <div className="absolute inset-0 bg-timber-green/20 blur-3xl rounded-full -z-10"></div>
                      <img 
                        src="/mascot/timber_v1.png" 
                        alt="Timber the Beaver" 
                        className="w-full h-full object-contain drop-shadow-2xl animate-bounce-subtle"
                      />
                    </div>
                  </div>
                  
                  {/* Decorative Rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-white/5 rounded-full -z-10"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] border border-white/5 rounded-full -z-20"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-background relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Build Wealth
              </h2>
              <p className="text-lg text-muted-foreground">
                Timber combines AI wisdom with powerful financial tools to help you construct a lasting financial legacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-2xl bg-card border border-border hover:border-timber-green/50 transition-all hover:shadow-lg hover:shadow-timber-green/5">
                <div className="w-14 h-14 rounded-xl bg-timber-green/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-7 h-7 text-timber-green" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">AI Financial Guide</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Chat with Timber to get personalized advice. He uses dam-building analogies to make complex finance simple and fun.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-2xl bg-card border border-border hover:border-timber-green/50 transition-all hover:shadow-lg hover:shadow-timber-green/5">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-7 h-7 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Visual Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  See your "Logs" (assets) vs "Termites" (debt) in clear, beautiful charts. Watch your dam strength grow over time.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-2xl bg-card border border-border hover:border-timber-green/50 transition-all hover:shadow-lg hover:shadow-timber-green/5">
                <div className="w-14 h-14 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle2 className="w-7 h-7 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">Smart Goals</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Set targets for debt payoff and savings. Timber helps you stay on track with automated reminders and tips.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-timber-navy text-white py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-timber-green/20 flex items-center justify-center overflow-hidden border border-timber-green/30">
                  <img 
                    src="/mascot/timber_v2.png" 
                    alt="Timber Money Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Timber<span className="text-timber-green">Money</span>
                </span>
              </div>
              <p className="text-timber-beige/60 max-w-sm">
                Building stronger financial futures, one log at a time. 
                Join thousands of others constructing their fortress of wealth.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-timber-green">Product</h4>
              <ul className="space-y-2 text-timber-beige/60">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4 text-timber-green">Company</h4>
              <ul className="space-y-2 text-timber-beige/60">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          
          <LegalDisclaimer />
          
          <div className="border-t border-white/10 pt-8 mt-8 text-center text-timber-beige/40 text-sm">
            <p>&copy; {new Date().getFullYear()} Timber Money. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
