import { Box, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { useSidebarMode } from "cookies.util";
import { Employee } from "data-design/src/entity/Employee.entity";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RoleSBType } from "../role-switch-button/RoleSwitchButton";
import { ItemSidebar, ItemSidebarProps } from "./ItemSidebar";
import { SIDEBAR_CEO, SIDEBAR_HR, SIDEBAR_PERSONAL, SIDEBAR_TEAM } from "./sidebar.data";

interface SidebarProps {
  admin: Employee
}

export function Sidebar(props: SidebarProps) {
  const { mode } = useSidebarMode();
  const initial_sidebar_data = getSidebarData();
  const [sidebar, setSidebar] = useState<ItemSidebarProps[]>([]);

  function getSidebarData() {
    switch (mode) {
      case RoleSBType.CEO: return SIDEBAR_CEO;
      case RoleSBType.TEAM: return SIDEBAR_TEAM;
      case RoleSBType.HR: return SIDEBAR_HR;
      default: return SIDEBAR_PERSONAL;
    }
  }

  useEffect(() => {
    setSidebar(initial_sidebar_data);
  }, [initial_sidebar_data]);

  return (
    <Flex 
      h={'100%'}
      minH={'100%'}
      maxH={'100%'}
      boxShadow={'0px 2px 12px rgba(0, 0, 0, .1)'}
      direction={'column'}>
      <Flex
        bg={'white'}
        borderRadius={8}
        borderBottomLeftRadius={0}
        borderBottomRightRadius={0}
        p={'24px'}
        pb={'0px'}
        mb={'-12px'}
        justify={'center'}>
        <Image
          w={'auto'}
          h={'3em'}
          mt={'1.5px'}
          objectFit={'contain'}
          src={props.admin.company.logo ?? '/icons/light/logo.png'} />
      </Flex>
      <Flex
        bg={'white'}
        overflowY={'auto'}
        borderRadius={8}
        borderTopLeftRadius={0}
        borderTopRightRadius={0}>
        <Flex 
          pt={'18px'}
          direction={'column'}>
          {
            sidebar.map((isp: ItemSidebarProps, j: number) => (
              <ItemSidebar 
                key={j} 
                listPermission={[]}
                {...isp} />
            ))
          }
        </Flex>
      </Flex>
    </Flex>
  );
}
