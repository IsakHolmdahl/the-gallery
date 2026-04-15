import { env } from "@/lib/env";
import { GalleryContent } from "@/components/gallery-content";

function Page() {
  return <GalleryContent artworkSize={env.ARTWORK_SIZE} />;
}

export default Page;
