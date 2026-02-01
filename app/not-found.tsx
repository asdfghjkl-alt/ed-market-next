import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center text-center">
      <h1 className="mb-2 text-4xl">
        Oops, we couldn&apos;t find the page you were looking for!
      </h1>
      <Link
        href="/"
        className="text-blue-600 decoration-blue-500 decoration-solid hover:text-blue-400 hover:underline"
      >
        Go to Home page
      </Link>
    </div>
  );
}
