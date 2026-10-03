// Lightweight JSON-LD injector. Renders a <script type="application/ld+json">
// tag with safely escaped content. Placed inline in the tree so it works for
// both client rendering and SSR without relying on helmet script serialization.
function serializeLdJson(data: object): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeLdJson(data) }}
    />
  );
}
