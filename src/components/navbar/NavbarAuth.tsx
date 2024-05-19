import { useHttp } from "@/hooks/useHttp";
import { useOutsideClick } from "@/hooks/useOutsideAlerter";
import { Box, Flex, Image, Link, Skeleton, Text } from "@chakra-ui/react";
import axios from "axios";
import { useTokenCookie } from "cookies.util";
import { Employee } from "data-design/src/entity/Employee.entity";
import { Notification } from "data-design/src/entity/Notification.entity";
import { useEffect, useRef, useState } from "react";
import { currencyFormatter } from "../input-number";
import { NotificationFloating } from "../notification-floating/NotificationFloating";
import { ProfileFloatingCard } from "../profile-floating-card/ProfileFloatingCard";

interface NavbarAuthProps {
  admin: Employee
  title?: string
  withLogo?: boolean
}

export function NavbarAuth(props: NavbarAuthProps) {
  const cookie = useTokenCookie();
  const [show_floating_profile, setShowFloatingProfile] = useState<boolean>(false);
  const [show_notification, setShowNotification] = useState<boolean>(false);
  const ref = useRef(null);
  useOutsideClick(ref, () => setShowNotification(false));

  const http_notification = useHttp<Notification[]>({
    url: '/notification'
  });

  const http_notification_mark = useHttp<boolean>({
    url: '/notification/:id',
    callback: http_notification.get
  });

  const unread_notif_count = (http_notification.result ?? []).filter(x => !x.is_read).length;

  function logout() {
    cookie.removeToken();
    location.href = '/';
  }

  function markRead(notif: Notification) {
    http_notification_mark.put({}, {
      params: {
        id: notif.id
      }
    });
  }

  useEffect(() => {
    if (show_notification) {
      http_notification.get();
    }
  }, [show_notification]);

  useEffect(() => {
    http_notification.get();
  }, []);

  return (
    <Flex 
      pt={'12px'}
      pl={'12px'}
      pr={'12px'}>
      <Flex 
        zIndex={999}
        w={'100%'}
        bg={'#FFF'}
        borderRadius={8}
        alignItems={'center'}
        justify={'space-between'}
        p={'16px 30px'}
        bgGradient={'linear-gradient(271deg, #005CB9 -9.99%, #01A8BD 90.68%, #01C8BE 117.17%)'}>
        { !props.withLogo && <Text
          whiteSpace={'nowrap'}
          color={'#FFF'}
          fontSize={'1.2em'}
          fontWeight={700}>
          { props.title }
        </Text> }
        { props.withLogo && <Link href={'/main'}>
          <Image
            w={'auto'}
            h={'3em'}
            ml={'3%'}
            mt={'1.5px'}
            objectFit={'contain'}
            src={props.admin.company.logo ?? '/logo-white.png'} />
        </Link> }
        <Flex 
          justify={'flex-end'}
          align={'center'}
          w={'100%'}
          gap={'12px'}>
          <Flex
            position={'relative'}>
            <Flex
              position={'relative'}
              align={'center'}>
              <Image 
                h={'28px'}
                w={'28px'}
                borderRadius={999}
                cursor={'pointer'}
                src={'/icons/light/icon-notif-new.svg'}
                objectFit={'cover'}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowNotification(!show_notification);
                }} />
              {/* <Text
                fontWeight={unread_notif_count > 0 ? 700 : 400}
                color={unread_notif_count > 0 ? 'red.500' : ''}>
                { unread_notif_count }
              </Text> */}
              { unread_notif_count > 0 && <Box
                position={'absolute'}
                right={'3px'}
                w={'8px'}
                h={'8px'}
                borderRadius={999}
                mt={'-5px'}
                bg={'red'} /> }
            </Flex>
            <Flex
              ref={ref}
              opacity={show_notification ? 1 : 0}
              transition={'opacity 250ms, top 250ms'}
              position={'absolute'}
              top={show_notification ? '100%' : '0%'}
              right={show_notification ? '-35px' : 9999}>
              <NotificationFloating
                data={http_notification.result}
                onClick={markRead}
                loading={http_notification.loading} />
            </Flex>
          </Flex>
          <Flex 
            align={'center'}
            gap={'12px'}
            cursor={'pointer'}
            position={'relative'}
            color={'#FFF'}
            onMouseOver={() => setShowFloatingProfile(true)}
            onMouseLeave={() => setShowFloatingProfile(false)}>
            <Image 
              h={'38px'}
              w={'38px'}
              borderRadius={999}
              bg={'#EEE'}
              objectFit={'cover'}
              src={props.admin.photo} />
            <Flex 
              direction={'column'}
              align={'flex-start'}>
              <Text
                fontSize={'.9em'}
                fontWeight={500}>
                { props.admin.name }
              </Text>
              <Text 
                fontSize={'.78em'}>
                { props.admin.is_creator ? 'Super Admin' : (props.admin.job_profile?.name ?? '') }
              </Text>
            </Flex>
            { show_floating_profile && <Flex 
              position={'absolute'}
              top={'100%'}
              w={'180px'}
              color={'#000'}
              right={'-36px'}
              pt={'12px'}>
              <ProfileFloatingCard onLogout={logout} />
            </Flex> }
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
