import { Metadata } from 'next';
import LatexTestPage from '@/components/LatexTestPage';

export const metadata: Metadata = {
  title: 'Thử nghiệm hiển thị LaTeX',
  robots: { index: false, follow: false },
};

export default function LatexTest() {
  return <LatexTestPage />;
}
