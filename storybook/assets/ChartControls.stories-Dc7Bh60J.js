import{j as t,r as s}from"./iframe-CnlYGR5L.js";import{T}from"./TimeRangeSelector-B_LXGgPg.js";import{M as b}from"./MetricSelector-BYBe3CL6.js";import{D as j}from"./DeviceSelector-CQo7zkBw.js";import{m as w,a as D,b as u}from"./test-utils-7FD7azQ1.js";const S=({config:e,onChange:n,className:r=""})=>{const i={showLegend:"Legends",showAxisLabels:"Axis Labels",splitCharts:"Split Charts"};return t.jsx("div",{className:`flex gap-2 items-center ${r}`,children:Object.entries(i).map(([a,c])=>t.jsxs("label",{className:"text-gray-700 dark:text-gray-300",children:[t.jsx("input",{type:"checkbox",className:"mr-2",checked:e[a],onChange:o=>n({...e,[a]:o.target.checked})}),c]},a))})};S.__docgenInfo={description:"",methods:[],displayName:"ChartConfigSelector",props:{config:{required:!0,tsType:{name:"ChartConfig"},description:""},onChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(config: ChartConfig) => void",signature:{arguments:[{type:{name:"ChartConfig"},name:"config"}],return:{name:"void"}}},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'""',computed:!1}}}};const h=({timeRange:e,onTimeRangeChange:n,selectedMetrics:r,onMetricsChange:i,chartConfig:a,onChartConfigChange:c,devices:o,selectedDevices:l,onDevicesChange:m,mappings:x,colorMap:y})=>t.jsxs("div",{className:"flex flex-col gap-4 mb-4",children:[t.jsxs("div",{className:"flex flex-col md:flex-row gap-4",children:[t.jsx(T,{value:e,onChange:n}),t.jsx(b,{selectedMetrics:r,onChange:i}),t.jsx(S,{config:a,onChange:c})]}),t.jsx(j,{devices:o,selectedDevices:l,onChange:m,mappings:x,colorMap:y})]});h.__docgenInfo={description:"",methods:[],displayName:"ChartControls",props:{timeRange:{required:!0,tsType:{name:"union",raw:'"1h" | "6h" | "12h" | "24h" | "48h" | "1w" | "2w"',elements:[{name:"literal",value:'"1h"'},{name:"literal",value:'"6h"'},{name:"literal",value:'"12h"'},{name:"literal",value:'"24h"'},{name:"literal",value:'"48h"'},{name:"literal",value:'"1w"'},{name:"literal",value:'"2w"'}]},description:""},onTimeRangeChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(timeRange: TimeRange) => void",signature:{arguments:[{type:{name:"union",raw:'"1h" | "6h" | "12h" | "24h" | "48h" | "1w" | "2w"',elements:[{name:"literal",value:'"1h"'},{name:"literal",value:'"6h"'},{name:"literal",value:'"12h"'},{name:"literal",value:'"24h"'},{name:"literal",value:'"48h"'},{name:"literal",value:'"1w"'},{name:"literal",value:'"2w"'}]},name:"timeRange"}],return:{name:"void"}}},description:""},selectedMetrics:{required:!0,tsType:{name:"Record",elements:[{name:"union",raw:'"hum" | "tmp" | "bat"',elements:[{name:"literal",value:'"hum"'},{name:"literal",value:'"tmp"'},{name:"literal",value:'"bat"'}]},{name:"boolean"}],raw:"Record<MetricKey, boolean>"},description:""},onMetricsChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(metrics: Record<MetricKey, boolean>) => void",signature:{arguments:[{type:{name:"Record",elements:[{name:"union",raw:'"hum" | "tmp" | "bat"',elements:[{name:"literal",value:'"hum"'},{name:"literal",value:'"tmp"'},{name:"literal",value:'"bat"'}]},{name:"boolean"}],raw:"Record<MetricKey, boolean>"},name:"metrics"}],return:{name:"void"}}},description:""},chartConfig:{required:!0,tsType:{name:"ChartConfig"},description:""},onChartConfigChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(config: ChartConfig) => void",signature:{arguments:[{type:{name:"ChartConfig"},name:"config"}],return:{name:"void"}}},description:""},devices:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},selectedDevices:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},onDevicesChange:{required:!0,tsType:{name:"signature",type:"function",raw:"(devices: string[]) => void",signature:{arguments:[{type:{name:"Array",elements:[{name:"string"}],raw:"string[]"},name:"devices"}],return:{name:"void"}}},description:""},mappings:{required:!0,tsType:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>"},description:""},colorMap:{required:!0,tsType:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>"},description:""}}};const _={title:"Chart Components/ChartControls",component:h,parameters:{layout:"padded"},tags:["autodocs"]},g={render:e=>{const[n,r]=s.useState(e.timeRange),[i,a]=s.useState(e.selectedMetrics),[c,o]=s.useState(e.chartConfig),[l,m]=s.useState(e.selectedDevices);return t.jsx(h,{...e,timeRange:n,onTimeRangeChange:r,selectedMetrics:i,onMetricsChange:a,chartConfig:c,onChartConfigChange:o,selectedDevices:l,onDevicesChange:m})},args:{timeRange:"6h",selectedMetrics:{hum:!0,tmp:!0,bat:!1},chartConfig:{showLegend:!0,showAxisLabels:!0,splitCharts:!0},devices:u,selectedDevices:u.slice(0,2),mappings:D,colorMap:w}},d={render:e=>{const[n,r]=s.useState(e.timeRange),[i,a]=s.useState(e.selectedMetrics),[c,o]=s.useState(e.chartConfig),[l,m]=s.useState(e.selectedDevices);return t.jsx("div",{className:"max-w-sm",children:t.jsx(h,{...e,timeRange:n,onTimeRangeChange:r,selectedMetrics:i,onMetricsChange:a,chartConfig:c,onChartConfigChange:o,selectedDevices:l,onDevicesChange:m})})},args:{timeRange:"24h",selectedMetrics:{hum:!0,tmp:!1,bat:!0},chartConfig:{showLegend:!1,showAxisLabels:!0,splitCharts:!1},devices:u,selectedDevices:[u[0]],mappings:D,colorMap:w}};var p,C,v;g.parameters={...g.parameters,docs:{...(p=g.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => {
    const [timeRange, setTimeRange] = useState(args.timeRange);
    const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
    const [chartConfig, setChartConfig] = useState(args.chartConfig);
    const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);
    return <ChartControls {...args} timeRange={timeRange} onTimeRangeChange={setTimeRange} selectedMetrics={selectedMetrics} onMetricsChange={setSelectedMetrics} chartConfig={chartConfig} onChartConfigChange={setChartConfig} selectedDevices={selectedDevices} onDevicesChange={setSelectedDevices} />;
  },
  args: {
    timeRange: '6h',
    selectedMetrics: {
      hum: true,
      tmp: true,
      bat: false
    },
    chartConfig: {
      showLegend: true,
      showAxisLabels: true,
      splitCharts: true
    },
    devices: mockDevices,
    selectedDevices: mockDevices.slice(0, 2),
    mappings: mockMappings,
    colorMap: mockColorMap
  }
}`,...(v=(C=g.parameters)==null?void 0:C.docs)==null?void 0:v.source}}};var f,M,R;d.parameters={...d.parameters,docs:{...(f=d.parameters)==null?void 0:f.docs,source:{originalSource:`{
  render: args => {
    const [timeRange, setTimeRange] = useState(args.timeRange);
    const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
    const [chartConfig, setChartConfig] = useState(args.chartConfig);
    const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);
    return <div className="max-w-sm">
                <ChartControls {...args} timeRange={timeRange} onTimeRangeChange={setTimeRange} selectedMetrics={selectedMetrics} onMetricsChange={setSelectedMetrics} chartConfig={chartConfig} onChartConfigChange={setChartConfig} selectedDevices={selectedDevices} onDevicesChange={setSelectedDevices} />
            </div>;
  },
  args: {
    timeRange: '24h',
    selectedMetrics: {
      hum: true,
      tmp: false,
      bat: true
    },
    chartConfig: {
      showLegend: false,
      showAxisLabels: true,
      splitCharts: false
    },
    devices: mockDevices,
    selectedDevices: [mockDevices[0]],
    mappings: mockMappings,
    colorMap: mockColorMap
  }
}`,...(R=(M=d.parameters)==null?void 0:M.docs)==null?void 0:R.source}}};const E=["Default","MobileView"];export{g as Default,d as MobileView,E as __namedExportsOrder,_ as default};
