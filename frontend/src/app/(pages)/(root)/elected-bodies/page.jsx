"use client"
import Carousel from "@/Components/Carousel/Carousel";
import ContainerCenter from "@/Components/ContainerCenter";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "@/assets/dha-connect-logo.png";
import { useSearchParams } from "next/navigation";
import { BsWhatsapp } from "react-icons/bs";
import electedBodiesService from "@/services/electedBodies.service";

const page = () => {
  const timeline = useSearchParams().get("timeline");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await electedBodiesService.getMembers();
        if (!res?.success) {
          throw new Error(res?.message || "Unable to load elected body members.");
        }
        setMembers(res.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const availableStatuses = useMemo(() => {
    const unique = new Set();
    members.forEach((member) => {
      if (member.status) {
        unique.add(member.status);
      }
    });
    return Array.from(unique);
  }, [members]);

  const selectedStatus = useMemo(() => {
    if (!availableStatuses.length) {
      return timeline || "current";
    }
    if (timeline && availableStatuses.includes(timeline)) {
      return timeline;
    }
    if (timeline && !availableStatuses.includes(timeline)) {
      return availableStatuses[0];
    }
    if (availableStatuses.includes("current")) {
      return "current";
    }
    return availableStatuses[0];
  }, [timeline, availableStatuses]);

  const filteredMembers = useMemo(() => {
    if (!selectedStatus) return members;
    return members.filter((member) => member.status === selectedStatus);
  }, [members, selectedStatus]);

  const formatPhoneNumber = (value) => {
    if (!value) return { tel: null, whatsapp: null };
    const cleaned = value.toString().replace(/[^0-9+]/g, "");
    if (!cleaned) return { tel: null, whatsapp: null };
    const normalized = cleaned.startsWith("+")
      ? cleaned
      : `+92${cleaned.replace(/^0/, "")}`;
    return {
      tel: normalized,
      whatsapp: `https://wa.me/${normalized.replace("+", "")}`,
    };
  };

  return (
    <>
      <ContainerCenter>
        {/* PAGE HEADER  */}
        <div className="py-12">
          <h1 className="text-center text-4xl font-semibold">Elected Body</h1>
        </div>

        {/* CURRENT BODY  */}
        <div className="">
          <h2 className="font-semibold text-xl capitalize">
            {selectedStatus} Elected Body
          </h2>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading members…</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">{error}</div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              No members found for this body yet.
            </div>
          ) : (
            <Carousel
              autoPlay={true}
              autoPlayInterval={3000}
              sidePadding={0}
              gap={20}
              navButtonOffset={0}
            >
              {filteredMembers.map((member) => {
                const links = formatPhoneNumber(member.whatsappNo);
                return (
                  <div
                    key={member._id}
                    className="p-5 shadow bg-gradient-to-t from-blue-50 to-[#114085] rounded-lg"
                  >
                    <Link
                      href={`/elected-bodies/${selectedStatus}/${member._id}`}
                      className="shadow overflow-hidden rounded-md block w-full h-[250px] sm:h-[350px] md:h-[200px]"
                    >
                      <img
                        className="object-center object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        src={member.photo}
                        alt={member.name}
                      />
                    </Link>
                    <div className="mt-5 space-y-1.5">
                      <h3 className="text-lg font-semibold text-white">
                        {member.designation}
                      </h3>
                      <p className="text-sm text-slate-200">{member.name}</p>
                      {member.whatsappNo && (
                        <p className="text-xs text-slate-200/80">
                          WhatsApp: {member.whatsappNo}
                        </p>
                      )}
                      <a
                        className="text-white bg-blue-900 font-semibold text-center mt-3 rounded-md block px-2 py-1 text-sm disabled:opacity-50"
                        href={links.tel ? `tel:${links.tel}` : undefined}
                        aria-disabled={!links.tel}
                      >
                        Call
                      </a>
                      <a
                        className="text-white justify-center flex items-center gap-3 bg-green-700 font-semibold text-center mt-3 rounded-md px-2 py-1 text-sm disabled:opacity-50"
                        href={links.whatsapp || "#"}
                        target="_blank"
                        rel="noreferrer"
                        aria-disabled={!links.whatsapp}
                      >
                        <BsWhatsapp /> WhatsApp
                      </a>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          )}
        </div>

        {/* PREVIOUS  */}
        <div className="mt-10">
          {availableStatuses.map((status) => (
            <div
              key={status}
              className="flex items-center justify-between py-10 border-b border-gray-500"
            >
              <Link
                className="font-semibold text-2xl underline"
                href={`/elected-bodies?timeline=${status}`}
              >
                {status}
              </Link>
              <Image src={logo} alt="company logo" width={100} height={100} />
            </div>
          ))}
        </div>
      </ContainerCenter>
    </>
  );
};

export default page;
