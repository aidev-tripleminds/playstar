/** Local stand-ins from `public/assets/playright`. */
export const DUMMY_IMAGES = [
  "/assets/playright/pic1.webp",
  "/assets/playright/pic2.webp",
  "/assets/playright/pic3.webp",
  "/assets/playright/pic4.avif",
  "/assets/playright/pic5.avif",
  "/assets/playright/pic6.avif",
  "/assets/playright/pic7.avif",
  "/assets/playright/pic8.avif",
  "/assets/playright/pic9.avif",
  "/assets/playright/pic10.jpg",
  "/assets/playright/pic11.jpg",
  "/assets/playright/pic12.jpg",
  "/assets/playright/pic13.avif",
  "/assets/playright/pic14.avif",
  "/assets/playright/pic15.jpg",
  "/assets/playright/pic16.jpg",
  "/assets/playright/pic17.jpg",
  "/assets/playright/pic18.avif",
  "/assets/playright/pic19.avif",
  "/assets/playright/pic20.avif",
] as const;

export function dummyImage(index: number): string {
  const count = DUMMY_IMAGES.length;
  const safe = Number.isFinite(index) ? index : 0;
  return DUMMY_IMAGES[((safe % count) + count) % count];
}
