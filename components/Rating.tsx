import { FaStar } from 'react-icons/fa'; // Folosim react-icons pentru stele

const Rating = ({ rating }:{rating:number}) => {
  const n_rating=Number(rating)
  const stars = Array.from({ length: 5 }, (_, index) => {
    const starRating = index + 1;

    return (
      <FaStar
        key={index}
    
        className={
          starRating <= n_rating
            ? "text-yellow-500" // stea complet colorată
            : starRating - 0.5 <= n_rating
            ? "text-yellow-300" // stea jumătate colorată
            : "text-gray-300" // stea necolorată
        }
      />
    );
  });

  return <div className="flex p-0">{stars}</div>;
};

export default Rating;
