import { Flex, Image, Input } from "@chakra-ui/react";
import { useState } from "react";
import { XFormItem, XFormItemPassword } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputPasswordProps extends XFormItemPassword {}

export function XInputPassword(props: XInputPasswordProps) {
  const [show, setShow] = useState<boolean>(false);

  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      style={{ position: 'relative', ...props.containerStyle }}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}>
      <Input 
        disabled={props.disabled}
        type={show ? 'text' : 'password'}
        value={props.value}
        border={'solid 1.8px #C7C9D9'}
        fontSize={'.8em'}
        p={'12px 18px'}
        onChange={e => props.onChange && props.onChange(e.target.value)}
        placeholder={props.placeholder}
        onKeyDown={props.onKeyDown} />
      <Flex 
        position={'absolute'}
        marginTop={'0'}
        right={'20px'}
        h={'100%'}
        align={'center'}
        cursor={'pointer'}
        zIndex={999}>
        { !show && <Image 
          w={'18px'} 
          h={'18px'} 
          objectFit={'contain'} 
          src={'/icons/icon-password-show.svg'}
          onClick={() => setShow(true)} /> }
        { show && <Image 
          w={'18px'} 
          h={'18px'} 
          objectFit={'contain'} 
          src={'/icons/icon-password-hide.svg'}
          onClick={() => setShow(false)} /> }
      </Flex>
    </XFormLabel>
  );
}
