import{g as ie,R as v,j as s}from"./iframe-BplrydNZ.js";import{a as h}from"./test-utils-7FD7azQ1.js";var k={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/var E;function ce(){return E||(E=1,function(n){(function(){var i={}.hasOwnProperty;function r(){for(var e="",o=0;o<arguments.length;o++){var c=arguments[o];c&&(e=m(e,d(c)))}return e}function d(e){if(typeof e=="string"||typeof e=="number")return e;if(typeof e!="object")return"";if(Array.isArray(e))return r.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var o="";for(var c in e)i.call(e,c)&&e[c]&&(o=m(o,c));return o}function m(e,o){return o?e?e+" "+o:e+o:e}n.exports?(r.default=r,n.exports=r):window.classNames=r})()}(k)),k.exports}var ue=ce();const me=ie(ue),de=n=>{if(n.length===0)return!0;const i=n[0].split(" ")[0];return n.every(r=>r.split(" ")[0]===i)},Z=({groupedData:n,selectedDevices:i,selectedMetric:r,mappings:d,className:m=""})=>{var $;const[e,o]=v.useState(null),[c,H]=v.useState({x:0,y:0}),[I,w]=v.useState(null),C=v.useMemo(()=>{const t=[];return Object.entries(n).filter(([a])=>i.includes(a)).forEach(([a,l])=>{l.timestamps.forEach((u,x)=>{t.push({device:a,timestamp:u,value:l[r][x],timestampIndex:x})})}),t},[n,i,r]),{minValue:p,maxValue:f}=v.useMemo(()=>{const t=C.map(a=>a.value).filter(a=>a!==null);return{minValue:t.length>0?Math.min(...t):0,maxValue:t.length>0?Math.max(...t):100}},[C]),T=t=>{if(t===null)return"#374151";const a=(t-p)/(f-p);if(a<=.5){const l=a*2;return`rgb(${Math.round(l*255)}, ${Math.round(l*255)}, 255)`}else{const l=(a-.5)*2;return`rgb(255, ${Math.round(255*(1-l))}, 0)`}},ee=t=>{if(t===null)return"";const a=p+(f-p)*(t/19),l=r==="hum"?"%":r==="tmp"?"°C":"%";return`${a.toFixed(1)}${l}`},te=t=>{H({x:t.clientX,y:t.clientY})},ae=(t,a,l,u)=>{o({x:u.clientX,y:u.clientY,value:l,device:t,timestamp:a}),H({x:u.clientX,y:u.clientY})},ne=()=>{o(null)},re=t=>{w(t)},se=()=>{w(null)},g=(($=Object.values(n)[0])==null?void 0:$.timestamps)||[],le=de(g),_=i.filter(t=>n[t]),oe=t=>{if(le||t===0)return!1;const a=g[t],l=g[t-1],u=a.split(" ")[0],x=l.split(" ")[0];return u!==x};return _.length===0||g.length===0?s.jsx("div",{className:`text-center text-gray-500 p-8 ${m}`,children:"No data available for heatmap"}):s.jsxs("div",{className:`bg-white dark:bg-gray-800 rounded-lg p-4 relative ${m}`,onMouseMove:te,children:[s.jsxs("h3",{className:"text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4",children:[r==="hum"?"Humidity":r==="tmp"?"Temperature":"Battery"," Heatmap"]}),s.jsx("div",{className:"w-full",children:_.map(t=>s.jsxs("div",{className:"flex w-full",children:[s.jsx("div",{className:"w-32 flex-shrink-0 h-8 flex items-center px-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700",children:d[t]||t}),s.jsx("div",{className:"flex-1 flex",children:n[t][r].map((a,l)=>s.jsx("div",{className:me("flex-1 h-8 cursor-pointer hover:opacity-80 transition-opacity relative",{"border-l-2 border-gray-400 border-opacity-50":oe(l)}),style:{backgroundColor:T(a)},onMouseEnter:u=>ae(t,g[l],a,u),onMouseLeave:ne},l))})]},t))}),s.jsxs("div",{className:"mt-4 flex items-center justify-center gap-2",children:[s.jsx("span",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Low"}),s.jsx("div",{className:"flex h-4 w-32 rounded cursor-crosshair",title:ee(I),children:Array.from({length:20},(t,a)=>s.jsx("div",{className:"flex-1 h-full hover:opacity-30 transition-opacity",style:{backgroundColor:T(p+(f-p)*(a/19))},onMouseEnter:()=>re(a),onMouseLeave:se},a))}),s.jsx("span",{className:"text-sm text-gray-600 dark:text-gray-400",children:"High"}),s.jsxs("span",{className:"text-xs text-gray-500 dark:text-gray-400 ml-2",children:["(",p.toFixed(1)," - ",f.toFixed(1),")"]})]}),e&&s.jsxs("div",{className:"fixed bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg z-50 pointer-events-none",style:{left:c.x+10,top:c.y-10,transform:c.x>window.innerWidth-200?"translateX(-100%)":"none"},children:[s.jsx("div",{className:"font-medium",children:d[e.device]||e.device}),s.jsx("div",{className:"text-gray-300",children:e.timestamp}),s.jsxs("div",{className:"text-gray-300",children:["Value: ",e.value!==null?e.value.toFixed(1):"N/A"]})]})]})};Z.__docgenInfo={description:"",methods:[],displayName:"HeatmapComponent",props:{groupedData:{required:!0,tsType:{name:"GroupedData"},description:""},selectedDevices:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},selectedMetric:{required:!0,tsType:{name:"union",raw:'"hum" | "tmp" | "bat"',elements:[{name:"literal",value:'"hum"'},{name:"literal",value:'"tmp"'},{name:"literal",value:'"bat"'}]},description:""},mappings:{required:!0,tsType:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>"},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'""',computed:!1}}}};const he={title:"Chart Components/HeatmapComponent",component:Z,parameters:{layout:"fullscreen"},tags:["autodocs"]},pe=()=>{const n=Array.from({length:12},(d,m)=>`${(8+m).toString().padStart(2,"0")}:00`),i=["device001","device002","device003"],r={};return i.forEach(d=>{r[d]={hum:n.map((m,e)=>45+Math.random()*30+Math.sin(e*.5)*10),tmp:n.map((m,e)=>20+Math.random()*10+Math.cos(e*.3)*5),bat:n.map(()=>85+Math.random()*15),timestamps:n}}),r},N=pe(),y={args:{groupedData:N,selectedDevices:["device001","device002","device003"],selectedMetric:"hum",mappings:h}},D={args:{groupedData:N,selectedDevices:["device001","device002","device003"],selectedMetric:"tmp",mappings:h}},M={args:{groupedData:N,selectedDevices:["device001","device002","device003"],selectedMetric:"bat",mappings:h}},S={args:{groupedData:N,selectedDevices:["device001"],selectedMetric:"hum",mappings:h}},b={args:{groupedData:{device001:{hum:[45,null,52,48,null,51,49,null,53,47,50,null],tmp:[22,23,null,24,23,null,25,24,23,null,22,23],bat:[90,89,88,null,86,85,null,83,82,81,null,79],timestamps:Array.from({length:12},(n,i)=>`${(8+i).toString().padStart(2,"0")}:00`)},device002:{hum:[null,48,49,null,52,50,51,null,49,48,null,47],tmp:[null,21,22,23,null,24,23,22,null,21,22,null],bat:[85,null,83,82,81,null,79,78,77,null,75,74],timestamps:Array.from({length:12},(n,i)=>`${(8+i).toString().padStart(2,"0")}:00`)}},selectedDevices:["device001","device002"],selectedMetric:"hum",mappings:h}},j={args:{groupedData:{},selectedDevices:[],selectedMetric:"hum",mappings:{}}};var A,L,q;y.parameters={...y.parameters,docs:{...(A=y.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    groupedData: mockGroupedData,
    selectedDevices: ['device001', 'device002', 'device003'],
    selectedMetric: 'hum',
    mappings: mockMappings
  }
}`,...(q=(L=y.parameters)==null?void 0:L.docs)==null?void 0:q.source}}};var V,O,G;D.parameters={...D.parameters,docs:{...(V=D.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    groupedData: mockGroupedData,
    selectedDevices: ['device001', 'device002', 'device003'],
    selectedMetric: 'tmp',
    mappings: mockMappings
  }
}`,...(G=(O=D.parameters)==null?void 0:O.docs)==null?void 0:G.source}}};var R,F,X;M.parameters={...M.parameters,docs:{...(R=M.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    groupedData: mockGroupedData,
    selectedDevices: ['device001', 'device002', 'device003'],
    selectedMetric: 'bat',
    mappings: mockMappings
  }
}`,...(X=(F=M.parameters)==null?void 0:F.docs)==null?void 0:X.source}}};var B,P,W;S.parameters={...S.parameters,docs:{...(B=S.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    groupedData: mockGroupedData,
    selectedDevices: ['device001'],
    selectedMetric: 'hum',
    mappings: mockMappings
  }
}`,...(W=(P=S.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var Y,z,J;b.parameters={...b.parameters,docs:{...(Y=b.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    groupedData: {
      device001: {
        hum: [45, null, 52, 48, null, 51, 49, null, 53, 47, 50, null],
        tmp: [22, 23, null, 24, 23, null, 25, 24, 23, null, 22, 23],
        bat: [90, 89, 88, null, 86, 85, null, 83, 82, 81, null, 79],
        timestamps: Array.from({
          length: 12
        }, (_, i) => \`\${(8 + i).toString().padStart(2, '0')}:00\`)
      },
      device002: {
        hum: [null, 48, 49, null, 52, 50, 51, null, 49, 48, null, 47],
        tmp: [null, 21, 22, 23, null, 24, 23, 22, null, 21, 22, null],
        bat: [85, null, 83, 82, 81, null, 79, 78, 77, null, 75, 74],
        timestamps: Array.from({
          length: 12
        }, (_, i) => \`\${(8 + i).toString().padStart(2, '0')}:00\`)
      }
    },
    selectedDevices: ['device001', 'device002'],
    selectedMetric: 'hum',
    mappings: mockMappings
  }
}`,...(J=(z=b.parameters)==null?void 0:z.docs)==null?void 0:J.source}}};var K,Q,U;j.parameters={...j.parameters,docs:{...(K=j.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    groupedData: {},
    selectedDevices: [],
    selectedMetric: 'hum',
    mappings: {}
  }
}`,...(U=(Q=j.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};const fe=["HumidityHeatmap","TemperatureHeatmap","BatteryHeatmap","SingleDevice","WithMissingData","EmptyData"];export{M as BatteryHeatmap,j as EmptyData,y as HumidityHeatmap,S as SingleDevice,D as TemperatureHeatmap,b as WithMissingData,fe as __namedExportsOrder,he as default};
