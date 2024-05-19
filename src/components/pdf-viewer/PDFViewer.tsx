import { Flex } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useState } from "react";
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { PDFViewerPageNavigation } from "./PDFViewerPageNavigation";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string
}

export function PDFViewer(props: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [page, setPage] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  function next() {
    if (page < numPages) {
      setPage(page + 1);
    }
  }

  function prev() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  useEffect(() => {
    setWidth(Math.min(800, window.innerWidth) - 48);
  }, [typeof window !== 'undefined'])

  return (
    <Flex
      bg={'#FFF'}
      align={'center'}
      flex={1}
      justify={'center'}
      direction={'column'}
      gap={'12px'}
      p={'12px'}
      borderRadius={12}>
      <PDFViewerPageNavigation
        page={page}
        onRight={next}
        onLeft={prev}
        gotoPage={setPage} />
      <Flex
        h={'800px'}>
        <Document 
          file={props.url} 
          onLoadSuccess={onDocumentLoadSuccess}>
          <Page 
            height={800}
            pageNumber={page}
            renderTextLayer={false}
            renderAnnotationLayer={false} />
          {/* {Array.from(new Array(numPages), (el, index) => (
          ))} */}
        </Document>
      </Flex>
      <PDFViewerPageNavigation
        page={page}
        onRight={next}
        onLeft={prev}
        gotoPage={setPage} />
    </Flex>
  );
}
