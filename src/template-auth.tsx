import { Flex } from '@chakra-ui/react';
import axios from 'axios';
import { initAuthorizationToken, useTokenCookie } from 'cookies.util';
import { Employee } from 'data-design/src/entity/Employee.entity';
import { useState } from 'react';
import { HelpDeskContact } from './components/HelpDeskContact';
import { NavbarAuth } from './components/navbar/NavbarAuth';
import { PoweredByTerampil } from './components/PoweredByTerampil';
import { Sidebar } from './components/sidebar/Sidebar';

interface TemplateAuthProps {
  children?: any;
  admin: Employee;
  title?: string;
  noSidebar?: boolean;
  noPadding?:boolean;
  p?: string | number
}

export function TemplateAuth(props: TemplateAuthProps) {
  const cookie = useTokenCookie();
  initAuthorizationToken(cookie.getToken());

  return (
    <Flex 
      direction={'row'}
      h={'100vh'}
      minH={'100vh'}
      w={'100vw'}
      bg={'#FBFAFA'}
      flex={1}>
      { !props.noSidebar && <Flex
        h={'100%'}
        zIndex={999}
        bg={'#FFF'}>
        <Sidebar 
          admin={props.admin} />
      </Flex> }
      <Flex 
        flex={1}
        direction={'column'}
        bg={'#FBFAFA'}
        w={0}
        gap={'12px'}>
        <NavbarAuth 
          admin={props.admin}
          title={props.title}
          withLogo={props.noSidebar} />
        <Flex 
          direction={'column'}
          flex={1}
          overflow={'auto'}
          gap={'24px'}
          overflowY={'auto'}>
          { props.children }
          <PoweredByTerampil />
          <HelpDeskContact />
          <br/>
        </Flex>
      </Flex>
    </Flex>
  );
}
