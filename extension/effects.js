(function(root){
  'use strict';
  const tau=Math.PI*2;
  function hash(n){const a=Math.sin(n*127.1+23.71)*43758.5453;return a-Math.floor(a);}
  function star(ctx,x,y,r,alpha,color,points=4){
    ctx.save();ctx.translate(x,y);ctx.globalAlpha=alpha;ctx.fillStyle=color;ctx.beginPath();
    for(let i=0;i<points*2;i++){const a=i*Math.PI/points-Math.PI/2,rr=i%2?r*.16:r;if(i)ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);else ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();ctx.restore();
  }
  function stars(ctx,w,h,t,color,count,twinkle){
    for(let i=0;i<count;i++){const f=hash(i+2),x=hash(i+9)*w,y=hash(i+21)*h*.9;
      const pulse=twinkle?.5+.5*Math.sin(t*(.65+f*.7)+i*2.4):.5;
      const a=.08+pulse*.43;ctx.globalAlpha=a;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,.5+f*1.15,0,tau);ctx.fill();
      if(f>.86)star(ctx,x,y,3+f*3,a*.7,color);
    }
    ctx.globalAlpha=1;
  }
  function draw(ctx,w,h,t,theme){
    ctx.save();
    if(theme==='ocean'){
      for(let layer=0;layer<5;layer++){
        const baseline=h*(.77+layer*.047),amp=12+layer*3;
        ctx.beginPath();ctx.moveTo(-20,h+20);
        for(let x=-20;x<=w+25;x+=12){const y=baseline+Math.sin(x/(120+layer*25)-t*(.34+layer*.07)+layer)*amp+Math.sin(x/67+t*.27)*4;ctx.lineTo(x,y);}
        ctx.lineTo(w+25,h+20);ctx.closePath();
        const g=ctx.createLinearGradient(0,baseline-amp,0,h);g.addColorStop(0,`rgba(82,223,227,${.045+layer*.009})`);g.addColorStop(1,'rgba(5,65,94,.10)');ctx.fillStyle=g;ctx.fill();
        ctx.strokeStyle=`rgba(148,255,243,${.08+layer*.02})`;ctx.lineWidth=.8;ctx.stroke();
      }
      for(let i=0;i<20;i++){const x=hash(i)*w,y=h*.8+hash(i+3)*h*.18+Math.sin(t*.6+i)*3;ctx.fillStyle=`rgba(197,255,245,${.04+(.5+.5*Math.sin(t+i))*.14})`;ctx.fillRect(x,y,3+hash(i+1)*9,.7);}
    }else if(theme==='amber'){
      for(let i=0;i<58;i++){
        const f=hash(i+1),x=hash(i+10)*w,y=hash(i+20)*h;
        const peak=Math.pow(Math.max(0,Math.sin(t*(.7+f*.65)+i*2.1)),9);
        const glow=ctx.createRadialGradient(x,y,0,x,y,7+peak*16);glow.addColorStop(0,`rgba(255,214,120,${.02+peak*.16})`);glow.addColorStop(1,'rgba(255,200,100,0)');ctx.fillStyle=glow;ctx.fillRect(x-25,y-25,50,50);
        star(ctx,x,y,1.2+peak*(5+f*6),.06+peak*.6,'#ffdf95');
      }
    }else if(theme==='violet'){
      stars(ctx,w,h,t,'#dfc6ff',105,true);
      for(let i=0;i<7;i++){const x=hash(i+52)*w,y=hash(i+60)*h*.75,p=.5+.5*Math.sin(t*.8+i*1.9);const g=ctx.createRadialGradient(x,y,0,x,y,18);g.addColorStop(0,`rgba(165,115,255,${p*.13})`);g.addColorStop(1,'rgba(140,80,240,0)');ctx.fillStyle=g;ctx.fillRect(x-18,y-18,36,36);}
    }else if(theme==='fire'){
      const base=ctx.createLinearGradient(0,h,0,h*.61);base.addColorStop(0,'rgba(255,62,7,.25)');base.addColorStop(1,'rgba(255,62,7,0)');ctx.fillStyle=base;ctx.fillRect(0,h*.6,w,h*.4);
      const count=Math.ceil(w/31);
      for(let i=0;i<count;i++){
        const x=i*w/count,fw=23+hash(i+4)*25,fh=h*(.09+hash(i+7)*.13)*( .8+.2*Math.sin(t*1.8+i));
        const lean=Math.sin(t*1.4+i*2)*fw*.35,tipX=x+lean,tipY=h-fh;
        ctx.beginPath();ctx.moveTo(x-fw,h+15);ctx.bezierCurveTo(x-fw*.75,h-fh*.4,tipX+fw*.5,tipY+fh*.22,tipX,tipY);ctx.bezierCurveTo(tipX-fw*.12,tipY+fh*.38,x+fw,h-fh*.4,x+fw,h+15);ctx.closePath();
        const flame=ctx.createLinearGradient(0,h,0,tipY);flame.addColorStop(0,'rgba(255,180,53,.33)');flame.addColorStop(.4,'rgba(255,100,18,.19)');flame.addColorStop(1,'rgba(255,47,8,0)');ctx.fillStyle=flame;ctx.fill();
        // A narrower bright core separates each living tongue from the ambient glow.
        ctx.beginPath();ctx.moveTo(x-fw*.3,h);ctx.quadraticCurveTo(x-fw*.1,h-fh*.27,x+lean*.4,h-fh*.56);ctx.quadraticCurveTo(x+fw*.28,h-fh*.2,x+fw*.3,h);ctx.fillStyle='rgba(255,217,113,.10)';ctx.fill();
      }
      for(let i=0;i<33;i++){const f=hash(i),x=hash(i+4)*w+Math.sin(t+i)*8,y=h-((hash(i+15)*h*.45+t*(15+f*24))%(h*.5));ctx.fillStyle=`rgba(255,${160+Math.floor(f*70)},85,${.12+f*.3})`;ctx.beginPath();ctx.arc(x,y,.5+f*1.1,0,tau);ctx.fill();}
    }else if(theme==='love'){
      for(let i=0;i<34;i++){
        const f=hash(i+1),x=hash(i+8)*w+Math.sin(t*.45+i*1.7)*(15+f*24),y=(hash(i+14)*(h+80)+t*(13+f*19))%(h+80)-40,r=5+f*8;
        ctx.save();ctx.translate(x,y);ctx.rotate(Math.sin(t*.35+i)*1.1+i);ctx.scale(.25+Math.abs(Math.cos(t*.45+i))*.75,1);ctx.globalAlpha=.12+f*.24;
        const g=ctx.createLinearGradient(-r,-r,r,r);g.addColorStop(0,'#ffbfda');g.addColorStop(.5,'#ed77ac');g.addColorStop(1,'#a83f71');ctx.fillStyle=g;
        ctx.beginPath();ctx.moveTo(0,-r);ctx.bezierCurveTo(r*1.3,-r*.8,r*1.2,r*.6,0,r);ctx.bezierCurveTo(-r*.85,r*.4,-r*.65,-r*.7,0,-r);ctx.closePath();ctx.fill();ctx.strokeStyle='rgba(255,218,234,.4)';ctx.lineWidth=.45;ctx.beginPath();ctx.moveTo(0,-r*.7);ctx.quadraticCurveTo(r*.2,0,0,r*.7);ctx.stroke();ctx.restore();
      }
    }else if(theme==='emerald'){
      stars(ctx,w,h,t,'#f8dfaa',52,true);
      for(let i=0;i<3;i++){
        const period=6+i*1.7,age=(t+i*2.4)%period,duration=1.15;
        if(age>duration)continue;
        const p=age/duration,x=w*(.06+hash(i+12)*.5)+p*w*.4,y=h*(.04+hash(i+5)*.23)+p*h*.23;
        const length=55+p*100,dx=length*.9,dy=length*.43,fade=Math.sin(p*Math.PI);
        const g=ctx.createLinearGradient(x-dx,y-dy,x,y);g.addColorStop(0,'rgba(255,224,155,0)');g.addColorStop(1,`rgba(255,236,183,${fade*.7})`);ctx.strokeStyle=g;ctx.lineWidth=1.2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x-dx,y-dy);ctx.lineTo(x,y);ctx.stroke();star(ctx,x,y,2.5,fade*.8,'#fff1c8');
      }
    }else if(theme==='rain'){
      for(let i=0;i<40;i++){const x=hash(i+1)*w,y=(hash(i+5)*h+t*(40+hash(i)*35))%h;ctx.fillStyle='rgba(150,191,242,.10)';ctx.fillRect(x,y,.7,10+hash(i+3)*8);}
    }
    ctx.restore();return theme;
  }
  root.AesthetifyEffects={draw};if(typeof module!=='undefined')module.exports=root.AesthetifyEffects;
})(globalThis);
