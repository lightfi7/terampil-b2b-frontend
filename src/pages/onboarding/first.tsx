import { AButton } from '@/components/button/AButton';
import { DetailContainer } from '@/components/detail-container/DetailContainer';
import { DetailNavigation } from '@/components/detail-navigation/DetailNavigation';
import { XForm } from '@/components/form/XForm';
import { TemplateAuth } from '@/template-auth';
import { Button, Flex, Image, Link, Text } from '@chakra-ui/react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../cookies.util';
export { getServerSideProps };

export namespace OnboardingFirstDTO {
  export enum IndustrySectors {
    'Agriculture' = 'Agriculture',
    'Basic Metal Production ' = 'Basic Metal Production ',
    'Chemical Industries ' = 'Chemical Industries ',
    'Commerce ' = 'Commerce ',
    'Construction ' = 'Construction ',
    'Education ' = 'Education ',
    'Financial Services' = 'Financial Services',
    'Food' = 'Food',
    'Forestry' = 'Forestry',
    'Health Services ' = 'Health Services ',
    'Hotels' = 'Hotels',
    'Mining' = 'Mining',
    'Mechanical and Electrical Engineering ' = 'Mechanical and Electrical Engineering ',
    'Media' = 'Media',
    'Oil and Gas Production' = 'Oil and Gas Production',
    'Postal and Telecommunications Services ' = 'Postal and Telecommunications Services ',
    'Public Service ' = 'Public Service ',
    'Shipping' = 'Shipping',
    'Textiles' = 'Textiles',
    'Transport' = 'Transport',
    'Transport Equipment Manufacturing ' = 'Transport Equipment Manufacturing ',
    'Utilities' = 'Utilities',
  }

  export interface OnboardingPICData {
    name: string
    position: string
    email: string
    phone_number: string
  }

  export interface OnboardingFirstRequestData {
    name: string
    address: string
    nib: string
    npwp: string
    brand: string
    industry: string
    total_employee: number
    logo: string
    list_pic: OnboardingPICData[]
    password: string
    repassword: string
  }
}

