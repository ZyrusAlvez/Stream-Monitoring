import Header from "../../layout/Header"
import BackgroundImage from "../../layout/BackgroundImage"
import Step from "../../components/tutorial/Step"
import img0 from "../../assets/tutorial/RadioGarden/RadioGarden_Info_0.jpg"
import img1 from "../../assets/tutorial/RadioGarden/RadioGarden_Info_1.jpg"
import img2 from "../../assets/tutorial/RadioGarden/RadioGarden_Info_2.jpg"
import BackButton from "../../components/ui/BackButton"

const RadioGardenInfo = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <Header />
      <BackgroundImage />
      <div className="pt-20 flex flex-row-reverse m-6">
        <BackButton />
      </div>
      {/* Main Content Container */}
      <div className="px-6 flex flex-col justify-center space-y-8">
        <Step stepNo={1} url="https://radio.garden/"/>
        <Step stepNo={2} photo={img0} description="At the lower left, use the following tools to find your desired radio station"/>
        <Step stepNo={3} photo={img1} description="Copy the link"/>
        <Step stepNo={4} photo={img2} description='Paste the link, configure based on your need, and hit "Submit"'/>
      </div>
    </div>
  )
}

export default RadioGardenInfo