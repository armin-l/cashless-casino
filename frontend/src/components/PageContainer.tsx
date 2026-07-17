export default function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-7xl mx-auto w-full px-6 py-8">
      {children}
    </main>
  );
}
