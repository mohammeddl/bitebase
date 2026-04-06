import React from 'react';

/**
 * A reusable component to inject JSON-LD structured data into the head of the page.
 */
export default function JsonLd({ data }: { data: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
