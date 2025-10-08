import ContainerCenter from "../Components/ContainerCenter";
import agencies from "../Agencies";
import properties from "../Properties";
import PropertiesCard from "../Components/PropertiesCard";
import Carousel from "../Components/Carousel/Carousel";
import HeroSearchForm from "../Components/HeroSearchForm";

const Home = () => {
  return (
    <div>
      {/* HERO  */}
      <div className="hero w-full py-32">
        <ContainerCenter className={`gap-7 flex flex-col`}>
          <h1 className="text-white text-4xl">
            Find Properties in DHA Defence
          </h1>
          <HeroSearchForm color="#fff"/>
          <h3 className="text-white text-2xl">
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
          <div className="right-widget">
            <div className="search-agencies">
              <h3 className="text-2xl">Search Agencies</h3>
            </div>
          </div>
        </ContainerCenter>
      </div>
    </div>
  );
};

export default Home;
