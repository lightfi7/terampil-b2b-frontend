
import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";
import { OSNodeData } from "../organization-structure-tree/node.utility";
import { SelectTree } from "../select-tree/SelectTree";

interface ModalContentOrgTreeSelectProps<T> {
  onSubmit?(): void
  onCancel?(): void
  selected: number[]
  onSelected(selected: number[]): void
  data?: T
  getID(t: T): any
  getLabel(t: T): string
  getChildren(t: T): T[]
  loading?: boolean
}

export function ModalContentOrgTreeSelect<T>(props: ModalContentOrgTreeSelectProps<T>) {
  const [feedback, setFeedback] = useState<string>('');

  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit();
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}
      mt={'-12px'}>
      <SelectTree<T>
        data={props.data}
        selected={props.selected}
        onSelected={props.onSelected}
        getID={props.getID}
        getLabel={props.getLabel}
        getChildren={props.getChildren} />
    </Flex>
  );
}
