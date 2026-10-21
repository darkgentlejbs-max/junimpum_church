import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "대한예수교장로회(통합) 주님품교회",
    short_name: "주님품교회",
    description: "믿음, 소망, 사랑으로 세워가는 따뜻한 공동체 주님품교회",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F6",
    theme_color: "#FAF9F6",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
