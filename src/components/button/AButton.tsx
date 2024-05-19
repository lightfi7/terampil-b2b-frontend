import { Button, ButtonProps, Image, useColorMode, useTheme } from "@chakra-ui/react";

interface AButtonProps extends ButtonProps {
  clearBg?: boolean
}

export function AButton(props: AButtonProps) {
  let bg = 'transparent';
  let color = '#000';
  let border = '';
  let borderColor = '';
  switch (props.variant) {
    case 'outline':
      bg = 'tranparent';
      border = `solid 1px #000`;
      borderColor = 'brand';
      color = 'brand';
      break;
    default:
      bg = 'brand';
      color = '#FFF';
      break;
  }
  if (props.clearBg) {
    bg = 'brand';
  }

  return (
    <Button
      borderRadius={4} 
      fontWeight={600}
      fontSize={'.9em'}
      border={border}
      borderColor={borderColor}
      _hover={{
        bgColor: bg,
        opacity: .8
      }}
      _active={{
        bgColor: bg,
        opacity: .6
      }}
      bgColor={bg} 
      color={color}
      p={'1px 32px'}
      h={'32px'}
      {...props} />
  );
}
