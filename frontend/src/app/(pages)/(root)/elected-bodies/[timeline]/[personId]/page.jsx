import ContainerCenter from "@/Components/ContainerCenter";
import Link from "next/link";
import { BsWhatsapp, BsTelephoneFill, BsPlayFill } from "react-icons/bs";
import { notFound } from "next/navigation";

const formatPhoneNumber = (value) => {
  if (!value) {
    return { display: "Not Available", tel: null, whatsapp: null };
  }
  const cleaned = value.toString().replace(/[^0-9+]/g, "");
  if (!cleaned) {
    return { display: value, tel: null, whatsapp: null };
  }
  const normalized = cleaned.startsWith("+")
    ? cleaned
    : `+92${cleaned.replace(/^0/, "")}`;
  return {
    display: normalized,
    tel: normalized,
    whatsapp: `https://wa.me/${normalized.replace("+", "")}`,
  };
};

const extractYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

const fetchMember = async (id) => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  if (!baseURL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined.");
  }
  const res = await fetch(`${baseURL}/elected-bodies/${id}`, {
    cache: "no-store",
  });
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error("Failed to load elected body member.");
  }
  const payload = await res.json();
  if (!payload?.success || !payload?.data) {
    notFound();
  }
  return payload.data;
};

const MemberProfilePage = async ({ params }) => {
  const { timeline, personId } = params;
  const member = await fetchMember(personId);
  const statusLabel = member.status || timeline;
  const phoneLinks = formatPhoneNumber(member.whatsappNo);
  const youtubeThumbnail =
    member.uploadVideo && extractYouTubeId(member.uploadVideo)
      ? `https://img.youtube.com/vi/${extractYouTubeId(member.uploadVideo)}/hqdefault.jpg`
      : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <ContainerCenter>
        <div className="py-12">
          <Link
            href={`/elected-bodies?timeline=${statusLabel || timeline}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Back to {statusLabel || timeline} body
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-slate-800/60 bg-slate-900/70 px-6 pb-16 pt-12 shadow-[0_40px_120px_-40px_rgba(16,185,129,0.35)] sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute -top-32 -right-24 h-64 w-64 rounded-full bg-emerald-500/30 blur-[120px]" />
          <div className="pointer-events-none absolute bottom-0 left-10 h-52 w-52 rounded-full bg-sky-500/20 blur-[100px]" />

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr),minmax(0,1.4fr)] items-start">
            <div className="relative z-10 flex flex-col items-center gap-8 text-center lg:items-start lg:text-left">
              <div className="relative">
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-emerald-400/50 via-teal-400/40 to-sky-400/50 blur-[40px]" />
                <div className="relative h-48 w-48 overflow-hidden rounded-[28px] border border-emerald-400/30 bg-slate-950/40 shadow-2xl sm:h-56 sm:w-56">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="h-full w-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {statusLabel || "Elected Body"}
                </div>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                  {member.name}
                </h1>
                <p className="text-lg text-slate-300">{member.designation}</p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href={phoneLinks.tel ? `tel:${phoneLinks.tel}` : undefined}
                  className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-70"
                  aria-disabled={!phoneLinks.tel}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                    <BsTelephoneFill className="text-lg" />
                  </span>
                  Call {member.name.split(" ")[0]}
                </a>

                <a
                  href={phoneLinks.whatsapp || undefined}
                  target={phoneLinks.whatsapp ? "_blank" : undefined}
                  rel={phoneLinks.whatsapp ? "noreferrer" : undefined}
                  className="group inline-flex items-center gap-3 rounded-full border border-emerald-400/40 bg-transparent px-6 py-3 text-sm font-semibold text-emerald-200 transition-colors duration-300 hover:border-emerald-300 hover:text-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
                  aria-disabled={!phoneLinks.whatsapp}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15">
                    <BsWhatsapp className="text-lg" />
                  </span>
                  WhatsApp Message
                </a>
              </div>

              <div className="grid w-full gap-4 text-left sm:grid-cols-2">
                <div className="rounded-2xl border border-white/5 bg-white/5 px-5 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Status
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white capitalize">
                    {statusLabel || "Not specified"}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/5 bg-white/5 px-5 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Active
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {member.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>

              <div className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Contact
                </p>
                <div className="mt-2 space-y-1 text-sm text-slate-200">
                  <p>Email: {member.email || "Not provided"}</p>
                  <p>WhatsApp: {phoneLinks.display}</p>
                </div>
              </div>

              {member.agencyBelong && (
                <div className="w-full rounded-2xl border border-white/5 bg-white/5 px-5 py-4 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    Agency / Committee
                  </p>
                  <p className="mt-2 text-sm text-slate-200">
                    {member.agencyBelong}
                  </p>
                </div>
              )}
            </div>

            <div className="relative z-10 space-y-10">
              <div className="rounded-[28px] border border-white/5 bg-white/[0.04] p-10 backdrop-blur-md">
                <h2 className="text-2xl font-semibold text-white sm:text-3xl">
                  Profile Summary
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-slate-300 whitespace-pre-line">
                  {member.profileSummary ||
                    `${member.name} serves as ${member.designation}. More details will be shared soon.`}
                </p>
              </div>

              {youtubeThumbnail && (
                <Link
                  href={member.uploadVideo}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-[28px] border border-emerald-400/40 bg-emerald-500/5 shadow-lg ring-1 ring-emerald-500/10 transition-transform duration-500 hover:-translate-y-1"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={youtubeThumbnail}
                      alt="Leadership highlight"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 via-emerald-900/30 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-6">
                      <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-emerald-700 shadow-2xl transition-transform duration-500 group-hover:scale-110">
                        <BsPlayFill className="text-4xl" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-emerald-200/90">
                          Highlight Video
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-white">
                          Leadership Spotlight
                        </h3>
                        <p className="mt-3 text-sm text-emerald-100/80 leading-relaxed">
                          Dive into key milestones and community storytelling powered by this visual highlight.
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </ContainerCenter>
    </div>
  );
};

export default MemberProfilePage;

