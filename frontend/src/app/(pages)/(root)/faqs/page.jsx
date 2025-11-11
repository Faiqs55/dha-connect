"use client";

import ContainerCenter from "@/Components/ContainerCenter";
import FAQ from "@/Components/FAQ";

export default function FaqsPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <ContainerCenter className="max-w-5xl">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">Frequently Asked Questions</h1>
          <p className="mt-2 text-sm text-slate-500">
            Answers about DHA Connect’s services, support, and property guidance.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <FAQ />
        </section>
      </ContainerCenter>
    </div>
  );
}


