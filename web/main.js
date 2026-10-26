(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var nav=document.querySelector('.nav');
function onS(){nav.classList.toggle('scrolled',scrollY>20)}addEventListener('scroll',onS,{passive:true});onS();
function fmt(n,money){n=Math.round(n).toLocaleString('es-CL');return money?'$'+n:n}
// typewriter placeholder (works without GSAP)
var q=document.getElementById('q');var ex=['Una inyección de vitamina B12','Curación a domicilio en Ñuñoa','Hemograma y perfil lipídico','Una enfermera para mi mamá','Toma de muestras en casa'];
if(q&&!reduce){var ei=0,ci=ex[0].length,del=true,hold=26;(function tick(){if(document.activeElement===q||q.value){setTimeout(tick,400);return}
var w=ex[ei];if(hold>0){hold--;}else if(del){ci--;if(ci<=0){del=false;ei=(ei+1)%ex.length;w=ex[ei]}}else{ci++;if(ci>=w.length){del=true;hold=30}}
q.setAttribute('placeholder',w.slice(0,Math.max(ci,0))+(hold>0?'':'|'));setTimeout(tick,del&&hold<=0?28:62)})()}
if(reduce||!window.gsap){document.documentElement.classList.remove('motion');return}
window.__cuidaReady=true;
gsap.registerPlugin(ScrollTrigger);
var fine=matchMedia('(pointer:fine)').matches,lenis=null;
if(fine&&window.Lenis){lenis=new Lenis({lerp:.1});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(id.length<2)return;var el=document.querySelector(id);if(!el)return;e.preventDefault();if(lenis)lenis.scrollTo(el,{offset:id=='#como'?0:-70,duration:1.2});else el.scrollIntoView({behavior:'smooth'})})});
// HERO: staggered blur-to-sharp (~1.2s)
var tl=gsap.timeline();window.__heroTL=tl;
tl.fromTo('.hx',{opacity:0,y:14,filter:'blur(10px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.7,ease:'power3.out',stagger:.07,clearProps:'filter'},0)
.add(function(){document.querySelector('.more').classList.add('more-b')});
// rotating second line
var rws=gsap.utils.toArray('.rw'),ri=0;
setInterval(function(){if(document.hidden)return;var a=rws[ri];ri=(ri+1)%rws.length;var b=rws[ri];
gsap.to(a,{yPercent:-45,opacity:0,filter:'blur(8px)',duration:.5,ease:'power2.in',onComplete:function(){a.classList.remove('on')}});
b.classList.add('on');gsap.fromTo(b,{yPercent:45,opacity:0,filter:'blur(8px)'},{yPercent:0,opacity:1,filter:'blur(0px)',duration:.6,delay:.32,ease:'power3.out'})},2500);
// section reveals
gsap.utils.toArray('.rv').forEach(function(el){gsap.fromTo(el,{opacity:0,y:28},{opacity:1,y:0,duration:.9,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 88%',once:true}})});
function counter(el){var to=+el.dataset.count,m=el.hasAttribute('data-money'),o={v:0};return gsap.to(o,{v:to,duration:1.6,ease:'power3.out',paused:true,onUpdate:function(){el.textContent=fmt(o.v,m)}})}
gsap.utils.toArray('[data-count]').forEach(function(el){var tw=counter(el);ScrollTrigger.create({trigger:el,start:'top 88%',once:true,onEnter:function(){tw.play()}})});
gsap.fromTo('.nurse-ph>img',{scale:1.08},{scale:1,ease:'none',scrollTrigger:{trigger:'.nurse',start:'top bottom',end:'bottom top',scrub:true}});
gsap.fromTo('.ph-nurse',{y:50},{y:-30,ease:'none',scrollTrigger:{trigger:'.nurse',start:'top bottom',end:'bottom top',scrub:true}});
gsap.fromTo('.ph-b',{y:60},{y:-40,ease:'none',scrollTrigger:{trigger:'.isapre',start:'top bottom',end:'bottom top',scrub:true}});
// pinned phone (desktop)
var mm=gsap.matchMedia();
mm.add('(min-width:981px)',function(){var steps=gsap.utils.toArray('.step'),scr=gsap.utils.toArray('.ph-pin .scr'),cur=-1;
function set(i){if(i===cur)return;cur=i;steps.forEach(function(s,j){s.classList.toggle('on',j===i)});scr.forEach(function(s,j){s.classList.toggle('on',j===i)})}
set(0);var len='+='+(steps.length*60)+'%';
ScrollTrigger.create({trigger:'.como',start:'top top',end:len,pin:true,scrub:true,onUpdate:function(self){set(Math.min(steps.length-1,Math.floor(self.progress*steps.length*.999)))}});
gsap.fromTo('.ph-pin',{y:12},{y:-12,ease:'none',scrollTrigger:{trigger:'.como',start:'top top',end:len,scrub:true}});
return function(){steps.forEach(function(s){s.classList.remove('on')})}});
if(fine){gsap.utils.toArray('.mag').forEach(function(b){var x=gsap.quickTo(b,'x',{duration:.4,ease:'power3'}),y=gsap.quickTo(b,'y',{duration:.4,ease:'power3'});
b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();x((e.clientX-r.left-r.width/2)*.2);y((e.clientY-r.top-r.height/2)*.3)});b.addEventListener('pointerleave',function(){x(0);y(0)})})}
addEventListener('load',function(){ScrollTrigger.refresh()});
})();
