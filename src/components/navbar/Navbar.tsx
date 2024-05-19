import { Flex, Image, Link } from "@chakra-ui/react";
import { useTokenCookie } from "cookies.util";
import { useEffect, useState } from "react";
import { AButton } from "../button/AButton";

interface NavbarProps {}

const LIST_MENU = [{
  label: 'Home',
  url: '/'
}, {
  label: 'Product',
  url: '/product'
}, {
  label: 'Our Services',
  url: '/our-services'
}, {
  label: 'Contact Us',
  url: '/contact-us'
}];

export function Navbar(props: NavbarProps) {
  const [has_logged_in, setHasLoggedIn] = useState<boolean>(false);
  const cookie = useTokenCookie();

  useEffect(() => {
    setHasLoggedIn(cookie.getToken() ? true : false);
  }, [cookie.getToken()]);

  return (
    <Flex 
      position={'sticky'}
      top={0}
      left={0}
      w={'100%'}
      bg={'#FFF'}
      align={'center'}
      justify={'space-between'}
      p={'12px 36px'}
      boxShadow={'0px 1px 12px rgba(0, 0, 0, .1)'}>
      <Flex align={'center'}>
        <Link href={'/'}>
          <Image 
            h={'24px'} />
        </Link>
      </Flex>
      <Flex 
        align={'center'}
        gap={'16px'}>
        { has_logged_in && <>
          <AButton 
            onClick={() => window.location.href = '/main'}
            rightIcon={<Image src={'/icons/arrow-right.svg'} />}>
            Dashboard
          </AButton>
        </> }
        { !has_logged_in && <>
          <AButton 
            onClick={() => window.location.href = '/login'}
            rightIcon={<Image src={'/icons/arrow-right.svg'} />}>
            Login
          </AButton>
        </> }
      </Flex>
    </Flex>
  );
}
