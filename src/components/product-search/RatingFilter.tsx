
import React from "react";
import { Star } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface RatingFilterProps {
  minRating: number;
  onRatingChange: (rating: number) => void;
}

const RatingFilter: React.FC<RatingFilterProps> = ({ minRating, onRatingChange }) => {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          size={16} 
          className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Star size={16} className="text-yellow-500 fill-yellow-500" />
        <h3 className="text-sm font-medium">Minimum Seller Rating</h3>
      </div>
      <div className="px-2">
        <Slider
          value={[minRating]}
          min={0}
          max={5}
          step={1}
          onValueChange={(value) => onRatingChange(value[0])}
          className="my-4"
        />
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">Any Rating</div>
          <div className="flex">{renderStars(minRating)}</div>
        </div>
      </div>
    </div>
  );
};

export default RatingFilter;
