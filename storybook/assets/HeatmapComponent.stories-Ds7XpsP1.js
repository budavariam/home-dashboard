import{j as n}from"./jsx-runtime-DLmZSmIB.js";import{g as oe,R as g}from"./iframe-DWXqC8DE.js";var k={exports:{}};/*!
	Copyright (c) 2018 Jed Watson.
	Licensed under the MIT License (MIT), see
	http://jedwatson.github.io/classnames
*/var E;function ie(){return E||(E=1,function(l){(function(){var i={}.hasOwnProperty;function s(){for(var e="",o=0;o<arguments.length;o++){var c=arguments[o];c&&(e=m(e,d(c)))}return e}function d(e){if(typeof e=="string"||typeof e=="number")return e;if(typeof e!="object")return"";if(Array.isArray(e))return s.apply(null,e);if(e.toString!==Object.prototype.toString&&!e.toString.toString().includes("[native code]"))return e.toString();var o="";for(var c in e)i.call(e,c)&&e[c]&&(o=m(o,c));return o}function m(e,o){return o?e?e+" "+o:e+o:e}l.exports?(s.default=s,l.exports=s):window.classNames=s})()}(k)),k.exports}var ce=ie();const ue=oe(ce),Z=({groupedData:l,selectedDevices:i,selectedMetric:s,mappings:d,className:m=""})=>{var $;const[e,o]=g.useState(null),[c,H]=g.useState({x:0,y:0}),[I,w]=g.useState(null),C=g.useMemo(()=>{const t=[];return Object.entries(l).filter(([a])=>i.includes(a)).forEach(([a,r])=>{r.timestamps.forEach((u,f)=>{t.push({device:a,timestamp:u,value:r[s][f],timestampIndex:f})})}),t},[l,i,s]),{minValue:p,maxValue:h}=g.useMemo(()=>{const t=C.map(a=>a.value).filter(a=>a!==null);return{minValue:t.length>0?Math.min(...t):0,maxValue:t.length>0?Math.max(...t):100}},[C]),T=t=>{if(t===null)return"#374151";const a=(t-p)/(h-p);if(a<=.5){const r=a*2;return`rgb(${Math.round(r*255)}, ${Math.round(r*255)}, 255)`}else{const r=(a-.5)*2;return`rgb(255, ${Math.round(255*(1-r))}, 0)`}},ee=t=>{if(t===null)return"";const a=p+(h-p)*(t/19),r=s==="hum"?"%":s==="tmp"?"°C":"%";return`${a.toFixed(1)}${r}`},te=t=>{H({x:t.clientX,y:t.clientY})},ae=(t,a,r,u)=>{o({x:u.clientX,y:u.clientY,value:r,device:t,timestamp:a}),H({x:u.clientX,y:u.clientY})},ne=()=>{o(null)},re=t=>{w(t)},se=()=>{w(null)},x=(($=Object.values(l)[0])==null?void 0:$.timestamps)||[],_=i.filter(t=>l[t]),le=t=>{if(t===0)return!1;const a=x[t],r=x[t-1],u=a.split(" ")[0],f=r.split(" ")[0];return u!==f};return _.length===0||x.length===0?n.jsx("div",{className:`text-center text-gray-500 p-8 ${m}`,children:"No data available for heatmap"}):n.jsxs("div",{className:`bg-white dark:bg-gray-800 rounded-lg p-4 relative ${m}`,onMouseMove:te,children:[n.jsxs("h3",{className:"text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4",children:[s==="hum"?"Humidity":s==="tmp"?"Temperature":"Battery"," Heatmap"]}),n.jsx("div",{className:"w-full",children:_.map(t=>n.jsxs("div",{className:"flex w-full",children:[n.jsx("div",{className:"w-32 flex-shrink-0 h-8 flex items-center px-2 text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-700",children:d[t]||t}),n.jsx("div",{className:"flex-1 flex",children:l[t][s].map((a,r)=>n.jsx("div",{className:ue("flex-1 h-8 cursor-pointer hover:opacity-80 transition-opacity relative",{"border-l-2 border-gray-400 border-opacity-50":le(r)}),style:{backgroundColor:T(a)},onMouseEnter:u=>ae(t,x[r],a,u),onMouseLeave:ne},r))})]},t))}),n.jsxs("div",{className:"mt-4 flex items-center justify-center gap-2",children:[n.jsx("span",{className:"text-sm text-gray-600 dark:text-gray-400",children:"Low"}),n.jsx("div",{className:"flex h-4 w-32 rounded cursor-crosshair",title:ee(I),children:Array.from({length:20},(t,a)=>n.jsx("div",{className:"flex-1 h-full hover:opacity-30 transition-opacity",style:{backgroundColor:T(p+(h-p)*(a/19))},onMouseEnter:()=>re(a),onMouseLeave:se},a))}),n.jsx("span",{className:"text-sm text-gray-600 dark:text-gray-400",children:"High"}),n.jsxs("span",{className:"text-xs text-gray-500 dark:text-gray-400 ml-2",children:["(",p.toFixed(1)," - ",h.toFixed(1),")"]})]}),e&&n.jsxs("div",{className:"fixed bg-gray-900 text-white text-sm rounded-lg px-3 py-2 shadow-lg z-50 pointer-events-none",style:{left:c.x+10,top:c.y-10,transform:c.x>window.innerWidth-200?"translateX(-100%)":"none"},children:[n.jsx("div",{className:"font-medium",children:d[e.device]||e.device}),n.jsx("div",{className:"text-gray-300",children:e.timestamp}),n.jsxs("div",{className:"text-gray-300",children:["Value: ",e.value!==null?e.value.toFixed(1):"N/A"]})]})]})};Z.__docgenInfo={description:"",methods:[],displayName:"HeatmapComponent",props:{groupedData:{required:!0,tsType:{name:"GroupedData"},description:""},selectedDevices:{required:!0,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:""},selectedMetric:{required:!0,tsType:{name:"union",raw:'"hum" | "tmp" | "bat"',elements:[{name:"literal",value:'"hum"'},{name:"literal",value:'"tmp"'},{name:"literal",value:'"bat"'}]},description:""},mappings:{required:!0,tsType:{name:"Record",elements:[{name:"string"},{name:"string"}],raw:"Record<string, string>"},description:""},className:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'""',computed:!1}}}};const ge={title:"Chart Components/HeatmapComponent",component:Z,parameters:{layout:"fullscreen"},tags:["autodocs"]},me=()=>{const l=Array.from({length:12},(d,m)=>`${(8+m).toString().padStart(2,"0")}:00`),i=["device001","device002","device003"],s={};return i.forEach(d=>{s[d]={hum:l.map((m,e)=>45+Math.random()*30+Math.sin(e*.5)*10),tmp:l.map((m,e)=>20+Math.random()*10+Math.cos(e*.3)*5),bat:l.map(()=>85+Math.random()*15),timestamps:l}}),s},N=me(),v={device001:"Living Room",device002:"Kitchen",device003:"Bedroom"},y={args:{groupedData:N,selectedDevices:["device001","device002","device003"],selectedMetric:"hum",mappings:v}},D={args:{groupedData:N,selectedDevices:["device001","device002","device003"],selectedMetric:"tmp",mappings:v}},M={args:{groupedData:N,selectedDevices:["device001","device002","device003"],selectedMetric:"bat",mappings:v}},S={args:{groupedData:N,selectedDevices:["device001"],selectedMetric:"hum",mappings:v}},b={args:{groupedData:{device001:{hum:[45,null,52,48,null,51,49,null,53,47,50,null],tmp:[22,23,null,24,23,null,25,24,23,null,22,23],bat:[90,89,88,null,86,85,null,83,82,81,null,79],timestamps:Array.from({length:12},(l,i)=>`${(8+i).toString().padStart(2,"0")}:00`)},device002:{hum:[null,48,49,null,52,50,51,null,49,48,null,47],tmp:[null,21,22,23,null,24,23,22,null,21,22,null],bat:[85,null,83,82,81,null,79,78,77,null,75,74],timestamps:Array.from({length:12},(l,i)=>`${(8+i).toString().padStart(2,"0")}:00`)}},selectedDevices:["device001","device002"],selectedMetric:"hum",mappings:v}},j={args:{groupedData:{},selectedDevices:[],selectedMetric:"hum",mappings:{}}};var L,A,q;y.parameters={...y.parameters,docs:{...(L=y.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    groupedData: mockGroupedData,
    selectedDevices: ['device001', 'device002', 'device003'],
    selectedMetric: 'hum',
    mappings: mockMappings
  }
}`,...(q=(A=y.parameters)==null?void 0:A.docs)==null?void 0:q.source}}};var V,R,G;D.parameters={...D.parameters,docs:{...(V=D.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    groupedData: mockGroupedData,
    selectedDevices: ['device001', 'device002', 'device003'],
    selectedMetric: 'tmp',
    mappings: mockMappings
  }
}`,...(G=(R=D.parameters)==null?void 0:R.docs)==null?void 0:G.source}}};var O,F,B;M.parameters={...M.parameters,docs:{...(O=M.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    groupedData: mockGroupedData,
    selectedDevices: ['device001', 'device002', 'device003'],
    selectedMetric: 'bat',
    mappings: mockMappings
  }
}`,...(B=(F=M.parameters)==null?void 0:F.docs)==null?void 0:B.source}}};var X,P,W;S.parameters={...S.parameters,docs:{...(X=S.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    groupedData: mockGroupedData,
    selectedDevices: ['device001'],
    selectedMetric: 'hum',
    mappings: mockMappings
  }
}`,...(W=(P=S.parameters)==null?void 0:P.docs)==null?void 0:W.source}}};var Y,z,K;b.parameters={...b.parameters,docs:{...(Y=b.parameters)==null?void 0:Y.docs,source:{originalSource:`{
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
}`,...(K=(z=b.parameters)==null?void 0:z.docs)==null?void 0:K.source}}};var J,Q,U;j.parameters={...j.parameters,docs:{...(J=j.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    groupedData: {},
    selectedDevices: [],
    selectedMetric: 'hum',
    mappings: {}
  }
}`,...(U=(Q=j.parameters)==null?void 0:Q.docs)==null?void 0:U.source}}};const ve=["HumidityHeatmap","TemperatureHeatmap","BatteryHeatmap","SingleDevice","WithMissingData","EmptyData"];export{M as BatteryHeatmap,j as EmptyData,y as HumidityHeatmap,S as SingleDevice,D as TemperatureHeatmap,b as WithMissingData,ve as __namedExportsOrder,ge as default};
