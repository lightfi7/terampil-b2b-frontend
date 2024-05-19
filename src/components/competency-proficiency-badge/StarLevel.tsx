import { Flex, Image } from "@chakra-ui/react";

interface StarLevelProps {
  n?: number
  level?: number
}

const StarActive = () => <Image src={'/icons/light/icon-star-active.svg'} w={'18px'} h={'18px'} />;
const StarInactive = () => <Image src={'/icons/light/icon-star-inactive.svg'} w={'18px'} h={'18px'} />;

export function StarLevel(props: StarLevelProps) {
  const n = Math.round(props.n ?? 5);
  const level = Math.round(props.level ?? 0);

  return (
    <Flex
      align={'center'}
      gap={'4px'}>
      {
        Array(level).fill(0).map((_, i: number) => (
          <StarActive key={`a-${i}`} />
        ))
      }
      {
        Array(n - level).fill(0).map((_, i: number) => (
          <StarInactive key={`i-${i}`} />
        ))
      }
    </Flex>
  );
}
