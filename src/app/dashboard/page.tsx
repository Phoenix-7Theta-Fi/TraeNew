import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6 text-primary">Welcome to Tangerine</h1>
          <p className="text-xl mb-8 text-foreground">
            Your journey to holistic wellness through Ayurvedic and alternative medicine starts here.
          </p>
          <div className="bg-surface p-6 rounded-lg border border-primary/20">
            <h2 className="text-2xl font-semibold mb-4 text-primary">
              Discover Natural Healing
            </h2>
            <p className="text-foreground/80">
              Explore traditional Ayurvedic practices and alternative medicine solutions tailored to your wellness needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
