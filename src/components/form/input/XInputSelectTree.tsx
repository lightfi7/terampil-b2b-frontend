import CreatableSelect from 'react-select/creatable';
import Select, { SingleValue } from 'react-select';
import { CSSProperties, useEffect, useRef, useState } from "react";
import { OptionData, XFormItem, XFormItemDropdown, XFormItemSelectTree } from "../interface";
import { XFormLabel } from "../XFormLabel";
import { SelectTree } from '@/components/select-tree/SelectTree';
import { EmployeeDBPreviewDTO } from '@/pages/onboarding/employee-database-preview';
import { OrganizationNode } from 'data-design/src/entity/OrganizationNode.entity';
import { dfsGeneral, generateTreeGeneral } from '@/components/organization-structure-tree/node.utility';
import { Flex, Input } from '@chakra-ui/react';
import { useOutsideClick } from '@/hooks/useOutsideAlerter';

interface XInputSelectTreeProps extends XFormItemSelectTree {
}

export function XInputSelectTree(props: XInputSelectTreeProps) {
  const ref = useRef(null);
  useOutsideClick(ref, () => setOpen(false));
  const [open, setOpen] = useState<boolean>(false);
  const selected_option = dfsGeneral<EmployeeDBPreviewDTO.Tree>(
    props.treeData.root!, 
    t => t.org_node.id == props.treeData.selected,
    t => t.org_node.id,
    t => t.children
  );
  
  useEffect(() => {
    props.onChange && props.onChange(props.treeData.selected);
  }, [props.treeData.selected]);

  return (
    <XFormLabel 
      prefix={props.prefix}
      label={props.label}
      required={props.required}
      style={props.containerStyle}
      columnMode={props.columnMode}
      labelWidth={props.labelWidth}>
      <Input 
        disabled={props.disabled}
        border={'solid 1.8px #C7C9D9'}
        type={'text'}
        value={selected_option?.org_node.name}
        fontSize={'.8em'}
        p={'12px 18px'}
        bg={'#FFF'}
        cursor={'pointer'}
        _placeholder={{
          color: 'gray.400'
        }}
        onKeyDown={props.onKeyDown}
        placeholder={props.placeholder}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        style={props.style}
        readOnly />
      <Flex
        position={'relative'}
        ref={ref}>
        { open && <Flex
          position={'absolute'}
          zIndex={9999}
          bg={'#FFF'}
          minW={'100%'}
          boxShadow={'0px 1px 25px #00000022'}>
          <SelectTree<EmployeeDBPreviewDTO.Tree>
            single
            data={props.treeData.root}
            selected={[props.treeData.selected]}
            onSelected={(ns: number[]) => {
              props.treeData.onSelected(ns);
              setOpen(false);
            }}
            getID={x => x.org_node.id}
            getLabel={x => x.org_node.name}
            getChildren={x => x.children} />
        </Flex> }
      </Flex>
    </XFormLabel>
  );
}

export interface SelectTreeData<T extends EmployeeDBPreviewDTO.Tree> {
  selected: number
  root?: T
  setRoot(t: T): void
  onSelected(id: number[]): void
}

export function useSelectTreeData<T extends EmployeeDBPreviewDTO.Tree>(list_org?: OrganizationNode[]): SelectTreeData<T> {
  const [root, setRoot] = useState<T>();
  const [selected, setSelectedOrgID] = useState<number>(-1);
  
  function onSelected(list_id: number[]) {
    setSelectedOrgID(list_id[0]);
  }

  useEffect(() => {
    if (!list_org || list_org.length === 0) {
      return;
    }
    const list_org_node: EmployeeDBPreviewDTO.Tree[] = list_org.map((o: OrganizationNode) => ({
      org_node: o,
      children: []
    }));
    const tree_org_root: EmployeeDBPreviewDTO.Tree = generateTreeGeneral<EmployeeDBPreviewDTO.Tree>(
      list_org_node, 
      (x: EmployeeDBPreviewDTO.Tree) => x.org_node.id,
      (x: EmployeeDBPreviewDTO.Tree) => x.org_node.parent?.id,
      (root: EmployeeDBPreviewDTO.Tree, children: EmployeeDBPreviewDTO.Tree[]) => {
        root.children = children;
      }
    );
  
    setRoot(tree_org_root as T);
    setSelectedOrgID(tree_org_root.org_node.id);
  }, [list_org]);

  return {
    selected, 
    root, 
    setRoot,
    onSelected
  }
}
