import Image from 'next/image';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-[#ff9b42]">Welcome to Tangerine</h1>
        <p className="text-xl mb-8">
          Your journey to holistic wellness through Ayurvedic and alternative medicine starts here.
        </p>
        <div className="bg-[#171717] p-6 rounded-lg border border-[#ff9b42]/20">
          <h2 className="text-2xl font-semibold mb-4 text-[#ff9b42]">
            Discover Natural Healing
          </h2>
          <p className="text-gray-300">
            Explore traditional Ayurvedic practices and alternative medicine solutions tailored to your wellness needs.
          </p>
        </div>
      </div>
    </div>
  );
}