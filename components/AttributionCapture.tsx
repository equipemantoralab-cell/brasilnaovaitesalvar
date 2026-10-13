'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { captureAttribution } from '@/lib/attribution';

export default function AttributionCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    captureAttribution(new URLSearchParams(searchParams.toString()));
  }, [searchParams]);

  return null;
}
