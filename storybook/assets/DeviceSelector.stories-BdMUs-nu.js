import{j as a}from"./jsx-runtime-DLmZSmIB.js";import{D as n}from"./DeviceSelector-DybuNucV.js";import{r as d}from"./iframe-DWXqC8DE.js";const j={title:"Chart Components/DeviceSelector",component:n,parameters:{layout:"padded"},tags:["autodocs"]},i=["device001","device002","device003","device004"],C={device001:"Living Room Sensor",device002:"Kitchen Sensor",device003:"Bedroom Sensor",device004:"Bathroom Sensor"},v={device001:"#3b82f6",device002:"#f97316",device003:"#10b981",device004:"#eab308"},t={render:e=>{const[s,c]=d.useState(e.selectedDevices);return a.jsx(n,{...e,selectedDevices:s,onChange:c})},args:{devices:i,selectedDevices:i,mappings:C,colorMap:v}},r={render:e=>{const[s,c]=d.useState(e.selectedDevices);return a.jsx(n,{...e,selectedDevices:s,onChange:c})},args:{devices:i,selectedDevices:["device001","device003"],mappings:C,colorMap:v}},o={render:e=>{const[s,c]=d.useState(e.selectedDevices);return a.jsx(n,{...e,selectedDevices:s,onChange:c})},args:{devices:i,selectedDevices:["device001","device002"],mappings:{},colorMap:v}};var l,p,D;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  render: args => {
    const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);
    return <DeviceSelector {...args} selectedDevices={selectedDevices} onChange={setSelectedDevices} />;
  },
  args: {
    devices: mockDevices,
    selectedDevices: mockDevices,
    mappings: mockMappings,
    colorMap: mockColorMap
  }
}`,...(D=(p=t.parameters)==null?void 0:p.docs)==null?void 0:D.source}}};var m,g,S;r.parameters={...r.parameters,docs:{...(m=r.parameters)==null?void 0:m.docs,source:{originalSource:`{
  render: args => {
    const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);
    return <DeviceSelector {...args} selectedDevices={selectedDevices} onChange={setSelectedDevices} />;
  },
  args: {
    devices: mockDevices,
    selectedDevices: ['device001', 'device003'],
    mappings: mockMappings,
    colorMap: mockColorMap
  }
}`,...(S=(g=r.parameters)==null?void 0:g.docs)==null?void 0:S.source}}};var u,M,k;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  render: args => {
    const [selectedDevices, setSelectedDevices] = useState(args.selectedDevices);
    return <DeviceSelector {...args} selectedDevices={selectedDevices} onChange={setSelectedDevices} />;
  },
  args: {
    devices: mockDevices,
    selectedDevices: ['device001', 'device002'],
    mappings: {},
    colorMap: mockColorMap
  }
}`,...(k=(M=o.parameters)==null?void 0:M.docs)==null?void 0:k.source}}};const b=["AllDevicesSelected","PartialSelection","NoMappings"];export{t as AllDevicesSelected,o as NoMappings,r as PartialSelection,b as __namedExportsOrder,j as default};
