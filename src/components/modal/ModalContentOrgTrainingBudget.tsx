
import { Button, Checkbox, Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { AButton } from "../button/AButton";
import { XInputText } from "../form/input/XInputText";
import { XForm } from "../form/XForm";
import { OSNodeData } from "../organization-structure-tree/node.utility";

interface ModalContentOrgTrainingBudgetProps {
  onSubmit?(year: number, budget: number): void
  onCancel?(): void
  initialBudget?: number
  data?: OSNodeData
  year: number
  loading?: boolean
}

export function ModalContentOrgTrainingBudget(props: ModalContentOrgTrainingBudgetProps) {
  const [budget, setBudget] = useState<number>(+(props.initialBudget ?? 0));

  function submit() {
    if (!props.onSubmit) {
      return;
    }

    props.onSubmit(props.year, budget);
  }

  return (
    <Flex
      direction={'column'}
      gap={'8px'}
      mt={'-12px'}>
      <XForm
        gap={'8px'}
        labelStyle={{
          padding: 0
        }}
        forms={[{
          label: 'Organisasi',
          key: 'nama',
          placeholder: 'Organisasi',
          type: 'text',
          value: props.data?.label,
          disabled: true,
        }, {
          label: 'Tahun',
          key: 'tahun',
          placeholder: 'Tahun',
          type: 'number',
          value: props.year,
          disabled: true,
        }, {
          label: 'Budget',
          key: 'budget',
          placeholder: 'Budget',
          type: 'number',
          value: budget,
          onChange: setBudget,
        }]} />
      <Flex
        mt={'24px'}
        justify={'space-between'}
        gap={'16px'}>
        <AButton
          isLoading={props.loading}
          h={'42px'}
          w={'100%'}
          onClick={props.onCancel}
          variant={'outline'}>
          Batal
        </AButton>
        <AButton
          h={'42px'}
          w={'100%'}
          onClick={submit}>
          Simpan
        </AButton>
      </Flex>
    </Flex>
  );
}
