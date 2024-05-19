import { 
  Accordion,
  Box, 
  Flex, 
  Image, 
  Link, 
  Text,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Tag,
  TagLeftIcon,
  TagLabel,
  Alert,
  AlertTitle,
  AlertDescription, 
} from '@chakra-ui/react';
import { 
  CheckIcon,
  CloseIcon,
  RepeatClockIcon
} from '@chakra-ui/icons';

interface ApprovalAccordionProps {
  title: string;
  verified: boolean;
  rejectReason: string;
  children: JSX.Element;
}

export function ApprovalAccordion({
  title,
  verified,
  rejectReason,
  children
}: ApprovalAccordionProps) {

  return (
    <Accordion
      allowToggle
    >
      <AccordionItem 
        bg={'#FFF'}
        gap={'8px'}
        p={'12px'}
        borderRadius={12}
      >
        <h2>
          <AccordionButton>
            <Box display="flex" textAlign='left' justifyContent="space-between" width="100%">
              <Text>{title}</Text>
              {verified && (
                <Tag color="green.500">
                  <TagLeftIcon boxSize='12px' as={CheckIcon} />
                  <TagLabel>verified</TagLabel>
                </Tag>
              )}

              {!verified && rejectReason && (
                <Tag color="red.500">
                  <TagLeftIcon boxSize='12px' as={CloseIcon} />
                  <TagLabel>rejected</TagLabel>
                </Tag>
              )}

              {!verified && !rejectReason && (
                <Tag>
                  <TagLeftIcon boxSize='12px' as={RepeatClockIcon} />
                  <TagLabel>menunggu konfirmasi</TagLabel>
                </Tag>
              )}
              
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {verified === false && rejectReason && (
            <Alert status='error' mb={6}>
              <AlertTitle>Rejected</AlertTitle>
              <AlertDescription>{rejectReason}</AlertDescription>
            </Alert>
          )}
          {children}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
