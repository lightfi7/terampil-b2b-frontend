import { Flex, Image, Link, Text } from "@chakra-ui/react";

interface ProfileFloatingCardProps {
  onLogout?(): void
}

export function ProfileFloatingCard(props: ProfileFloatingCardProps) {
  return (
    <Flex 
      bg={'#FFF'}
      boxShadow={'0px 1px 15px rgba(0, 0, 0, .1)'}
      borderRadius={8}
      p={'12px 0'}
      direction={'column'}>
      {/* <Link href={'/main/profile'}>
        <Flex 
          align={'center'}
          gap={'12px'}
          p={'7px 22px'}
          _hover={{
            bg: '#0001'
          }}>
          <Image 
            w={'1.2em'}
            h={'1.2em'}
            objectFit={'contain'}
            src={'/icons/icon-black-profile.svg'} />
          <Text whiteSpace={'nowrap'}>
            Profile
          </Text>
        </Flex>
      </Link> */}
      <Link href={'/main/profile'}>
        <Flex 
          align={'center'}
          gap={'12px'}
          p={'7px 22px'}
          _hover={{
            bg: '#0001'
          }}>
          <Image 
            w={'1.2em'}
            h={'1.2em'}
            objectFit={'contain'}
            src={'/icons/icon-admin-log.svg'} />
          <Text whiteSpace={'nowrap'}>
            Profile
          </Text>
        </Flex>
      </Link>
      <Flex 
        align={'center'}
        gap={'12px'}
        p={'7px 22px'}
        _hover={{
          bg: '#0001'
        }}
        onClick={props.onLogout}>
        <Image 
          w={'1.2em'}
          h={'1.2em'}
          objectFit={'contain'}
          src={'/icons/icon-logout.svg'} />
        <Text whiteSpace={'nowrap'}>
          Logout
        </Text>
      </Flex>
    </Flex>
  );
}
