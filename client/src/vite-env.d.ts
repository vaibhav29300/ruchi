/// <reference types="vite/client" />

declare module "*.mp3" {
  const src: string;
  export default src;
}

declare module "@assets/*.mp3" {
  const src: string;
  export default src;
}

declare module "*.jpg" {
  const src: string;
  export default src;
}

declare module "*.JPG" {
  const src: string;
  export default src;
}

declare module "@assets/*.jpg" {
  const src: string;
  export default src;
}

declare module "@assets/*.JPG" {
  const src: string;
  export default src;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare module "@assets/*.png" {
  const src: string;
  export default src;
}

