// app/not-found.js - For App Router (Next.js 13+)

import Button from "@/components/form/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        <h1 className="text-8xl 2xl:text-9xl font-extrabold text-gray-700">
          404
        </h1>
        <div className="w-16 h-1 bg-indigo-600 mx-auto my-6"></div>

        <h2 className="font-34 font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="font-16 text-gray-600 mb-8">
          We couldn't find the page you're looking for. The page might have been
          removed, had its name changed, or is temporarily unavailable.
        </p>

        <Button href="/invitations" className="w-fit mx-auto bg-blue-600">
          Back to home
        </Button>
      </div>
    </div>
  );
}
