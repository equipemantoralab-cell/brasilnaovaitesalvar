import Hero from '@/components/Hero';
import Dobra2 from '@/components/Dobra2';
import MinisteriosGrid from '@/components/MinisteriosGrid';
import PlanosTable from '@/components/PlanosTable';
import MentorBio from '@/components/MentorBio';

export default function HomePage() {
  return (
    <main className="overflow-hidden bg-cream">
      {/* Dobra 1 — Hero */}
      <Hero />

      {/* Dobra 2 — Storytelling */}
      <Dobra2 />

      {/* Dobra 3 — Ministérios */}
      <MinisteriosGrid />

      {/* Dobra 4 — Ingressos */}
      <PlanosTable />

      {/* Dobra 5 — Mentor */}
      <MentorBio />
    </main>
  );
}
