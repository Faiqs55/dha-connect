import logo from "@/assets/dha-connect-logo.png";
import ContainerCenter from "./ContainerCenter";
import QuickLink from "./QuickLink";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="mt-15">
      <div className="cta bg-[#114085] text-white flex justify-center items-center h-[150px] md:h-[180px]">
        <h3 className="px-3 text-xl md:text-3xl font-semibold text-center">
          We Help People and home find each other
        </h3>
      </div>

      <div className="pt-10">
        <ContainerCenter className="gap-15 grid md:grid-cols-2 xl:grid-cols-3 xl:gap-10">
          <div>
            <Image src={logo} width={100} height={50} alt="Company Logo" />
            <p className="text-sm leading-6 text-gray-400 font-semibold">
              DHA Connects is Pakistan's No. 1 Real Estate App for all DHA Defence
              Projects since 2011 and has since revolutionized the real estate
              industry of Pakistan by connecting buyers and sellers online in a
              highly convenient way. DHA Connects authorize all type property Buy &
              Sell across all projects of DHA Defence Lahore, Karachi,
              Islamabad/Rawalpindi.
            </p>
          </div>
          <div>
            <h4 className="text-[21px] mb-5">Usefull Links</h4>
            <div className="flex gap-10">
              <ul className="flex flex-col gap-2">
                <QuickLink url="/privacy-policy">Privacy Policy</QuickLink>
                <QuickLink url="/terms-and-conditions">Terms & Conditions</QuickLink>
                <QuickLink url="/faqs">FAQs</QuickLink>
                <QuickLink url="/forms">Forms</QuickLink>
                <QuickLink url="/contact">Contact</QuickLink>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="text-[21px] mb-5">Contact Us</h4>
            <address className="flex flex-col not-italic text-[#707070] font-semibold gap-2">
              <span>Address : <a className="text-blue-500" href="https://maps.app.goo.gl/LDETWfGoX4rMPkKYA">CCA II, 180 Broadway Main Blvd, Sector W DHA Phase 8, Lahore, 54000</a></span>
              <span>
                Phone : {
                  <a className="text-blue-500" href="tel:+923215678920">
                    +92 321 5678920
                  </a>
                }
              </span>
              <span>
                Email : {
                  <a className="text-blue-500" href="mailto:info@dhaconnects.com">
                    info@dhaconnects.com
                  </a>
                }
              </span>
            </address>
          </div>
        </ContainerCenter>
      </div>

      <div className="copy-right mt-10 text-[#707070]">
        <ContainerCenter className="py-[40px] border-t-[1px] border-gray-300">
          <p className="text-center">
            © 2025 DHA Connects. All Rights Reserved.
          </p>
        </ContainerCenter>
      </div>
    </footer>
  );
};

export default Footer;
