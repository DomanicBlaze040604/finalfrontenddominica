import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "@/lib/api";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SocialMediaManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    email: "",
  });

  // Fetch settings from API
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => settingsApi.get(),
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: settingsApi.updateSocialMedia,
    onSuccess: () => {
      // Invalidate all settings queries to refresh footer and other components
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      // Force refetch
      queryClient.refetchQueries({ queryKey: ["settings"] });
      toast({
        title: "Social Media Links Updated",
        description: "Your social media links have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update social media links",
        variant: "destructive",
      });
    },
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (data?.success && data.data.socialMedia) {
      setSocialLinks({
        facebook: data.data.socialMedia.facebook || "",
        twitter: data.data.socialMedia.twitter || "",
        instagram: data.data.socialMedia.instagram || "",
        youtube: data.data.socialMedia.youtube || "",
        linkedin: data.data.socialMedia.linkedin || "",
        email: data.data.socialMedia.email || "",
      });
    }
  }, [data]);

  const socialPlatforms = [
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      placeholder: "https://facebook.com/yourpage",
    },
    {
      id: "twitter",
      name: "Twitter / X",
      icon: Twitter,
      color: "text-sky-500",
      placeholder: "https://twitter.com/youraccount",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
      placeholder: "https://instagram.com/youraccount",
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "text-red-600",
      placeholder: "https://youtube.com/@yourchannel",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700",
      placeholder: "https://linkedin.com/company/yourcompany",
    },
    {
      id: "email",
      name: "Contact Email",
      icon: Mail,
      color: "text-gray-600",
      placeholder: "contact@yoursite.com",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(socialLinks);
  };

  const handleReset = () => {
    if (data?.success && data.data.socialMedia) {
      setSocialLinks({
        facebook: data.data.socialMedia.facebook || "",
        twitter: data.data.socialMedia.twitter || "",
        instagram: data.data.socialMedia.instagram || "",
        youtube: data.data.socialMedia.youtube || "",
        linkedin: data.data.socialMedia.linkedin || "",
        email: data.data.socialMedia.email || "",
      });
    }
  };

  const handleInputChange = (platform: string, value: string) => {
    setSocialLinks(prev => ({ ...prev, [platform]: value }));
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Social Media Links</h1>
          <p className="text-muted-foreground">
            Configure your social media presence and contact information
          </p>
        </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>How your social links will appear to visitors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {socialPlatforms.map((platform) => {
                  const Icon = platform.icon;
                  const link = socialLinks[platform.id as keyof typeof socialLinks];
                  
                  return link ? (
                    <a
                      key={platform.id}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                      title={platform.name}
                    >
                      <Icon className={`h-6 w-6 ${platform.color}`} />
                    </a>
                  ) : null;
                })}
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit} className="space-y-6">
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon;
              
              return (
                <Card key={platform.id} className="interactive-card">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-muted ${platform.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{platform.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor={platform.id} className="sr-only">
                        {platform.name} URL
                      </Label>
                      <Input
                        id={platform.id}
                        type={platform.id === "email" ? "email" : "url"}
                        value={socialLinks[platform.id as keyof typeof socialLinks]}
                        onChange={(e) => handleInputChange(platform.id, e.target.value)}
                        placeholder={platform.placeholder}
                        className="font-mono text-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button type="submit" disabled={updateMutation.isPending || isLoading}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </AdminLayout>
    );
  };

export default SocialMediaManager;
