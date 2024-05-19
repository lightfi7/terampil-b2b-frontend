import { AButton } from '@/components/button/AButton';
import { DashboardCEOData } from '@/components/dashboard-sub-page/DashboardCEO';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const http_dashboard_ceo = useHttp<DashboardCEOData>({
    url: '/dashboard/ceo'
  });
  const [mode, setMode] = useState<'okr' | 'dp'>('okr');
  const [is_hover, setIsHover] = useState<boolean>(false);
  const color_status = (() => {
    const p = mode === 'okr' 
      ? http_dashboard_ceo.result?.okr.percentage ?? 0
      : http_dashboard_ceo.result?.development_progress.percentage ?? 0;
    if (p > 80) {
      return '#00DEBF';
    }
    if (p > 60) {
      return '#F18F01';
    }
    return '#E84F52';
  })();

  async function init() {
    http_dashboard_ceo.get();
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Peta Indonesia'}>
      <Flex 
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}
        mt={'12px'}>
        <Flex
          justify={'space-between'}
          align={'center'}>
          <Flex>
            {/*  */}
          </Flex>
          <Flex
            gap={'12px'}>
            <AButton
              variant={mode === 'okr' ? '' : 'outline'}
              onClick={() => setMode('okr')}
              h={'36px'}
              borderRadius={999}>
              OKRs
            </AButton>
            <AButton
              variant={mode === 'dp' ? '' : 'outline'}
              onClick={() => setMode('dp')}
              h={'36px'}
              borderRadius={999}>
              Development Progress
            </AButton>
          </Flex>
        </Flex>
        <Flex 
          gap={'24px'}
          boxShadow={'0px 6px 10px rgba(0, 0, 0, .1)'}
          bg={'#FFF'}
          borderRadius={24}
          p={'18px'}
          direction={'column'}
          fontSize={'.85em'}>
          <Flex
            position={'relative'}>
            <Image
              src={'/image/peta-indonesia.png'}
              w={'100%'}
              borderRadius={12}
              style={{
                aspectRatio: 2274/956
              }} />
            <Flex
              position={'absolute'}
              top={'65%'}
              left={'23.5%'}
              w={'7%'}
              style={{
                aspectRatio: 1
              }}
              zIndex={2}>
              <Box
                borderRadius={999}
                opacity={.4}
                cursor={'pointer'}
                w={'100%'}
                h={'100%'}
                bg={color_status}
                zIndex={2}
                transition={'200ms'}
                _hover={{
                  opacity: .8
                }}
                onMouseOver={() => setIsHover(true)}
                onMouseOut={() => setIsHover(false)} />
              { is_hover && <Flex
                zIndex={3}
                top={'-100%'}
                position={'absolute'}
                bg={'#FFF'}
                borderRadius={8}
                boxShadow={'0px 1px 15px rgba(0, 0, 0, .1)'}
                direction={'column'}
                whiteSpace={'nowrap'}
                p={'12px 18px'}>
                <Text
                  fontWeight={700}>
                  Jakarta
                </Text>
                <Text>
                  OKR: {http_dashboard_ceo.loading ? '...' : http_dashboard_ceo.result?.okr.percentage?.toFixed(2)}%
                </Text>
                <Text>
                  Development Progress: {http_dashboard_ceo.loading ? '...' : http_dashboard_ceo.result?.development_progress.percentage?.toFixed(2)}%
                </Text>
              </Flex> }
            </Flex>
          </Flex>
          <Flex
            fontSize={'.9em'}
            color={'#999'}
            p={'12px 24px'}>
            <Flex
              flex={1}
              align={'center'}
              gap={'8px'}>
              <Box
                borderRadius={999}
                w={'8px'}
                h={'8px'}
                bg={'#00DEBF'} />
              <Text>
                OKRs di atas 80%
              </Text>
            </Flex>
            <Flex
              flex={1}
              align={'center'}
              gap={'8px'}>
              <Box
                borderRadius={999}
                w={'8px'}
                h={'8px'}
                bg={'#F18F01'} />
              <Text>
                OKRs diantara 61-79%
              </Text>
            </Flex>
            <Flex
              flex={1}
              align={'center'}
              gap={'8px'}>
              <Box
                borderRadius={999}
                w={'8px'}
                h={'8px'}
                bg={'#E84F52'} />
              <Text>
                OKRs dibawah 60%
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
