import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import { Flex, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface PDFViewerPageNavigationProps {
  page?: number
  onRight?(): void
  onLeft?(): void
  gotoPage?(page: number): void
}

export function PDFViewerPageNavigation(props: PDFViewerPageNavigationProps) {
  const [temp_page, setTempPage] = useState<any>(props.page ?? 1);

  useEffect(() => {
    if (props.page === temp_page) {
      return;
    }
    setTempPage(props.page ?? 1);
  }, [props.page]);

  return (
    <Flex
      gap={'12px'}
      flex={1}
      align={'center'}>
      <ArrowLeftIcon
        onClick={props.onLeft}
        cursor={'pointer'} />
      <Input
        textAlign={'center'}
        value={temp_page}
        onChange={(e: any) => setTempPage(e.target.value)}
        onKeyDown={(e: any) => {
          if (e.key === 'Enter' && props.gotoPage && temp_page.length > 0 && !isNaN(temp_page)) {
            props.gotoPage(parseInt(temp_page));
          }
        }}
        flex={1} />
      <ArrowRightIcon
        onClick={props.onRight}
        cursor={'pointer'} />
    </Flex>
  );
}
