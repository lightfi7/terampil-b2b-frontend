import { Flex, Image, Text } from "@chakra-ui/react";
import { OKRTransferHistory } from "data-design/src/entity/OKRTransferHistory.entity";
import { ContextMenu } from "../context-menu/ContextMenu";
import { numberFormatter } from "../input-number";
import { ProgressValue } from "../progress-value/ProgressValue";

interface OKRTitleProps {
  title?: string
  bobot?: number | string
  open?: boolean
  pencapaian?: number
  listTransferHistory?: OKRTransferHistory[]
  onClick?(): void
  onDetail?(): void
  onDelete?(): void
  onTransfer?(): void
  employeeName?: string
  redBorderLeft?: boolean
}

export function OKRTitle(props: OKRTitleProps) {
  return (
    <Flex 
      onClick={props.onClick}
      cursor={'pointer'}
      w={'100%'}
      bg={'#FFF'}
      bgGradient={'linear-gradient(90deg, #016ABA 0.96%, #32DFCB 117.32%);'}
      color={'#FFF'}
      p={'12px 24px'}
      borderRadius={8}
      align={'center'}
      gap={'18px'}
      boxShadow={'0px 1px 8px rgba(0, 0, 0, .1)'}
      borderLeft={props.redBorderLeft ? 'solid 10px red' : ''}>
      <Image 
        w={'.85em'}
        h={'.85em'}
        transition={'250ms'}
        objectFit={'contain'}
        transform={`rotate(${props.open ? '0deg' : '180deg'})`}
        src={'/icons/icon-arrow-up-white.svg'} />
      <Flex 
        flex={1}
        direction={'column'}>
        { typeof props.bobot === 'number' && <Text
          fontSize={'1.2em'}
          fontWeight={600}>
          Bobot { +(props.bobot ?? 0).toFixed(2) }% { props.employeeName ? `(${props.employeeName})` : '' }
        </Text> }
        { typeof props.bobot === 'string' && <Text
          fontSize={'1.2em'}
          fontWeight={600}>
          { props.bobot }
        </Text> }
        <Text
          mt={'-2px'}
          fontSize={'.9em'}>
          { props.title }
        </Text>
        { (props.listTransferHistory && (props.listTransferHistory.length > 0)) && <Flex
          mt={'6px'}>
          <Text
            fontSize={'.7em'}
            bg={'#FFF1'}
            borderRadius={4}
            p={'3px 8px'}>
            OKR transferred from { props.listTransferHistory[0].employee_source?.name } with progress { (props.listTransferHistory[0].value * 100).toFixed(2) }%
          </Text>
        </Flex> }
      </Flex>
      { !!props.pencapaian && <Flex
        direction={'row'}
        align={'center'}
        w={'25%'}
        gap={'12px'}>
        <ProgressValue 
          bg={'#FFF'}
          h={'6px'}
          progress={props.pencapaian / 100} />
        <Text
          fontSize={'1.1em'}
          fontWeight={600}>
          { props.pencapaian.toFixed(2) }%
        </Text>
      </Flex> }
      <ContextMenu
        trigger={
          <Image 
            src={'/icons/light/three-dots-white.svg'}
            w={'24px'}
            h={'48px'}
            objectFit={'contain'} />
        }
        listMenu={[{
          hide: !props.onDetail,
          label: 'Detail',
          onClick: props.onDetail
        }, {
          hide: !props.onTransfer,
          label: 'Transfer',
          onClick: props.onTransfer
        }, {
          hide: !props.onDelete,
          label: 'Delete',
          onClick: props.onDelete
        }]} />
    </Flex>
  );
}
