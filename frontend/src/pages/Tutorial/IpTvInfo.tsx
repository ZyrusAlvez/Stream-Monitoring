import Header from "../../layout/Header"
import BackgroundImage from "../../layout/BackgroundImage"
import Step from "../../components/tutorial/Step"
import img0 from "../../assets/tutorial/IpTv/IpTv_Info_0.jpg"
import img1 from "../../assets/tutorial/IpTv/IpTv_Info_1.jpg"
import img2 from "../../assets/tutorial/IpTv/IpTv_Info_2.jpg"
import img3 from "../../assets/tutorial/IpTv/IpTv_Info_3.jpg"
import img4 from "../../assets/tutorial/IpTv/IpTv_Info_4.jpg"
import BackButton from "../../components/ui/BackButton"

const IpTvInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <Header />
      <BackgroundImage />
      <div className="pt-20 flex flex-row-reverse m-6">
        <BackButton />
      </div>
      {/* Main Content Container */}
      <div className="px-6 flex flex-col justify-center space-y-8">
        <Step stepNo={1} url="https://iptv-org.github.io/"/>
        <Step stepNo={2} photo={img0} description="Select a country of your choice"/>
        <Step stepNo={3} photo={img1} description='Select a channel of your choice and click on "feed"'/>
        <Step stepNo={4} photo={img2} description='Click the Menu Button'/>
        <Step stepNo={5} photo={img3} description='Click the "Copy Link" Button'/>
        <Step stepNo={6} photo={img4} description='Paste the link, configure based on your need, and hit "Submit"'/>
      </div>
    </div>
  )
}

export default IpTvInfo