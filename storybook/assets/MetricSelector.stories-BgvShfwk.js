import{r as l,j as o}from"./iframe-CnlYGR5L.js";import{M as n}from"./MetricSelector-BYBe3CL6.js";const C={title:"Chart Components/MetricSelector",component:n,parameters:{layout:"centered"},tags:["autodocs"]},r={render:e=>{const[t,s]=l.useState(e.selectedMetrics);return o.jsx(n,{...e,selectedMetrics:t,onChange:s})},args:{selectedMetrics:{hum:!0,tmp:!0,bat:!0}}},c={render:e=>{const[t,s]=l.useState(e.selectedMetrics);return o.jsx(n,{...e,selectedMetrics:t,onChange:s})},args:{selectedMetrics:{hum:!0,tmp:!1,bat:!0}}},a={render:e=>{const[t,s]=l.useState(e.selectedMetrics);return o.jsx(n,{...e,selectedMetrics:t,onChange:s})},args:{selectedMetrics:{hum:!1,tmp:!1,bat:!1}}};var d,i,u;r.parameters={...r.parameters,docs:{...(d=r.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(u=(i=r.parameters)==null?void 0:i.docs)==null?void 0:u.source}}};var M,m,S;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`{
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
}`,...(h=(g=a.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};const b=["AllSelected","PartiallySelected","NoneSelected"];export{r as AllSelected,a as NoneSelected,c as PartiallySelected,b as __namedExportsOrder,C as default};
