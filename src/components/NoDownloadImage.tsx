// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt?: string;
  className?: string;
};

const NoDownloadImage: React.FC<Props> = ({
  src,
  alt = "",
  className,
  style,
  ...rest
}) => {
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleDragStart = (e: React.DragEvent<HTMLImageElement>) => {
    e.preventDefault();
  };

  return (
    <div
      className={`no-download-image-wrapper w-full h-full flex items-center justify-center`}
      style={style}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onMouseDown={(e) => {
          // prevent right-click in some older browsers
          if (e.button === 2) e.preventDefault();
        }}
        {...rest}
      />
      <style jsx>{`
        .no-download-image-wrapper img {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-select: none;
          -webkit-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default NoDownloadImage;
