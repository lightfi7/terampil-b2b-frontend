import { Box, Flex, Heading, Progress, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
const Player = dynamic(import('../player/Player'), { ssr: false });

interface SectionMaterialProps {
  isTrailer?: boolean
  isSafari?: boolean
  dataTraining?: any
  currentSection?: any
  progressPercent?: number
  rewind?(): void
  nextMateri?(): void
  forward?(): void
  setCurrentDuration?(duration_second: number): void
}

export function SectionMaterial(props: SectionMaterialProps) {
  return (
    <Flex
      direction={'column'}
      gap={'12px'}>
      <Box>
        {
          props.isTrailer ? (
            <Player
              manifestUrl={
                props.isSafari
                ? props.dataTraining?.video_apple_url
                : props.dataTraining?.video_non_apple_url
              }
              posterUrl={props.dataTraining?.thumbnail}
              showControls
              isSafari={props.isSafari}
              isTrailer={props.isTrailer}
              setCurrentDuration={props.setCurrentDuration}
            />
          ) : (
            <Player
              manifestUrl={
                props.isSafari
                ? props.currentSection?.video_apple_url
                : props.currentSection?.video_non_apple_url
              }
              posterUrl={props.currentSection?.thumbnail}
              showControls
              isOverlay
              rewindFunction={props.rewind}
              skipFunction={props.nextMateri}
              forwardFunction={props.forward}
              isSafari={props.isSafari}
              setCurrentDuration={props.setCurrentDuration}
            />
          )
        }
      </Box>
      <Heading size={'lg'}>{props.dataTraining?.title}</Heading>
      <Text>{props.dataTraining?.Trainer?.fullname}</Text>
      { props.setCurrentDuration && <Flex direction={'row'} gap={'24px'} alignItems={'center'}>
        <Progress flex={'1'} value={props.progressPercent ?? 0} borderRadius={'30px'} />
        <Text fontWeight={'bold'} color={'#005CB9'}>
          { (props.progressPercent ?? 0).toFixed(0) } %
        </Text>
      </Flex> }
    </Flex>
  )
}
