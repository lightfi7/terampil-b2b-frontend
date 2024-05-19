import { Flex, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export interface PieChartItem {
  name: string
  value: number
  color: string
}

export interface TerampilPieChartProps {
  innerRadius?: number
  outerRadius?: number
  containerStyle?: CSSProperties
  data: PieChartItem[]
  centerValue?: string
  d?: string | number
}

export default function TerampilPieChart(props: TerampilPieChartProps) {
  let post_data = props.data;
  const is_all_zero = props.data.reduce((acc: number, curr) => acc + curr.value, 0) === 0;
  if (is_all_zero) {
    post_data = [{
      name: '',
      value: 1,
      color: '#E5E5E5'
    }];
  }

  return (
    <Flex 
      w={props.d ?? '180px'}
      h={props.d ?? '180px'}
      align={'center'}
      boxSizing={'border-box'}
      position={'relative'}
      style={props.containerStyle}>
      { props.centerValue && <Flex 
        position={'absolute'}
        w={'100%'}
        align={'center'}
        justify={'center'}
        alignSelf={'center'}
        justifySelf={'center'}>
        <Text
          fontSize={'1.7em'}
          fontWeight={700}
          color={'#0160BA'}>
          { props.centerValue }
        </Text>
      </Flex> }
      <ResponsiveContainer 
        width={'100%'}
        height={'100%'}>
        <PieChart>
          <defs>
            <linearGradient 
              id="colorUv" 
              x1="1" 
              y1="1" 
              x2="0" 
              y2="0">
              <stop offset="-4.22%" stopColor="#01D9BF" stopOpacity={1} />
              <stop offset="93.69%" stopColor="#005CB9" stopOpacity={1} />
            </linearGradient>
          </defs>
          <Pie
            data={post_data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={props.outerRadius ?? 85}
            innerRadius={props.innerRadius ?? 63}
            strokeWidth={0}
            fill="#8884d8"
            dataKey="value"
          >
            {post_data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </Flex>
  );
}
