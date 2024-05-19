import { Navbar } from '@/components/navbar/Navbar';

interface TemplateProps {
  children?: any
}

export function Template(props: TemplateProps) {
  return (
    <div>
      <Navbar />
      <div>
        { props.children }
      </div>
    </div>
  );
}
