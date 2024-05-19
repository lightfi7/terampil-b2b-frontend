import { CSSProperties } from "react";
import { ResponsiveContainer, PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { TerampilLineBarContainer } from "./styled";
import { currencyFormatter } from "../input-number";

const getPath = (x: number, y: number, width: number, height: number) => `M${x} ${y} H${x + width} V${y + height} H${x} L${x} ${y}`;

const CustomRectBar = (props: any) => {
  const { fill, x, y, width, height } = props;

  const desired_width = 30;
  const calculated_x = x + ((width - desired_width) / 2)

  return <path d={getPath(calculated_x, y, desired_width, height)} stroke="none" fill={fill} />;
};

export interface TerampilBarChartProps {
  layout?: 'horizontal' | 'vertical'
  containerStyle?: CSSProperties
  data: {
    label: string
    Cost: number
    Benefit: number
  }[]
}

export default function TerampilBarChart(props: TerampilBarChartProps) {
  return (
    <TerampilLineBarContainer>
      <ResponsiveContainer 
        height={600}
        width={'100%'}>
        <BarChart
          data={props.data}
          layout={props.layout}>
          <Tooltip
            formatter={currencyFormatter.format as any} />
          <CartesianGrid 
            strokeDasharray="10 3" />
          <XAxis 
            dataKey="label"
            height={150}
            angle={-90} 
            fontSize={'.75em'}
            textAnchor="end"
            interval={0} />
          <YAxis
            fontSize={'.75em'}
            orientation={'right'}
            tickFormatter={currencyFormatter.format}
            width={200} />
          <Legend />
          <Bar dataKey="Cost" fill="#01C8BE" />
          <Bar dataKey="Benefit" fill="#005CB9" />
        </BarChart>
      </ResponsiveContainer>
    </TerampilLineBarContainer>
  );
}
