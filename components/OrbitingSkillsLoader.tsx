"use client";
import dynamic from "next/dynamic";

const OrbitingSkills = dynamic(() => import("@/components/OrbitingSkills"), {
  ssr: false,
  loading: () => (
    <div className="w-full flex items-center justify-center overflow-hidden py-4">
      <div className="w-[320px] h-[320px] sm:w-[360px] sm:h-[360px]" />
    </div>
  ),
});

export default function OrbitingSkillsLoader() {
  return <OrbitingSkills />;
}
