import{S as d,i as _,s as h,e as p,t as b,c as T,a as g,h as x,d as c,b as C,M as f,g as v,F as w,R as I,j as y,E as m,K as S,a0 as R}from"./index-031e6f9d.js";import{w as u}from"./index-9ea886c1.js";function B(i,t,a){const e=u(i,a);let s=null;return e.subscribe(n=>{s!=null&&clearTimeout(s),n!=i?s=setTimeout(()=>{s=null,e.set(i)},t):s=null}),e}function F(i,t,a){const e=u(i,a),s=u(0);let n=null;return e.subscribe(r=>{n!=null&&clearInterval(n),r!=i?(s.set(t),n=setInterval(()=>{s.update(l=>l-1<=0?(n&&clearInterval(n),e.set(i),n=null,0):l-1)},1e3)):n=null}),[e,s]}function E(i){let t,a=i[0]?"Copi\xE9 !":"Copier",e,s,n;return{c(){t=p("button"),e=b(a),this.h()},l(r){t=T(r,"BUTTON",{class:!0});var l=g(t);e=x(l,a),l.forEach(c),this.h()},h(){C(t,"class","button-coloured w-full"),f(t,"bg-green-500",i[0])},m(r,l){v(r,t,l),w(t,e),s||(n=I(t,"click",i[2]),s=!0)},p(r,[l]){l&1&&a!==(a=r[0]?"Copi\xE9 !":"Copier")&&y(e,a),l&1&&f(t,"bg-green-500",r[0])},i:m,o:m,d(r){r&&c(t),s=!1,n()}}}function j(i,t,a){let e,{text:s}=t,{resetTime:n=2e3}=t,r=B(!1,n);S(i,r,o=>a(0,e=o));async function l(){await navigator.clipboard.writeText(s),R(r,e=!0,e)}return i.$$set=o=>{"text"in o&&a(3,s=o.text),"resetTime"in o&&a(4,n=o.resetTime)},[e,r,l,s,n]}class K extends d{constructor(t){super(),_(this,t,j,E,h,{text:3,resetTime:4})}}export{K as C,F as a};
