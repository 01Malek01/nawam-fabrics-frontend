import React from "react";

const VideoIframe = ({ videoUrl }: { videoUrl: string }) => {
  return (
    <div className="max-w-[100vw] h-[30rem] overflow-hidden rounded-lg mx-auto">
      <iframe
        className="w-full h-full"
        src={videoUrl}
        title="Product Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoIframe;
