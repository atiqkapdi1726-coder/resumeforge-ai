export default function Loading() {
  return (
    <div className="container flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent mb-4" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
