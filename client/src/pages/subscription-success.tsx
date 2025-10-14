import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function SubscriptionSuccess() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const sessionId = searchParams.get('session_id');

  // Verify the session and update user subscription
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/checkout/verify-session', sessionId],
    queryFn: async () => {
      if (!sessionId) {
        throw new Error('No session ID found');
      }
      const response = await fetch(`/api/checkout/verify-session?session_id=${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to verify subscription');
      }
      return response.json();
    },
    enabled: !!sessionId,
    retry: 3,
    retryDelay: 2000, // Wait 2 seconds between retries for pending payments
  });

  useEffect(() => {
    if (!sessionId) {
      // Redirect to pricing if no session ID
      setTimeout(() => setLocation('/pricing'), 2000);
    }
  }, [sessionId, setLocation]);

  if (!sessionId) {
    return (
      <div className="container max-w-2xl mx-auto py-16">
        <Card className="text-center">
          <CardContent className="py-8">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-muted-foreground">No subscription session found. Redirecting to pricing...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container max-w-2xl mx-auto py-16">
        <Card className="text-center">
          <CardContent className="py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Verifying your subscription...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle pending payment status
  if (data && !data.success && data.pending) {
    return (
      <div className="container max-w-2xl mx-auto py-16">
        <Card className="text-center">
          <CardContent className="py-8">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-500 mx-auto mb-4" />
            <p className="font-medium mb-2">Payment Processing...</p>
            <p className="text-muted-foreground">
              {data.message || "Your payment is being processed. This usually takes just a few moments."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-2xl mx-auto py-16">
        <Card className="text-center">
          <CardContent className="py-8">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              There was an issue verifying your subscription. Please contact support.
            </p>
            <Button asChild variant="outline">
              <Link href="/pricing">Back to Pricing</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const planName = data?.subscription?.plan === 'pro_monthly' ? 'Pro Monthly' :
                    data?.subscription?.plan === 'pro_annual' ? 'Pro Annual' :
                    data?.subscription?.plan === 'family_monthly' ? 'Family Monthly' :
                    data?.subscription?.plan === 'family_annual' ? 'Family Annual' : 'Premium';

  return (
    <div className="container max-w-2xl mx-auto py-16">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to {planName}!</CardTitle>
          <CardDescription className="text-lg mt-2">
            Your subscription is now active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            You now have access to all premium features. Start exploring your enhanced financial tools!
          </p>
          
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="font-medium">What's next?</p>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• Upload your financial documents for AI analysis</li>
              <li>• Get personalized debt payoff strategies</li>
              <li>• Chat with your AI financial advisor</li>
              <li>• Track your progress towards financial freedom</li>
            </ul>
          </div>
          
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild data-testid="button-go-dashboard">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" data-testid="button-upload-documents">
              <Link href="/documents">
                Upload Documents
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}