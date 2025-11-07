import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;

    // In production, send to backend API
    toast({
      title: "Subscribed!",
      description: "You'll receive our daily newsletter.",
    });

    setIsSubmitted(true);
    setEmail("");
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div>
      <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
        <Mail className="h-5 w-5" />
        Newsletter
      </h3>
      <p className="text-sm opacity-90 mb-4">
        Get daily news updates delivered to your inbox
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          id="footer-newsletter-email"
          name="email"
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:bg-white/20"
        />
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          className="w-full"
          disabled={isSubmitted}
        >
          {isSubmitted ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Subscribed!
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
      
      <p className="text-xs opacity-70 mt-2">
        Join 10,000+ readers. Unsubscribe anytime.
      </p>
    </div>
  );
}