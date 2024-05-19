import { EmployeeDBPreviewDTO } from "@/pages/onboarding/employee-database-preview";
import { Flex } from "@chakra-ui/react";
import axios from "axios";
import { OrganizationNode } from "data-design/src/entity/OrganizationNode.entity";
import { useEffect, useState } from "react";
import { generateTreeGeneral } from "../organization-structure-tree/node.utility";
import { SelectTree } from "../select-tree/SelectTree";
import { GeneralContainer, GeneralContainerProps } from "./GeneralContainer";

interface GeneralContainerWithTreeOrgProps extends GeneralContainerProps {
}

export function GeneralContainerWithTreeOrg(props: GeneralContainerWithTreeOrgProps) {
  const [root_org, setRootOrg] = useState<EmployeeDBPreviewDTO.Tree>();
  const [selected_org_id, setSelectedOrgID] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);

  async function init() {
    setLoading(true);
    try {
      const list_org: OrganizationNode[] = (await axios.get('/onboarding/existing-organization-structure')).data;
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
      setRootOrg(tree_org_root);
      setSelectedOrgID(tree_org_root.org_node.id);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <GeneralContainer {...props}>
      <Flex
        gap={'12px'}>
        <Flex
          flex={1}
          border={'solid 1px #DDD'}
          bg={'#FFF'}
          px={'8px'}>
          <SelectTree<EmployeeDBPreviewDTO.Tree>
            single
            data={root_org}
            selected={[selected_org_id]}
            onSelected={(list_id: number[]) => setSelectedOrgID(list_id[0])}
            getID={x => x.org_node.id}
            getLabel={x => x.org_node.name}
            getChildren={x => x.children} />
        </Flex>
        <Flex flex={3}>
          { props.children }
        </Flex>
      </Flex>
    </GeneralContainer>
  );
}
