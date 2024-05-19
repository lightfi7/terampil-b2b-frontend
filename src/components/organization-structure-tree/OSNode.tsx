import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { EdgeNode } from "./EdgeNode";
import { OSNodeData } from "./node.utility";

interface OSNodeProps {
  renderContent?(node: OSNodeData): any
  data: OSNodeData
  level?: number
  parentRef?: any
  onAddNewChildren(parent_id: string): void
  onDeleteNode(node_id: string): void
  onClick?(node_id: string): void
  scrollPosition?: number[] // contains [x, y]
  hideAdd?: boolean
}

export function OSNode(props: OSNodeProps) {
  const level = props.level ?? 0;
  const ref = useRef();
  const [xy, setXY] = useState<number[]>([0, 0]);
  const x = xy[0];
  const y = xy[1];

  function addChildren() {
    if (!props.data) {
      return;
    }
    props.onAddNewChildren(props.data.id);
  }

  function addSibling() {
    if (!props.data || !props.data.parent_id) {
      return;
    }
    props.onAddNewChildren(props.data.parent_id);
  }

  function getPosition() {
    const x = (ref.current as any)?.getBoundingClientRect()?.x ?? 0;
    const y = (ref.current as any)?.getBoundingClientRect()?.y ?? 0;
    setXY([x, y]);
  }

  useEffect(() => {
    getPosition();
  }, [ref]);

  useEffect(() => {
    getPosition();
  }, []);

  useEffect(() => {
    window.addEventListener("resize", getPosition);
    return () => {
      window.removeEventListener("resize", getPosition);
    }
  }, []);

  return (
    <Flex
      gap={'48px'}
      direction={'column'}
      align={'center'}
      alignSelf={'flex-start'}
      position={'relative'}
      transition={'200ms'}>
      <Flex
        zIndex={2}
        fontSize={'.6em'}
        direction={'column'}>
        <Flex
          ref={ref as any}
          align={'center'}>
          <Image
            onClick={() => props.onClick && props.onClick(props.data!.id)}
            cursor={'pointer'}
            borderRadius={999}
            w={'92px'}
            src={'/image/placeholder-employee.png'}
            h={'92px'}
            minW={'92px'}
            minH={'92px'}
            objectFit={'contain'}
            border={'solid 4px #EEE'}
            bg={'#999'}
            zIndex={2} />
          <Flex
            h={'71px'}
            position={'relative'}>
            <Flex
              onClick={() => props.onClick && props.onClick(props.data!.id)}
              h={'100%'}
              justify={'center'}
              zIndex={1}
              borderRadius={15}
              p={'5px 18px'}
              w={'240px'}
              pl={'30px'}
              ml={'-28px'}
              border={'solid 4px #EEE'}
              direction={'column'}
              bg={'#F9F9F9'}
              cursor={'pointer'}
              lineHeight={'1.4em'}
              _hover={{
                bg: '#FFF'
              }}>
              { props.renderContent && props.renderContent(props.data) }
              { !props.renderContent && <Flex
                direction={'column'}>
                <Flex
                  justify={'space-between'}>
                  <Text
                    fontSize={'1.2em'}
                    fontWeight={500}
                    color={props.data?.label ? '#000' : '#888'}>
                    { props.data?.label ? props.data?.label : 'Organization Name' }
                  </Text>
                  <Flex>
                    { (level !== 0 && !props.hideAdd) && <Image
                      src={'/icons/icon-trash-red.png'}
                      w={'12px'}
                      h={'12px'}
                      cursor={'pointer'}
                      objectFit={'contain'}
                      onClick={(e) => {
                        e.stopPropagation();
                        props.onDeleteNode(props.data!.id);
                      }} /> }
                  </Flex>
                </Flex>
                { props.data?.position &&  <Text
                  color={props.data?.position ? '#000' : '#888'}>
                  { props.data?.position ? props.data?.position : 'Position' }
                </Text> }
                { props.data?.pic && <Text
                  color={props.data?.pic ? '#000' : '#888'}>
                  { props.data?.pic ? props.data?.pic : 'PIC Name' }
                </Text> }
              </Flex> }
            </Flex>
            { props.parentRef && <Flex
              position={'absolute'}
              left={0}
              top={0}
              zIndex={-1}>
              <EdgeNode
                refA={props.parentRef}
                refB={ref} />
            </Flex> }
          </Flex>
          { !props.hideAdd && <Text
            cursor={level === 0 ? '' : 'pointer'}
            whiteSpace={'nowrap'}
            pl={'4px'}
            onClick={level === 0 ? undefined : addSibling}
            fontSize={'1.3em'}
            color={level === 0 ? 'transparent' : '#1D64AE'}>
            +Hor
          </Text> }
        </Flex>
        <Flex>
          <Text
            zIndex={999}
            cursor={props.hideAdd ? 'default' : 'pointer'}
            pl={'12px'}
            onClick={addChildren}
            fontSize={'1.3em'}
            color={props.hideAdd ? 'transparent' : '#1D64AE'}>
            + Vertical
          </Text>
        </Flex>
      </Flex>
      <Flex
        zIndex={1}
        align={'center'}
        gap={'12px'}
        transition={'200ms'}>
        {
          (props.data?.children ?? []).map((node: OSNodeData, i: number) => (
            <OSNode 
              renderContent={props.renderContent}
              parentRef={ref}
              scrollPosition={props.scrollPosition}
              key={`node-${level}-${i}`}
              data={node}
              onAddNewChildren={props.onAddNewChildren}
              onDeleteNode={props.onDeleteNode}
              onClick={props.onClick}
              level={level + 1}
              hideAdd={props.hideAdd} />
          ))
        }
      </Flex>
    </Flex>
  );
}
