import{S,i as j,s as F,e as d,t as A,k as _,w as K,c as E,a as $,h as N,d as p,m as h,x as O,b as k,g as m,F as R,y as P,j as Q,q as y,o as w,B as U,l as T,V,Q as B,R as q,p as X,T as z,K as D,n as G}from"../../chunks/index-031e6f9d.js";import{C as H}from"../../chunks/CopyButton-b2067cec.js";import{p as I}from"../../chunks/stores-412a6a00.js";import{e as J}from"../../chunks/index-aa2a4886.js";import"../../chunks/index-9ea886c1.js";function x(n){let r,o,i,s,f;return s=new H({props:{text:n[1]}}),{c(){r=d("p"),o=A(n[1]),i=_(),K(s.$$.fragment),this.h()},l(e){r=E(e,"P",{class:!0});var l=$(r);o=N(l,n[1]),l.forEach(p),i=h(e),O(s.$$.fragment,e),this.h()},h(){k(r,"class","m-auto w-max whitespace-pre-line font-mono")},m(e,l){m(e,r,l),R(r,o),m(e,i,l),P(s,e,l),f=!0},p(e,l){(!f||l&2)&&Q(o,e[1]);const c={};l&2&&(c.text=e[1]),s.$set(c)},i(e){f||(y(s.$$.fragment,e),f=!0)},o(e){w(s.$$.fragment,e),f=!1},d(e){e&&p(r),e&&p(i),U(s,e)}}}function L(n){let r,o,i,s,f,e,l,c,b,C,a=n[1]&&x(n);return{c(){r=_(),o=d("textarea"),i=_(),s=d("button"),f=A("Chiffrer"),e=_(),a&&a.c(),l=T(),this.h()},l(t){V('[data-svelte="svelte-1gcyy9c"]',document.head).forEach(p),r=h(t),o=E(t,"TEXTAREA",{class:!0}),$(o).forEach(p),i=h(t),s=E(t,"BUTTON",{class:!0});var v=$(s);f=N(v,"Chiffrer"),v.forEach(p),e=h(t),a&&a.l(t),l=T(),this.h()},h(){document.title="Chiffrer - Crypto",k(o,"class","textarea h-52 w-full"),k(s,"class","button-coloured w-full")},m(t,u){m(t,r,u),m(t,o,u),B(o,n[0]),m(t,i,u),m(t,s,u),R(s,f),m(t,e,u),a&&a.m(t,u),m(t,l,u),c=!0,b||(C=[q(o,"input",n[3]),q(s,"click",n[2])],b=!0)},p(t,[u]){u&1&&B(o,t[0]),t[1]?a?(a.p(t,u),u&2&&y(a,1)):(a=x(t),a.c(),y(a,1),a.m(l.parentNode,l)):a&&(G(),w(a,1,1,()=>{a=null}),X())},i(t){c||(y(a),c=!0)},o(t){w(a),c=!1},d(t){t&&p(r),t&&p(o),t&&p(i),t&&p(s),t&&p(e),a&&a.d(t),t&&p(l),b=!1,z(C)}}}function M(n,r,o){let i;D(n,I,c=>o(4,i=c));let s,f="";async function e(){o(1,f=await J(s,i.stuff.key))}function l(){s=this.value,o(0,s)}return[s,f,e,l]}class et extends S{constructor(r){super(),j(this,r,M,L,F,{})}}export{et as default};
