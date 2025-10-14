import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Copy, Plus, Trash2, Link as LinkIcon, Check, Calendar, Hash, User } from "lucide-react";
import { format } from "date-fns";

export default function PitchAccessAdmin() {
  const { toast } = useToast();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    recipientEmail: "",
    recipientName: "",
    expiresAt: "",
    maxUses: "",
  });
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Fetch all pitch access tokens
  const { data: tokens, isLoading } = useQuery({
    queryKey: ['/api/pitch-access/list'],
  });

  // Create new token mutation
  const createTokenMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/pitch-access/create", data);
      if (!response.ok) {
        throw new Error("Failed to create access token");
      }
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Access Link Created",
        description: `Shareable link generated successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/pitch-access/list'] });
      setShowCreateForm(false);
      setFormData({ recipientEmail: "", recipientName: "", expiresAt: "", maxUses: "" });
      
      // Copy the URL automatically
      copyToClipboard(data.url, data.token);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create access link",
        variant: "destructive",
      });
    },
  });

  // Deactivate token mutation
  const deactivateTokenMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/pitch-access/deactivate/${id}`, {});
      if (!response.ok) {
        throw new Error("Failed to deactivate token");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Token Deactivated",
        description: "Access link has been deactivated",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/pitch-access/list'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to deactivate token",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async (url: string, tokenId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(tokenId);
      setTimeout(() => setCopiedToken(null), 2000);
      toast({
        title: "Copied!",
        description: "Access link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTokenMutation.mutate(formData);
  };

  const baseUrl = window.location.origin;

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4" data-testid="page-pitch-access-admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Pitch Deck Access Management</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage secure access links for your investor pitch deck
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            data-testid="button-create-token"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Access Link
          </Button>
        </div>

        {showCreateForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Access Link</CardTitle>
              <CardDescription>
                Generate a secure, shareable link for viewing the pitch deck
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipientName">Recipient Name (Optional)</Label>
                    <Input
                      id="recipientName"
                      placeholder="John Doe"
                      value={formData.recipientName}
                      onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                      data-testid="input-recipient-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipientEmail">Recipient Email (Optional)</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="investor@example.com"
                      value={formData.recipientEmail}
                      onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                      data-testid="input-recipient-email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiresAt">Expiration Date (Optional)</Label>
                    <Input
                      id="expiresAt"
                      type="datetime-local"
                      value={formData.expiresAt}
                      onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                      data-testid="input-expires-at"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxUses">Max Uses (Optional)</Label>
                    <Input
                      id="maxUses"
                      type="number"
                      min="1"
                      placeholder="Unlimited"
                      value={formData.maxUses}
                      onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                      data-testid="input-max-uses"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={createTokenMutation.isPending}
                    data-testid="button-generate-link"
                  >
                    {createTokenMutation.isPending ? "Generating..." : "Generate Link"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Access Links</h2>
          
          {isLoading ? (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
              </CardContent>
            </Card>
          ) : !tokens || (tokens as any[]).length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No access links created yet. Create one to share your pitch deck securely.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {(tokens as any[]).map((token: any) => (
                <Card key={token.id} data-testid={`token-card-${token.id}`}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          {token.recipientName && (
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{token.recipientName}</span>
                            </div>
                          )}
                          {token.recipientEmail && (
                            <div className="text-sm text-muted-foreground">
                              {token.recipientEmail}
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {token.expiresAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                Expires: {format(new Date(token.expiresAt), 'MMM d, yyyy h:mm a')}
                              </div>
                            )}
                            {token.maxUses && (
                              <div className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                {token.usageCount} / {token.maxUses} uses
                              </div>
                            )}
                            {!token.maxUses && (
                              <div className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                {token.usageCount} uses
                              </div>
                            )}
                          </div>
                        </div>
                        <Badge variant={token.isActive ? "default" : "secondary"}>
                          {token.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                        <LinkIcon className="w-4 h-4 text-muted-foreground" />
                        <code className="flex-1 text-sm truncate">
                          {baseUrl}/pitch?token={token.token}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(`${baseUrl}/pitch?token=${token.token}`, token.token)}
                          data-testid={`button-copy-${token.id}`}
                        >
                          {copiedToken === token.token ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>

                      {token.isActive && (
                        <div className="flex justify-end">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deactivateTokenMutation.mutate(token.id)}
                            disabled={deactivateTokenMutation.isPending}
                            data-testid={`button-deactivate-${token.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Deactivate
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
