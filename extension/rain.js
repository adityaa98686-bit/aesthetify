(function(root){
  'use strict';
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  function noise(n){const x=Math.sin(n*127.1+17.31)*43758.5453;return x-Math.floor(x);}
  function drops(width,height,time,reduced=false){
    const count=Math.min(120,Math.max(35,Math.round(width*height/10000))),out=[];
    for(let i=0;i<count;i++){
      const lifetime=10+noise(i+9)*12,age=reduced?3:(time+noise(i+15)*lifetime)%lifetime;
      const radius=1.8+Math.pow(noise(i+2),3)*10;
      const originY=noise(i+4)*height,slide=reduced?0:Math.pow(Math.max(0,age-4.5),1.65)*(2+noise(i+8)*5);
      const y=(originY+slide)%(height+50)-15,x=noise(i+1)*width+Math.sin(age*.3+i)*Math.min(slide*.02,5);
      out.push({x,y,radius,age,lifetime,slide,growth:clamp(age/.22,0,1),opacity:clamp((lifetime-age)/.8,0,1)});
    }
    return out;
  }
  function draw(ctx,width,height,time,image,reduced=false){
    ctx.clearRect(0,0,width,height);
    const beads=drops(width,height,time,reduced);
    for(const d of beads){const{x,y,age}=d,r=d.radius*d.growth;if(r<.2)continue;
      // Keep the center readable while retaining glass detail around it.
      const center=Math.abs(x-width*.62)<width*.25&&y>height*.25&&y<height*.75;
      ctx.save();ctx.globalAlpha=d.opacity*(center?.48:.85);
      if(age<.48&&!reduced){const p=age/.48;ctx.strokeStyle=`rgba(205,225,255,${(1-p)*.32})`;ctx.lineWidth=.65;ctx.beginPath();ctx.ellipse(x,y,r+14*p,r*.65+9*p,0,0,Math.PI*2);ctx.stroke();}
      if(d.slide>4){const length=Math.min(d.slide,100+r*5);const gradient=ctx.createLinearGradient(x,y-length,x,y);gradient.addColorStop(0,'rgba(190,218,245,0)');gradient.addColorStop(1,'rgba(190,218,245,.13)');ctx.strokeStyle=gradient;ctx.lineWidth=Math.max(.8,r*.4);ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x+Math.sin(age)*2,y-length);ctx.bezierCurveTo(x-3,y-length*.65,x+2,y-length*.2,x,y);ctx.stroke();}
      const ry=r*(1.18+Math.min(d.slide/200,.6));
      ctx.beginPath();ctx.ellipse(x,y,r,ry,0,0,Math.PI*2);ctx.save();ctx.clip();
      if(image?.complete&&image.naturalWidth&&r>4){
        const iw=image.naturalWidth,ih=image.naturalHeight,sw=Math.min(iw,r*9),sh=Math.min(ih,ry*9);
        const sx=clamp(x/width*iw-sw/2,0,iw-sw),sy=clamp(y/height*ih-sh/2,0,ih-sh);
        ctx.globalAlpha*=.27;ctx.drawImage(image,sx,sy,sw,sh,x-r,y-ry,r*2,ry*2);ctx.globalAlpha/= .27;
      }
      const fill=ctx.createRadialGradient(x-r*.3,y-ry*.4,r*.1,x,y,ry*1.2);fill.addColorStop(0,'rgba(218,235,255,.10)');fill.addColorStop(.55,'rgba(20,36,54,.04)');fill.addColorStop(.9,'rgba(2,9,18,.35)');fill.addColorStop(1,'rgba(209,229,255,.30)');ctx.fillStyle=fill;ctx.fillRect(x-r,y-ry,r*2,ry*2);ctx.restore();
      const edge=ctx.createLinearGradient(x-r,y-ry,x+r,y+ry);edge.addColorStop(0,'rgba(236,247,255,.58)');edge.addColorStop(.4,'rgba(180,211,241,.06)');edge.addColorStop(1,'rgba(224,241,255,.35)');ctx.strokeStyle=edge;ctx.lineWidth=.65;ctx.beginPath();ctx.ellipse(x,y,r,ry,0,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle='rgba(248,252,255,.7)';ctx.lineWidth=Math.max(.6,r*.12);ctx.beginPath();ctx.ellipse(x-r*.22,y-ry*.2,r*.57,ry*.59,-.2,Math.PI*1.05,Math.PI*1.55);ctx.stroke();
      ctx.fillStyle='rgba(235,247,255,.5)';ctx.beginPath();ctx.ellipse(x+r*.18,y+ry*.65,r*.22,Math.max(.5,r*.12),-.2,0,Math.PI*2);ctx.fill();ctx.restore();
    }
    return beads.length;
  }
  root.AesthetifyRain={drops,draw};if(typeof module!=='undefined')module.exports=root.AesthetifyRain;
})(globalThis);
