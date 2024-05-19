import { Flex, Text } from "@chakra-ui/react";

interface EdgeNodeProps {
  refA?: any // parent ref
  refB?: any
}

export function EdgeNode(props: EdgeNodeProps) {
  const bw = .5;
  const xy1 = getPosition(props.refA);
  const xy2 = getPosition(props.refB);
  const w = Math.max(.5, Math.abs(xy2[0] - xy1[0]));
  const h = Math.abs(xy2[1] - xy1[1]) - 35 * 2;
  const is_on_left = xy2[0] < xy1[0];
  const margin_left = is_on_left ? '70px' : `${(-w + 70)}px`;

  function getPosition(ref?: any): number[] {
    if (!ref) {
      return [];
    }
    const x = (ref.current as any)?.getBoundingClientRect()?.x ?? 0;
    const y = (ref.current as any)?.getBoundingClientRect()?.y ?? 0;
    return [x, y];
  }

  return (
    <Flex
      w={w}
      h={h}
      ml={margin_left}
      mt={'-89px'}>
      <svg 
        width={'100%'}
        height={'100%'}
        style={{
          zIndex: -1
        }}
        xmlns="http://www.w3.org/2000/svg">
        <line 
          x1={is_on_left ? 0 + bw : w - bw} 
          y1={h} 
          x2={is_on_left ? 0 + bw : w - bw} 
          y2={h/2} 
          stroke={'#777'}
          strokeWidth={bw}
          fill="rgb(121,0,121)" />
        <line 
          x1={0 + bw} 
          y1={h/2} 
          x2={w - bw} 
          y2={h/2} 
          stroke={'#777'}
          strokeWidth={bw}
          fill="rgb(121,0,121)" />
        <line 
          x1={is_on_left ? w : 0} 
          y1={h/2} 
          x2={is_on_left ? w : 0} 
          y2={0} 
          stroke={'#777'}
          strokeWidth={bw}
          fill="rgb(121,0,121)" />
      </svg>
    </Flex>
  );
}
