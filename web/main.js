(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var nav=document.querySelector('.nav');
function onS(){nav.classList.toggle('scrolled',scrollY>40)}addEventListener('scroll',onS,{passive:true});onS();
var q=document.getElementById('q');var ex=['Una inyección de vitamina B12','Curación a domicilio en Ñuñoa','Hemograma y perfil lipídico','Una enfermera para mi mamá','Toma de muestras en casa'];
if(q&&!reduce){var ei=0,ci=ex[0].length,del=true,hold=26;(function tick(){if(document.activeElement===q||q.value){setTimeout(tick,400);return}
var w=ex[ei];if(hold>0){hold--}else if(del){ci--;if(ci<=0){del=false;ei=(ei+1)%ex.length;w=ex[ei]}}else{ci++;if(ci>=w.length){del=true;hold=30}}
q.setAttribute('placeholder',w.slice(0,Math.max(ci,0))+(hold>0?'':'|'));setTimeout(tick,del&&hold<=0?28:62)})()}
if(reduce||!window.gsap){document.documentElement.classList.remove('motion');return}
window.__cuidaReady=true;
gsap.registerPlugin(ScrollTrigger);
var fine=matchMedia('(pointer:fine)').matches,lenis=null;
if(fine&&window.Lenis){lenis=new Lenis({lerp:.1});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(function(t){lenis.raf(t*1000)});gsap.ticker.lagSmoothing(0)}
document.querySelectorAll('a[href^="#"]').forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href');if(id.length<2)return;var el=document.querySelector(id);if(!el)return;e.preventDefault();if(lenis)lenis.scrollTo(el,{offset:-40,duration:1.2});else el.scrollIntoView({behavior:'smooth'})})});
// hero entrance
var tl=gsap.timeline();window.__heroTL=tl;
tl.fromTo('.hx',{opacity:0,y:14,filter:'blur(10px)'},{opacity:1,y:0,filter:'blur(0px)',duration:.7,ease:'power3.out',stagger:.07,clearProps:'filter'},0)
.add(function(){document.querySelector('.more').classList.add('more-b')});
var rws=gsap.utils.toArray('.rw'),ri=0;
setInterval(function(){if(document.hidden)return;var a=rws[ri];ri=(ri+1)%rws.length;var b=rws[ri];
gsap.to(a,{yPercent:-45,opacity:0,filter:'blur(8px)',duration:.5,ease:'power2.in',onComplete:function(){a.classList.remove('on')}});
b.classList.add('on');gsap.fromTo(b,{yPercent:45,opacity:0,filter:'blur(8px)'},{yPercent:0,opacity:1,filter:'blur(0px)',duration:.6,delay:.32,ease:'power3.out'})},2500);
// text reveals
gsap.utils.toArray('.rv').forEach(function(el){gsap.fromTo(el,{opacity:0,y:24},{opacity:1,y:0,duration:.9,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}})});
// tray objects pop in one by one
gsap.fromTo('.tc img',{opacity:0,scale:.5,y:20},{opacity:1,scale:1,y:0,duration:.6,ease:'back.out(1.8)',stagger:{each:.035,from:'center'},scrollTrigger:{trigger:'.tray',start:'top 85%',once:true}});
// film card grows like a video reveal
gsap.fromTo('.film',{scale:.86,borderRadius:48},{scale:1,borderRadius:30,ease:'none',scrollTrigger:{trigger:'.film',start:'top 95%',end:'center 55%',scrub:true}});
gsap.fromTo('.film img',{scale:1.18},{scale:1,ease:'none',scrollTrigger:{trigger:'.film',start:'top bottom',end:'bottom top',scrub:true}});
// rows: phone rises, cards break out, objects float
gsap.utils.toArray('.row').forEach(function(r){var ph=r.querySelector('.phn'),bo=r.querySelectorAll('.bo'),em=r.querySelectorAll('.emo');
var t=gsap.timeline({scrollTrigger:{trigger:r,start:'top 72%',once:true}});
t.fromTo(ph,{y:120,opacity:0},{y:0,opacity:1,duration:1.1,ease:'expo.out'})
.fromTo(bo,{y:40,scale:.92,opacity:0},{y:0,scale:1,opacity:1,duration:.8,ease:'back.out(1.4)',stagger:.14},'-=.75')
.fromTo(em,{scale:0,opacity:0},{scale:1,opacity:1,duration:.7,ease:'back.out(2)',stagger:.1},'-=.6');
em.forEach(function(e,i){gsap.to(e,{y:i%2?-10:10,duration:2.6+i*.4,ease:'sine.inOut',yoyo:true,repeat:-1,delay:1.2})});
gsap.fromTo(bo,{yPercent:0},{yPercent:-12,ease:'none',scrollTrigger:{trigger:r,start:'top bottom',end:'bottom top',scrub:true}})});
addEventListener('load',function(){ScrollTrigger.refresh()});
})();
