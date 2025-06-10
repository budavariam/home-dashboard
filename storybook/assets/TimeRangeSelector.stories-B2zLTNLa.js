import{r as p,j as v}from"./iframe-btbIs0Bq.js";import{T as n}from"./TimeRangeSelector-QrUbmnZF.js";const h={title:"Chart Components/TimeRangeSelector",component:n,parameters:{layout:"centered"},tags:["autodocs"]},a={render:e=>{const[s,t]=p.useState(e.value);return v.jsx(n,{...e,value:s,onChange:t})},args:{value:"6h"}},r={render:e=>{const[s,t]=p.useState(e.value);return v.jsx(n,{...e,value:s,onChange:t})},args:{value:"24h",className:"w-48"}};var o,u,l;a.parameters={...a.parameters,docs:{...(o=a.parameters)==null?void 0:o.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.value);
    return <TimeRangeSelector {...args} value={value} onChange={setValue} />;
  },
  args: {
    value: '6h'
  }
}`,...(l=(u=a.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};var c,m,g;r.parameters={...r.parameters,docs:{...(c=r.parameters)==null?void 0:c.docs,source:{originalSource:`{
  render: args => {
    const [value, setValue] = useState(args.value);
    return <TimeRangeSelector {...args} value={value} onChange={setValue} />;
  },
  args: {
    value: '24h',
    className: 'w-48'
  }
}`,...(g=(m=r.parameters)==null?void 0:m.docs)==null?void 0:g.source}}};const C=["Default","WithCustomClass"];export{a as Default,r as WithCustomClass,C as __namedExportsOrder,h as default};
