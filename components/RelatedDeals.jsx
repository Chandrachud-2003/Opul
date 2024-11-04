import { useNavigate } from 'react-router-dom';

function RelatedDeals({ deals }) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4">
      {deals.slice(0, 2).map(deal => (
        <div 
          key={deal.id}
          onClick={() => navigate(`/platform/${deal.platformId}`)}
          className="cursor-pointer hover:shadow-lg transition-shadow"
        >
          {/* Deal card content */}
        </div>
      ))}
    </div>
  );
} 