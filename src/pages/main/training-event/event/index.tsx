import { AButton } from '@/components/button/AButton';
import { ContainerGradient } from '@/components/container-gradient/ContainerGradient';
import { ContextMenu } from '@/components/context-menu/ContextMenu';
import { GeneralContainer } from '@/components/general-container/GeneralContainer';
import { PageTitleSubtitle } from '@/components/page-title-subtitle/PageTitleSubtitle';
import { Pagination } from '@/components/pagination/Pagination';
import { TableAction } from '@/components/table-action/TableAction';
import { XTable } from '@/components/table/XTable';
import { ThreeDotsImage } from '@/components/three-dots-image/ThreeDotsImage';
import { TemplateAuth } from '@/template-auth';
import { Flex, Image, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { getServerSideProps, WithAdminPageProps } from '../../../../../cookies.util';
export { getServerSideProps };

export default function(props: WithAdminPageProps) {
  async function init() {
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <TemplateAuth
      admin={props.admin}
      title={'Training & Event'}>
      <PageTitleSubtitle
        title={'Buat Event untuk Karyawan'}
        subtitle={'Buat event untuk semua karyawan Anda'} />
      <ContainerGradient 
        p={'24px 18px'}
        justify={'space-between'}
        align={'center'}>
        <Flex 
          gap={'32px'}
          flex={1}>
          <Image 
            w={'80px'}
            h={'80px'}
            objectFit={'contain'}
            src={'/icons/light/icon-training-big-white.png'} />
          <Flex
            align={'center'}
            gap={'28px'}>
            <Flex 
              direction={'column'}
              gap={'12px'}>
              <Text 
                fontWeight={600}
                fontSize={'1.1em'}>
                Total Event
              </Text>
              <Text
                fontSize={'.76em'}>
                Update 15 Mar 2021, 23:59
              </Text>
            </Flex>
            <Text 
              fontSize={'2em'}
              fontWeight={700}>
              20
            </Text>
          </Flex>
        </Flex>
        <Flex h={'90%'} w={'1px'} bg={'#FFF'} />
        <Flex 
          gap={'48px'}
          flex={1}
          justify={'center'}>
          <Flex 
            direction={'column'}
            align={'center'}>
            <Text>
              Sudah Selesai
            </Text>
            <Text 
              fontSize={'1.6em'}>
              15
            </Text>
          </Flex>
          <Flex 
            direction={'column'}
            align={'center'}>
            <Text>
              Akan Datang
            </Text>
            <Text
              fontSize={'1.6em'}>
              5
            </Text>
          </Flex>
        </Flex>
      </ContainerGradient>
      <GeneralContainer title={'Event'}>
        <TableAction
          button={{
            label: '+ Tambah Aktivitas',
            onClick() {
              window.location.href = `/main/training-event/event/add`;
            }
          }} />
        <XTable data={{
          header: [{
            label: 'Nama Event',
            key: 'nama',
            type: 'string',
          }, {
            label: 'Jenis Event',
            key: 'jenis',
            type: 'string',
          }, {
            label: 'Tanggal',
            key: 'tanggal',
            type: 'string',
          }, {
            label: 'Tempat',
            key: 'tempat',
            type: 'string',
          }, {
            label: 'Status',
            key: 'status',
            type: 'string',
          }, {
            label: '',
            key: '',
            renderValue() {
              return <Flex align={'center'}>
                <AButton variant={'outline'}>
                  Ubah
                </AButton>
                <ContextMenu 
                  listMenu={[{
                    label: 'Hapus',
                    onClick() {
                      if (confirm('Hapus data ini?')) {
                        return true;
                      }
                    }
                  }]} />
              </Flex>
            }
          }],
          data: [{
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }, {
            nama: 'Materi The Art of Self Management',
            jenis: 'Webinar',
            tanggal: '25 Agustus 2022',
            tempat: 'Web Terampil',
            status: 'Akan Datang'
          }]
        }} />
        <Pagination 
          page={1} 
          numberOfPages={8} 
          limit={10}
          onLimitChange={() => {}}
          onPageChange={() => {}} />
      </GeneralContainer>
    </TemplateAuth>
  );
}
