import React from 'react';

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {

  // Function to optimize Cloudinary URLs
  const getOptimizedUrl = (url) => {
    if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return url;

    // Check if URL already has transformations
    if (url.includes('/upload/')) {
      // Logic: Insert f_auto (auto format/WebP) and q_auto (auto quality/compression)
      // This ensures small file sizes (<100KB) and fast loading
      return url.replace('/upload/', '/upload/f_auto,q_auto,w_800,c_limit/');
    }
    return url;
  };

  const optimizedSrc = getOptimizedUrl(src);

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = "/assets/images/no_image.png"
      }}
      loading={props.loading || "lazy"}
      {...props}
    />
  );
}

export default Image;
