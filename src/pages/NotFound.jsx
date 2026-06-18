export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF2E1] flex items-center justify-center p-6">
      <div className="max-w-xl bg-white rounded-3xl shadow-2xl p-12 text-center">
        <h1 className="text-5xl font-bold text-[#A79277] mb-4">404</h1>
        <p className="text-lg text-gray-700 mb-6">
          The page you are looking for does not exist.
        </p>
        <p className="text-sm text-gray-500">
          If you arrived here after a refresh or direct link, make sure your deployment is configured to serve <code>index.html</code> for all client routes.
        </p>
      </div>
    </div>
  );
}
