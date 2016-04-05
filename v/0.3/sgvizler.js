/*  Sgvizler JavaScript SPARQL result set visualizer, version 0.3.5
 *  (c) 2011 Martin G. Skjæveland
 *
 *  Sgvizler is freely distributable under the terms of an MIT-style license.
 *  Sgvizler web site: https://code.google.com/p/sgvizler/
 *
 *  Relies on Google Visualiztion API and jQuery:
 *    src="https://www.google.com/jsapi"
 *    src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"
 *--------------------------------------------------------------------------*/var sgvizler={home:window.location.href.replace(window.location.search,""),queryOptions:{},queryOptionDefaults:{query:"SELECT ?class (count(?instance) AS ?noOfInstances)\nWHERE{ ?instance a ?class }\nGROUP BY ?class\nORDER BY ?class",endpoint:"http://sws.ifi.uio.no/sparql/world",endpointOutput:"json",endpointQueryURL:"?output=text&amp;query=",validatorQueryURL:"http://www.sparql.org/query-validator?languageSyntax=SPARQL&amp;outputFormat=sparql&amp;linenumbers=true&amp;query=",chart:"gLineChart",loglevel:2},namespaces:{rdf:"http://www.w3.org/1999/02/22-rdf-syntax-ns#",rdfs:"http://www.w3.org/2000/01/rdf-schema#",owl:"http://www.w3.org/2002/07/owl#",xsd:"http://www.w3.org/2001/XMLSchema#"},chartOptions:{},chartOptionDefaults:{width:"800",height:"400",chartArea:{left:"5%",top:"5%",width:"75%",height:"80%"},gGeoMap:{dataMode:"markers"},gMap:{dataMode:"markers"},sMap:{dataMode:"markers",showTip:!0,useMapTypeControl:!0},gSparkline:{showAxisLines:!1}},html:{script:"sgvzlr_script",chartCon:"sgvzlr_gchart",queryForm:"sgvzlr_formQuery",queryTxt:"sgvzlr_cQuery",formQuery:"sgvzlr_strQuery",formWidth:"sgvzlr_strWidth",formHeight:"sgvzlr_strHeight",formChart:"sgvzlr_optChart",prefixCon:"sgvzlr_cPrefix",messageCon:"sgvzlr_cMessage",queryOptionPrefix:"data-sgvizler-",chartOption:"data-sgvizler-chart-options"},chartTypes:[],initGoogleObjects:function(){sgvizler.GChartTypes=[{id:"gLineChart",name:"Line Chart",func:google.visualization.LineChart},{id:"gAreaChart",name:"Area Chart",func:google.visualization.AreaChart},{id:"gPieChart",name:"Pie Chart",func:google.visualization.PieChart},{id:"gColumnChart",name:"Column Chart",func:google.visualization.ColumnChart},{id:"gBarChart",name:"Bar Chart",func:google.visualization.BarChart},{id:"gSparkline",name:"Sparkline",func:google.visualization.ImageSparkLine},{id:"gScatterChart",name:"Scatter Chart",func:google.visualization.ScatterChart},{id:"gCandlestickChart",name:"Candlestick Chart",func:google.visualization.CandlestickChart},{id:"gGauge",name:"Gauge",func:google.visualization.Gauge},{id:"gOrgChart",name:"Org Chart",func:google.visualization.OrgChart},{id:"gTreeMap",name:"Tree Map",func:google.visualization.TreeMap},{id:"gTimeline",name:"Timeline",func:google.visualization.AnnotatedTimeLine},{id:"gMotionChart",name:"Motion Chart",func:google.visualization.MotionChart},{id:"gGeoChart",name:"Geo Chart",func:google.visualization.GeoChart},{id:"gGeoMap",name:"Geo Map",func:google.visualization.GeoMap},{id:"gMap",name:"Map",func:google.visualization.Map},{id:"gTable",name:"Table",func:google.visualization.Table}]},visualization:{},example:{},go:function(){$.extend(sgvizler.queryOptionDefaults,sgvizler.queryOptions),$.extend(sgvizler.chartOptionDefaults,sgvizler.chartOptions),google.load("visualization","1.0",{packages:["annotatedtimeline","corechart","gauge","geomap","imagesparkline","map","orgchart","table","motionchart","treemap"]}),google.setOnLoadCallback(function(){sgvizler.initGoogleObjects(),$.merge(sgvizler.chartTypes,sgvizler.GChartTypes);for(var a in sgvizler.visualization)sgvizler.util.registerFunction({id:sgvizler.visualization[a].prototype.id,name:sgvizler.visualization[a].prototype.name,func:sgvizler.visualization[a]});sgvizler.draw()})},draw:function(){var a=sgvizler.util.getUrlParams(),b=$.extend({},sgvizler.queryOptionDefaults,a);$("#"+sgvizler.html.prefixCon).length&&sgvizler.ui.displayPrefixes(),$("#"+sgvizler.html.formChart).length&&sgvizler.ui.displayChartTypesMenu(),$("#"+sgvizler.html.formQuery).length&&sgvizler.ui.displayUserInput(b),$("#"+sgvizler.html.chartCon).length&&a.query&&(b.container=sgvizler.html.chartCon,sgvizler.drawChart(b,sgvizler.util.flattenChartOptions(b.chart))),sgvizler.drawContainerQueries()},drawContainerQueries:function(){$("["+sgvizler.html.queryOptionPrefix+"query]").each(function(){var a=$(this).attr("id"),b={container:a},c={};for(var d=0;d<this.attributes.length;d++){var e=this.attributes[d].name,f=this.attributes[d].value;e===sgvizler.html.chartOption?c=sgvizler.util.getContainerChartOptions(f):e.lastIndexOf(sgvizler.html.queryOptionPrefix,0)===0&&(b[e.substring(sgvizler.html.queryOptionPrefix.length)]=f)}typeof b.rdf!="undefined"&&(b.query=sgvizler.util.buildQueryWFrom(b.query,b.rdf)),c.width=$(this).css("width"),c.height=$(this).css("height"),b=$.extend(!0,{},sgvizler.queryOptionDefaults,b),c=$.extend(sgvizler.util.flattenChartOptions(b.chart),c),sgvizler.drawChart(b,c)})},drawChart:function(a,b){var c=sgvizler.util.getChartType(a.container,a.chart);sgvizler.runQuery(a,function(a){var d=new google.visualization.DataTable(a);c.draw(d,b)})},runQuery:function(a,b){sgvizler.ui.displayMessage(a.container,1,a),a.encodedQuery=encodeURIComponent(sgvizler.util.getPrefixes()+a.query);if($.browser.msie&&window.XDomainRequest){var c=new XDomainRequest,d=a.endpoint+"?query="+a.encodedQuery+"&output="+a.endpointOutput;c.open("GET",d),c.onload=function(){var d;a.endpointOutput==="json"?d=$.parseJSON(c.responseText):d=$.parseXML(c.responseText),sgvizler.processQueryResults(d,a,b)},c.send()}else $.get(a.endpoint,{query:sgvizler.util.getPrefixes()+a.query},function(c){sgvizler.processQueryResults(c,a,b)},a.endpointOutput).error(function(){sgvizler.ui.displayMessage(a.container,2,a)})},processQueryResults:function(a,b,c){var d=null;b.endpointOutput==="json"?d=sgvizler.parser.countRowsSparqlJSON(a):d=sgvizler.parser.countRowsSparqlXML(a),b.noRows=d,d===null?sgvizler.ui.displayMessage(b.container,3,b):d===0?sgvizler.ui.displayMessage(b.container,4,b):(sgvizler.ui.displayMessage(b.container,5,b),b.endpointOutput==="json"?a=sgvizler.parser.SparqlJSON2GoogleJSON(a):a=sgvizler.parser.SparqlXML2GoogleJSON(a),c(a))},util:{buildQueryWFrom:function(a,b){var c=b.split("|"),d="";for(var e in c)d+="FROM <"+c[e]+">\n";return a.replace(/(WHERE)?(\s)*\{/,"\n"+d+"WHERE {")},getContainerChartOptions:function(a){var b={},c=a.split("|");for(var d in c){var e=c[d].split("=");b[e[0]]=e[1]}return b},flattenChartOptions:function(a){var b=sgvizler.chartOptionDefaults,c={};for(var d in b)if(d===a)for(var e in b[d])c[e]=b[d][e];else c[d]=b[d];return c},getChartType:function(a,b){var c=document.getElementById(a),d=sgvizler.chartTypes;for(var e=0;e<d.length;e++)if(b===d[e].id)return new d[e].func(c)},registerFunction:function(a){sgvizler.chartTypes.push(a)},getUrlParams:function(){var a={},b=["query","chart","width","height"],c,d=/\+/g,e=/([^&=]+)=?([^&]*)/g,f=function(a){return decodeURIComponent(a.replace(d," "))},g=window.location.search.substring(1);while(c=e.exec(g))c[2].length>0&&$.inArray(c[1],b!==-1)&&(a[f(c[1])]=f(c[2]));return a},getPrefixes:function(){var a="";for(var b in sgvizler.namespaces)a+="PREFIX "+b+": <"+sgvizler.namespaces[b]+">\n";return a},prefixify:function(a){for(var b in sgvizler.namespaces)if(a.lastIndexOf(sgvizler.namespaces[b],0)===0)return a.replace(sgvizler.namespaces[b],b+":");return a},unprefixify:function(a){for(var b in sgvizler.namespaces)if(a.lastIndexOf(b+":",0)===0)return a.replace(b+":",sgvizler.namespaces[b]);return a}},ui:{displayUserInput:function(a){$("#"+sgvizler.html.queryTxt).val(a.query),$("#"+sgvizler.html.formChart).val(a.chart),$("#"+sgvizler.html.formWidth).val(a.width),$("#"+sgvizler.html.formHeight).val(a.height)},displayChartTypesMenu:function(){var a=sgvizler.chartTypes;for(var b=0;b<a.length;b++)$("#"+sgvizler.html.formChart).append($("<option/>").val(a[b].id).html(a[b].name))},displayMessage:function(a,b,c){var d="";if(c.loglevel===0)return;if(c.loglevel===1){if(b===1)d="Loading...";else if(b===2||b===3)d="Error."}else b===1?d="<p>Sending query...</p>":b===2?(d="<p>Error querying endpoint. Possible errors:<ul><li><a href='"+c.endpoint+"'>SPARQL endpoint</a> down?",typeof c.endpointQueryURL!="undefined"&&(d+=" <a href='"+c.endpoint+c.endpointQueryURL+c.encodedQuery+"'>"+"Check if query runs at the endpoint</a>"),d+=".</li><li>Malformed SPARQL query?",typeof c.validatorQueryURL!="undefined"&&(d+=" <a href='"+c.validatorQueryURL+c.encodedQuery+"'> Check if it validates</a>"),d+=".</li><li>CORS supported and enabled? If this page <code>"+sgvizler.home+"</code> and the SPARQL endpoint <code>"+c.endpoint+"</code> are <i>not</i> located at the same domain and port, does your "+"browser support CORS and is the endpoint CORS enabled? Read more about "+'<a href="http://code.google.com/p/sgvizler/wiki/Compatibility">CORS and compatibility</a>.</li>',d+='<li>Is your <a href="http://code.google.com/p/sgvizler/wiki/Compatibility">browser support</a>ed?.</li>',d+='<li>Hmm.. it might be a bug! Please file a report to <a href="http://code.google.com/p/sgvizler/issues/">the issues</a>.</li></ul></p>'):b===3?d="<p>Unknown error.</p>":b===4?d="<p>Query returned no results.</p>":b===5&&(d="<p>Received "+c.noRows+" rows. Drawing chart...",typeof c.endpointQueryURL!="undefined"&&(d+="<br/><a target='_blank' href='"+c.endpoint+c.endpointQueryURL+c.encodedQuery+"'>"+"View query results</a> (in new window)."),d+="</p>");a===sgvizler.html.chartCon&&sgvizler.html.messageCon.length?$("#"+sgvizler.html.messageCon).html(d):$("#"+a).html(d)},displayPrefixes:function(){$("#"+sgvizler.html.prefixCon).text(sgvizler.util.getPrefixes())},resetPage:function(){document.location=sgvizler.home},submitQuery:function(){$("#"+sgvizler.html.formQuery).val($("#"+sgvizler.html.queryTxt).val()),$("#"+sgvizler.html.queryForm).submit()}},parser:{defaultGDatatype:"string",countRowsSparqlXML:function(a){return $(a).find("sparql").find("results").find("result").length},countRowsSparqlJSON:function(a){if(typeof a.results.bindings!="undefined")return a.results.bindings.length},SparqlXML2GoogleJSON:function(a){var b=[],c=[],d=[],e=$(a).find("sparql").find("results").find("result"),f=0;$(a).find("sparql").find("head").find("variable").each(function(){var a=null,c=null,g=$(this).attr("name"),h=$(e).find('binding[name="'+g+'"]');if(h.length){var i=$(h).first().children().first()[0],a=i.nodeName;c=$(i).attr("datatype")}d[f]=sgvizler.parser.getGoogleJsonDatatype(a,c),b[f]={id:g,label:g,type:d[f]},f++});var g=0;return $(e).each(function(){var a=[];for(var e=0;e<b.length;e++){var f=null,h=$(this).find('binding[name="'+b[e].id+'"]');if(h.length&&$(h).first().children().first()!=="undefined"&&$(h).first().children().first().firstChild!==null){var i=$(h).first().children().first()[0],j=i.nodeName,k=$(i).first().text();f=sgvizler.parser.getGoogleJsonValue(k,d[e],j)}a[e]={v:f}}c[g]={c:a},g++}),{cols:b,rows:c}},SparqlJSON2GoogleJSON:function(a){var b=[],c=[],d=[],e=a.head.vars,f=a.results.bindings;for(var g=0;g<e.length;g++){var h=0,i=null,j=null;while(typeof f[h][e[g]]=="undefined"&&h+1<f.length)h++;typeof f[h][e[g]]!="undefined"&&(i=f[h][e[g]].type,j=f[h][e[g]].datatype),d[g]=sgvizler.parser.getGoogleJsonDatatype(i,j),b[g]={id:e[g],label:e[g],type:d[g]}}for(var h=0;h<f.length;h++){var k=f[h],l=[];for(var g=0;g<e.length;g++){var m=null;typeof k[e[g]]!="undefined"&&typeof k[e[g]].value!="undefined"&&(m=sgvizler.parser.getGoogleJsonValue(k[e[g]].value,d[g],k[e[g]].type)),l[g]={v:m}}c[h]={c:l}}return{cols:b,rows:c}},getGoogleJsonValue:function(a,b,c){return b==="number"?Number(a):b==="date"?new Date(a.substr(0,4),a.substr(5,2),a.substr(8,2)):b==="datetime"?new Date(a.substr(0,4),a.substr(5,2),a.substr(8,2),a.substr(11,2),a.substr(14,2),a.substr(17,2)):b==="timeofday"?[a.substr(0,2),a.substr(3,2),a.substr(6,2)]:c==="uri"?sgvizler.util.prefixify(a):a},getGoogleJsonDatatype:function(a,b){if(typeof a!="undefined"&&(a==="typed-literal"||a==="literal")){if(b==="http://www.w3.org/2001/XMLSchema#float"||b==="http://www.w3.org/2001/XMLSchema#double"||b==="http://www.w3.org/2001/XMLSchema#decimal"||b==="http://www.w3.org/2001/XMLSchema#int"||b==="http://www.w3.org/2001/XMLSchema#long"||b==="http://www.w3.org/2001/XMLSchema#integer")return"number";if(b==="http://www.w3.org/2001/XMLSchema#boolean")return"boolean";if(b==="http://www.w3.org/2001/XMLSchema#date")return"date";if(b==="http://www.w3.org/2001/XMLSchema#dateTime")return"datetime";if(b==="http://www.w3.org/2001/XMLSchema#time")return"timeofday"}return sgvizler.parser.defaultGDatatype}}},scriptfolder=$("#"+sgvizler.html.script).length?$("#"+sgvizler.html.script).attr("src").replace(/sgvizler\.js$/,""):"";$.getScript(scriptfolder+"sgvizler.visualization.js"),$("head").append('<link rel="stylesheet" href="'+scriptfolder+'sgvizler.visualization.css" type="text/css" />'),jQuery.ajaxSetup({accepts:{xml:"application/sparql-results+xml",json:"application/sparql-results+json"}})