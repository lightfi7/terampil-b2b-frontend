import { AButton } from "@/components/button/AButton";
import { XInputPassword } from "@/components/form/input/XInputPassword";
import { XInputText } from "@/components/form/input/XInputText";
import { RoleSBType } from "@/components/role-switch-button/RoleSwitchButton";
import { Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { useSidebarMode, useTokenCookie } from "cookies.util";
import { useEffect, useState } from "react";

interface LoginPageProps {}

export namespace LoginDTO {
  export interface LoginRequestData {
    email: string
    password: string
  }

  export interface LoginResponseData {
    token: string
    has_onboarding: boolean
  }
}

export default function LoginPage() {
  const cookie = useTokenCookie();
  const sidebar = useSidebarMode();

  const [login_data, setLoginData] = useState<LoginDTO.LoginRequestData>({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  async function login() {
    setLoading(true);
    try {
      const res: LoginDTO.LoginResponseData = (await axios.post('/login', login_data)).data;
      cookie.setToken(res.token);
      sidebar.setSidebarMode(RoleSBType.PERSONAL);
      window.location.href = res?.has_onboarding ? '/main' : '/onboarding/first';
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (cookie.isLoggedIn()) {
      window.location.href = '/main';
    }
  }, []);

  return (
    <Flex 
      w={'100%'}
      minH={'100vh'}
      h={'100vh'}
      bg={'#F5F6F8'}>
      <Flex
        position={'fixed'}
        bottom={0}
        right={0}
        h={'100%'}
        w={'50%'}>
        <Image
          objectFit={'contain'}
          objectPosition={'bottom'}
          h={'65%'}
          src={'/image/bg-login-2.png'} />
      </Flex>
      <Flex
        position={'fixed'}
        bottom={0}
        left={0}
        h={'100%'}
        w={'100%'}>
        <Image
          w={'100%'}
          objectFit={'contain'}
          objectPosition={'bottom'}
          h={'97%'}
          src={'/image/bg-login-1.png'} />
      </Flex>
      <Flex
        pt={'24px'}
        position={'absolute'}
        ml={'100px'}>
        <Image 
          w={'180px'}
          h={'30px'}
          objectFit={'contain'}
          src={'/icons/light/logo.png'} />
      </Flex> 
      <Flex
        direction={'column'}
        ml={'100px'}
        justify={'center'}
        pt={'24px'}
        zIndex={2}>
        <Flex
          direction={'column'}
          gap={'24px'}>
          <Text
            fontWeight={700}
            fontSize={'2em'}>
            Login And <span style={{ color: '#0093BC' }}>Explore</span> our<br/>Intelligent LXP
          </Text>
          <Text
            fontSize={'.85em'}>
            Access to our Corporate Learning Experience Platform and<br/>Discover the importance of people development.
          </Text>
          <Flex 
            p={'55px 30px'}
            bg={'#FFF'}
            borderRadius={24}
            boxShadow={'0px 15px 30px rgba(0, 0, 0, .1)'}
            h={'auto'}
            gap={'16px'}
            direction={'column'}
            w={'450px'}>
            <Flex
              direction={'column'}
              gap={'2px'}>
              <Text
                fontSize={'.8em'}
                color={'#AAAAAA'}>
                Email Address
              </Text>
              <XInputText
                containerStyle={{ padding: 0 }} 
                key={"a"}
                placeholder={'Email'}
                value={login_data.email}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    login();
                  }
                }}
                onChange={(email: string) => {
                  setLoginData({
                    ...login_data,
                    email
                  });
                }} />
            </Flex>
            <Flex
              direction={'column'}
              gap={'2px'}>
              <Text
                fontSize={'.8em'}
                color={'#AAAAAA'}>
                Password
              </Text>
              <XInputPassword 
                containerStyle={{ padding: 0 }} 
                key={"a"}
                placeholder={'Password'} 
                type={"password"}
                value={login_data.password}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    login();
                  }
                }}
                onChange={(password: string) => {
                  setLoginData({
                    ...login_data,
                    password
                  });
                }} />
            </Flex>
            <Flex
              justify={'flex-end'}>
              <Text
                fontSize={'.8em'}
                color={'#AAAAAA'}>
                Forgot my password?
              </Text>
            </Flex>
            <AButton
              h={'36px'}
              onClick={login}>
              Sign in
            </AButton>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}