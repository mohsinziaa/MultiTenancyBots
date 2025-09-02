import { Chat } from '@/components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto max-w-5xl h-screen p-2 sm:p-3 md:p-4">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 h-full overflow-hidden">
          <Chat />
        </div>
      </div>
    </main>
  );
}
