type Props = {
  width?: number;
  height?: number;
  className?: string;
};

const MediaTrackLogo: React.FC<Props> = ({
  width = 200,
  height = 116,
  className = '',
}) => {
  return (
    <a href="https://mediatrack.org" target="_blank" rel="noopener noreferrer">
      <img
        src="https://mediatrack.org/wp-content/uploads/2022/10/mediatrack-logo-web.png"
        alt="MediaTrack Logo"
        width={width}
        height={height}
        className={className}
      />
    </a>
  );
};

export default MediaTrackLogo;
