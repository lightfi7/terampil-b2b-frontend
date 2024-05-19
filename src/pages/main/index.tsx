import { DashboardCEO, DashboardCEOData } from '@/components/dashboard-sub-page/DashboardCEO';
import { DashboardPersonal, DashboardPersonalData } from '@/components/dashboard-sub-page/DashboardPersonal';
import { DashboardSuperior } from '@/components/dashboard-sub-page/DashboardSuperior';
import { RoleSBType, RoleSwitchButton } from '@/components/role-switch-button/RoleSwitchButton';
import { useHttp } from '@/hooks/useHttp';
import { TemplateAuth } from '@/template-auth';
import { Flex } from '@chakra-ui/react';
import { useEffect } from 'react';
import { getServerSideProps, useSidebarMode, WithAdminPageProps } from '../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  const { mode, setSidebarMode } = useSidebarMode();

  const http_dashboard_personal = useHttp<DashboardPersonalData>({
    url: '/dashboard/personal'
  });

  const http_dashboard_ceo = useHttp<DashboardCEOData>({
    url: '/dashboard/ceo'
  });

  const http_dashboard_team = useHttp<DashboardCEOData>({
    url: '/dashboard/team'
  });

  async function init() {
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Dashboard'}>
      <Flex 
        direction={'column'}
        gap={'24px'}
        p={'0 12px'}>
        <Flex 
          position={'relative'}
          mt={'12px'}
          color={'#FFF'}>
          <RoleSwitchButton
            active={mode}
            setActive={setSidebarMode}
            isSuperior={props.admin.is_superior || props.admin.is_creator || props.admin.job_profile?.is_organization_head}
            isCEO={props.admin.is_ceo || props.admin.is_creator}
            isHR={props.admin.is_hr || props.admin.is_creator} />
        </Flex>
        { mode === RoleSBType.PERSONAL && <DashboardPersonal
          summary={http_dashboard_personal} /> }
        { mode === RoleSBType.CEO && <DashboardCEO
          summary={http_dashboard_ceo} /> }
        { mode === RoleSBType.HR && <DashboardCEO
          summary={http_dashboard_ceo} /> }
        { mode === RoleSBType.TEAM && <DashboardSuperior
          summary={http_dashboard_team} /> }
        <br/>
        <br/>
        <br/>
      </Flex>
    </TemplateAuth>
  );
}
