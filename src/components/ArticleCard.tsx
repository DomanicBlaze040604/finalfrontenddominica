import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  date: string;
  author: string;
  authorId?: string;
  featured?: boolean;
}

const ArticleCard = ({
  slug,
  title,
  excerpt,
  imageUrl,
  category,
  date,
  author,
  authorId,
  featured = false,
}: ArticleCardProps) => {
  return (
    <Link to={`/article/${slug}`} className="group block h-full">
      <article className={`h-full bg-card rounded-lg overflow-hidden border border-border interactive-card flex flex-col ${featured ? 'md:flex-row md:gap-6' : ''}`}>
        <div className={`relative overflow-hidden bg-muted flex-shrink-0 ${featured ? 'h-48 md:h-auto md:w-1/2' : 'aspect-video'}`}>
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2 left-2 md:top-3 md:left-3 bg-primary text-primary-foreground text-xs">
            {category}
          </Badge>
        </div>
        
        <div className={`p-3 md:p-4 flex flex-col flex-1 ${featured ? 'md:w-1/2 md:justify-center' : ''}`}>
          <h3 className={`font-display font-bold mb-2 group-hover:text-primary transition-colors line-clamp-3 ${featured ? 'text-xl md:text-2xl lg:text-3xl' : 'text-base md:text-lg lg:text-xl'}`}>
            {title}
          </h3>
          <p className={`text-muted-foreground mb-3 line-clamp-2 flex-1 ${featured ? 'text-sm md:text-base' : 'text-xs md:text-sm'}`}>
            {excerpt}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link 
              to={`/author/${authorId || '#'}`} 
              className="font-medium truncate hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {author}
            </Link>
            <span className="flex-shrink-0">•</span>
            <time dateTime={date} className="truncate">{date}</time>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;
