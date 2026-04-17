import React from 'react';
import './SocialMarquee.css';

interface SocialMarqueeProps {
  className?: string;
}

const SocialMarquee: React.FC<SocialMarqueeProps> = ({ className = '' }) => {
  const instagramLogo = "https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_auto/v1776449354/Pngtree_instagram_icon_vector_8704817.png";
  const youtubeLogo = "https://res.cloudinary.com/dp4xt0bve/image/upload/f_webp,q_auto/v1776449455/Pngtree_youtube_social_media_3d_stereo_8704808.png";
  
  const instagramUrl = "https://www.instagram.com/havenhomespunjab?igsh=MTVsM3Ixd3JnM21hcg==";
  const youtubeUrl = "https://youtube.com/@haven_homes_punjab?si=2LAcMfZd2jWVkDNN";

  const renderMarqueeItems = (logo: string, text: string) => {
    return Array(10).fill(null).map((_, i) => (
      <div key={i} className="social-marquee-item">
        <img src={logo} alt={text} className="social-logo" />
        <span className="social-text">{text}</span>
      </div>
    ));
  };

  return (
    <div className={`social-marquee-container ${className}`}>
      {/* Instagram Marquee */}
      <a 
        href={instagramUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-marquee-strip instagram-strip"
      >
        <div className="marquee-wrapper scroll-left">
          {renderMarqueeItems(instagramLogo, "JOIN US ON INSTAGRAM")}
          {renderMarqueeItems(instagramLogo, "JOIN US ON INSTAGRAM")}
        </div>
      </a>

      {/* YouTube Marquee */}
      <a 
        href={youtubeUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="social-marquee-strip youtube-strip"
      >
        <div className="marquee-wrapper scroll-right">
          {renderMarqueeItems(youtubeLogo, "JOIN US ON YOUTUBE")}
          {renderMarqueeItems(youtubeLogo, "JOIN US ON YOUTUBE")}
        </div>
      </a>
    </div>
  );
};

export default SocialMarquee;
