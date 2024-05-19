import { Image } from "@chakra-ui/react";

export function ThreeDotsImage() {
  return (
    <Image 
      cursor={'pointer'}
      src={'/icons/light/icon-three-dots.png'}
      w={'48px'}
      h={'30px'}
      objectFit={'contain'} />
  );
}
