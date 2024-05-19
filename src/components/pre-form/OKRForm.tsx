import { Flex } from "@chakra-ui/react";
import { Competency } from "data-design/src/entity/Competency.entity";
import { UpdatePeriode } from "data-design/src/entity/Objective.entity";
import { AButton } from "../button/AButton";
import { DetailContainer } from "../detail-container/DetailContainer";
import { XForm } from "../form/XForm";

export namespace OKRFormData {
  export interface KeyResult {
    id?: number
    title: string
    target: number
    unit: string
    update_period: UpdatePeriode
    target_per_period: number
    weight: number
    list_competency: number[]
  }

  export interface Objective {
    objective: string
    start_date: Date
    end_date: Date
    update_period: UpdatePeriode
    weight: number
    list_key_result: KeyResult[]
  }
}

interface OKRFormProps {
  title?: string
  data: OKRFormData.Objective
  setData(data: OKRFormData.Objective): void
  listCompetency: Competency[]
}

export function OKRForm(props: OKRFormProps) {
  function addOKRItem() {
    props.setData({
      ...props.data,
      list_key_result: [
        ...props.data.list_key_result,
        {
          title: '',
          target: '' as any,
          unit: '',
          update_period: '' as any,
          target_per_period: '' as any,
          weight: '' as any,
          list_competency: []
        },
      ]
    });
  }

  function updateOKRItem(index: number, kvs: {[key: string]: any}) {
    props.setData({
      ...props.data,
      list_key_result: [
        ...props.data.list_key_result.slice(0, index),
        {
          ...props.data.list_key_result[index],
          ...kvs
        },
        ...props.data.list_key_result.slice(index + 1),
      ]
    });
  }

  function removeOKRItem(index: number) {
    props.setData({
      ...props.data,
      list_key_result: [
        ...props.data.list_key_result.slice(0, index),
        ...props.data.list_key_result.slice(index + 1),
      ]
    });
  }

  return (
    <DetailContainer 
      title={props.title}>
      <XForm gap={'16px'} forms={[{
        label: 'Objective',
        key: 'objective',
        placeholder: 'Objective',
        type: 'text',
        value: props.data.objective,
        onChange(objective: string) {
          props.setData({
            ...props.data,
            objective
          });
        },
      }, {
        label: 'Start End Date',
        key: 'start_end_date',
        placeholder: 'Start End Date',
        type: 'range-date',
        start: props.data.start_date,
        end: props.data.end_date,
        onRangeChange(start_date: Date, end_date: Date) {
          props.setData({
            ...props.data,
            start_date,
            end_date
          })
        },
      }, {
        label: 'Weight',
        key: 'weight',
        placeholder: 'Weight OKRs %',
        type: 'number',
        value: props.data.weight,
        max: 100,
        min: 0,
        onChange(weight: number) {
          props.setData({
            ...props.data,
            weight
          });
        },
      }, {
        label: 'Update Period',
        key: 'update_period',
        placeholder: 'Update Period',
        type: 'dropdown',
        options: Object.keys(UpdatePeriode).map((value: string) => ({
          label: value,
          value
        })),
        value: props.data.update_period,
        onChange(update_period: UpdatePeriode) {
          props.setData({
            ...props.data,
            update_period
          });
        }
      }]} />
      <Flex p={'0 36px'}>
        <Flex 
          pl={'15%'}
          direction={'column'}
          gap={'12px'}
          w={'100%'}>
          <Flex
            direction={'column'}
            gap={'12px'}>
            {
              props.data.list_key_result.map((okr_data: OKRFormData.KeyResult, i: number) => (
                <Flex 
                  border={'solid 1px #EEE'}
                  borderRadius={12}
                  p={'12px 18px'}
                  direction={'column'}
                  key={i}>
                  <Flex
                    justify={'flex-end'}
                    mb={'12px'}>
                    <AButton
                      onClick={() => removeOKRItem(i)}
                      variant={'outline'}>
                      Hapus OKR
                    </AButton>
                  </Flex>
                  <XForm 
                    gap={'16px'} 
                    forms={[{
                      label: 'OKRs',
                      key: 'okrs',
                      placeholder: 'Detail OKRs',
                      type: 'text',
                      value: okr_data.title,
                      containerStyle: {
                        padding: 0,
                        paddingLeft: 4
                      },
                      onChange(title: string) {
                        updateOKRItem(i, { title });
                      },
                    }, {
                      label: 'Target (angka)',
                      key: 'target',
                      placeholder: 'Jumlah target yang harus dicapai karyawan',
                      type: 'number',
                      containerStyle: {
                        padding: 0,
                        paddingLeft: 4
                      },
                      value: okr_data.target,
                      onChange(target: number) {
                        updateOKRItem(i, { target });
                      },
                    }, {
                      label: 'Unit',
                      key: 'unit',
                      placeholder: 'Unit Target',
                      type: 'text',
                      containerStyle: {
                        padding: 0,
                        paddingLeft: 4
                      },
                      value: okr_data.unit,
                      onChange(unit: string) {
                        updateOKRItem(i, { unit });
                      },
                    }, {
                      label: 'Periode Update OKR',
                      key: 'update_period',
                      placeholder: 'Pilih periode update OKRs ini',
                      type: 'dropdown',
                      options: Object.keys(UpdatePeriode).map((value: string) => ({
                        label: value,
                        value
                      })),
                      containerStyle: {
                        padding: 0,
                        paddingLeft: 4
                      },
                      value: okr_data.update_period,
                      onChange(update_period: UpdatePeriode) {
                        updateOKRItem(i, { update_period });
                      },
                    }, {
                      label: 'Target per Update',
                      key: 'target_per_update',
                      placeholder: 'Jumlah target yang harus dicapai setiap update',
                      type: 'number',
                      containerStyle: {
                        padding: 0,
                        paddingLeft: 4
                      },
                      value: okr_data.target_per_period,
                      onChange(target_per_period: number) {
                        updateOKRItem(i, { target_per_period });
                      },
                    }, {
                      label: 'Weight',
                      key: 'weight',
                      placeholder: 'Weight OKR %',
                      type: 'number',
                      containerStyle: {
                        padding: 0,
                        paddingLeft: 4
                      },
                      value: okr_data.weight,
                      max: 100,
                      min: 0,
                      onChange(weight: number) {
                        updateOKRItem(i, { weight });
                      },
                    }, {
                      label: 'Competency',
                      key: 'competency',
                      placeholder: 'Pick Competency',
                      type: 'multi-dropdown',
                      options: props.listCompetency.map((c: Competency) => ({
                        label: c.name,
                        value: c.id
                      })),
                      containerStyle: {
                        padding: 0,
                        paddingLeft: 4
                      },
                      values: okr_data.list_competency,
                      onChange(list_competency: number[]) {
                        updateOKRItem(i, { list_competency });
                      },
                    }]} />
                </Flex>
              ))
            }
          </Flex>
          <AButton 
            ml={'4px'}
            w={'100%'}
            mb={'12px'}
            variant={'outline'}
            onClick={addOKRItem}>
            Tambah OKR
          </AButton>
        </Flex>
      </Flex>
    </DetailContainer>
  );
}
