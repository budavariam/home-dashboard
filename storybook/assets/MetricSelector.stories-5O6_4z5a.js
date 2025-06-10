import{j as l}from"./jsx-runtime-DLmZSmIB.js";import{M as n}from"./MetricSelector-DvlUKE94.js";import{r as o}from"./iframe-DWXqC8DE.js";const b={title:"Chart Components/MetricSelector",component:n,parameters:{layout:"centered"},tags:["autodocs"]},s={render:e=>{const[t,r]=o.useState(e.selectedMetrics);return l.jsx(n,{...e,selectedMetrics:t,onChange:r})},args:{selectedMetrics:{hum:!0,tmp:!0,bat:!0}}},c={render:e=>{const[t,r]=o.useState(e.selectedMetrics);return l.jsx(n,{...e,selectedMetrics:t,onChange:r})},args:{selectedMetrics:{hum:!0,tmp:!1,bat:!0}}},a={render:e=>{const[t,r]=o.useState(e.selectedMetrics);return l.jsx(n,{...e,selectedMetrics:t,onChange:r})},args:{selectedMetrics:{hum:!1,tmp:!1,bat:!1}}};var d,i,u;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  render: args => {
    const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
    return <MetricSelector {...args} selectedMetrics={selectedMetrics} onChange={setSelectedMetrics} />;
  },
  args: {
    selectedMetrics: {
      hum: true,
      tmp: true,
      bat: true
    }
  }
}`,...(u=(i=s.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};var M,m,S;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
  render: args => {
    const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
    return <MetricSelector {...args} selectedMetrics={selectedMetrics} onChange={setSelectedMetrics} />;
  },
  args: {
    selectedMetrics: {
      hum: true,
      tmp: false,
      bat: true
    }
  }
}`,...(S=(m=c.parameters)==null?void 0:m.docs)==null?void 0:S.source}}};var p,g,h;a.parameters={...a.parameters,docs:{...(p=a.parameters)==null?void 0:p.docs,source:{originalSource:`{
  render: args => {
    const [selectedMetrics, setSelectedMetrics] = useState(args.selectedMetrics);
    return <MetricSelector {...args} selectedMetrics={selectedMetrics} onChange={setSelectedMetrics} />;
  },
  args: {
    selectedMetrics: {
      hum: false,
      tmp: false,
      bat: false
    }
  }
}`,...(h=(g=a.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const j=["AllSelected","PartiallySelected","NoneSelected"];export{s as AllSelected,a as NoneSelected,c as PartiallySelected,j as __namedExportsOrder,b as default};
