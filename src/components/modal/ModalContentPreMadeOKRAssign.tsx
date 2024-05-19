
import { Button, Flex, Text } from "@chakra-ui/react";
import { Competency } from "data-design/src/entity/Competency.entity";
import { CompetencyAssessment } from "data-design/src/entity/CompetencyAssessment.entity";
import { Employee } from "data-design/src/entity/Employee.entity";
import { KeyBehavior } from "data-design/src/entity/KeyBehavior.entity";
import { PreMadeOKR } from "data-design/src/entity/PreMadeOKR.entity";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XForm } from "../form/XForm";

interface ModalContentPreMadeOKRAssignProps {
  employees?: Employee[]
  onSubmit?(employee_id: number, pre_made_okr_id: number): void
  onCancel?(): void
  loading?: boolean
  data?: PreMadeOKR
}

export function ModalContentPreMadeOKRAssign(props: ModalContentPreMadeOKRAssignProps) {
  const [selected_employee_id, setSelectedEmployeeID] = useState<number>('' as any);

  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit(selected_employee_id, props.data?.id ?? -1);
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}>
      <XForm
        columnMode
        gap={'8px'}
        forms={[{
          label: 'Employee',
          key: 'employee',
          placeholder: 'Employee',
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
          Assign
        </AButton>
      </Flex>
    </Flex>
  );
}
