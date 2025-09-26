export default function LegalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="legal-page-layout container mx-auto px-4 py-8 max-w-4xl">
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <div lang="de">
          {children}
        </div>
      </div>
    </div>
  )
}