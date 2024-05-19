import { MinusIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import { XFormItem, XFormItemProficiencyKeyBehavior, XFormItemTextarea } from "../interface";
import { XFormLabel } from "../XFormLabel";

interface XInputProficiencyKeyBehaviorProps extends XFormItemProficiencyKeyBehavior {}

export function XInputProficiencyKeyBehavior(props: XInputProficiencyKeyBehaviorProps) {
  function onChange(i: number, kv: {[key: string]: any}) {
    if (!props.onChange) {
      return;
    }
    props.onChange([
      ...props.value.slice(0, i),
      {
        ...props.value[i],
        ...kv
      },
      ...props.value.slice(i + 1)
    ]);
  }

  function onDelete(i: number) {
    if (!props.onChange) {
      return;
    }
    props.onChange([
      ...props.value.slice(0, i),
      ...props.value.slice(i + 1)
    ]);
  }

  function onAdd() {
    if (!props.onChange) {
      return;
    }
    props.onChange([
      ...props.value,
      {
        label: '',
        list_key_behavior: [{
          key_behavior: '',
          weight: ''
        }]
      }
    ]);
  }

  function onKBChange(i: number, j: number, kb: {[key: string]: any}) {
    onChange(i, {
      list_key_behavior: [
        ...props.value[i].list_key_behavior.slice(0, j),
        {
          ...props.value[i].list_key_behavior[j],
          ...kb
        },
        ...props.value[i].list_key_behavior.slice(j + 1),
      ]
    });
  }

  function onKBDelete(i: number, j: number) {
    onChange(i, {
      list_key_behavior: [
        ...props.value[i].list_key_behavior.slice(0, j),
        ...props.value[i].list_key_behavior.slice(j + 1),
      ]
    });
  }

  function onKBAdd(i: number) {
    onChange(i, {
      list_key_behavior: [
        ...props.value[i].list_key_behavior,
        {
          key_behavior: '',
          weight: ''
        },
      ]
    });
  }

  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}
      style={props.containerStyle}>
      <Flex
        direction={'column'}
        gap={'12px'}>
        {
          props.value.map((item, i: number) => (
            <Flex
              key={i}
              direction={'row'}
              gap={'12px'}>
              <Text
                w={'32px'}
                mt={'8px'}>
                { i + 1 }.
              </Text>
              <Flex
                flex={1}
                gap={'12px'}
                direction={'column'}>
                <Flex
                  align={'center'}
                  gap={'8px'}>
                  <Input
                    value={item.label}
                    placeholder={'Level'}
                    fontSize={'.9em'}
                    onChange={e => onChange(i, { label: e.target.value })} />
                  <Flex
                    border={'solid 1px #FF2222AA'}
                    borderRadius={999}
                    w={'15px'}
                    h={'15px'}
                    align={'center'}
                    justify={'center'}
                    cursor={'pointer'}
                    onClick={() => onDelete(i)}>
                    <MinusIcon 
                      fontSize={'8px'}
                      color={'red'} />
                  </Flex>
                </Flex>
                <Flex
                  gap={'12px'}>
                  <Text
                    mt={'8px'}
                    fontSize={'.9em'}>
                    Key Behavior
                  </Text>
                  <Flex
                    flex={1}
                    gap={'24px'}
                    direction={'column'}>
                    {
                      item.list_key_behavior.map((kb: { key_behavior: string, weight: number, tags: string[] }, j: number) => (
                        <Flex
                          key={`kb-${i}-${j}`}
                          align={'center'}
                          gap={'8px'}>
                          <Flex
                            flex={1}
                            gap={'8px'}
                            direction={'column'}>
                            <Flex
                              gap={'8px'}>
                              <Input
                                flex={7}
                                value={kb.key_behavior}
                                placeholder={'Key Behavior'}
                                fontSize={'.9em'}
                                onChange={e => onKBChange(i, j, { key_behavior: e.target.value })} />
                              <Input
                                flex={1}
                                value={kb.weight}
                                max={100}
                                min={0}
                                placeholder={'Weight'}
                                fontSize={'.9em'}
                                type={'number'}
                                onChange={e => onKBChange(i, j, { weight: e.target.value })} />
                            </Flex>
                            <Input
                              value={(kb.tags ?? []).join(' ')}
                              placeholder={'Tags'}
                              fontSize={'.9em'}
                              type={'string'}
                              onChange={e => onKBChange(i, j, { tags: e.target.value.split(' ') })} />
                          </Flex>
                          <Flex
                            border={'solid 1px #FF2222AA'}
                            borderRadius={999}
                            w={'15px'}
                            h={'15px'}
                            align={'center'}
                            justify={'center'}
                            cursor={'pointer'}
                            onClick={() => onKBDelete(i, j)}>
                            <MinusIcon 
                              fontSize={'8px'}
                              color={'red'} />
                          </Flex>
                        </Flex>
                      ))
                    }
                    <Flex>
                      <Button
                        color={'#005CB9'}
                        fontSize={'.8em'}
                        fontWeight={400}
                        border={'dashed 1px #005CB9 !important'}
                        h={'32px'}
                        bg={'transparent'}
                        onClick={() => onKBAdd(i)}>
                        + Tambah Key Behavior
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          ))
        }
      </Flex>
      <Flex>
        <Button
          color={'#005CB9'}
          fontSize={'.8em'}
          fontWeight={400}
          border={'dashed 1px #005CB9 !important'}
          h={'32px'}
          bg={'transparent'}
          mt={'12px'}
          ml={'44px'}
          onClick={onAdd}>
          + Tambah Level
        </Button>
      </Flex>
    </XFormLabel>
  );
}
