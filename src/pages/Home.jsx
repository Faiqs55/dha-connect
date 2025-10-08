import SearchBar from "../Components/SearchBar";
import ContainerCenter from "../Components/ContainerCenter";
import Carousel from "../Components/Carousel";
import agencies from "../Agencies";
import properties from "../Properties";
import PropertiesCard from "../Components/PropertiesCard";

const Home = () => {
  return (
    <div>
      {/* HERO  */}
      <div className="hero w-full py-32">
        <ContainerCenter className={`gap-7 flex flex-col`}>
          <h1 className="text-white text-4xl">
            Find Properties in DHA Defence
          </h1>
          <SearchBar />
          <h3 className="text-white text-2xl">
            We’ve 38705 properties for you!
          </h3>
        </ContainerCenter>
      </div>

      {/* FEATURED AGENCIES  */}
      <div className="featured-agencies mt-10">
        <ContainerCenter>
          <h2 className="text-3xl">
            Featured Agencies
            <div>
              <Carousel autoplay={true} cardsToShow={4} interval={3000}>
                {agencies.map(agency => (
                  <div key={agency.img} className="w-[170px]">
                     <img className="w-full h-full object-cover object-center" src={agency.img} alt="" />
                  </div>
                ))}
              </Carousel>
            </div>
          </h2>
        </ContainerCenter>
      </div>

      {/* HOT PROPERTIES  */}
      <div className="hot-properties mt-10">
        <ContainerCenter>
          <h2 className="text-3xl">Recent Properties</h2>
          <Carousel autoplay cardsToShow={4} gap={10}>
            {properties.map(prop => (
              <div key={prop.id} className="w-[220px]">
                 <img className="w-full" src={prop.img} alt="" />
              </div>
            ))}
          </Carousel>
        </ContainerCenter>
      </div>

      {/* MAIN SECTION  */}
      <div className="main mt-10">
        <ContainerCenter className={`flex flex-col xl:flex-row gap-10`}>
          {/* LEFT  */}
          <div className="recent-properties w-full xl:w-[70%]">
            <h2 className="text-3xl">Recent Properties</h2>
            {/* PROPERTIES CARDS  */}
            <div className="flex flex-col gap-10 mt-10">
                 {properties.map((data, index) => <PropertiesCard data={data} />)}
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
