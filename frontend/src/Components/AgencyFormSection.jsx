const AgencyFormSection = ({ innerStyle, title, children }) => {
  return (
    <div>
      <h2 className="text-2xl border-b-[1px] border-b-gray-300 pb-6 mt-10">
        {title}
      </h2>
      <div className={`mt-5 ${innerStyle}`}>{children}</div>
    </div>
  );
};

export default AgencyFormSection;
