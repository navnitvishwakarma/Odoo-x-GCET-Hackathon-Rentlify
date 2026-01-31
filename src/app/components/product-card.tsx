import React from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { Product } from '@/app/data/mock-data';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group border border-border"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-muted">
        <ImageWithFallback
          src={`https://source.unsplash.com/800x600/?${product.images[0]}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="bg-white/90 text-foreground">
              Unavailable
            </Badge>
          </div>
        )}
        {product.available && (
          <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">
            Available
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="line-clamp-1 mb-1">{product.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4" />
          <span className="line-clamp-1">{product.location}</span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl text-primary">${product.price.perDay}</span>
            <span className="text-sm text-muted-foreground">/day</span>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <div>${product.price.perWeek}/week</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
