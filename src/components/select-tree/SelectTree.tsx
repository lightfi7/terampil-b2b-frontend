import { Checkbox, Flex, list, Text } from "@chakra-ui/react";
import { flattenTreeGeneral } from "../organization-structure-tree/node.utility";
import { SelectTreeChildren } from "./SelectTreeChildren";

interface SelectTreeProps<T> {
  selected: number[]
  data?: T
  getID(t: T): any
  getLabel(t: T): string
  onSelected(selected: number[]): void
  getChildren(t: T): T[]
  single?: boolean
}

export function SelectTree<T>(props: SelectTreeProps<T>) {
  const list_tree = props.data 
    ? flattenTreeGeneral<T>(props.data, x => props.getChildren(x))
    : [];

  function onSelect(tree_id: any) {
    if (!props.onSelected) {
      return;
    }

    if (props.selected.includes(tree_id)) {
      props.onSelected(props.selected.filter((t_id: any) => t_id !== tree_id));
    } else {
      if (props.single) {
        props.onSelected([tree_id]);
      } else {
        props.onSelected([
          ...props.selected,
          tree_id
        ]);
      }
    }
  }

  function checkAll(checked: boolean) {
    if (!props.onSelected) {
      return;
    }

    if (checked) {
      props.onSelected([]);
    } else {
      props.onSelected(list_tree.map(props.getID));
    }
  }

  return (
    <Flex
      w={'100%'}
      p={'12px 0px'}
      direction={'column'}>
      { !props.single && <Checkbox
        pl={'10px'}
        onChange={(e) => checkAll(!e.target.checked)}
        isChecked={props.selected.length === list_tree.length}>
        <Text
          pl={'4px'}
          fontSize={'.9em'}>
          Select All
        </Text>
      </Checkbox> }
      { list_tree.length > 0 && <SelectTreeChildren<T>
        selected={props.selected}
        data={props.data}
        getID={props.getID}
        getLabel={props.getLabel}
        getChildren={props.getChildren}
        onSelected={onSelect}
        single={props.single} /> }
    </Flex>
  );
}
