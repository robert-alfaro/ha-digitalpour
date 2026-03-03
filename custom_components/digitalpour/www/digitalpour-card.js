function t(t,e,i,o){var s,r=arguments.length,n=r<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,o);else for(var l=t.length-1;l>=0;l--)(s=t[l])&&(n=(r<3?s(n):r>3?s(e,i,n):s(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e=window,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;class r{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}}const n=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new r(i,t,o)},l=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,o))(e)})(t):t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var a;const d=window,h=d.trustedTypes,p=h?h.emptyScript:"",c=d.reactiveElementPolyfillSupport,u={toAttribute(t,e){switch(e){case Boolean:t=t?p:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},g=(t,e)=>e!==t&&(e==e||t==t),_={attribute:!0,type:String,converter:u,reflect:!1,hasChanged:g},v="finalized";class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this._$Eu()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach((e,i)=>{const o=this._$Ep(i,e);void 0!==o&&(this._$Ev.set(o,i),t.push(o))}),t}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,o=this.getPropertyDescriptor(t,i,e);void 0!==o&&Object.defineProperty(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(o){const s=this[t];this[e]=o,this.requestUpdate(t,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||_}static finalize(){if(this.hasOwnProperty(v))return!1;this[v]=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}_$Eu(){var t;this._$E_=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach(t=>t(this))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])})}createRenderRoot(){var t;const o=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{i?t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet):o.forEach(i=>{const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)})})(o,this.constructor.elementStyles),o}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)})}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)})}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=_){var o;const s=this.constructor._$Ep(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==(null===(o=i.converter)||void 0===o?void 0:o.toAttribute)?i.converter:u).toAttribute(e,i.type);this._$El=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$El=null}}_$AK(t,e){var i;const o=this.constructor,s=o._$Ev.get(t);if(void 0!==s&&this._$El!==s){const t=o.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:u;this._$El=s,this[s]=r.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let o=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||g)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):o=!1),!this.isUpdatePending&&o&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((t,e)=>this[e]=t),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach(t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)}),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach(t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach((t,e)=>this._$EO(e,this[e],t)),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var m;f[v]=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==c||c({ReactiveElement:f}),(null!==(a=d.reactiveElementVersions)&&void 0!==a?a:d.reactiveElementVersions=[]).push("1.6.3");const $=window,b=$.trustedTypes,y=b?b.createPolicy("lit-html",{createHTML:t=>t}):void 0,w="$lit$",x=`lit$${(Math.random()+"").slice(9)}$`,A="?"+x,k=`<${A}>`,E=document,S=()=>E.createComment(""),C=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,P="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,T=/>/g,O=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,M=/"/g,j=/^(?:script|style|textarea|title)$/i,z=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),L=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),D=new WeakMap,I=E.createTreeWalker(E,129,null,!1);function V(t,e){if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==y?y.createHTML(e):e}const F=(t,e)=>{const i=t.length-1,o=[];let s,r=2===e?"<svg>":"",n=U;for(let e=0;e<i;e++){const i=t[e];let l,a,d=-1,h=0;for(;h<i.length&&(n.lastIndex=h,a=n.exec(i),null!==a);)h=n.lastIndex,n===U?"!--"===a[1]?n=H:void 0!==a[1]?n=T:void 0!==a[2]?(j.test(a[2])&&(s=RegExp("</"+a[2],"g")),n=O):void 0!==a[3]&&(n=O):n===O?">"===a[0]?(n=null!=s?s:U,d=-1):void 0===a[1]?d=-2:(d=n.lastIndex-a[2].length,l=a[1],n=void 0===a[3]?O:'"'===a[3]?M:R):n===M||n===R?n=O:n===H||n===T?n=U:(n=O,s=void 0);const p=n===O&&t[e+1].startsWith("/>")?" ":"";r+=n===U?i+k:d>=0?(o.push(l),i.slice(0,d)+w+i.slice(d)+x+p):i+x+(-2===d?(o.push(void 0),e):p)}return[V(t,r+(t[i]||"<?>")+(2===e?"</svg>":"")),o]};class W{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,r=0;const n=t.length-1,l=this.parts,[a,d]=F(t,e);if(this.el=W.createElement(a,i),I.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(o=I.nextNode())&&l.length<n;){if(1===o.nodeType){if(o.hasAttributes()){const t=[];for(const e of o.getAttributeNames())if(e.endsWith(w)||e.startsWith(x)){const i=d[r++];if(t.push(e),void 0!==i){const t=o.getAttribute(i.toLowerCase()+w).split(x),e=/([.?@])?(.*)/.exec(i);l.push({type:1,index:s,name:e[2],strings:t,ctor:"."===e[1]?G:"?"===e[1]?X:"@"===e[1]?Y:Z})}else l.push({type:6,index:s})}for(const e of t)o.removeAttribute(e)}if(j.test(o.tagName)){const t=o.textContent.split(x),e=t.length-1;if(e>0){o.textContent=b?b.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],S()),I.nextNode(),l.push({type:2,index:++s});o.append(t[e],S())}}}else if(8===o.nodeType)if(o.data===A)l.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(x,t+1));)l.push({type:7,index:s}),t+=x.length-1}s++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function q(t,e,i=t,o){var s,r,n,l;if(e===L)return e;let a=void 0!==o?null===(s=i._$Co)||void 0===s?void 0:s[o]:i._$Cl;const d=C(e)?void 0:e._$litDirective$;return(null==a?void 0:a.constructor)!==d&&(null===(r=null==a?void 0:a._$AO)||void 0===r||r.call(a,!1),void 0===d?a=void 0:(a=new d(t),a._$AT(t,i,o)),void 0!==o?(null!==(n=(l=i)._$Co)&&void 0!==n?n:l._$Co=[])[o]=a:i._$Cl=a),void 0!==a&&(e=q(t,a._$AS(t,e.values),a,o)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:o}=this._$AD,s=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:E).importNode(i,!0);I.currentNode=s;let r=I.nextNode(),n=0,l=0,a=o[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new K(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new tt(r,this,t)),this._$AV.push(e),a=o[++l]}n!==(null==a?void 0:a.index)&&(r=I.nextNode(),n++)}return I.currentNode=E,s}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class K{constructor(t,e,i,o){var s;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cp=null===(s=null==o?void 0:o.isConnected)||void 0===s||s}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),C(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==L&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>N(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==B&&C(this._$AH)?this._$AA.nextSibling.data=t:this.$(E.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:o}=t,s="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=W.createElement(V(o.h,o.h[0]),this.options)),o);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===s)this._$AH.v(i);else{const t=new J(s,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=D.get(t.strings);return void 0===e&&D.set(t.strings,e=new W(t)),e}T(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new K(this.k(S()),this.k(S()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Z{constructor(t,e,i,o,s){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,o){const s=this.strings;let r=!1;if(void 0===s)t=q(this,t,e,0),r=!C(t)||t!==this._$AH&&t!==L,r&&(this._$AH=t);else{const o=t;let n,l;for(t=s[0],n=0;n<s.length-1;n++)l=q(this,o[i+n],e,n),l===L&&(l=this._$AH[n]),r||(r=!C(l)||l!==this._$AH[n]),l===B?t=B:t!==B&&(t+=(null!=l?l:"")+s[n+1]),this._$AH[n]=l}r&&!o&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class G extends Z{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}const Q=b?b.emptyScript:"";class X extends Z{constructor(){super(...arguments),this.type=4}j(t){t&&t!==B?this.element.setAttribute(this.name,Q):this.element.removeAttribute(this.name)}}class Y extends Z{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=q(this,t,e,0))&&void 0!==i?i:B)===L)return;const o=this._$AH,s=t===B&&o!==B||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,r=t!==B&&(o===B||s);s&&this.element.removeEventListener(this.name,this,o),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class tt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const et=$.litHtmlPolyfillSupport;null==et||et(W,K),(null!==(m=$.litHtmlVersions)&&void 0!==m?m:$.litHtmlVersions=[]).push("2.8.0");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var it,ot;class st extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var o,s;const r=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:e;let n=r._$litPart$;if(void 0===n){const t=null!==(s=null==i?void 0:i.renderBefore)&&void 0!==s?s:null;r._$litPart$=n=new K(e.insertBefore(S(),t),t,void 0,null!=i?i:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return L}}st.finalized=!0,st._$litElement$=!0,null===(it=globalThis.litElementHydrateSupport)||void 0===it||it.call(globalThis,{LitElement:st});const rt=globalThis.litElementPolyfillSupport;null==rt||rt({LitElement:st}),(null!==(ot=globalThis.litElementVersions)&&void 0!==ot?ot:globalThis.litElementVersions=[]).push("3.3.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const nt=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:o}=e;return{kind:i,elements:o,finisher(e){customElements.define(t,e)}}})(t,e),lt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function at(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):lt(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function dt(t){return at({...t,state:!0})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var ht;null===(ht=window.HTMLSlotElement)||void 0===ht||ht.prototype.assignedElements;let pt=class extends st{constructor(){super(...arguments),this._brokenLogos={}}static getStubConfig(){return{type:"custom:digitalpour-card",entity:"sensor.digitalpour_tap_list"}}static getConfigElement(){return document.createElement("digitalpour-card-editor")}setConfig(t){if(!t.entity)throw new Error("Entity is required");this._config={show_title:!0,show_tap_number:!0,show_logos:!0,show_style:!0,show_details:!0,show_keg:!0,show_just_tapped:!0,show_level_percent:!0,...t}}render(){if(!this.hass||!this._config)return z``;const t=this.hass.states[this._config.entity];if(!t)return this._renderError(`Entity not found: ${this._config.entity}`);const e=t.attributes.taps;if(!Array.isArray(e))return this._renderError(`Entity ${t.entity_id} has no 'taps' attribute list`);const i=[...e].sort((t,e)=>this._tapSort(t.tap_number,e.tap_number)),o=this._config.max_rows?i.slice(0,this._config.max_rows):i,s=!1!==this._config.show_title;return z`
      <ha-card>
        <div class="wrapper">
          ${s?z`<div class="header">${this._config.title??"Current Tap List"}</div>`:B}
          <div class="list">
            ${o.map(t=>this._renderRow(t))}
          </div>
        </div>
      </ha-card>
    `}_renderRow(t){const e=!1!==this._config?.show_tap_number,i=!1!==this._config?.show_logos,o=!1!==this._config?.show_style,s=!1!==this._config?.show_details,r=!1!==this._config?.show_keg,n=!1!==this._config?.show_just_tapped,l=!1!==this._config?.show_level_percent,a="number"==typeof t.abv?`${t.abv}% ABV`:"",d=t.beverage_style??"",h=this._hexOrNull(t.beverage_color),p=[t.location??"",a].filter(Boolean).join(" • "),c=[t.producer??"",t.beverage??""].filter(Boolean).join(" "),u=this._normalizeLevel(t.keg_level_percent),g=this._kegColor(u,t.keg_level_color),_=`${u}%`,v=`${t.tap_number??"x"}|${t.logo_url??""}`,f=Boolean(t.logo_url)&&!this._brokenLogos[v],m=`${e?"":"no-tap-number"} ${i?"":"no-logo"} ${r?"":"no-keg"}`.trim();return z`
      <div class="row ${m}">
        ${e?z`<div class="tap-number">${t.tap_number??"?"}</div>`:B}

        ${i?f?z`<img
                class="logo"
                src="${t.logo_url}"
                alt="${t.producer??"Producer"}"
                loading="lazy"
                @error=${()=>this._markLogoBroken(v)}
              />`:z`<div class="logo logo-placeholder" aria-hidden="true"></div>`:B}

        <div class="info">
          <div class="title-line" title=${c}>
            <span class="producer">${t.producer??"Unknown producer"}</span>
            <span class="beverage">${t.beverage??"Unknown beverage"}</span>
          </div>
          ${o?z`<div class="meta style-line">
                <span
                  class="beverage-color"
                  style=${h?`background:${h}`:""}
                  aria-hidden="true"
                ></span>
                <span class="style-text" title=${d||"Unknown style"}>${d||"Unknown style"}</span>
              </div>`:B}
          ${s?z`<div class="meta" title=${p||"Unknown location"}>${p||"Unknown location"}</div>`:B}
        </div>

        ${r?z`<div class="right-col">
              <div class="keg-visual" role="img" aria-label="Keg level ${u}%">
                <img class="keg-bottom" src="${"https://fbpage.digitalpour.com/empty_keg_bottom.png"}" alt="" />
                <div class="keg-fill-mask">
                  <div class="keg-fill" style="height:${_};background:${g}"></div>
                </div>
                <img class="keg-front" src="${"https://fbpage.digitalpour.com/empty_keg_front.png"}" alt="" />
                ${n&&t.just_tapped?z`<span class="keg-badge">Just Tapped</span>`:B}
              </div>
              ${l?z`<div class="level">${u}%</div>`:B}
            </div>`:B}
      </div>
    `}_renderError(t){return z`
      <ha-card>
        <div class="wrapper error">${t}</div>
      </ha-card>
    `}getCardSize(){return 6}getGridOptions(){return{rows:6,columns:12,min_rows:3,max_rows:12}}_normalizeLevel(t){return"number"!=typeof t||Number.isNaN(t)?0:Math.max(0,Math.min(100,Math.round(t)))}_tapSort(t,e){const i=Number.parseInt(t??"",10),o=Number.parseInt(e??"",10);return Number.isNaN(i)&&Number.isNaN(o)?(t??"").localeCompare(e??""):Number.isNaN(i)?1:Number.isNaN(o)?-1:i-o}_kegColor(t,e){return e&&/^#[0-9A-Fa-f]{6}$/.test(e)?e:t>=75?"#22FF28":t>=50?"#B8FF28":t>=25?"#FFE428":t>=10?"#FF8928":"#FF1F28"}_hexOrNull(t){return t&&/^#[0-9A-Fa-f]{6}$/.test(t)?t:null}_markLogoBroken(t){this._brokenLogos[t]||(this._brokenLogos={...this._brokenLogos,[t]:!0})}};pt.styles=n`
    :host {
      --dp-accent: #ec702a;
      --dp-muted: #5f6368;
      --dp-line: #d7d9dc;
      display: block;
    }

    ha-card {
      overflow: hidden;
    }

    .wrapper {
      padding: 12px;
    }

    .header {
      font-weight: 600;
      font-size: 1.1rem;
      margin-bottom: 10px;
      color: var(--primary-text-color);
    }

    .list {
      display: grid;
      gap: 10px;
    }

    .row {
      display: grid;
      grid-template-columns: 34px 44px 1fr auto;
      align-items: center;
      gap: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--dp-line);
    }

    .row:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }

    .row.no-logo {
      grid-template-columns: 34px 1fr auto;
    }

    .row.no-keg {
      grid-template-columns: 34px 44px 1fr;
    }

    .row.no-logo.no-keg {
      grid-template-columns: 34px 1fr;
    }

    .row.no-tap-number {
      grid-template-columns: 44px 1fr auto;
    }

    .row.no-tap-number.no-logo {
      grid-template-columns: 1fr auto;
    }

    .row.no-tap-number.no-keg {
      grid-template-columns: 44px 1fr;
    }

    .row.no-tap-number.no-logo.no-keg {
      grid-template-columns: 1fr;
    }

    .tap-number {
      text-align: center;
      font-weight: 700;
      font-size: 1rem;
    }

    .logo {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid var(--dp-line);
      background: #fff;
    }

    .logo-placeholder {
      display: block;
      background:
        linear-gradient(135deg, #f3f4f6 0%, #ffffff 50%, #eef1f4 100%);
      position: relative;
    }

    .logo-placeholder::after {
      content: "";
      position: absolute;
      inset: 11px;
      border: 2px solid #c4cad1;
      border-radius: 6px;
      transform: rotate(45deg);
    }

    .info {
      min-width: 0;
    }

    .title-line {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .producer {
      font-weight: 600;
      margin-right: 6px;
      color: var(--primary-text-color);
    }

    .beverage {
      color: var(--dp-accent);
      font-weight: 600;
    }

    .meta {
      margin-top: 2px;
      //color: var(--dp-muted);
      font-size: 0.85rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .style-line {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .beverage-color {
      width: 10px;
      height: 10px;
      border-radius: 2px;
      border: 1px solid #d8dce1;
      background: transparent;
      flex: 0 0 auto;
    }

    .style-text {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .right-col {
      display: grid;
      justify-items: center;
      gap: 2px;
      min-width: 70px;
    }

    .keg-visual {
      width: 28px;
      height: 46px;
      position: relative;
    }

    .keg-bottom {
      width: 28px;
      height: 46px;
      position: absolute;
      inset: 0;
      object-fit: contain;
    }

    .keg-front {
      width: 28px;
      height: 46px;
      position: absolute;
      inset: 0;
      object-fit: contain;
      opacity: 0.5;
      z-index: 2;
    }

    .keg-fill-mask {
      position: absolute;
      left: 7px;
      bottom: 11px;
      width: 14px;
      height: 26px;
      overflow: hidden;
      border-radius: 2px;
      z-index: 1;
    }

    .keg-fill {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 2px 2px 0 0;
      opacity: 0.75;
      transition: height 240ms ease;
    }

    .keg-badge {
      position: absolute;
      left: -18px;
      top: 18px;
      transform: rotate(-36deg);
      transform-origin: center;
      font-size: 0.45rem;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      font-weight: 800;
      color: #744300;
      background: #ffe7c2;
      border: 1px solid #ffd28f;
      border-radius: 999px;
      padding: 1px 4px;
      white-space: nowrap;
      z-index: 3;
      pointer-events: none;
    }

    .level {
      font-size: 0.72rem;
      //color: var(--dp-muted);
      line-height: 1;
    }

    .error {
      color: var(--error-color);
    }

    @media (max-width: 480px) {
      .row {
        grid-template-columns: 30px 38px 1fr auto;
        gap: 8px;
      }

      .row.no-keg {
        grid-template-columns: 30px 38px 1fr;
      }

      .row.no-logo.no-keg {
        grid-template-columns: 30px 1fr;
      }

      .row.no-tap-number {
        grid-template-columns: 38px 1fr auto;
      }

      .row.no-tap-number.no-logo {
        grid-template-columns: 1fr auto;
      }

      .row.no-tap-number.no-keg {
        grid-template-columns: 38px 1fr;
      }

      .row.no-tap-number.no-logo.no-keg {
        grid-template-columns: 1fr;
      }

      .logo {
        width: 38px;
        height: 38px;
      }

      .keg-visual,
      .keg-bottom,
      .keg-front {
        width: 24px;
        height: 40px;
      }

      .keg-fill-mask {
        left: 6px;
        width: 12px;
        bottom: 10px;
        height: 23px;
      }

      .keg-badge {
        left: -16px;
        top: 15px;
      }
    }
  `,t([at({attribute:!1})],pt.prototype,"hass",void 0),t([dt()],pt.prototype,"_config",void 0),t([dt()],pt.prototype,"_brokenLogos",void 0),pt=t([nt("digitalpour-card")],pt);let ct=class extends st{setConfig(t){this._config={show_title:!0,show_tap_number:!0,show_logos:!0,show_style:!0,show_details:!0,show_keg:!0,show_just_tapped:!0,show_level_percent:!0,...t}}render(){return this.hass&&this._config?z`
      <div class="editor">
        <label>
          <span>Entity</span>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.entity??""}
            .includeDomains=${["sensor"]}
            @value-changed=${t=>this._updateValue("entity",(t.detail?.value??"").trim())}
          ></ha-entity-picker>
        </label>

        <label>
          <span>Title</span>
          <input
            .value=${this._config.title??"Current Tap List"}
            @input=${t=>this._updateValue("title",t.target.value)}
          />
        </label>

        <label>
          <span>Tap Count Limit</span>
          <input
            type="number"
            min="1"
            .value=${String(this._config.max_rows??"")}
            @input=${t=>this._updateNumber("max_rows",t.target.value)}
          />
        </label>

        <fieldset>
          <legend>Display</legend>
          ${this._checkbox("show_title","Show title")}
          ${this._checkbox("show_tap_number","Show tap number")}
          ${this._checkbox("show_logos","Show logos")}
          ${this._checkbox("show_style","Show style line")}
          ${this._checkbox("show_details","Show location/abv line")}
          ${this._checkbox("show_keg","Show keg indicator")}
          ${this._checkbox("show_level_percent","Show keg percent")}
          ${this._checkbox("show_just_tapped","Show Just Tapped badge")}
        </fieldset>
      </div>
    `:z``}_checkbox(t,e){return z`
      <label class="check">
        <input
          type="checkbox"
          .checked=${!1!==this._config?.[t]}
          @change=${e=>this._updateBoolean(t,e.target.checked)}
        />
        <span>${e}</span>
      </label>
    `}_updateValue(t,e){this._emitConfig({[t]:e.trim()})}_updateNumber(t,e){const i=Number.parseInt(e,10);this._emitConfig({[t]:Number.isNaN(i)?void 0:Math.max(1,i)})}_updateBoolean(t,e){this._emitConfig({[t]:e})}_emitConfig(t){const e={...this._config,...t};e.title||delete e.title,e.max_rows||delete e.max_rows,this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0}))}};ct.styles=n`
    .editor {
      display: grid;
      gap: 12px;
      padding: 8px 0;
    }

    label {
      display: grid;
      gap: 6px;
      font-size: 0.9rem;
    }

    ha-entity-picker {
      width: 100%;
    }

    input[type="text"],
    input[type="number"],
    input:not([type]) {
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
    }

    fieldset {
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 10px;
      margin: 0;
      display: grid;
      gap: 8px;
    }

    legend {
      padding: 0 6px;
      color: var(--secondary-text-color);
      font-size: 0.85rem;
    }

    .check {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `,t([at({attribute:!1})],ct.prototype,"hass",void 0),t([dt()],ct.prototype,"_config",void 0),ct=t([nt("digitalpour-card-editor")],ct),window.customCards=window.customCards||[],window.customCards.push({type:"digitalpour-card",name:"DigitalPour Menu Card",description:"Display a DigitalPour tap list with keg levels and just-tapped badges"});export{pt as DigitalpourCard};
//# sourceMappingURL=digitalpour-card.js.map
