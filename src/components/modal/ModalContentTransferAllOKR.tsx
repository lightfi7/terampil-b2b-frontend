
import { Flex } from "@chakra-ui/react";
import { Employee } from "data-design/src/entity/Employee.entity";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";

interface ModalContentTransferAllOKRProps {
  employees?: Employee[]
  onSubmit?(employee_id: number): void
  onCancel?(): void
  loading?: boolean
}

export function ModalContentTransferAllOKR(props: ModalContentTransferAllOKRProps) {
  const [selected_employee_id, setSelectedEmployeeID] = useState<number>('' as any);

  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit(selected_employee_id);
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}>
      <XForm
        columnMode
        gap={'8px'}
        forms={[{
          label: 'Choose Employee',
          key: 'employee',
          placeholder: 'Choose Employee',
          type: 'dropdown',
          options: (props.employees ?? []).map((employee: Employee) => ({
            value: employee.id,
            label: `${employee.name} - ${employee.job_profile?.name}`
          })),
          value: selected_employee_id,
          onChange: setSelectedEmployeeID
        }]} />
      <Flex
        mt={'24px'}
        justify={'space-between'}
        gap={'16px'}>
        <AButton
          isLoading={props.loading}
          h={'42px'}
          w={'100%'}
          onClick={submit}>
          Transfer OKR
        </AButton>
      </Flex>
    </Flex>
  );
}
