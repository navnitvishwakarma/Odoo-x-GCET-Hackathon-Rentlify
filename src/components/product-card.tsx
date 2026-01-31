import { } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, ShieldCheck } from 'lucide-react';
import { Product } from '@/data/mock-data';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  isTrending?: boolean;
  viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, onClick, isTrending, viewMode = 'grid' }: ProductCardProps) {
  const isList = viewMode === 'list';

  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border border-border ${isList ? 'flex flex-row h-52' : 'flex flex-col'
        }`}
      onClick={onClick}
    >
      <div className={`relative overflow-hidden bg-muted transition-all duration-300 ${isList ? 'w-1/3 min-w-[200px] h-full' : 'h-48 w-full'
        }`}>
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {isTrending && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-none shadow-md gap-1 px-2 py-0.5">
              <span className="text-xs">🔥</span> Trending
            </Badge>
          </div>
        )}
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-white/90 text-foreground text-xs px-2 py-0.5">
              Unavailable
            </Badge>
          </div>
        )}
        {product.available && (
          <Badge className={`absolute top-3 right-3 bg-green-500 hover:bg-green-600 text-white border-none shadow-sm text-xs px-2 py-0.5`}>
            Available
          </Badge>
        )}
      </div>

      <CardContent className={`p-5 flex flex-col justify-between flex-1 ${isList ? 'py-4' : ''}`}>
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className={`font-semibold text-lg leading-tight group-hover:text-primary transition-colors ${isList ? 'line-clamp-1' : 'line-clamp-1'
              }`}>
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{product.rating}</span>
              <span className="opacity-70">({product.reviewCount})</span>
            </div>
          </div>

          {/* Trust Score & Availability Timeline (Advanced Features) */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-[10px] font-bold text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>98% Trusted</span>
            </div>

            <div className="flex items-center gap-1.5">
              {[
                { label: 'Today', available: true },
                { label: 'Tmrw', available: true },
                { label: 'Wknd', available: false }
              ].map((day, idx) => (
                <div key={idx} className="flex flex-col items-center group/time relative">
                  <div className={`w-9 h-1.5 rounded-full cursor-help ${day.available ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-gray-300 dark:bg-gray-700'
                    }`}></div>
                  <span className="text-[10px] font-medium text-muted-foreground mt-1">{day.label}</span>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/time:block bg-black/90 backdrop-blur-sm text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap z-20 shadow-xl border border-white/10">
                    {day.available ? `Available ${day.label}` : `Booked ${day.label}`}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isList && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-sm text-muted-foreground pt-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="line-clamp-1">{product.location}</span>
          </div>
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-border/50 mt-2">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">${product.price.perDay}</span>
              <span className="text-sm font-medium text-muted-foreground">/day</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-foreground/80">${product.price.perWeek}<span className="text-xs font-normal text-muted-foreground ml-1">/week</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
