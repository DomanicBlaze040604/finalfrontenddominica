import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { pagesApi, settingsApi } from "@/lib/api";
import { FooterNewsletter } from "./FooterNewsletter";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

const Footer = () => {
  // Fetch footer pages from API
  const { data: footerPagesData } = useQuery({
    queryKey: ["pages", "footer"],
    queryFn: pagesApi.getFooterPages,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch social media links from settings
  const { data: settingsData } = useQuery({
    queryKey: ["settings"],
    queryFn: settingsApi.get,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const footerPages = footerPagesData?.success ? footerPagesData.data : [];
  const socialMedia = settingsData?.success ? settingsData.data.socialMedia : {};

  // Always include Editorial Team link
  const editorialLink = { title: "Editorial Team", slug: "editorial" };
  
  // Fallback static pages if API fails
  const staticPages = [
    { title: "About Us", slug: "about" },
    editorialLink,
    { title: "Contact", slug: "contact" },
    { title: "Privacy Policy", slug: "privacy" },
    { title: "Terms of Service", slug: "terms" },
  ];

  // Combine API pages with Editorial Team link (if not already present)
  let pagesToShow = footerPages.length > 0 ? footerPages : staticPages;
  
  // Always ensure Editorial Team is in the list
  if (footerPages.length > 0 && !footerPages.some(p => p.slug === 'editorial')) {
    // Insert Editorial Team after About Us (or at position 1)
    const aboutIndex = pagesToShow.findIndex(p => p.slug === 'about');
    const insertIndex = aboutIndex >= 0 ? aboutIndex + 1 : 1;
    pagesToShow = [
      ...pagesToShow.slice(0, insertIndex),
      editorialLink,
      ...pagesToShow.slice(insertIndex)
    ];
  }

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">About Us</h3>
            <p className="text-sm opacity-90">
              Dominica News is your trusted source for breaking news, politics, weather updates, and Caribbean coverage.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {pagesToShow.map((page) => (
                <li key={page.slug}>
                  <Link 
                    to={`/${page.slug}`} 
                    className="hover:text-secondary transition-colors"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/category/news" className="hover:text-secondary transition-colors">News</Link></li>
              <li><Link to="/category/politics" className="hover:text-secondary transition-colors">Politics</Link></li>
              <li><Link to="/category/weather" className="hover:text-secondary transition-colors">Weather</Link></li>
              <li><Link to="/category/sports" className="hover:text-secondary transition-colors">Sports</Link></li>
              <li><Link to="/category/entertainment" className="hover:text-secondary transition-colors">Entertainment</Link></li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-display font-bold text-lg mb-4">Follow Us</h3>
            {socialMedia && (socialMedia.facebook || socialMedia.twitter || socialMedia.instagram || socialMedia.youtube || socialMedia.linkedin) ? (
              <>
                <div className="flex gap-4 mb-6">
                  {socialMedia.facebook && (
                    <a href={socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                      <Facebook className="h-6 w-6" />
                      <span className="sr-only">Facebook</span>
                    </a>
                  )}
                  {socialMedia.twitter && (
                    <a href={socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                      <Twitter className="h-6 w-6" />
                      <span className="sr-only">Twitter</span>
                    </a>
                  )}
                  {socialMedia.instagram && (
                    <a href={socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                      <Instagram className="h-6 w-6" />
                      <span className="sr-only">Instagram</span>
                    </a>
                  )}
                  {socialMedia.youtube && (
                    <a href={socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                      <Youtube className="h-6 w-6" />
                      <span className="sr-only">YouTube</span>
                    </a>
                  )}
                  {socialMedia.linkedin && (
                    <a href={socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                      <Linkedin className="h-6 w-6" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  )}
                </div>
                <p className="text-sm opacity-90">
                  Follow us for real-time updates and breaking news alerts.
                </p>
              </>
            ) : (
              <p className="text-sm opacity-90">
                Connect with us on social media for the latest updates.
              </p>
            )}
          </div>

          {/* Newsletter */}
          <div>
            <FooterNewsletter />
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
          <p>&copy; {new Date().getFullYear()} Dominica News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
