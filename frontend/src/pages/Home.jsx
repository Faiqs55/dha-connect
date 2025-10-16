import ContainerCenter from "../Components/ContainerCenter";
import {
  hotProperties,
  newProperties,
  featuredProperties,
} from "../Properties";
import PropertiesCard from "../Components/PropertiesCard";
import Carousel from "../Components/Carousel/Carousel";
import HeroSearchForm from "../Components/HeroSearchForm";
import WidgetSearchFrom from "../Components/WidgetSearchFrom";
import { FaRegEnvelope } from "react-icons/fa6";
import { useEffect, useState } from "react";
import agencyService from "../services/agency.service";
import AgencyCarouselCard from "../Components/AgencyCarouselCard";
import PropertyCarouselCard from "../Components/PropertyCarouselCard";
import HeroForm from "../Components/HeroForm";
import ctaImage from "../../public/cta-buildings.png";
import ctaBg from "../../public/cta-bg.png";
import Faq from "../Components/FAQ";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const Home = () => {
  const [agenciesData, setAgenciesData] = useState(null);
  const getAgencies = async () => {
    const data = await agencyService.getAllAgencies();
    if (!data.success) {
      setAgenciesData(null);
    }
    setAgenciesData(data.data);
  };

  // Group agencies into pairs for stacked display
  const groupedAgencies = agenciesData
    ? agenciesData.reduce((acc, agency, index) => {
        const groupIndex = Math.floor(index / 2);
        if (!acc[groupIndex]) {
          acc[groupIndex] = [];
        }
        acc[groupIndex].push(agency);
        return acc;
      }, [])
    : null;

  useEffect(() => {
    getAgencies();
  }, []);

  return (
    <>
    <Navbar/>
      {/* HERO  */}
      <div className="p-5">
        <div className="w-full hero rounded-xl py-16 md:py-24 lg:py-28">
          <ContainerCenter className={`flex flex-col`}>
            <h1 className="text-white text-5xl mb-[15px] text-center">
              Find Properties in DHA Lahore
            </h1>
            <h3 className="text-white text-2xl text-center mb-[40px]">
              Real Data. Real Brokers. Real Properties.
            </h3>
            <HeroForm />
            {/* <HeroSearchForm color="#fff" /> */}
            <h3 className="text-white text-3xl text-center mt-[40px]">
              We’ve 38705 properties for you!
            </h3>
          </ContainerCenter>
        </div>
      </div>

      {/* CTA FOR PROPERTIES  */}
      <div className="mx-5 md:mx-0 mb-5">
        <ContainerCenter className="flex flex-col md:flex-row items-center w-full bg-gradient-to-r from-[#0c4f47] to-[#1e7066] rounded-md px-5 md:gap-5 py-5 md:py-0">
          <div className="self-end hidden lg:block">
            <img src={ctaImage} alt="" />
          </div>
          <div className="py-10 md:flex-1">
            <h3 className="text-[#caf4b7] text-2xl font-semibold">
              Sell or Rent Your Property with Confidence
            </h3>
            <p className="text-white">
              Connect with a trusted agent to secure the best deal, faster.
            </p>
          </div>
          <div className="">
            <a
              href="#"
              className="bg-white text-[#1e7066] px-4 py-2 text-xl rounded-md font-semibold"
            >
              Get Started
            </a>
          </div>
        </ContainerCenter>
      </div>

      {/* CTA FOR BROKERS  */}
      <div className="mx-5 md:mx-0 mb-5">
        <ContainerCenter className="flex flex-col md:flex-row md:items-center w-full bg-gradient-to-r from-[#073530] to-[#1e7066] rounded-md px-5 gap-5 py-5">
          <div className="flex">
            {[
              "https://images.bayut.com/thumbnails/770429815-240x180.webp",
              "https://images.bayut.com/thumbnails/727791641-240x180.webp",
              "https://images.bayut.com/thumbnails/786411891-240x180.webp",
              "https://images.bayut.com/thumbnails/791403857-240x180.webp",
            ].map((img, index) => {
              return (
                <div key={img} className={`rounded-full h-[50px] w-[50px] overflow-hidden ${index == 0 ? "" : "ml-[-10px]"} `}>
                  <img
                    src={img}
                    alt=""
                  />
                </div>
              );
            })}
          </div>
          <div className="text-white flex-1">
            <h3 className="font-semibold text-xl">Find a TruBroker<sup>TM</sup></h3>
            <p>Find trusted agents awarded for their excellent performance</p>
          </div>
          <div className="">
            <a
              href="#"
              className="bg-white text-[#1e7066] px-4 py-2 text-xl rounded-md font-semibold"
            >
              Get Started
            </a>
          </div>
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
            {groupedAgencies &&
              groupedAgencies.length > 0 &&
              groupedAgencies.map((agen) => (
                <div className="flex flex-col items-center">
                  {agen.map((a) => (
                    <AgencyCarouselCard key={a._id} a={a} />
                  ))}
                </div>
              ))}
          </Carousel>
        </ContainerCenter>
      </section>

      {/* HOT PROPERTIES SECTION  */}
      <section className="mt-10">
        <ContainerCenter>
          <Carousel
            title={"Hot Properties"}
            bg={"bg-gradient-to-t from-[#fff] to-blue-100 rounded-lg"}
            show={{ xl: 3, l: 3, md: 2, sm: 1 }}
            gap={20}
            autoPlay={true}
            autoPlayInterval={3000}
          >
            {hotProperties.map((p) => (
              <PropertyCarouselCard p={p} />
            ))}
          </Carousel>
        </ContainerCenter>
      </section>

      {/* FEATURED PROPERTIES  */}
      <section className="mt-10">
        <ContainerCenter>
          <Carousel
            title={"Featured Properties"}
            bg={"bg-gradient-to-t from-[#fff] to-blue-100 rounded-lg"}
            show={{ xl: 3, l: 3, md: 2, sm: 1 }}
            gap={20}
            autoPlay={true}
            autoPlayInterval={3000}
          >
            {featuredProperties.map((p) => (
              <PropertyCarouselCard p={p} />
            ))}
          </Carousel>
        </ContainerCenter>
      </section>

      {/* New PROPERTIES  */}
      <section className="mt-10">
        <ContainerCenter>
          <Carousel
            title={"New Properties"}
            bg={"bg-gradient-to-t from-[#fff] to-blue-100 rounded-lg"}
            show={{ xl: 3, l: 3, md: 2, sm: 1 }}
            gap={20}
            autoPlay={true}
            autoPlayInterval={3000}
          >
            {newProperties.map((p) => (
              <PropertyCarouselCard p={p} />
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
                <p className="mb-5 text-[#114085]">
                  If you are having any questions, please feel free to ask.
                </p>
                <a
                  href="/contact"
                  className="bg-[#114085] text-white px-[20px] py-[10px] rounded-sm flex items-center justify-center gap-3"
                >
                  <FaRegEnvelope /> Drop us a line
                </a>
              </div>
            </div>
          </div>
        </ContainerCenter>
        <ContainerCenter>
          <Faq/>
        </ContainerCenter>
      </div>
      <Footer/>
    </>
  );
};

export default Home;
