import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "404 Not Found",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <div>404 Not Found</div>;
}