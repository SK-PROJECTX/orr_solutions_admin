import DocumentDetailClient from './DocumentDetailClient';

// For "output: export", dynamic routes must provide generateStaticParams
export async function generateStaticParams() {
  // These are the initial documents defined in the vaultStore
  // Providing them here ensures they are pre-rendered during build
  return [
    { id: 'DOC-001' },
    { id: 'DOC-002' }
  ];
}

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  return <DocumentDetailClient params={params} />;
}
