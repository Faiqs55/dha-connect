import ContainerCenter from "../Components/ContainerCenter";
import agencies from "../Agencies";
import {hotProperties, newProperties, featuredProperties} from "../Properties";
import PropertiesCard from "../Components/PropertiesCard";
import Carousel from "../Components/Carousel/Carousel";
import HeroSearchForm from "../Components/HeroSearchForm";
import WidgetSearchFrom from "../Components/WidgetSearchFrom";
import { FaRegEnvelope } from "react-icons/fa6";
import { IoLocationSharp } from "react-icons/io5";
import { LuBuilding2 } from "react-icons/lu";
import { LuGitCompareArrows } from "react-icons/lu";



const Home = () => {
  return (
    <div>
      {/* HERO  */}
      <div className="hero w-full py-16 md:py-24 lg:py-32">
        <ContainerCenter className={`flex flex-col`}>
          <h1 className="text-white text-5xl mb-[40px]">
            Find Properties in DHA Defence
          </h1>
          <HeroSearchForm color="#fff" />
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
            show={{ xl: 4, l: 3, md: 2, sm: 1 }}
            gap={10}
            autoPlay={true}
            autoPlayInterval={3000}
          >
            {agencies.map((a) => (
              <div
                key={a.id}
                className="w-full gap-2 flex items-center justify-center p-3 cursor-pointer rounded-md duration-200 hover:bg-gray-50"
              >
                <img
                  className="w-[70px] p-3 border-[1px] rounded-md border-gray-300"
                  src={a.img}
                  alt=""
                />
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">Agency Name</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <IoLocationSharp className="text-[#274abb]" /> <span>Islamabad</span>
                  </p>
                </div>
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
            show={{ xl: 3, l: 3, md: 2, sm: 1 }}
            gap={20}
            autoPlay={true}
            autoPlayInterval={3000}
          >
            {hotProperties.map((p) => (
              <div
                key={p.id}
                className="w-full flex flex-col gap-3 justify-center lg:bg-none bg-[#274abb10] p-6 rounded-md"
              >
                <img
                  className="w-full rounded-md"
                  src={p.img}
                  alt=""
                />

                <div className="flex flex-col">
                  <h3 className="font-semibold text-base"><span className="text-xs">PKR</span> {p.price}</h3>
                  <h3 className="font-semibold text-lg">{p.name}, {p.city}</h3>
                  <span className="text-sm text-gray-500 my-2">{p.city}, {p.location}</span>
                  <span className="flex items-center gap-2 text-sm mb-1"><LuBuilding2 className="text-xs text-gray-500" /> {p.category}</span>
                  <span className="flex items-center gap-2 text-sm"><LuGitCompareArrows className="text-xs text-gray-500" /> {p.minArea} sqft to {p.maxArea} sqft</span>
                </div>
              </div>
            ))}
          </Carousel>
        </ContainerCenter>
      </section>


        {/* FEATURED PROPERTIES  */}
      <section className="mt-10">
        <ContainerCenter>
          <h2 className="text-3xl mb-10">Featured Properties</h2>
          <Carousel
            show={{ xl: 3, l: 3, md: 2, sm: 1 }}
            gap={20}
            autoPlay={true}
            autoPlayInterval={3000}
          >
            {featuredProperties.map((p) => (
              <div
                key={p.id}
                className="w-full flex flex-col gap-3 justify-center lg:bg-none bg-[#274abb10] p-6 rounded-md"
              >
                <img
                  className="w-full rounded-md"
                  src={p.img}
                  alt=""
                />

                <div className="flex flex-col">
                  <h3 className="font-semibold text-base"><span className="text-xs">PKR</span> {p.price}</h3>
                  <h3 className="font-semibold text-lg">{p.name}, {p.city}</h3>
                  <span className="text-sm text-gray-500 my-2">{p.city}, {p.location}</span>
                  <span className="flex items-center gap-2 text-sm mb-1"><LuBuilding2 className="text-xs text-gray-500" /> {p.category}</span>
                  <span className="flex items-center gap-2 text-sm"><LuGitCompareArrows className="text-xs text-gray-500" /> {p.minArea} sqft to {p.maxArea} sqft</span>
                </div>
              </div>
            ))}
          </Carousel>
        </ContainerCenter>
      </section>


        {/* New PROPERTIES  */}
      <section className="mt-10">
        <ContainerCenter>
          <h2 className="text-3xl mb-10">New Properties</h2>
          <Carousel
            show={{ xl: 3, l: 3, md: 2, sm: 1 }}
            gap={20}
            autoPlay={true}
            autoPlayInterval={3000}
          >
            {newProperties.map((p) => (
              <div
                key={p.id}
                className="w-full flex flex-col gap-3 justify-center lg:bg-none bg-[#274abb10] p-6 rounded-md"
              >
                <img
                  className="w-full rounded-md"
                  src={p.img}
                  alt=""
                />

                <div className="flex flex-col">
                  <h3 className="font-semibold text-base"><span className="text-xs">PKR</span> {p.price}</h3>
                  <h3 className="font-semibold text-lg">{p.name}, {p.city}</h3>
                  <span className="text-sm text-gray-500 my-2">{p.city}, {p.location}</span>
                  <span className="flex items-center gap-2 text-sm mb-1"><LuBuilding2 className="text-xs text-gray-500" /> {p.category}</span>
                  <span className="flex items-center gap-2 text-sm"><LuGitCompareArrows className="text-xs text-gray-500" /> {p.minArea} sqft to {p.maxArea} sqft</span>
                </div>
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
              {hotProperties.map((data, index) => (
                <PropertiesCard key={data.id} data={data} />
              ))}
            </div>
          </div>

          {/* RIGHT  */}
          <div className="right-widget w-full xl:w-[30%]">
            <div className="search-agencies w-full mb-10">
              <h3 className="text-2xl mb-10">Search Agencies</h3>
              <WidgetSearchFrom />
            </div>

            {/* GOT ANY QUESTIONS  */}
            <div className="contact-cta w-full">
              <h3 className="text-2xl mb-5">Got Any Questions?</h3>
              <div className="bg-[#f9fafd] px-[30px] py-[25px] rounded-sm border-t-2 border-t-[#274abb]">
                <p className="mb-5 text-[#2828cf]">
                  If you are having any questions, please feel free to ask.
                </p>
                <a
                  href="/contact"
                  className="bg-[#274abb] text-white px-[20px] py-[10px] rounded-sm flex items-center justify-center gap-3"
                >
                  <FaRegEnvelope /> Drop us a line
                </a>
              </div>
            </div>
          </div>
        </ContainerCenter>
      </div>
    </div>
  );
};

export default Home;
