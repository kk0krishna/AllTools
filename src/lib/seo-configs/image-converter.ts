import { Requirement } from "@/tools/everyday/image-converter/presets";

export interface SeoPageConfig {
  slug: string;
  title: string;
  description: string;
  h1: string;
  preset: Requirement;
  content: {
    explanation: string;
    faq: { q: string, a: string }[];
  }
}

export const imageConverterSeoPages: SeoPageConfig[] = [
  {
    slug: "compress-image-to-50kb",
    title: "Compress Image to 50KB Online - Free & Private",
    description: "Easily compress your image to exactly 50KB or less for passport photos, exam applications, and forms. 100% free and works completely in your browser.",
    h1: "Compress Image to 50KB",
    preset: { format: "image/jpeg", maxKB: 50 },
    content: {
      explanation: "Many government forms, job applications, and exam portals require your photo or signature to be under 50KB. Our tool uses smart compression algorithms to reduce your file size without losing visible quality. It processes entirely on your device, ensuring your sensitive documents never leave your computer.",
      faq: [
        { q: "Will I lose image quality?", a: "We use an optimized balancing algorithm that finds the perfect compression ratio. You will likely not notice any difference in quality." },
        { q: "Is this secure?", a: "Yes. Unlike other tools that upload your photo to a server, this tool processes everything directly inside your browser. Your images are never uploaded." }
      ]
    }
  },
  {
    slug: "compress-image-to-20kb",
    title: "Compress Image to 20KB Online - Signature & Photo Resizer",
    description: "Compress your signature or photo to 20KB online. Perfect for strict form requirements. Fast, free, and private.",
    h1: "Compress Image to 20KB",
    preset: { format: "image/jpeg", maxKB: 20 },
    content: {
      explanation: "A 20KB limit is one of the strictest requirements usually reserved for digital signatures or thumbnail photos. To achieve this, our tool may slightly resize the physical dimensions of your image in addition to applying heavy compression, ensuring it absolutely meets the requirement while remaining legible.",
      faq: [
        { q: "Why did my image get smaller in size?", a: "To reach 20KB, sometimes compressing the quality isn't enough. We automatically reduce the dimensions slightly to guarantee it hits the target size." }
      ]
    }
  },
  {
    slug: "jpg-to-png",
    title: "Convert JPG to PNG Online - Free Format Converter",
    description: "Convert your JPG images to high-quality PNG format instantly. 100% private in-browser conversion.",
    h1: "Convert JPG to PNG",
    preset: { format: "image/png" },
    content: {
      explanation: "Convert your JPEG files into PNG format with a single click. PNGs are lossless and support transparency, making them ideal for graphics, logos, and high-quality web images.",
      faq: [
        { q: "Are there any size limits?", a: "No! Since the conversion happens entirely on your device, you can convert images of any size." }
      ]
    }
  },
  {
    slug: "passport-photo-resizer",
    title: "Passport Photo Maker & Resizer - Free Online Tool",
    description: "Resize and format your photo for passport and visa applications. Automatically crops and compresses to official requirements.",
    h1: "Passport Photo Resizer",
    preset: { format: "image/jpeg", maxKB: 50, width: 413, height: 531, aspectRatio: 413/531 },
    content: {
      explanation: "Creating a passport photo at home has never been easier. This tool enforces standard passport dimensions (equivalent to 3.5cm x 4.5cm at 300 DPI) and keeps the file size under 50KB to ensure it's accepted by digital portals. Just upload your photo, and we will intelligently center-crop it to the correct proportions.",
      faq: [
        { q: "What are the standard dimensions for a digital passport photo?", a: "Most systems require an aspect ratio of 3.5x4.5, which digitally translates well to 413x531 pixels." },
        { q: "How do I crop my face properly?", a: "Our tool provides a manual crop mode! After uploading, simply click the crop icon on your image to adjust exactly where the frame sits." }
      ]
    }
  }
];
