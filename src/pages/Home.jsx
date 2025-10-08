import ContainerCenter from "../Components/ContainerCenter";
import agencies from "../Agencies";
import properties from "../Properties";
import PropertiesCard from "../Components/PropertiesCard";
import Carousel from "../Components/Carousel/Carousel";
import HeroSearchForm from "../Components/HeroSearchForm";
import WidgetSearchFrom from "../Components/WidgetSearchFrom";
import { FaRegEnvelope } from "react-icons/fa6";
import Footer from "../Components/Footer";

const Home = () => {
  return (
    <div>
      {/* HERO  */}
      <div className="hero w-full py-16 md:py-24 lg:py-32">
        <ContainerCenter className={`flex flex-col`}>
          <h1 className="text-white text-5xl mb-[40px]">
            Find Properties in DHA Defence
          </h1>
          <HeroSearchForm color="#fff"/>
          <h3 className="text-white text-3xl mt-[40px]">
            We’ve 38705 properties for you!
          </h3>
        </ContainerCenter>
      </div>

      {/* FEATURED AGENCIES SECTION  */}
      <section className="mt-10">
        <ContainerCenter>
          <h2 className="text-3xl mb-10">Featured Agencies</h2>
          <Carousel
            show={{ xl: 5, l: 3, md: 2, sm: 1 }}
            gap={20}
            autoPlay={true}
            autoPlayInterval={3000}
          >
            {agencies.map((a) => (
              <div key={a.id} className="w-full flex justify-center">
                <img className="w-[150px]" src={a.img} alt="" />
              </div>
            ))}
          </Carousel>
        </ContainerCenter>
      </section>

      {/* HOT PROPERTIES SECTION  */}
      <section className="mt-10">
        <ContainerCenter>
          <h2 className="text-3xl mb-10">Hot Properties</h2>
          <Carousel
            show={{ xl: 4, l: 3, md: 2, sm: 1 }}
            gap={20}
            autoPlay={true}
            autoPlayInterval={3000}
          >
            {properties.map((p) => (
              <div
                key={p.id}
                className="w-full flex justify-center lg:bg-none bg-gray-100 p-4 lg:p-0"
              >
                <img
                  className="w-[250px] lg:w-full shadow-xl"
                  src={p.img}
                  alt=""
                />
              </div>
            ))}
          </Carousel>
        </ContainerCenter>
      </section>

      {/* MAIN SECTION  */}
      <div className="main mt-10">
        <ContainerCenter className={`flex flex-col xl:flex-row gap-10`}>
          {/* LEFT  */}
          <div className="recent-properties w-full xl:w-[70%]">
            <h2 className="text-3xl">Recent Properties</h2>
            {/* PROPERTIES CARDS  */}
            <div className="flex flex-col gap-10 mt-10">
              {properties.map((data, index) => (
                <PropertiesCard key={data.id} data={data} />
              ))}
            </div>
          </div>

          {/* RIGHT  */}
          <div className="right-widget w-full xl:w-[30%]">
            <div className="search-agencies w-full mb-10">
              <h3 className="text-2xl mb-10">Search Agencies</h3>
              <WidgetSearchFrom/>
            </div>

            {/* GOT ANY QUESTIONS  */}
            <div className="contact-cta w-full">
             <h3 className="text-2xl mb-5">Got Any Questions?</h3>
             <div className="bg-[#f9fafd] px-[30px] py-[25px] rounded-sm border-t-2 border-t-[#274abb]">
                <p className="mb-5 text-[#2828cf]">If you are having any questions, please feel free to ask.</p>
                <a href="/contact" className="bg-[#274abb] text-white px-[20px] py-[10px] rounded-sm flex items-center justify-center gap-3"><FaRegEnvelope /> Drop us a line</a>

             </div>
            </div>
          </div>
        </ContainerCenter>
      </div>

      <Footer/>
    </div>
  );
};

export default Home;
