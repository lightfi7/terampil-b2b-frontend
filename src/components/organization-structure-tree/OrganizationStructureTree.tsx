import { Flex, list, Text } from "@chakra-ui/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { flattenTree, generateTree, genNodeID, OSNodeData } from "./node.utility";
import { OSNode } from "./OSNode";

interface OrganizationStructureTreeProps {
  data: OSNodeData[]
  setData?(data: OSNodeData[]): void
  onNodeClick?(node: OSNodeData): void
  onDeleteNodes?(node: OSNodeData[]): void
  renderContent?(node: OSNodeData): any
}

export function OrganizationStructureTree(props: OrganizationStructureTreeProps) {
  const scroll_ref = useRef();
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const [w, setW] = useState<number>(0);
  const root_node = generateTree(props.data);
  const [scroll_pos, setScrollPos] = useState<number[]>([0, 0]); // contains [x, y]

  function addNewChildren(parent_id: string) {
    const new_node: OSNodeData = {
      id: genNodeID(),
      parent_id,
      label: '',
      position: '',
      photo: '',
      pic: '',
      list_job_profile: []
    };

    props.setData && props.setData([
      ...props.data,
      new_node
    ]);
  }

  function deleteNode(node_id: string) {
    const node = props.data.find((node: OSNodeData) => node.id == node_id);
    if (!node) {
      return;
    }

    if (node.label && !confirm(`Anda yakin ingin menghapus "${node.label}"? Aksi ini akan menghapus seluruh Karyawan, OKR, dan Kompetensi pada struktur organisasi tersebut`)) {
      return;
    }

    const tree = generateTree(props.data, node);
    if (!tree) {
      return;
    }
    const flatten_nodes: OSNodeData[] = flattenTree(tree);
    const list_id = flatten_nodes.map((node: OSNodeData) => node.id);
    props.setData && props.setData(props.data.filter((node: OSNodeData) => !list_id.includes(node.id)));
    props.onDeleteNodes && props.onDeleteNodes(flatten_nodes);
  }

  function onNodeClick(node_id: string) {
    const node = props.data.find((node: OSNodeData) => node.id == node_id);
    if (!node) {
      return;
    }

    props.onNodeClick && props.onNodeClick(node);
  }

  function getPosition() {
    const x = (scroll_ref.current as any)?.scrollLeft ?? 0;
    const y = (scroll_ref.current as any)?.scrollTop ?? 0;
    setScrollPos([x, y]);
    setW((scroll_ref.current as any)?.scrollWidth);
  }

  useEffect(() => {
    getPosition();
  }, [scroll_ref]);

  useEffect(() => {
    if (!scroll_ref.current) {
      return;
    }
    (scroll_ref.current as any).addEventListener("scroll", getPosition);
    return () => {
      (scroll_ref.current as any).removeEventListener("scroll", getPosition);
    }
  }, [scroll_ref.current]);

  useEffect(() => {
    forceUpdate();
  }, [props.data]);

  return (
    <Flex
      p={'24px'}
      pb={0}
      pt={'42px'}
      overflowX={'auto'}
      ref={scroll_ref as any}>
      <Flex
        flex={1}
        justify={'center'}>
        <OSNode 
          renderContent={props.renderContent}
          scrollPosition={scroll_pos}
          data={root_node}
          onAddNewChildren={addNewChildren}
          onDeleteNode={deleteNode}
          onClick={onNodeClick}
          hideAdd={Boolean(!props.setData)} />
      </Flex>
    </Flex>
  );
}
