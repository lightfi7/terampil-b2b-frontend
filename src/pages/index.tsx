import { Template } from '@/template';
import { Flex } from '@chakra-ui/react';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

export default function Home() {
  return (
    <Template>
      <Flex p={'24px'}>
        This is admin
      </Flex>
    </Template>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> {
  return {
    redirect: {
      destination: '/login',
      permanent: false
    }
  };
}
