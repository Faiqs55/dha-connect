"use client";
import { useState, useEffect } from "react";
import ContainerCenter from "@/Components/ContainerCenter";
import HeroForm from "@/Components/HeroForm";
import ctaImage from "@/assets/cta-buildings.png";
import Image from "next/image";
import agencyService from "@/services/agency.service";
import Carousel from "@/Components/Carousel/Carousel";
import AgencyCarouselCard from "@/Components/AgencyCarouselCard";
import PropertyCarouselCard from "@/Components/PropertyCarouselCard";
import PropertiesCard from "@/Components/PropertiesCard";
import WidgetSearchFrom from "@/Components/WidgetSearchFrom";
import FAQ from "@/Components/FAQ";
import { FaRegEnvelope } from "react-icons/fa6";
import { body } from "@/static-data/electedBody";
import { BsWhatsapp } from "react-icons/bs";
import propertyService from "@/services/property.service";
import QuickLinkHome from "@/Components/QuickLinksHome";
import Link from "next/link";

const bodyData = body.find((b) => b.timeline === "current");

const page = () => {
  const [agenciesData, setAgenciesData] = useState(null);
  const [properties, setProperties] = useState([]);
  const [fProperties, setFProperties] = useState(null);
  const [vProperties, setVProperties] = useState(null);
  const [cProperties, setCProperties] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAgencies = async () => {
    const query = { status: "Approved" };
    const data = await agencyService.getAllAgencies(query);
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

  const getProperties = async () => {
    const resC = await propertyService.getAllProperties({
      adType: "classifiedAds",
      status: "available"
    });

    if (resC.success) {
      setCProperties(resC.data);
    } else {
      setCProperties(null);
    }

    const resV = await propertyService.getAllProperties({ adType: "videoAds", status: "available" });

    if (resV.success) {
      setVProperties(resV.data);
    } else {
      setVProperties(null);
    }

    const resF = await propertyService.getAllProperties({
      adType: "featuredAds",
      status: "available"
    });

    if (resF.success) {
      setFProperties(resF.data);
    } else {
      setFProperties(null);
    }

    const resA = await propertyService.getAllProperties({status: "available"});

    if (resA.success) {
      setProperties(resA.data);
    } else {
      setProperties(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    getProperties();
  }, []);

  return (
    <>
      <div className="p-5">
        <div className="w-full hero rounded-xl py-16 md:py-24 lg:py-28">
          <ContainerCenter className={`flex flex-col`}>
            <h1 className="text-white text-4xl sm:text-5xl mb-[15px] text-center">
              Find Properties in DHA Lahore
            </h1>
            <h3 className="text-white text-xl sm:text-2xl text-center mb-[40px]">
              Real Data. Real Brokers. Real Properties.
            </h3>
            <HeroForm />
            {/* <HeroSearchForm color="#fff" /> */}
            <h3 className="text-white text-xl sm:text-3xl text-center mt-[40px]">
              We’ve 38705 properties for you!
            </h3>
          </ContainerCenter>
        </div>
      </div>

      {/* CTA FOR PROPERTIES  */}
      <div className="mx-5 md:mx-0 mb-5">
        <ContainerCenter className="flex flex-col md:flex-row items-center w-full bg-gradient-to-r from-blue-950 to-blue-800 rounded-md px-5 md:gap-5 py-5 md:py-0">
          <div className="self-end hidden lg:block">
            <Image src={ctaImage} alt="Call to action svg image" />
          </div>
          <div className="py-10 md:flex-1">
            <h3 className="text-blue-100 text-2xl font-semibold">
              Sell or Rent Your Property with Confidence
            </h3>
            <p className="text-white">
              Connect with a trusted agent to secure the best deal, faster.
            </p>
          </div>
          <div className="">
            <Link
              href="/properties"
              className="bg-white text-[#1e7066] px-4 py-2 text-xl rounded-md font-semibold"
            >
              Get Started
            </Link>
          </div>
        </ContainerCenter>
      </div>

      {/* CTA FOR BROKERS  */}
      <div className="mx-5 md:mx-0 mb-5">
        <ContainerCenter className="flex flex-col md:flex-row md:items-center w-full bg-gradient-to-r from-blue-950 to-blue-800 rounded-md px-5 gap-5 py-5">
          <div className="flex">
            {[
              "/dha-elected-bodies/zeeshan-butt.png",
              "/dha-elected-bodies/imran-fiaz.png",
              "/dha-elected-bodies/abrar-husain.png",
              "/dha-elected-bodies/p.png",
            ].map((img, index) => {
              return (
                <div
                  key={img}
                  className={`rounded-full h-[50px] w-[50px] overflow-hidden ${
                    index == 0 ? "" : "ml-[-10px]"
                  } `}
                >
                  <img src={img} alt="" />
                </div>
              );
            })}
          </div>
          <div className="text-white flex-1">
            <h3 className="font-semibold text-xl">
              Find a TruBroker<sup>TM</sup>
            </h3>
            <p>Find trusted agents awarded for their excellent performance</p>
          </div>
          <div className="">
            <Link
              href="/agencies"
              className="bg-white text-[#1e7066] px-4 py-2 text-xl rounded-md font-semibold"
            >
              Get Started
            </Link>
          </div>
        </ContainerCenter>
      </div>

      {/* FEATURED AGENCIES SECTION  */}
      <section className="pt-10">
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

      {/* ELECTED BODIES  */}
      <ContainerCenter className="py-20">
        <h2 className="mb-10 text-3xl capitalize">Current Elected Body</h2>
        {bodyData && (
          <Carousel
            autoPlay={true}
            autoPlayInterval={3000}
            sidePadding={0}
            gap={20}
            navButtonOffset={0}
          >
            {bodyData.people
              .slice()
              .sort((a, b) => {
                const order = [
                  "President",
                  "Senior Vice President",
                  "Vice President",
                  "Director Information",
                ];
                const aIndex = order.indexOf(a.designation);
                const bIndex = order.indexOf(b.designation);

                if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                if (aIndex !== -1) return -1;
                if (bIndex !== -1) return 1;
                return 0;
              })
              .map((p) => (
                <div
                  key={p.id}
                  className="p-5 shadow bg-gradient-to-t from-blue-50 to-[#114085] rounded-lg"
                >
                  <div className="shadow overflow-hidden rounded-md w-full h-[300px] sm:h-[350px] md:h-[200px]">
                    <img
                      className="object-center object-cover w-full"
                      src={p.img}
                      alt={p.name}
                    />
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-semibold">{p.designation}</h3>
                    <p className="text-sm text-gray-600">{p.name}</p>
                    <a
                      className="text-white bg-blue-900 font-semibold text-center mt-3 rounded-md block px-2 py-1 text-sm"
                      href={`tel:+92${p.phone.replaceAll(" ", "").slice(1)}`}
                    >
                      Call
                    </a>
                    <a
                      className="text-white justify-center flex items-center gap-3 bg-green-700 font-semibold text-center mt-3 rounded-md px-2 py-1 text-sm"
                      href={`tel:+92${p.phone.replaceAll(" ", "").slice(1)}`}
                    >
                      <BsWhatsapp /> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
          </Carousel>
        )}
      </ContainerCenter>

      {/* FEATURED PROPERTIES  */}
      {fProperties && (
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
              {fProperties.map((p) => (
                <PropertyCarouselCard p={p} />
              ))}
            </Carousel>
          </ContainerCenter>
        </section>
      )}

      {/* VIDEO PROPERTIES  */}
      {vProperties && (
        <section className="mt-10">
          <ContainerCenter>
            <Carousel
              title={"Video Properties"}
              bg={"bg-gradient-to-t from-[#fff] to-blue-100 rounded-lg"}
              show={{ xl: 3, l: 3, md: 2, sm: 1 }}
              gap={20}
              sidePadding={0}
              autoPlay={true}
              autoPlayInterval={3000}
            >
              {vProperties.map((p) => (
                <PropertyCarouselCard p={p} />
              ))}
            </Carousel>
          </ContainerCenter>
        </section>
      )}

      {/* Classified PROPERTIES  */}
      {cProperties && (
        <section className="mt-10">
          <ContainerCenter>
            <Carousel
              title={"Classified Properties"}
              bg={"bg-gradient-to-t from-[#fff] to-blue-100 rounded-lg"}
              show={{ xl: 3, l: 3, md: 2, sm: 1 }}
              gap={20}
              autoPlay={true}
              autoPlayInterval={3000}
            >
              {cProperties.map((p) => (
                <PropertyCarouselCard p={p} />
              ))}
            </Carousel>
          </ContainerCenter>
        </section>
      )}

      {/* MAIN SECTION  */}
      <div className="main mt-10">
        <ContainerCenter className={`flex flex-col xl:flex-row gap-10`}>
          {/* LEFT  */}
          <div className="recent-properties w-full xl:w-[70%]">
            <h2 className="text-3xl">Recent Properties</h2>
            {/* PROPERTIES CARDS  */}
            {properties.length > 0 && (
              <div className="flex flex-col gap-10 mt-10">
                {properties.map((data, index) => (
                  <PropertiesCard key={data._id} data={data} />
                ))}
              </div>
            )}
            {properties.length < 1 && <p>No Properties Available</p>}
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
          <QuickLinkHome />
          <FAQ />
        </ContainerCenter>
      </div>
    </>
  );
};

export default page;
