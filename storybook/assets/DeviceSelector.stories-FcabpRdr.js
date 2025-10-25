import{r as i,j as d}from"./iframe-DOEDa33N.js";import{D as n}from"./DeviceSelector-vUrjz2AP.js";import{m as l,a as C,b as a}from"./test-utils-7FD7azQ1.js";const f={title:"Chart Components/DeviceSelector",component:n,parameters:{layout:"padded"},tags:["autodocs"]},t={render:e=>{const[s,c]=i.useState(e.selectedDevices);return d.jsx(n,{...e,selectedDevices:s,onChange:c})},args:{devices:a,selectedDevices:a,mappings:C,colorMap:l}},r={render:e=>{const[s,c]=i.useState(e.selectedDevices);return d.jsx(n,{...e,selectedDevices:s,onChange:c})},args:{devices:a,selectedDevices:["device001","device003"],mappings:C,colorMap:l}},o={render:e=>{const[s,c]=i.useState(e.selectedDevices);return d.jsx(n,{...e,selectedDevices:s,onChange:c})},args:{devices:a,selectedDevices:["device001","device002"],mappings:{},colorMap:l}};var v,p,D;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(k=(M=o.parameters)==null?void 0:M.docs)==null?void 0:k.source}}};const E=["AllDevicesSelected","PartialSelection","NoMappings"];export{t as AllDevicesSelected,o as NoMappings,r as PartialSelection,E as __namedExportsOrder,f as default};
