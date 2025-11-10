import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Globe, Mail, Shield, Palette, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SiteSettings = () => {
  const { toast } = useToast();
  
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Dominica News",
    siteDescription: "Your trusted source for Dominica breaking news, politics, weather, sports, entertainment, and Caribbean coverage.",
    siteUrl: "https://www.dominicanews.dm",
    adminEmail: "admin@dominicanews.com",
    timezone: "America/Dominica",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
    homepageSectionOrder: "latest-first" as "latest-first" | "featured-first"
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Dominica News - Breaking News & Updates",
    metaDescription: "Stay informed with Dominica News - your trusted source for breaking news, politics, weather updates, sports, entertainment, and Caribbean coverage.",
    metaKeywords: "Dominica, news, breaking news, politics, weather, sports, Caribbean",
    ogImage: "https://dominicanews.dm/og-image.jpg",
    twitterHandle: "@dominicanews",
    googleAnalytics: "",
    googleSearchConsole: ""
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "noreply@dominicanews.com",
    fromName: "Dominica News",
    enableNotifications: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    enableTwoFactor: false,
    sessionTimeout: "24",
    maxLoginAttempts: "5",
    enableCaptcha: true,
    allowRegistration: true,
    requireEmailVerification: true
  });

  const [appearanceSettings, setAppearanceSettings] = useState({
    primaryColor: "#006B3F",
    secondaryColor: "#FFCC00",
    accentColor: "#D21034",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.svg",
    enableDarkMode: true,
    customCSS: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    enableBreakingNews: true,
    enableNewArticles: true,
    enableComments: true,
    enableNewsletter: true,
    emailFrequency: "daily",
    pushNotifications: false
  });

  const handleGeneralChange = (field: string, value: string) => {
    setGeneralSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSeoChange = (field: string, value: string) => {
    setSeoSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailChange = (field: string, value: string | boolean) => {
    setEmailSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAppearanceChange = (field: string, value: string | boolean) => {
    setAppearanceSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: string, value: string | boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2 flex items-center gap-2">
            <Settings className="h-8 w-8 text-primary" />
            Site Settings
          </h1>
          <p className="text-muted-foreground">Configure your website settings and preferences</p>
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={generalSettings.siteName}
                      onChange={(e) => handleGeneralChange("siteName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input
                      id="siteUrl"
                      value={generalSettings.siteUrl}
                      onChange={(e) => handleGeneralChange("siteUrl", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    value={generalSettings.siteDescription}
                    onChange={(e) => handleGeneralChange("siteDescription", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminEmail">Admin Email</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={(e) => handleGeneralChange("adminEmail", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={generalSettings.timezone}
                      onChange={(e) => handleGeneralChange("timezone", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="America/Dominica">America/Dominica</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      value={generalSettings.language}
                      onChange={(e) => handleGeneralChange("language", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <select
                      id="dateFormat"
                      value={generalSettings.dateFormat}
                      onChange={(e) => handleGeneralChange("dateFormat", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="timeFormat">Time Format</Label>
                    <select
                      id="timeFormat"
                      value={generalSettings.timeFormat}
                      onChange={(e) => handleGeneralChange("timeFormat", e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="12h">12 Hour</option>
                      <option value="24h">24 Hour</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-muted/30">
                  <Label htmlFor="homepageSectionOrder" className="text-base font-medium">
                    Homepage Section Order
                  </Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Choose which section appears first on the homepage
                  </p>
                  <select
                    id="homepageSectionOrder"
                    value={generalSettings.homepageSectionOrder}
                    onChange={(e) => handleGeneralChange("homepageSectionOrder", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="latest-first">Latest News First (Recommended)</option>
                    <option value="featured-first">Featured Story First</option>
                  </select>
                </div>

                <Button onClick={() => handleSave("General")}>
                  Save General Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>SEO & Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={seoSettings.metaTitle}
                    onChange={(e) => handleSeoChange("metaTitle", e.target.value)}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {seoSettings.metaTitle.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={seoSettings.metaDescription}
                    onChange={(e) => handleSeoChange("metaDescription", e.target.value)}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {seoSettings.metaDescription.length}/160 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={seoSettings.metaKeywords}
                    onChange={(e) => handleSeoChange("metaKeywords", e.target.value)}
                    placeholder="Comma-separated keywords"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ogImage">Open Graph Image URL</Label>
                    <Input
                      id="ogImage"
                      value={seoSettings.ogImage}
                      onChange={(e) => handleSeoChange("ogImage", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="twitterHandle">Twitter Handle</Label>
                    <Input
                      id="twitterHandle"
                      value={seoSettings.twitterHandle}
                      onChange={(e) => handleSeoChange("twitterHandle", e.target.value)}
                      placeholder="@dominicanews"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input
                      id="googleAnalytics"
                      value={seoSettings.googleAnalytics}
                      onChange={(e) => handleSeoChange("googleAnalytics", e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="googleSearchConsole">Google Search Console</Label>
                    <Input
                      id="googleSearchConsole"
                      value={seoSettings.googleSearchConsole}
                      onChange={(e) => handleSeoChange("googleSearchConsole", e.target.value)}
                      placeholder="Verification code"
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("SEO")}>
                  Save SEO Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      value={emailSettings.smtpHost}
                      onChange={(e) => handleEmailChange("smtpHost", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input
                      id="smtpPort"
                      value={emailSettings.smtpPort}
                      onChange={(e) => handleEmailChange("smtpPort", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpUsername">SMTP Username</Label>
                    <Input
                      id="smtpUsername"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => handleEmailChange("smtpUsername", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">SMTP Password</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => handleEmailChange("smtpPassword", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => handleEmailChange("fromEmail", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={emailSettings.fromName}
                      onChange={(e) => handleEmailChange("fromName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="enableNotifications" className="text-base font-medium">
                      Enable Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Send email notifications for various events
                    </p>
                  </div>
                  <Switch
                    id="enableNotifications"
                    checked={emailSettings.enableNotifications}
                    onCheckedChange={(checked) => handleEmailChange("enableNotifications", checked)}
                  />
                </div>

                <Button onClick={() => handleSave("Email")}>
                  Save Email Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for admin accounts
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.enableTwoFactor}
                      onCheckedChange={(checked) => handleSecurityChange("enableTwoFactor", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Enable CAPTCHA</Label>
                      <p className="text-sm text-muted-foreground">
                        Show CAPTCHA on login forms
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.enableCaptcha}
                      onCheckedChange={(checked) => handleSecurityChange("enableCaptcha", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Allow Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.allowRegistration}
                      onCheckedChange={(checked) => handleSecurityChange("allowRegistration", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Email Verification</Label>
                      <p className="text-sm text-muted-foreground">
                        Require email verification for new accounts
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.requireEmailVerification}
                      onCheckedChange={(checked) => handleSecurityChange("requireEmailVerification", checked)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSecurityChange("sessionTimeout", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => handleSecurityChange("maxLoginAttempts", e.target.value)}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave("Security")}>
                  Save Security Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Primary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => handleAppearanceChange("primaryColor", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={appearanceSettings.primaryColor}
                        onChange={(e) => handleAppearanceChange("primaryColor", e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="secondaryColor">Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={appearanceSettings.secondaryColor}
                        onChange={(e) => handleAppearanceChange("secondaryColor", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={appearanceSettings.secondaryColor}
                        onChange={(e) => handleAppearanceChange("secondaryColor", e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="accentColor">Accent Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accentColor"
                        type="color"
                        value={appearanceSettings.accentColor}
                        onChange={(e) => handleAppearanceChange("accentColor", e.target.value)}
                        className="w-20 h-10"
                      />
                      <Input
                        value={appearanceSettings.accentColor}
                        onChange={(e) => handleAppearanceChange("accentColor", e.target.value)}
                        className="flex-1 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logoUrl">Logo URL</Label>
                    <Input
                      id="logoUrl"
                      value={appearanceSettings.logoUrl}
                      onChange={(e) => handleAppearanceChange("logoUrl", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="faviconUrl">Favicon URL</Label>
                    <Input
                      id="faviconUrl"
                      value={appearanceSettings.faviconUrl}
                      onChange={(e) => handleAppearanceChange("faviconUrl", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Enable Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to switch to dark theme
                    </p>
                  </div>
                  <Switch
                    checked={appearanceSettings.enableDarkMode}
                    onCheckedChange={(checked) => handleAppearanceChange("enableDarkMode", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="customCSS">Custom CSS</Label>
                  <Textarea
                    id="customCSS"
                    value={appearanceSettings.customCSS}
                    onChange={(e) => handleAppearanceChange("customCSS", e.target.value)}
                    placeholder="/* Add your custom CSS here */"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>

                <Button onClick={() => handleSave("Appearance")}>
                  Save Appearance Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Breaking News Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Send notifications for breaking news
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.enableBreakingNews}
                      onCheckedChange={(checked) => handleNotificationChange("enableBreakingNews", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-medium">New Article Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify subscribers of new articles
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.enableNewArticles}
                      onCheckedChange={(checked) => handleNotificationChange("enableNewArticles", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Comment Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Notify authors of new comments
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.enableComments}
                      onCheckedChange={(checked) => handleNotificationChange("enableComments", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Newsletter</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable newsletter subscriptions
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.enableNewsletter}
                      onCheckedChange={(checked) => handleNotificationChange("enableNewsletter", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label className="text-base font-medium">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="emailFrequency">Email Frequency</Label>
                  <select
                    id="emailFrequency"
                    value={notificationSettings.emailFrequency}
                    onChange={(e) => handleNotificationChange("emailFrequency", e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background mt-2"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Summary</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <Button onClick={() => handleSave("Notifications")}>
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SiteSettings;