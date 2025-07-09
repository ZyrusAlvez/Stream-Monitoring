import MediaTrackLogo from "../components/ui/MediaTrackLogo"

const Header = () => {
  return (
    <header className="flex h-[80px] border-b-2 border-[#008037] w-full items-center absolute top-0 left-0 bg-white">
      <MediaTrackLogo width={100} className="ml-4"/>
    </header>
  )
}

export default Header