import { Chart } from "react-google-charts";

export interface NewChartLabel {
  label: string
  values: string[]
}

export interface NewChartData {
  label: string
  colors?: string[]
  h?: number
  values: number[]
}

interface SampleNewChartProps {
  title?: string
  hLabel?: string
  vLabel?: string
  xs: NewChartLabel
  ys: NewChartData[]
  legend?: boolean
}

export function SampleNewChart(props: SampleNewChartProps) {
  if (props.ys.length === 0) {
    return <div />
  }
  for (const y of props.ys) {
    if (props.xs.values.length !== y.values.length) {
      return (
        <div>
          Data Y ({ y.label }) length (={y.values.length}) is not equal to xs length (={props.xs.values.length})
        </div>
      );
    }
  }

  const data: any[] = [
    [props.xs.label, ...props.ys.map((y: NewChartData) => [y.label, { role: 'style' }]).reduce((a, b) => [...a, ...b], [])],
    ...props.xs.values.map((label: string, i: number) => [
      label,
      ...props.ys.map((data: NewChartData, j: number) => [data.values[i], `fill-color: ${data.colors?.[i]}`]).reduce((a, b) => [...a, ...b], []),
    ])
  ];

  console.log(data);

  const options = {
    title: props.title,
    chartArea: { width: "80%" },
    legend: { position: "none" },
    hAxis: {
      title: props.hLabel,
      minValue: 0,
      format: 'short'
    },
    vAxis: {
      title: props.vLabel,
    },
    bar: { groupWidth: '40%' }
  };

  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="300px"
      data={data}
      options={options}
    />
  );
}
