/*! For license information please see charts-react-src-__tests__-Sparkline-stories.1b11cf16.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkessex_toolkit_stories=self.webpackChunkessex_toolkit_stories||[]).push([[5670],{"../../.yarn/__virtual__/@thematic-d3-virtual-8d66f24e9b/0/cache/@thematic-d3-npm-2.0.22-01fffb296c-2f9005e50f.zip/node_modules/@thematic/d3/dist/svg.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{function svg(selection,child){return selection.attr("fill",child.backgroundColor().hex())}function mark(selection,child){return selection.attr("fill",(d=>child.fill(d).hex())).attr("fill-opacity",(d=>child.fillOpacity(d))).attr("stroke",(d=>child.stroke(d).hex())).attr("stroke-opacity",(d=>child.strokeOpacity(d))).attr("stroke-width",(d=>child.strokeWidth(d)))}function rect(selection,child){return selection.call(mark,child)}function line(selection,child){return selection.call(mark,child)}__webpack_require__.d(__webpack_exports__,{JA:()=>rect,YP:()=>svg,jv:()=>line})},"../charts-react/src/__tests__/Sparkline.stories.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,default:()=>Sparkline_stories});var jsx_runtime=__webpack_require__("../../.yarn/cache/react-npm-18.3.1-af38f3c1ae-261137d3f3.zip/node_modules/react/jsx-runtime.js"),svg=__webpack_require__("../../.yarn/__virtual__/@thematic-d3-virtual-8d66f24e9b/0/cache/@thematic-d3-npm-2.0.22-01fffb296c-2f9005e50f.zip/node_modules/@thematic/d3/dist/svg.js"),useThematic=__webpack_require__("../../.yarn/__virtual__/@thematic-react-virtual-1d715ad545/0/cache/@thematic-react-npm-2.1.9-5021c00aed-19e6347a18.zip/node_modules/@thematic/react/dist/useThematic.js");Array.prototype.slice;function constant(x){return function constant(){return x}}function Linear(context){this._context=context}function linear(context){return new Linear(context)}Linear.prototype={areaStart:function(){this._line=0},areaEnd:function(){this._line=NaN},lineStart:function(){this._point=0},lineEnd:function(){(this._line||0!==this._line&&1===this._point)&&this._context.closePath(),this._line=1-this._line},point:function(x,y){switch(x=+x,y=+y,this._point){case 0:this._point=1,this._line?this._context.lineTo(x,y):this._context.moveTo(x,y);break;case 1:this._point=2;default:this._context.lineTo(x,y)}}};const pi=Math.PI,tau=2*pi,tauEpsilon=tau-1e-6;function append(strings){this._+=strings[0];for(let i=1,n=strings.length;i<n;++i)this._+=arguments[i]+strings[i]}class Path{constructor(digits){this._x0=this._y0=this._x1=this._y1=null,this._="",this._append=null==digits?append:function appendRound(digits){let d=Math.floor(digits);if(!(d>=0))throw new Error(`invalid digits: ${digits}`);if(d>15)return append;const k=10**d;return function(strings){this._+=strings[0];for(let i=1,n=strings.length;i<n;++i)this._+=Math.round(arguments[i]*k)/k+strings[i]}}(digits)}moveTo(x,y){this._append`M${this._x0=this._x1=+x},${this._y0=this._y1=+y}`}closePath(){null!==this._x1&&(this._x1=this._x0,this._y1=this._y0,this._append`Z`)}lineTo(x,y){this._append`L${this._x1=+x},${this._y1=+y}`}quadraticCurveTo(x1,y1,x,y){this._append`Q${+x1},${+y1},${this._x1=+x},${this._y1=+y}`}bezierCurveTo(x1,y1,x2,y2,x,y){this._append`C${+x1},${+y1},${+x2},${+y2},${this._x1=+x},${this._y1=+y}`}arcTo(x1,y1,x2,y2,r){if(x1=+x1,y1=+y1,x2=+x2,y2=+y2,(r=+r)<0)throw new Error(`negative radius: ${r}`);let x0=this._x1,y0=this._y1,x21=x2-x1,y21=y2-y1,x01=x0-x1,y01=y0-y1,l01_2=x01*x01+y01*y01;if(null===this._x1)this._append`M${this._x1=x1},${this._y1=y1}`;else if(l01_2>1e-6)if(Math.abs(y01*x21-y21*x01)>1e-6&&r){let x20=x2-x0,y20=y2-y0,l21_2=x21*x21+y21*y21,l20_2=x20*x20+y20*y20,l21=Math.sqrt(l21_2),l01=Math.sqrt(l01_2),l=r*Math.tan((pi-Math.acos((l21_2+l01_2-l20_2)/(2*l21*l01)))/2),t01=l/l01,t21=l/l21;Math.abs(t01-1)>1e-6&&this._append`L${x1+t01*x01},${y1+t01*y01}`,this._append`A${r},${r},0,0,${+(y01*x20>x01*y20)},${this._x1=x1+t21*x21},${this._y1=y1+t21*y21}`}else this._append`L${this._x1=x1},${this._y1=y1}`;else;}arc(x,y,r,a0,a1,ccw){if(x=+x,y=+y,ccw=!!ccw,(r=+r)<0)throw new Error(`negative radius: ${r}`);let dx=r*Math.cos(a0),dy=r*Math.sin(a0),x0=x+dx,y0=y+dy,cw=1^ccw,da=ccw?a0-a1:a1-a0;null===this._x1?this._append`M${x0},${y0}`:(Math.abs(this._x1-x0)>1e-6||Math.abs(this._y1-y0)>1e-6)&&this._append`L${x0},${y0}`,r&&(da<0&&(da=da%tau+tau),da>tauEpsilon?this._append`A${r},${r},0,1,${cw},${x-dx},${y-dy}A${r},${r},0,1,${cw},${this._x1=x0},${this._y1=y0}`:da>1e-6&&this._append`A${r},${r},0,${+(da>=pi)},${cw},${this._x1=x+r*Math.cos(a1)},${this._y1=y+r*Math.sin(a1)}`)}rect(x,y,w,h){this._append`M${this._x0=this._x1=+x},${this._y0=this._y1=+y}h${w=+w}v${+h}h${-w}Z`}toString(){return this._}}function point_x(p){return p[0]}function point_y(p){return p[1]}function line(x,y){var defined=constant(!0),context=null,curve=linear,output=null,path=function withPath(shape){let digits=3;return shape.digits=function(_){if(!arguments.length)return digits;if(null==_)digits=null;else{const d=Math.floor(_);if(!(d>=0))throw new RangeError(`invalid digits: ${_}`);digits=d}return shape},()=>new Path(digits)}(line);function line(data){var i,d,buffer,n=(data=function array(x){return"object"==typeof x&&"length"in x?x:Array.from(x)}(data)).length,defined0=!1;for(null==context&&(output=curve(buffer=path())),i=0;i<=n;++i)!(i<n&&defined(d=data[i],i,data))===defined0&&((defined0=!defined0)?output.lineStart():output.lineEnd()),defined0&&output.point(+x(d,i,data),+y(d,i,data));if(buffer)return output=null,buffer+""||null}return x="function"==typeof x?x:void 0===x?point_x:constant(x),y="function"==typeof y?y:void 0===y?point_y:constant(y),line.x=function(_){return arguments.length?(x="function"==typeof _?_:constant(+_),line):x},line.y=function(_){return arguments.length?(y="function"==typeof _?_:constant(+_),line):y},line.defined=function(_){return arguments.length?(defined="function"==typeof _?_:constant(!!_),line):defined},line.curve=function(_){return arguments.length?(curve=_,null!=context&&(output=curve(context)),line):curve},line.context=function(_){return arguments.length?(null==_?context=output=null:output=curve(context=_),line):context},line}Path.prototype;var react=__webpack_require__("../../.yarn/cache/react-npm-18.3.1-af38f3c1ae-261137d3f3.zip/node_modules/react/index.js"),hooks=__webpack_require__("../charts-react/src/hooks.ts");const Sparkline=(0,react.memo)((function Sparkline({data,width,height,color}){const theme=(0,useThematic.J)(),ref=(0,react.useRef)(null),lineColor=(0,react.useMemo)((()=>color||theme.line().stroke().hex()),[theme,color]),xScale=(0,hooks.tX)(data,[0,width]),yScale=(0,hooks.Dp)(data,[height,0]);(0,hooks.D$)(ref,width,height);const group=(0,hooks.At)(ref,width,height),path=(0,react.useMemo)((()=>line(xScale,yScale)(data)),[data,xScale,yScale]);return(0,react.useLayoutEffect)((()=>{group&&(group.selectAll("*").remove(),group.append("path").call(svg.jv,theme.line()).attr("d",path).attr("stroke-width",1).attr("stroke",lineColor))}),[theme,group,path,lineColor]),(0,jsx_runtime.jsx)("svg",{ref})}));try{Sparkline.displayName="Sparkline",Sparkline.__docgenInfo={description:"Renders a basic Sparkline",displayName:"Sparkline",props:{data:{defaultValue:null,description:"",name:"data",required:!0,type:{name:"number[]"}},width:{defaultValue:null,description:"",name:"width",required:!0,type:{name:"number"}},height:{defaultValue:null,description:"",name:"height",required:!0,type:{name:"number"}},color:{defaultValue:null,description:"",name:"color",required:!1,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["../charts-react/src/Sparkline.tsx#Sparkline"]={docgenInfo:Sparkline.__docgenInfo,name:"Sparkline",path:"../charts-react/src/Sparkline.tsx#Sparkline"})}catch(__react_docgen_typescript_loader_error){}const Sparkline_stories={title:"@essex:charts-react/Sparkline",component:Sparkline,args:{width:150,height:30,data:[1,2,1.5,4,5,4,7]}},Primary={name:"Sparkline"};Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"{\n  name: 'Sparkline'\n}",...Primary.parameters?.docs?.source}}}},"../charts-react/src/hooks.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{D$:()=>useChartSVG,tX:()=>useIndexedScale,Dp:()=>useNumericLinearScale,At:()=>usePlotGroup});var dist_svg=__webpack_require__("../../.yarn/__virtual__/@thematic-d3-virtual-8d66f24e9b/0/cache/@thematic-d3-npm-2.0.22-01fffb296c-2f9005e50f.zip/node_modules/@thematic/d3/dist/svg.js");function getSelectionOptions(_selection,options){return{on:(null==options?void 0:options.on)||{},attr:(null==options?void 0:options.attr)||{},classed:(null==options?void 0:options.classed)||{},style:(null==options?void 0:options.style)||{}}}function attr(selection,attrs){let ret=selection;return Object.entries(attrs||{}).forEach((entry=>{const[key,value]=entry;ret=selection.attr(key,value)})),ret}function on(selection,ons){let ret=selection;return Object.entries(ons||{}).forEach((entry=>{const[key,value]=entry;ret=selection.on(key,value)})),ret}function classed(selection,classes){let ret=selection;return Object.entries(classes||{}).forEach((entry=>{const[key,value]=entry;ret=selection.classed(key,value)})),ret}function style(selection,styles){let ret=selection;return Object.entries(styles||{}).forEach((entry=>{const[key,value]=entry;ret=selection.style(key,value)})),ret}function applyBaseOptions(selection,options){return selection.call(on,null==options?void 0:options.on).call(attr,null==options?void 0:options.attr).call(classed,null==options?void 0:options.classed).call(style,null==options?void 0:options.style)}function chart(svg,theme,options){const opts=function getChartOptions(selection,options){const w=null==options?void 0:options.width,h=null==options?void 0:options.height,width=w||+selection.attr("width")||0,height=h||+selection.attr("height")||0,sOpts=getSelectionOptions(0,options);return{on:sOpts.on,attr:{width,height,...sOpts.attr},classed:sOpts.classed,style:sOpts.style}}(svg,options);return svg.classed("thematic-chart",!0).call(dist_svg.YP,theme.chart()).call(applyBaseOptions,opts)}function plotArea(group,theme,options){const p=theme.plotArea(),opts=function getPlotAreaOptions(selection,options){const marginTop=(null==options?void 0:options.marginTop)||0,marginBottom=(null==options?void 0:options.marginBottom)||0,marginLeft=(null==options?void 0:options.marginLeft)||0,marginRight=(null==options?void 0:options.marginRight)||0,w=null==options?void 0:options.width,h=null==options?void 0:options.height,parent=selection.select((function(){return this.parentNode})),pw=parent&&+parent.attr("width")||0,ph=parent&&+parent.attr("height")||0,width=w||pw-marginLeft-marginRight,height=h||ph-marginTop-marginBottom,sOpts=getSelectionOptions(0,options);return{width,height,marginTop,marginBottom,marginLeft,marginRight,on:sOpts.on,attr:{width,height,...sOpts.attr},classed:sOpts.classed,style:sOpts.style}}(group,options),{marginTop,marginLeft}=opts;return group.classed("thematic-plot-area",!0).attr("transform",`translate(${null!=marginLeft?marginLeft:0},${null!=marginTop?marginTop:0})`),group.select(".thematic-plot-area-background").remove(),group.insert("rect",":first-child").classed("thematic-plot-area-background",!0).call(dist_svg.JA,p).call(applyBaseOptions,opts),group}var useThematic=__webpack_require__("../../.yarn/__virtual__/@thematic-react-virtual-1d715ad545/0/cache/@thematic-react-npm-2.1.9-5021c00aed-19e6347a18.zip/node_modules/@thematic/react/dist/useThematic.js"),src_linear=__webpack_require__("../../.yarn/cache/d3-scale-npm-4.0.2-d17a53447b-e2dc424358.zip/node_modules/d3-scale/src/linear.js"),src_select=__webpack_require__("../../.yarn/cache/d3-selection-npm-3.0.0-39a42b4ca9-0e5acfd305.zip/node_modules/d3-selection/src/select.js"),react=__webpack_require__("../../.yarn/cache/react-npm-18.3.1-af38f3c1ae-261137d3f3.zip/node_modules/react/index.js");function useIndexedScale(values,range){const linear=(0,react.useMemo)((()=>(0,src_linear.Z)().domain([0,values.length-1]).range(range).clamp(!0)),[values,range]);return(0,react.useMemo)((()=>(_d,i)=>linear(i)),[linear])}function useNumericLinearScale(values,range){const extent=(0,react.useMemo)((()=>[Math.min(...values),Math.max(...values)]),[values]),linear=(0,react.useMemo)((()=>(0,src_linear.Z)().domain(extent).range(range)),[extent,range]);return(0,react.useMemo)((()=>extent[0]===extent[1]?()=>range[1]:d=>linear(d)),[linear,extent,range])}function useChartSVG(svgRef,width,height){const theme=(0,useThematic.J)();(0,react.useLayoutEffect)((()=>{(0,src_select.Z)(svgRef.current).call(chart,theme,{width:width<0?0:width,height:height<0?0:height})}),[theme,svgRef,width,height])}function usePlotGroup(svgRef,width,height){const theme=(0,useThematic.J)(),[group,setGroup]=(0,react.useState)();return(0,react.useLayoutEffect)((()=>{const g=(0,src_select.Z)(svgRef.current).append("g").call(plotArea,theme).append("g");setGroup(g)}),[theme,svgRef,width,height]),group}}}]);