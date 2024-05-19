
import { Flex, Text } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";

interface ModalContentUnarchiveEmployeeProps {
  data?: Employee
  onSubmit?(): void
  onCancel?(): void
  loading?: boolean
}

export function ModalContentUnarchiveEmployee(props: ModalContentUnarchiveEmployeeProps) {
  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit();
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}>
      <Text>
        Do you want to unarchive this employee?
      </Text>
      <Flex
        mt={'24px'}
        justify={'space-between'}
        gap={'16px'}>
        <AButton
          isLoading={props.loading}
          variant={'outline'}
          h={'42px'}
          w={'100%'}
          onClick={props.onCancel}>
          Cancel
        </AButton>
        <AButton
          isLoading={props.loading}
          h={'42px'}
          w={'100%'}
          onClick={submit}>
          Unarchive
        </AButton>
      </Flex>
    </Flex>
  );
}