export default function(props: WithAdminPageProps) {
  const router = useRouter();
  const [data, setData] = useState<OnboardingFirstDTO.OnboardingFirstRequestData>({
    name: props.admin.company.name ?? '',
    address: props.admin.company.address ?? '',
    nib: props.admin.company.nib ?? '',
    npwp: props.admin.company.npwp ?? '',
    brand: props.admin.company.brand ?? '',
    industry: props.admin.company.industry ?? '',
    total_employee: props.admin.company.total_employees ?? 0,
    logo: props.admin.company.logo ?? '',
    password: '',
    repassword: '',
    list_pic: props.admin.company.list_pic,
  });
  const [loading, setLoading] = useState<boolean>(false);

  async function init() {
    setLoading(true);
    try {
      // setListRole((await axios.get('/role')).data.data);
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  async function submit() {
    setLoading(true);
    try {
      await axios.post(`/onboarding/company-profile`, data);
      window.location.href = '/onboarding/organization-structure';
    } catch (err: any) {
      alert(err.response.data.toString());
    } finally {
      setLoading(false);
    }
  }

  function setPIC(i: number, pic: OnboardingFirstDTO.OnboardingPICData) {
    setData({
      ...data,
      list_pic: [
        ...data.list_pic.slice(0, i),
        pic,
        ...data.list_pic.slice(i + 1)
      ]
    });
  }

  function deletePIC(i: number) {
    setData({
      ...data,
      list_pic: [
        ...data.list_pic.slice(0, i),
        ...data.list_pic.slice(i + 1)
      ]
    })
  }

  function addPIC() {
    setData({
      ...data,
      list_pic: [
        ...data.list_pic,
        {
          name: '',
          position: '',
          email: '',
          phone_number: '',
        }
      ]
    })
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      title={'Tambah Training Wajib untuk Karyawan'}
      admin={props.admin}
      p={0}
      noSidebar>
      <Flex
        direction={'column'}>
        <Flex
          w={'100%'}
          h={'34vw'}
          position={'relative'}>
          <Image 
            zIndex={0}
            w={'100%'}
            h={'100%'}
            objectFit={'cover'}
            position={'absolute'}
            top={0}
            left={0}
            src={'/image/onboarding-1.png'} />
          <Flex
            zIndex={1}
            align={'center'}
            justify={'center'}
            w={'100%'}
            direction={'column'}
            color={'white'}>
            <Image 
              mt={'-36px'}
              mb={'24px'}
              w={'190px'}
              h={'100px'}
              objectFit={'contain'}
              src={'/logo-white.png'} />
            <Text
              fontSize={'1.6em'}
              fontWeight={600}>
              We Help You Solve the Greatest Business Challenge
            </Text>
            <Text
              fontSize={'2.4em'}
              fontWeight={700}
              borderBottom={'solid 1px #FFF9'}
              pb={'6px'}
              mb={'12px'}>
              The People
            </Text>
            <Text
              color={'#FFF9'}
              pb={'12px'}>
              www.terampil.biz
            </Text>
          </Flex>
        </Flex>
        <Flex 
          direction={'column'}
          gap={'12px'}
          padding={'0 32px'}>
          <Text
            fontWeight={700}
            fontSize={'1.9em'}
            alignSelf={'center'}
            m={'36px 0'}
            mt={'48px'}>
            Company Registration
          </Text>
          <DetailContainer 
            title={
              <>
                <span style={{ color: '#000', marginRight: 4, marginLeft: 36 }}>
                  Isi form ini
                </span>
                <span style={{ fontWeight: 400, fontSize: 13 }}>
                  (Perhatikan detail, hindari kesalahan dalam penulisan)
                </span>
              </>
            }>
            <XForm 
              gap={'16px'} 
              labelWidth={'17.5%'}
              forms={[{
                label: 'Company Registration Name',
                key: 'name',
                placeholder: 'Ketik Nama Perusahaan',
                type: 'text',
                value: data.name,
                onChange(name: string) {
                  setData({
                    ...data,
                    name
                  });
                },
              }, {
                label: 'Address',
                key: 'address',
                placeholder: 'Ketik Alamat Lengkap Perusahaan',
                type: 'textarea',
                value: data.address,
                onChange(address: string) {
                  setData({
                    ...data,
                    address
                  });
                },
              }, {
                label: 'NIB No',
                key: 'nib',
                placeholder: 'Ketik Nomor Induk Berusaha',
                type: 'text',
                value: data.nib,
                onChange(nib: string) {
                  setData({
                    ...data,
                    nib
                  });
                },
              }, {
                label: 'NPWP No',
                key: 'npwp',
                placeholder: 'Ketik Nomor Pokok Wajib Pajak',
                type: 'text',
                value: data.npwp,
                onChange(npwp: string) {
                  setData({
                    ...data,
                    npwp
                  });
                },
              }, {
                label: 'Brand',
                key: 'brand',
                placeholder: 'Ketik Nama Brand',
                type: 'text',
                value: data.brand,
                onChange(brand: string) {
                  setData({
                    ...data,
                    brand
                  });
                },
              }, {
                label: 'Industry',
                key: 'industry',
                placeholder: 'Pilih Industri',
                type: 'dropdown',
                value: data.industry,
                onChange(industry: string) {
                  setData({
                    ...data,
                    industry
                  });
                },
                options: Object.keys(OnboardingFirstDTO.IndustrySectors).map(value => ({ value, label: value }))
              }, {
                label: 'Total Employee',
                key: 'number_of_employee',
                placeholder: 'Ketik Total Jumlah Karyawan',
                type: 'number',
                value: data.total_employee,
                onChange(total_employee: number) {
                  setData({
                    ...data,
                    total_employee
                  });
                },
              }, {
                label: 'Logo',
                key: 'logo',
                placeholder: 'Upload Logo',
                type: 'file'
              }]} />
            <Flex
              direction={'column'}
              gap={'24px'}
              p={'12px 0'}
              pb={'24px'}>
              {
                data.list_pic.map((pic: OnboardingFirstDTO.OnboardingPICData, i: number) => (
                  <Flex
                    key={i}
                    direction={'column'}
                    pl={'8%'}
                    gap={'8px'}>
                    <Flex 
                      ml={'20%'}
                      align={'center'}
                      gap={'8px'}>
                      <Text>
                        PIC { i + 1 }
                      </Text>
                      <Button 
                        onClick={() => deletePIC(i)}
                        colorScheme={'red'}
                        h={'24px'}
                        fontWeight={400}
                        fontSize={'.9em'}>
                        Hapus
                      </Button>
                    </Flex>
                    <XForm 
                      gap={'16px'} 
                      labelWidth={'17.5%'}
                      forms={[{
                        label: 'Name',
                        key: 'name',
                        placeholder: 'Ketik People in Charge',
                        type: 'text',
                        value: pic.name,
                        onChange(name: string) {
                          setPIC(i, {
                            ...pic,
                            name
                          });
                        },
                      }, {
                        label: 'Position',
                        key: 'position',
                        placeholder: 'Ketik Posisi PIC',
                        type: 'text',
                        value: pic.position,
                        onChange(position: string) {
                          setPIC(i, {
                            ...pic,
                            position
                          });
                        },
                      }, {
                        label: 'Email',
                        key: 'email',
                        placeholder: 'Ketik Email PIC',
                        type: 'text',
                        value: pic.email,
                        onChange(email: string) {
                          setPIC(i, {
                            ...pic,
                            email
                          });
                        },
                      }, {
                        label: 'Phone No.',
                        key: 'phone_number',
                        placeholder: 'Ketik Nomor Telepon atau Mobile PIC',
                        type: 'text',
                        value: pic.phone_number,
                        onChange(phone_number: string) {
                          setPIC(i, {
                            ...pic,
                            phone_number
                          });
                        },
                      }]} />
                  </Flex>
                ))
              }
              <Flex
                justify={'flex-end'}
                pr={'36px'}>
                <Button
                  onClick={addPIC}>
                  Tambah PIC
                </Button>
              </Flex>
            </Flex>
            <XForm 
              gap={'16px'} 
              labelWidth={'17.5%'}
              forms={[{
                label: 'Password',
                key: 'password',
                placeholder: 'Ketik Kata Sandi',
                type: 'password',
                value: data.password,
                onChange(password: string) {
                  setData({
                    ...data,
                    password
                  });
                },
              }, {
                label: 'Re-type Password',
                key: 're-password',
                placeholder: 'Ketik Ulang Kata Sandi',
                type: 'password',
                value: data.repassword,
                onChange(repassword: string) {
                  setData({
                    ...data,
                    repassword
                  });
                },
              }]} />
          </DetailContainer>
          <Flex 
            mt={'8px'}
            justify={'flex-end'}
            gap={'12px'}>
            <AButton 
              isLoading={loading}
              onClick={submit}>
              Submit
            </AButton>
          </Flex>
        </Flex>
      </Flex>
    </TemplateAuth>
  );
}
