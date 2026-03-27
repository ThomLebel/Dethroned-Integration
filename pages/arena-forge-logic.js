
// Désactiver le menu contextuel natif partout
document.addEventListener('contextmenu',e=>e.preventDefault());
// ══════════════════════════════════════════════════
// CONSTANTES
// ══════════════════════════════════════════════════
const COLS=32,ROWS=18;
const CELL={VOID:0,FLOOR:1,OBSTACLE:2,STRUCT:3,WALL:4,CENTER:5,ENTRY:6,INTERACTIVE:8,SPECIAL:9};
const CELL_NAMES={0:'Hors arène',1:'Sol',2:'Obstacle',3:'Obstacle structurel',4:'Mur interne',5:'Zone centrale',6:'Entrée',8:'Tuile interactive',9:'Élément spécial'};

const BIOMES={
  savane:{name:'Savane',emoji:'🌅',floor:'#b87a3a',obs:'#6a4422',wall:'#3a2210',zone:'#d4a060',accent:'#d4884a',struct:'#c07840'},
  foret: {name:'Forêt', emoji:'🌿',floor:'#4a6a2a',obs:'#2a4a1a',wall:'#1a2a0a',zone:'#6a9a3a',accent:'#5a8a40',struct:'#4a7030'},
  zh:    {name:'Zones Humides',emoji:'🌊',floor:'#3a5a6a',obs:'#1a3a4a',wall:'#0a1a2a',zone:'#5a8a9a',accent:'#4a7a8a',struct:'#3a6070'},
  ruines:{name:'Ruines',emoji:'🏛️',floor:'#7a6a5a',obs:'#4a3a2a',wall:'#2a1a0a',zone:'#9a8a6a',accent:'#8a7060',struct:'#706050'},
};
const SHAPES=['oval','rect_soft','bean','diamond','lshape','cross','hex','irregular'];

const ENEMY_TYPES=[
  {id:'weak',    label:'Faible',       color:'#5aaa5a',ring:'#2a6a2a',symbol:'w'},
  {id:'normal',  label:'Normal',       color:'#aaaa3a',ring:'#6a6a1a',symbol:'n'},
  {id:'strong',  label:'Fort',         color:'#e07030',ring:'#8a4010',symbol:'f'},
  {id:'e_weak',  label:'Élite Faible', color:'#3aaaaa',ring:'#1a6a6a',symbol:'EW'},
  {id:'e_normal',label:'Élite Normal', color:'#3a7aee',ring:'#1a3a9a',symbol:'EN'},
  {id:'e_strong',label:'Élite Fort',   color:'#aa3aaa',ring:'#6a1a6a',symbol:'EF'},
  {id:'miniboss',label:'Mini-Boss',    color:'#ee3a3a',ring:'#8a0000',symbol:'MB'},
  {id:'boss',    label:'Boss',         color:'#c8a84b',ring:'#7a5a00',symbol:'B'},
];

const TOOLS=[
  {id:'floor',    label:'Sol',        color:'#b87a3a'},
  {id:'obstacle', label:'Obstacle',   color:'#6a4422'},
  {id:'struct',   label:'Obs. struct',color:'#c07840'},
  {id:'wall',     label:'Mur interne',color:'#3a2210'},
  {id:'center',   label:'Zone C.',    color:'rgba(255,255,255,0.15)'},
  {id:'interactive',label:'Tuile IA.',color:'#d4a060'},
  {id:'special',  label:'Spécial',    color:'#c8a84b'},
  {id:'entry',    label:'Entrée',     color:'#2a7a3a'},
  {id:'void',     label:'Effacer',    color:'#0a0c08'},
  {id:'enemy',    label:'Ennemi →',   color:'transparent',isEnemy:true},
  {id:'rm_enemy', label:'Retirer enn.',color:'#c0392b'},
];

const TEMPLATES={
  G01:{name:'Plaine Dégagée',family:'Ouverte',density:[8,12],struct:[]},
  G02:{name:'Îlots Épars',family:'Ouverte',density:[10,18],struct:[]},
  G03:{name:'Couloir Central',family:'Couloirs',density:[18,22],struct:['band_h']},
  G04:{name:'Couloir en L',family:'Couloirs',density:[10,15],struct:['l_shape']},
  G05:{name:'Double Passage',family:'Couloirs',density:[12,18],struct:['double_wall']},
  G06:{name:'Quatre Piliers',family:'Îlots',density:[15,20],struct:['four_pillars']},
  G07:{name:'Croix Inversée',family:'Îlots',density:[18,22],struct:['cross_corners']},
  G08:{name:'Archipel',family:'Îlots',density:[15,22],struct:[]},
  G09:{name:'Front de Bataille',family:'Asymétrique',density:[20,25],struct:['right_dense']},
  G10:{name:'Entonnoir',family:'Asymétrique',density:[18,24],struct:['funnel']},
  G11:{name:'Mini-Boss',family:'Spéciale',density:[5,10],struct:['central_boss']},
  G13:{name:'Mur Brisé',family:'Structure',density:[8,15],struct:['broken_wall']},
  G14:{name:'Anneau',family:'Structure',density:[5,12],struct:['ring']},
  G15:{name:'Diagonale',family:'Structure',density:[8,15],struct:['diagonal_band']},
  G16:{name:'Couloir Courbe',family:'Structure',density:[8,15],struct:['curve_wall']},
  G17:{name:'Axe Inversé',family:'E/S Décalés',density:[8,18],struct:[]},
  G18:{name:'Même Bord',family:'E/S Décalés',density:[12,18],struct:[]},
  G19:{name:'Coin à Coin',family:'E/S Décalés',density:[10,16],struct:[]},
  G20:{name:'Pincer',family:'E/S Décalés',density:[18,24],struct:['pincer']},
  G21:{name:'Salle de Repos',family:'Spéciale',density:[0,0],struct:['altar']},
  G22:{name:'Marchand Corbeau',family:'Spéciale',density:[0,0],struct:['merchant']},
  G23:{name:'Mini-Boss Circulaire',family:'Spéciale',density:[5,8],struct:['round_corners']},
  G24:{name:"Salle d'Élite",family:'Spéciale',density:[5,10],struct:['inner_frame']},
};

// Noms de salles par biome
const NAMES={
  savane:{
    adj:['Aride','Écorchée','Embrasée','Assoiffée','Sèche','Brûlante','Battue','Poussiéreuse','Oubliée','Dorée'],
    noun:['Plaine','Termitière','Broussaille','Savane','Crête','Plateau','Clairière','Rocaille','Étendue','Dépression'],
    suffix:['des Lions','du Vent','de la Sécheresse','des Vautours','du Soleil Couchant','des Hyènes','de la Poussière'],
  },
  foret:{
    adj:['Sombre','Enchevêtrée','Moussue','Humide','Torse','Silencieuse','Profonde','Envahie','Crépusculaire','Nouée'],
    noun:['Clairière','Sous-bois','Fourré','Canopée','Lisière','Racines','Taillis','Bosquet','Cavée','Brèche'],
    suffix:['des Renards','des Écureuils','de la Mousse','des Ombres','de la Fougère','du Vieux Chêne','des Feuilles Mortes'],
  },
  zh:{
    adj:['Noyée','Brumeuse','Glissante','Trouble','Stagnante','Marécageuse','Voilée','Saumâtre','Vaseuse','Miroir'],
    noun:['Berge','Flaque','Vasière','Mare','Roseaux','Tourbière','Confluence','Anse','Bras Mort','Gué'],
    suffix:['des Crabes','des Piranhas','de la Brume','des Anguilles','du Crocodile','des Nénuphars','des Reflets'],
  },
  ruines:{
    adj:['Effondrée','Érodée','Envahie','Désolée','Ancestrale','Oubliée','Brisée','Sacrée','Maudite','Profanée'],
    noun:['Temple','Colonnade','Autel','Crypte','Mausolée','Vestiges','Galerie','Sanctuaire','Arène','Cella'],
    suffix:['des Anciens','du Conquérant','de la Jungle','des Statues','du Dieu Mort','des Lianes','de Pierre'],
  },
};

const DESCS={
  savane:['La terre craquelée absorbe chaque impact. La chaleur distord les horizons.',
    'Des termitières brisées jonchent le sol ocre. Le vent chaud apporte l\'odeur du sang.',
    'Herbe rase et poussière rouge. Rien ne vit ici depuis longtemps.',
    'Le soleil couchant teinte tout en orange. Les ombres s\'allongent dangereusement.'],
  foret:['Les racines forment un labyrinthe naturel. La lumière peine à percer la canopée.',
    'Silence de sous-bois. Seul le craquement des branches sous les pas.',
    'Mousse glissante, troncs imposants. La forêt observe, impassible.',
    'Une clairière creusée par des années de combats. La terre garde les cicatrices.'],
  zh:['L\'eau trouble réfléchit des silhouettes qui n\'existent pas.',
    'Les roseaux masquent les mouvements. Rien n\'est ce qu\'il paraît.',
    'Sol vaseux, brume basse. Chaque pas résonne différemment.',
    'L\'eau peu profonde ralentit. La berge offre la seule traction.'],
  ruines:['Des colonnes brisées servent d\'abri et de piège à la fois.',
    'Le temple tient debout par obstination. Ses dieux sont partis depuis longtemps.',
    'Herbe entre les dalles. La jungle reprend ce qui lui appartient.',
    'Des fresques à moitié effacées représentent des combats oubliés.'],
};

// ══════════════════════════════════════════════════
// ÉTAT
// ══════════════════════════════════════════════════
let S={
  grid:null,mask:null,biome:'savane',template:'G01',shape:'oval',
  density:15,usedSeed:0,
  enemies:[],           // [{x,y,type}]
  activeEnemy:'normal',
  activeTool:'floor',
  library:[],
  currentJSON:null,
  isPainting:false,
  ctxCell:{x:0,y:0},
};

// ══════════════════════════════════════════════════
// UTILS
// ══════════════════════════════════════════════════
function mkRng(seed){
  let s=seed||(Math.floor(Math.random()*9998)+1);
  S.usedSeed=s;
  return()=>{s=(s*1664525+1013904223)&0xffffffff;return(s>>>0)/0xffffffff;};
}
function syncInput(sliderId,inputId){document.getElementById(inputId).value=document.getElementById(sliderId).value;}
function syncSlider(inputId,sliderId,mn,mx){
  let v=parseInt(document.getElementById(inputId).value)||0;
  v=Math.max(mn,Math.min(mx,v));
  document.getElementById(sliderId).value=v;
  document.getElementById(inputId).value=v;
}
function toggleTag(el){el.classList.toggle('active');}
function getTag(id){return document.getElementById(id)?.classList.contains('active')??false;}
function cellToTool(c){const m={1:'floor',2:'obstacle',3:'struct',4:'wall',5:'center',6:'entry',8:'interactive',9:'special',0:'void'};return m[c]||'floor';}
function toolToCell(t){const m={floor:1,obstacle:2,struct:3,wall:4,center:5,entry:6,interactive:8,special:9,void:0};return m[t]??1;}

// ══════════════════════════════════════════════════
// GÉNÉRATION DE FORME
// ══════════════════════════════════════════════════
function generateShape(shape,rng){
  const mask=Array.from({length:ROWS},()=>new Array(COLS).fill(false));
  const cx=COLS/2,cy=ROWS/2;
  const mirrorEnabled=getTag('tagMirror');
  if(shape==='oval'){
    const rx=COLS*.42,ry=ROWS*.40;
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)mask[y][x]=((x-cx)/rx)**2+((y-cy)/ry)**2<=1;
  } else if(shape==='rect_soft'){
    const pad=2,curve=3;
    for(let y=pad;y<ROWS-pad;y++)for(let x=pad;x<COLS-pad;x++){
      const mh=Math.min(x-pad,COLS-pad-1-x),mv=Math.min(y-pad,ROWS-pad-1-y);
      if(mh<curve&&mv<curve){const dx=curve-mh-.5,dy=curve-mv-.5;mask[y][x]=dx*dx+dy*dy<=curve*curve;}
      else mask[y][x]=true;
    }
  } else if(shape==='bean'){
    const c1x=cx-COLS*.1,c2x=cx+COLS*.14;
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)
      mask[y][x]=((x-c1x)/(COLS*.3))**2+((y-cy)/(ROWS*.38))**2<=1||((x-c2x)/(COLS*.28))**2+((y-cy)/(ROWS*.33))**2<=1;
  } else if(shape==='diamond'){
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)
      mask[y][x]=Math.abs((x-cx)/(COLS*.44))+Math.abs((y-cy)/(ROWS*.42))<=1;
  } else if(shape==='lshape'){
    const flip=mirrorEnabled&&rng()>.5;
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
      const px=flip?COLS-1-x:x;
      mask[y][x]=(px>=1&&px<=COLS*.65&&y>=1&&y<=ROWS*.6)||(px>=1&&px<=COLS*.38&&y>=ROWS*.3&&y<=ROWS-2);
    }
  } else if(shape==='cross'){
    const hw=Math.floor(COLS*.3),vw=Math.floor(ROWS*.3);
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)
      mask[y][x]=(x>=2&&x<=COLS-3&&y>=cy-vw/2&&y<=cy+vw/2)||(y>=1&&y<=ROWS-2&&x>=cx-hw/2&&x<=cx+hw/2);
  } else if(shape==='hex'){
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
      const nx=Math.abs(x-cx)/(COLS*.44),ny=Math.abs(y-cy)/(ROWS*.40);
      mask[y][x]=nx<=1&&ny<=1&&nx+ny*.6<=1.1;
    }
  } else { // irregular
    const pts=24,radii=Array.from({length:pts},()=>.30+rng()*.18);
    for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
      const dx=(x-cx)/(COLS*.5),dy=(y-cy)/(ROWS*.5),dist=Math.sqrt(dx*dx+dy*dy);
      if(dist<.01){mask[y][x]=true;continue;}
      const angle=Math.atan2(dy,dx),idx=((angle/(2*Math.PI)*pts)+pts)%pts;
      const i0=Math.floor(idx)%pts,i1=(i0+1)%pts,t=idx-Math.floor(idx);
      mask[y][x]=dist<=(radii[i0]*(1-t)+radii[i1]*t)*1.7;
    }
  }
  for(let x=0;x<COLS;x++){mask[0][x]=false;mask[ROWS-1][x]=false;}
  for(let y=0;y<ROWS;y++){mask[y][0]=false;mask[y][COLS-1]=false;}
  return mask;
}

// ══════════════════════════════════════════════════
// FLOOD FILL — CONNECTIVITÉ
// ══════════════════════════════════════════════════
function floodFill(grid,mask,startX,startY){
  const visited=Array.from({length:ROWS},()=>new Array(COLS).fill(false));
  const q=[[startX,startY]];
  if(!mask[startY]?.[startX])return visited;
  visited[startY][startX]=true;
  while(q.length){
    const[x,y]=q.shift();
    for(const[dx,dy]of[[0,1],[0,-1],[1,0],[-1,0]]){
      const nx=x+dx,ny=y+dy;
      if(nx<0||nx>=COLS||ny<0||ny>=ROWS)continue;
      if(visited[ny][nx]||!mask[ny][nx])continue;
      const c=grid[ny][nx];
      if(c===CELL.OBSTACLE||c===CELL.STRUCT||c===CELL.WALL)continue;
      visited[ny][nx]=true;q.push([nx,ny]);
    }
  }
  return visited;
}

function findEntryCell(mask){
  // Cherche la première cellule jouable près du bord gauche
  for(let x=1;x<Math.floor(COLS/2);x++)
    for(let y=1;y<ROWS-1;y++)
      if(mask[y][x])return{x,y};
  return{x:1,y:Math.floor(ROWS/2)};
}

function removeIsolated(grid,mask,entryX,entryY){
  // Flood fill depuis l'entrée, toute cellule non-atteinte et non-obstacle devient obstacle
  const reached=floodFill(grid,mask,entryX,entryY);
  let fixed=0;
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    if(!mask[y][x])continue;
    const c=grid[y][x];
    if(c===CELL.OBSTACLE||c===CELL.STRUCT||c===CELL.WALL)continue;
    if(!reached[y][x]){grid[y][x]=CELL.OBSTACLE;fixed++;}
  }
  return fixed;
}

function ensureEntryFree(grid,mask,entryX,entryY){
  // Libère les cellules directement adjacentes à l'entrée si bloquées
  const adj=[[entryX,entryY],[entryX+1,entryY],[entryX+2,entryY],[entryX,entryY-1],[entryX,entryY+1]];
  for(const[x,y]of adj){
    if(x>=0&&x<COLS&&y>=0&&y<ROWS&&mask[y][x]){
      if(grid[y][x]===CELL.OBSTACLE||grid[y][x]===CELL.STRUCT)grid[y][x]=CELL.FLOOR;
    }
  }
}

// ══════════════════════════════════════════════════
// GABARIT
// ══════════════════════════════════════════════════
function applyTemplate(grid,mask,tId,rng){
  const t=TEMPLATES[tId];if(!t||!t.struct.length)return;
  const cx=Math.floor(COLS/2),cy=Math.floor(ROWS/2);
  const p=(x,y,type)=>{if(x>=0&&x<COLS&&y>=0&&y<ROWS&&mask[y][x]&&grid[y][x]===CELL.FLOOR)grid[y][x]=type;};
  for(const s of t.struct){
    if(s==='band_h'){
      for(const y of[2,3])for(const x of[3,4,6,7,22,23,25,26])p(x,y,CELL.STRUCT);
      for(const y of[ROWS-4,ROWS-3])for(const x of[3,4,6,7,22,23,25,26])p(x,y,CELL.STRUCT);
    }else if(s==='l_shape'){
      for(let x=18;x<=24;x++)for(let y=1;y<=4;y++)p(x,y,CELL.STRUCT);
      for(let x=3;x<=8;x++)for(let y=ROWS-5;y<=ROWS-2;y++)p(x,y,CELL.STRUCT);
    }else if(s==='double_wall'){
      for(let x=6;x<=12;x++){p(x,2,CELL.WALL);p(x,ROWS-3,CELL.WALL);}
      for(let x=18;x<=24;x++){p(x,2,CELL.WALL);p(x,ROWS-3,CELL.WALL);}
    }else if(s==='four_pillars'){
      [[5,2],[8,2],[5,5],[8,5],[22,2],[25,2],[22,5],[25,5],
       [5,ROWS-7],[8,ROWS-7],[5,ROWS-4],[8,ROWS-4],[22,ROWS-7],[25,ROWS-7],[22,ROWS-4],[25,ROWS-4]]
      .forEach(([x,y])=>p(x,y,CELL.STRUCT));
    }else if(s==='cross_corners'){
      for(let x=3;x<=7;x++)for(const y of[[2,5],[ROWS-6,ROWS-3]])for(let yy=y[0];yy<=y[1];yy++)p(x,yy,CELL.STRUCT);
      for(let x=24;x<=28;x++)for(const y of[[2,5],[ROWS-6,ROWS-3]])for(let yy=y[0];yy<=y[1];yy++)p(x,yy,CELL.STRUCT);
    }else if(s==='right_dense'){
      for(let x=18;x<=28;x++)for(let y=1;y<ROWS-1;y++)if(rng()<.55&&mask[y][x])p(x,y,CELL.STRUCT);
    }else if(s==='funnel'){
      for(let x=6;x<=18;x++){const sp=Math.floor((x-6)*.35);p(x,1+sp,CELL.STRUCT);p(x,ROWS-2-sp,CELL.STRUCT);}
    }else if(s==='central_boss'){
      for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++)p(cx+dx,cy+dy,CELL.SPECIAL);
    }else if(s==='broken_wall'){
      const g1=7+Math.floor(rng()*3),g2=20+Math.floor(rng()*3);
      for(let x=2;x<COLS-2;x++)if(Math.abs(x-g1)>1&&Math.abs(x-g2)>1)p(x,cy,CELL.WALL);
    }else if(s==='ring'){
      for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
        const d=((x-cx)/10)**2+((y-cy)/5)**2;if(d>=.7&&d<=1.15)p(x,y,CELL.STRUCT);
      }
    }else if(s==='diagonal_band'){
      for(let x=2;x<COLS-2;x++){const y=Math.round(cy+(x-cx)*.35);if(Math.abs(x-cx)>3){p(x,y,CELL.STRUCT);p(x,y+1,CELL.STRUCT);}}
    }else if(s==='curve_wall'){
      for(let x=3;x<COLS-3;x++){
        const yT=Math.round(2+Math.sin((x/COLS)*Math.PI)*3),yB=Math.round(ROWS-3-Math.sin((x/COLS)*Math.PI)*3);
        if(x<8||x>COLS-8){p(x,yT,CELL.STRUCT);p(x,yB,CELL.STRUCT);}
      }
    }else if(s==='pincer'){
      for(let x=1;x<COLS-1;x++){p(x,1,CELL.STRUCT);p(x,ROWS-2,CELL.STRUCT);}
    }else if(s==='altar'){
      p(cx,cy,CELL.SPECIAL);p(cx+1,cy,CELL.SPECIAL);p(cx,cy+1,CELL.SPECIAL);p(cx+1,cy+1,CELL.SPECIAL);
    }else if(s==='merchant'){
      p(cx,cy,CELL.SPECIAL);
      for(let dx=-2;dx<=2;dx++)for(let dy=-2;dy<=2;dy++)if(Math.abs(dx)+Math.abs(dy)===2)p(cx+dx,cy+dy,CELL.STRUCT);
    }else if(s==='round_corners'){
      [[0,0],[COLS-1,0],[0,ROWS-1],[COLS-1,ROWS-1]].forEach(([ox,oy])=>{
        for(let dx=0;dx<=3;dx++)for(let dy=0;dy<=3;dy++){
          const x=ox===0?ox+dx:ox-dx,y=oy===0?oy+dy:oy-dy;p(x,y,CELL.STRUCT);
        }
      });
    }else if(s==='inner_frame'){
      const pad=3;
      for(let x=pad;x<COLS-pad;x++){p(x,pad,CELL.STRUCT);p(x,ROWS-pad-1,CELL.STRUCT);}
      for(let y=pad;y<ROWS-pad;y++){p(pad,y,CELL.STRUCT);p(COLS-pad-1,y,CELL.STRUCT);}
    }
  }
}

// ══════════════════════════════════════════════════
// WFC OBSTACLES
// ══════════════════════════════════════════════════
function applyWFC(grid,mask,density,rng){
  const playable=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)
    if(mask[y][x]&&grid[y][x]===CELL.FLOOR)playable.push([x,y]);
  const target=Math.floor(playable.length*density/100);
  for(let i=playable.length-1;i>0;i--){const j=Math.floor(rng()*i);[playable[i],playable[j]]=[playable[j],playable[i]];}
  let placed=0;
  for(const[x,y]of playable){
    if(placed>=target)break;
    if(grid[y][x]!==CELL.FLOOR)continue;
    let free=0;
    for(const[dx,dy]of[[0,-1],[0,1],[1,0],[-1,0]]){
      let run=0;
      for(let d=1;d<=3;d++){const nx=x+dx*d,ny=y+dy*d;if(nx>=0&&nx<COLS&&ny>=0&&ny<ROWS&&mask[ny][nx]&&grid[ny][nx]===CELL.FLOOR)run++;else break;}
      if(run>=3)free++;
    }
    if(free>=1){grid[y][x]=CELL.OBSTACLE;placed++;}
  }
}

function applyCenter(grid,mask){
  const cx=Math.floor(COLS/2),cy=Math.floor(ROWS/2);
  for(let y=cy-3;y<=cy+3;y++)for(let x=cx-4;x<=cx+4;x++)
    if(x>=0&&x<COLS&&y>=0&&y<ROWS&&mask[y][x]&&(grid[y][x]===CELL.FLOOR||grid[y][x]===CELL.OBSTACLE))grid[y][x]=CELL.CENTER;
}

function applyInteractive(grid,mask,rng){
  const count=1+Math.floor(rng()*3);
  const floors=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)
    if(mask[y][x]&&grid[y][x]===CELL.FLOOR)floors.push([x,y]);
  for(let i=0;i<count&&floors.length;i++){
    const idx=Math.floor(rng()*floors.length);
    const[x,y]=floors.splice(idx,1)[0];
    grid[y][x]=CELL.INTERACTIVE;
    [[x+1,y],[x,y+1],[x+1,y+1]].forEach(([nx,ny])=>{
      if(nx<COLS&&ny<ROWS&&mask[ny][nx]&&grid[ny][nx]===CELL.FLOOR)grid[ny][nx]=CELL.INTERACTIVE;
    });
  }
}

// ══════════════════════════════════════════════════
// SPAWN ENNEMIS — selon type de salle
// ══════════════════════════════════════════════════

// Compositions par type de salle : [type, poids relatif]
const ROOM_COMPOSITIONS={
  normal:[
    ['weak',4],['normal',5],['strong',2],
  ],
  elite:[
    ['normal',2],['strong',3],['e_weak',4],['e_normal',3],['e_strong',1],
  ],
  miniboss:[
    ['normal',2],['strong',2],['e_normal',2],['e_strong',2],['miniboss',1],
  ],
  boss:[
    ['e_strong',2],['boss',1],
  ],
};

// Defaults de count par type
const ROOM_COUNT_DEFAULTS={normal:5,elite:4,miniboss:3,boss:1};

function getRoomType(){
  return document.getElementById('selRoomType')?.value||'normal';
}

function weightedPick(rng,table){
  const total=table.reduce((s,[,w])=>s+w,0);
  let r=(rng?rng():Math.random())*total;
  for(const[type,w]of table){r-=w;if(r<=0)return type;}
  return table[0][0];
}

function respawnEnemies(){
  const count=parseInt(document.getElementById('inputEnemies').value)||0;
  S.enemies=[];
  if(!S.grid||!S.mask)return;
  const floors=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)
    if(S.mask[y][x]&&(S.grid[y][x]===CELL.FLOOR||S.grid[y][x]===CELL.CENTER))
      floors.push([x,y]);
  for(let i=floors.length-1;i>0;i--){const j=Math.floor(Math.random()*i);[floors[i],floors[j]]=[floors[j],floors[i]];}
  const roomType=getRoomType();
  const comp=ROOM_COMPOSITIONS[roomType]||ROOM_COMPOSITIONS.normal;
  for(let i=0;i<Math.min(count,floors.length);i++){
    const[x,y]=floors[i];
    S.enemies.push({x,y,type:weightedPick(null,comp)});
  }
  renderAll();updateStats();buildJSON();
}

function onRoomTypeChange(){
  // Met à jour le count par défaut selon le type
  const t=getRoomType();
  const def=ROOM_COUNT_DEFAULTS[t];
  document.getElementById('inputEnemies').value=def;
  document.getElementById('sliderEnemies').value=def;
  // Régénère immédiatement les ennemis si une salle est chargée
  if(S.grid)respawnEnemies();
  // Régénère nom et description
  generateName(true);
  generateDescription(true);
}

// ══════════════════════════════════════════════════
// GÉNÉRATION PRINCIPALE
// ══════════════════════════════════════════════════
function generateArena(fullRandom){
  const biomeKey=(fullRandom||document.getElementById('selBiome').value==='random')
    ?Object.keys(BIOMES)[Math.floor(Math.random()*4)]
    :document.getElementById('selBiome').value;
  const templateId=(fullRandom||document.getElementById('selTemplate').value==='random')
    ?Object.keys(TEMPLATES)[Math.floor(Math.random()*Object.keys(TEMPLATES).length)]
    :document.getElementById('selTemplate').value;
  const shapeKey=(fullRandom||document.getElementById('selShape').value==='random')
    ?SHAPES[Math.floor(Math.random()*SHAPES.length)]
    :document.getElementById('selShape').value;
  const density=parseInt(document.getElementById('inputDensity').value)||15;
  const seedVal=parseInt(document.getElementById('inputSeed').value)||0;

  S.biome=biomeKey; S.template=templateId; S.shape=shapeKey; S.density=density;

  const rng=mkRng(seedVal===0?null:seedVal);
  const mask=generateShape(shapeKey,rng);
  const grid=Array.from({length:ROWS},(_,y)=>Array.from({length:COLS},(_,x)=>mask[y][x]?CELL.FLOOR:CELL.VOID));

  applyTemplate(grid,mask,templateId,rng);
  applyCenter(grid,mask);

  const tInfo=TEMPLATES[templateId];
  const effD=tInfo.density[0]===0?0:Math.max(tInfo.density[0],Math.min(tInfo.density[1],density));
  applyWFC(grid,mask,effD,rng);

  // Entrée
  const entry=findEntryCell(mask);
  ensureEntryFree(grid,mask,entry.x,entry.y);

  // Supprimer zones isolées
  removeIsolated(grid,mask,entry.x,entry.y);
  // Re-libérer entrée après correction
  ensureEntryFree(grid,mask,entry.x,entry.y);

  if(getTag('tagInteractive')&&tInfo.density[0]>0)
    applyInteractive(grid,mask,rng);

  if(getTag('tagEntry'))
    grid[entry.y][entry.x]=CELL.ENTRY;

  S.grid=grid; S.mask=mask; S.entryPos=entry; S.enemies=[];

  // Spawn ennemis avec count adapté au type de salle
  const rt=getRoomType();
  const defCount=ROOM_COUNT_DEFAULTS[rt];
  document.getElementById('inputEnemies').value=defCount;
  document.getElementById('sliderEnemies').value=defCount;
  respawnEnemies();

  // Toujours régénérer nom et description à chaque génération
  document.getElementById('arenaNameInput').value='';
  document.getElementById('arenaDesc').value='';
  generateName(true);
  generateDescription(true);

  updateStats();
  renderAll();
  buildJSON();
  buildToolBar();
}

// ══════════════════════════════════════════════════
// NOM & DESCRIPTION — biome + type de salle
// ══════════════════════════════════════════════════

const ROOM_TYPE_PREFIXES={
  normal:  {fr:''},
  elite:   {fr:['Repaire','Antre','Territoire','Domaine','Fief']},
  miniboss:{fr:['Sanctuaire','Arène','Chasse-gardée','Fief','Bastion']},
  boss:    {fr:['Trône','Couronne','Domination','Règne','Palais']},
};

const ROOM_TYPE_DESCS={
  normal:null, // utilise DESCS par biome
  elite:{
    savane:['Un chasseur d\'élite protège ce territoire avec une férocité hors du commun.',
      'La poussière porte encore les traces du dernier combat. L\'élite attend.',
      'Espace restreint, ennemi redoutable. Il connaît chaque centimètre du terrain.'],
    foret:['Les arbres semblent se refermer. Quelque chose de plus grand que d\'habitude rôde ici.',
      'Le silence est trop parfait. L\'élite a déjà repéré ta présence.',
      'Terrain familier pour l\'élite. Chaque racine, chaque ombre lui appartient.'],
    zh:['Les eaux troubles dissimulent un prédateur d\'élite. Il attend que tu t\'approches.',
      'L\'élite se fond dans la brume. Sa maîtrise du terrain est totale.',
      'Les roseaux bougent sans vent. L\'élite est déjà en position.'],
    ruines:['Ces ruines sont son territoire. Il les connaît mieux que toi.',
      'L\'élite garde ces pierres depuis plus longtemps que tu ne l\'imagines.',
      'Chaque colonne, chaque alcôve est un avantage pour l\'élite qui t\'attend.'],
  },
  miniboss:{
    savane:['La savane tombe silencieuse. Un prédateur hors norme s\'est établi ici.',
      'Des carcasses récentes. Ce territoire appartient à quelqu\'un d\'exceptionnel.',
      'La chaleur est plus lourde ici. Quelque chose d\'imposant contrôle cet espace.'],
    foret:['Les arbres portent des marques de griffes trop hautes pour être normales.',
      'Le sous-bois est dégagé — nettoyé par quelqu\'un qui avait besoin d\'espace pour se battre.',
      'Les autres créatures ont fui. Quelque chose d\'unique s\'est installé ici.'],
    zh:['L\'eau ne bouge plus. Même les prédateurs aquatiques ont déserté ce coin.',
      'Un territoire aquatique défendu par une force hors du commun.',
      'Les pierres portent des traces d\'un combat récent et violent.'],
    ruines:['Ces ruines ont été réclamées par quelque chose de plus puissant que les autres.',
      'Un gardien d\'exception veille sur ces vestiges. Il ne les abandonnera pas.',
      'La végétation a été repoussée. Quelque chose a voulu espace pour régner ici.'],
  },
  boss:{
    savane:['La savane tout entière retient son souffle. Le Lion règne ici.',
      'Sol de latérite marqué par des années de domination absolue. C\'est le trône.',
      'Horizon dégagé. Ici, le Lion voit tout. Et il t\'a déjà vu arriver.'],
    foret:['La forêt s\'incline. Chaque arbre, chaque ombre lui appartient.',
      'Clairière du roi. Aucun autre n\'ose s\'aventurer ici. Sauf toi.',
      'Le sol est marqué par les rondes du Lion. Tu entres dans son palais.'],
    zh:['Les eaux reflètent son ombre depuis toujours. Tu n\'es que la prochaine proie.',
      'Brume de pouvoir. Le Lion commande même les éléments dans cette arène.',
      'Point d\'eau du roi. Tous viennent s\'y abreuver. Toi, tu viens le défier.'],
    ruines:['Temple érigé à sa gloire. Il l\'a simplement... occupé.',
      'Trône de pierre au milieu des ruines. Il l\'a toujours considéré comme sien.',
      'Le Lion n\'a pas besoin de murs pour régner. Ses yeux sont les seules frontières.'],
  },
};

function generateName(force=true){
  if(!force&&document.getElementById('arenaNameInput').value)return;
  const b=S.biome;
  const roomType=getRoomType();
  const N=NAMES[b]||NAMES.savane;
  const pick=arr=>arr[Math.floor(Math.random()*arr.length)];

  let name;
  if(roomType==='normal'){
    const r=Math.random();
    if(r<.4)name=pick(N.adj)+' '+pick(N.noun);
    else if(r<.7)name=pick(N.noun)+' '+pick(N.suffix);
    else name=pick(N.adj)+' '+pick(N.noun)+' '+pick(N.suffix);
  } else {
    const pref=ROOM_TYPE_PREFIXES[roomType];
    const prefix=pick(pref.fr);
    const r=Math.random();
    if(r<.5)name=prefix+' '+pick(N.suffix);
    else name=prefix+' '+pick(N.adj)+' '+pick(N.noun);
  }
  document.getElementById('arenaNameInput').value=name;
  document.getElementById('arenaTitle').textContent=name;
}

function generateDescription(force=true){
  if(!force&&document.getElementById('arenaDesc').value)return;
  const roomType=getRoomType();
  const b=S.biome;
  let pool;
  if(roomType==='normal'||!ROOM_TYPE_DESCS[roomType]){
    pool=DESCS[b]||DESCS.savane;
  } else {
    pool=(ROOM_TYPE_DESCS[roomType]?.[b])||DESCS[b]||DESCS.savane;
  }
  document.getElementById('arenaDesc').value=pool[Math.floor(Math.random()*pool.length)];
}

// Sync titre en temps réel
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('arenaNameInput').addEventListener('input',function(){
    document.getElementById('arenaTitle').textContent=this.value||'—';
  });
});

// ══════════════════════════════════════════════════
// RENDU
// ══════════════════════════════════════════════════
function renderAll(){
  if(!S.grid)return;
  render(S.grid,S.mask,S.biome,document.getElementById('arenaCanvas'),false,S.enemies);
}

function render(grid,mask,biomeKey,canvas,small,enemies){
  const ctx=canvas.getContext('2d');
  const cw=canvas.width,ch=canvas.height;
  const cW=cw/COLS,cH=ch/ROWS;
  const b=BIOMES[biomeKey];
  ctx.clearRect(0,0,cw,ch);
  ctx.fillStyle='#080a06';ctx.fillRect(0,0,cw,ch);

  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    const cell=grid[y][x],px=x*cW,py=y*cH;
    if(!mask[y][x]){
      ctx.fillStyle='#0a0c08';ctx.fillRect(px,py,cW,cH);
      if(isBorder(x,y,mask)){ctx.fillStyle=b.wall+'99';ctx.fillRect(px+cW*.15,py+cH*.15,cW*.7,cH*.7);}
      continue;
    }
    // sol base
    ctx.fillStyle=b.floor;ctx.fillRect(px,py,cW,cH);
    if(!small&&(x+y)%2===0){ctx.fillStyle='rgba(0,0,0,.06)';ctx.fillRect(px,py,cW,cH);}

    if(cell===CELL.OBSTACLE||cell===CELL.STRUCT){
      ctx.fillStyle=cell===CELL.STRUCT?b.struct:b.obs;
      ctx.fillRect(px+1,py+1,cW-2,cH-2);
      if(!small){
        ctx.fillStyle='rgba(255,255,255,.09)';ctx.fillRect(px+1,py+1,cW-2,2);
        ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(px+1,py+cH-3,cW-2,2);
      }
    }else if(cell===CELL.WALL){
      ctx.fillStyle=b.wall;ctx.fillRect(px,py,cW,cH);
    }else if(cell===CELL.CENTER){
      ctx.fillStyle=b.floor;ctx.fillRect(px,py,cW,cH);
      ctx.fillStyle='rgba(255,255,255,.06)';ctx.fillRect(px,py,cW,cH);
    }else if(cell===CELL.INTERACTIVE){
      ctx.fillStyle=b.zone;ctx.fillRect(px,py,cW,cH);
      if(!small){
        ctx.fillStyle='rgba(255,255,255,.18)';
        ctx.beginPath();ctx.arc(px+cW/2,py+cH/2,Math.min(cW,cH)*.28,0,Math.PI*2);ctx.fill();
      }
    }else if(cell===CELL.SPECIAL){
      ctx.fillStyle='#c8a84b';ctx.fillRect(px+1,py+1,cW-2,cH-2);
    }else if(cell===CELL.ENTRY){
      ctx.fillStyle='#1a5a2a';ctx.fillRect(px,py,cW,cH);
      if(!small){
        ctx.fillStyle='#4aff6a';ctx.font=`bold ${Math.floor(cH*.65)}px monospace`;
        ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillText('E',px+cW/2,py+cH/2);
      }
    }
    if(!small){ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=.4;ctx.strokeRect(px,py,cW,cH);}
  }

  // Contour arène
  if(!small)drawBorder(ctx,mask,cW,cH,b);

  // Ennemis
  if(enemies&&!small){
    for(const e of enemies){
      const et=ENEMY_TYPES.find(t=>t.id===e.type)||ENEMY_TYPES[0];
      const px=e.x*cW,py=e.y*cH;
      const r=Math.min(cW,cH)*.38;
      ctx.fillStyle=et.ring;ctx.beginPath();ctx.arc(px+cW/2,py+cH/2,r+1.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=et.color;ctx.beginPath();ctx.arc(px+cW/2,py+cH/2,r,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(0,0,0,.7)';
      ctx.font=`bold ${Math.floor(r*1.1)}px monospace`;
      ctx.textAlign='center';ctx.textBaseline='middle';
      ctx.fillText(et.symbol[0],px+cW/2,py+cH/2+.5);
      // Badge type (2e lettre si élite)
      if(et.symbol.length>1){
        ctx.font=`bold ${Math.floor(r*.6)}px monospace`;
        ctx.fillStyle='rgba(255,255,255,.9)';
        ctx.fillText(et.symbol[1],px+cW/2+r*.5,py+cH/2-r*.4);
      }
    }
  }
}

function isBorder(x,y,mask){
  return[[0,1],[0,-1],[1,0],[-1,0]].some(([dx,dy])=>{const nx=x+dx,ny=y+dy;return nx>=0&&nx<COLS&&ny>=0&&ny<ROWS&&mask[ny][nx];});
}
function drawBorder(ctx,mask,cW,cH,b){
  ctx.strokeStyle=b.accent+'bb';ctx.lineWidth=1.5;
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    if(!mask[y][x])continue;
    const px=x*cW,py=y*cH;
    [{dx:0,dy:-1,sx:0,sy:0,ex:cW,ey:0},{dx:0,dy:1,sx:0,sy:cH,ex:cW,ey:cH},
     {dx:-1,dy:0,sx:0,sy:0,ex:0,ey:cH},{dx:1,dy:0,sx:cW,sy:0,ex:cW,ey:cH}]
    .forEach(({dx,dy,sx,sy,ex,ey})=>{
      const nx=x+dx,ny=y+dy;
      if(nx<0||nx>=COLS||ny<0||ny>=ROWS||!mask[ny][nx]){
        ctx.beginPath();ctx.moveTo(px+sx,py+sy);ctx.lineTo(px+ex,py+ey);ctx.stroke();
      }
    });
  }
}

// ══════════════════════════════════════════════════
// STATS & VALIDATION
// ══════════════════════════════════════════════════
function updateStats(){
  if(!S.grid)return;
  let playable=0,obs=0,interactive=0,centerFree=0,minCorridor=99;
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    if(!S.mask[y][x])continue;playable++;
    const c=S.grid[y][x];
    if(c===CELL.OBSTACLE||c===CELL.STRUCT||c===CELL.WALL)obs++;
    if(c===CELL.INTERACTIVE)interactive++;
    if(c===CELL.CENTER)centerFree++;
  }
  for(let y=1;y<ROWS-1;y++){let run=0;
    for(let x=0;x<COLS;x++){
      if(S.mask[y][x]&&S.grid[y][x]!==CELL.OBSTACLE&&S.grid[y][x]!==CELL.STRUCT&&S.grid[y][x]!==CELL.WALL)run++;
      else run=0;
      if(run>0&&run<minCorridor)minCorridor=run;
    }
  }
  // Vérif zones isolées
  const entry=S.entryPos||{x:1,y:Math.floor(ROWS/2)};
  const reached=floodFill(S.grid,S.mask,entry.x,entry.y);
  let isolated=0;
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++){
    if(!S.mask[y][x])continue;
    const c=S.grid[y][x];
    if(c===CELL.OBSTACLE||c===CELL.STRUCT||c===CELL.WALL)continue;
    if(!reached[y][x])isolated++;
  }

  const density=playable>0?Math.round(obs/playable*100):0;
  const s=(id,val,cls)=>{const e=document.getElementById(id);if(e){e.textContent=val;e.className='stat-val '+(cls||'');}};
  s('stTemplate',S.template+' · '+(TEMPLATES[S.template]?.name||''));
  s('stShape',S.shape);
  s('stBiome',BIOMES[S.biome].emoji+' '+BIOMES[S.biome].name);
  s('stPlayable',playable);
  s('stObs',obs);
  s('stDensity',density+'%',density<=25?'good':'bad');
  s('stCenter',centerFree>0?'✓ Dégagée':'✗ Obstruée',centerFree>0?'good':'bad');
  s('stCorridor',minCorridor>=3?'✓ OK ('+minCorridor+')':'⚠ Étroit ('+minCorridor+')',minCorridor>=3?'good':'warn');
  s('stIsolated',isolated===0?'✓ Aucune':'⚠ '+isolated+' cellule(s)',isolated===0?'good':'warn');
  s('stEnemies',S.enemies.length);
  s('stSeed',S.usedSeed);

  // Badges validation
  const vr=document.getElementById('validationRow');
  vr.innerHTML='';
  const addBadge=(label,ok)=>vr.insertAdjacentHTML('beforeend',`<span class="vbadge ${ok?'ok':'warn'}">${label}</span>`);
  addBadge('Densité ≤25%',density<=25);
  addBadge('Couloir ≥3',minCorridor>=3);
  addBadge('Connectée',isolated===0);
  addBadge('Zone C.',centerFree>0);

  // Légende
  buildLegend();
  buildEnemyCount();
}

function buildLegend(){
  const b=BIOMES[S.biome];
  const items=[
    [b.floor,'Sol jouable'],[b.obs,'Obstacle WFC'],[b.struct,'Obstacle structurel'],
    [b.wall,'Mur interne'],[b.zone,'Tuile interactive'],['#c8a84b','Élément spécial'],['#1a5a2a','Entrée (E)'],
    ...ENEMY_TYPES.map(e=>[e.color,e.label])
  ];
  document.getElementById('legendBlock').innerHTML=items.map(([c,l])=>
    `<div class="leg-row"><div class="leg-sw" style="background:${c}"></div><span class="leg-lbl">${l}</span></div>`
  ).join('');
}

function buildEnemyCount(){
  const counts={};
  for(const e of S.enemies)counts[e.type]=(counts[e.type]||0)+1;
  document.getElementById('enemyCountBlock').innerHTML=
    ENEMY_TYPES.filter(t=>counts[t.id]).map(t=>`<span style="color:${t.color}">● ${t.label}: ${counts[t.id]}</span>`).join(' &nbsp;');
}

// ══════════════════════════════════════════════════
// INTERACTION CANVAS
// ══════════════════════════════════════════════════
const canvas=document.getElementById('arenaCanvas');
let painting=false;

function getCellFromEvent(e){
  const rect=canvas.getBoundingClientRect();
  const x=Math.floor((e.clientX-rect.left)/rect.width*COLS);
  const y=Math.floor((e.clientY-rect.top)/rect.height*ROWS);
  return{x:Math.max(0,Math.min(COLS-1,x)),y:Math.max(0,Math.min(ROWS-1,y))};
}

function paintCell(x,y){
  if(!S.grid||!S.mask[y]?.[x])return;
  const tool=S.activeTool;
  if(tool==='enemy'){
    // Ajouter ennemi si cellule libre
    if(S.grid[y][x]!==CELL.OBSTACLE&&S.grid[y][x]!==CELL.STRUCT&&S.grid[y][x]!==CELL.WALL&&S.grid[y][x]!==CELL.VOID){
      if(!S.enemies.find(e=>e.x===x&&e.y===y))
        S.enemies.push({x,y,type:S.activeEnemy});
    }
  }else if(tool==='rm_enemy'){
    S.enemies=S.enemies.filter(e=>!(e.x===x&&e.y===y));
  }else{
    if(S.mask[y][x])S.grid[y][x]=toolToCell(tool);
  }
  renderAll();updateStats();buildJSON();
}

canvas.addEventListener('mousedown',e=>{
  if(e.button===2){e.preventDefault();showCtxMenu(e);return;}
  painting=true;
  const{x,y}=getCellFromEvent(e);
  paintCell(x,y);
});
canvas.addEventListener('mousemove',e=>{
  const{x,y}=getCellFromEvent(e);
  if(painting)paintCell(x,y);
  // Tooltip
  if(!S.grid)return;
  const cell=S.grid[y]?.[x];
  const enemy=S.enemies.find(e=>e.x===x&&e.y===y);
  const et=enemy?ENEMY_TYPES.find(t=>t.id===enemy.type):null;
  const tip=document.getElementById('tooltip');
  tip.style.display='block';
  tip.style.left=(e.clientX+14)+'px';tip.style.top=(e.clientY+8)+'px';
  tip.textContent=`[${x},${y}] ${CELL_NAMES[cell]??'?'}${et?' · '+et.label:''}${!S.mask[y]?.[x]?' (hors arène)':''}`;
});
canvas.addEventListener('mouseup',()=>{painting=false;});
canvas.addEventListener('mouseleave',()=>{painting=false;document.getElementById('tooltip').style.display='none';});

// Context menu
function showCtxMenu(e){
  if(!S.grid)return;
  const{x,y}=getCellFromEvent(e);
  S.ctxCell={x,y};
  const menu=document.getElementById('ctxMenu');
  const cell=S.grid[y]?.[x];
  const inMask=S.mask[y]?.[x];
  const enemy=S.enemies.find(en=>en.x===x&&en.y===y);

  let html=`<div class="ctx-title">Cellule [${x},${y}]</div>`;
  if(inMask){
    html+=`<div class="ctx-sep"></div>`;
    html+=`<div class="ctx-title">Changer en</div>`;
    const cellTypes=[
      {t:'floor',label:'Sol',c:BIOMES[S.biome].floor},
      {t:'obstacle',label:'Obstacle',c:BIOMES[S.biome].obs},
      {t:'struct',label:'Obs. structurel',c:BIOMES[S.biome].struct},
      {t:'wall',label:'Mur interne',c:BIOMES[S.biome].wall},
      {t:'center',label:'Zone centrale',c:'rgba(255,255,255,.2)'},
      {t:'interactive',label:'Tuile interactive',c:BIOMES[S.biome].zone},
      {t:'special',label:'Élément spécial',c:'#c8a84b'},
      {t:'entry',label:'Entrée',c:'#1a5a2a'},
    ];
    cellTypes.forEach(({t,label,c})=>{
      html+=`<div class="ctx-item" onclick="ctxSetCell('${t}')"><div class="ctx-icon" style="background:${c}"></div>${label}</div>`;
    });
    html+=`<div class="ctx-sep"></div><div class="ctx-title">Ennemi</div>`;
    if(enemy){
      html+=`<div class="ctx-item" onclick="ctxRemoveEnemy()">✕ Retirer l'ennemi</div>`;
    }else{
      ENEMY_TYPES.forEach(et=>{
        html+=`<div class="ctx-item" onclick="ctxAddEnemy('${et.id}')"><div class="ctx-icon" style="background:${et.color}"></div>${et.label}</div>`;
      });
    }
  }
  html+=`<div class="ctx-sep"></div><div class="ctx-item" onclick="closeCtx()">✕ Fermer</div>`;
  menu.innerHTML=html;
  menu.style.display='block';
  menu.style.left=Math.min(e.clientX,window.innerWidth-170)+'px';
  menu.style.top=Math.min(e.clientY,window.innerHeight-300)+'px';
}

function ctxSetCell(tool){S.grid[S.ctxCell.y][S.ctxCell.x]=toolToCell(tool);renderAll();updateStats();buildJSON();closeCtx();}
function ctxAddEnemy(type){
  const{x,y}=S.ctxCell;
  if(!S.enemies.find(e=>e.x===x&&e.y===y))S.enemies.push({x,y,type});
  renderAll();updateStats();buildJSON();closeCtx();
}
function ctxRemoveEnemy(){
  S.enemies=S.enemies.filter(e=>!(e.x===S.ctxCell.x&&e.y===S.ctxCell.y));
  renderAll();updateStats();buildJSON();closeCtx();
}
function closeCtx(){document.getElementById('ctxMenu').style.display='none';}
document.addEventListener('click',e=>{if(!document.getElementById('ctxMenu').contains(e.target))closeCtx();});
// ══════════════════════════════════════════════════
// PALETTES UI
// ══════════════════════════════════════════════════
function buildToolPalette(){buildToolBar();} // alias de compatibilité

function buildToolBar(){
  const bar=document.getElementById('toolBarItems');
  if(!bar)return;
  const activeEnemy=ENEMY_TYPES.find(e=>e.id===S.activeEnemy)||ENEMY_TYPES[0];
  bar.innerHTML=TOOLS.map(t=>{
    const active=t.id===S.activeTool;
    const swatchHtml=t.isEnemy
      ?`<span style="color:${activeEnemy.color};font-size:10px;line-height:1;">●</span>`
      :`<span class="tb-swatch" style="background:${t.color};${t.id==='void'?'border-color:#444':''}"></span>`;
    return`<div class="tb-btn${active?' active':''}" onclick="setTool('${t.id}')" title="${getToolTip(t.id)}">${swatchHtml}${t.label}</div>`;
  }).join('');

  const ep=document.getElementById('toolBarEnemyPick');
  if(ep) ep.innerHTML=ENEMY_TYPES.map(et=>`
    <div class="tb-enemy-btn${et.id===S.activeEnemy?' active':''}"
      style="background:${et.color};border-color:${et.ring};color:rgba(0,0,0,.8);"
      onclick="setActiveEnemy('${et.id}')"
      title="${et.label}">${et.symbol[0]}</div>`).join('');
}

function getToolTip(id){
  const m={
    floor:'Sol — Peint une cellule jouable vide',
    obstacle:'Obstacle — Place un obstacle WFC standard',
    struct:'Obs. structurel — Obstacle du gabarit (plus robuste visuellement)',
    wall:'Mur interne — Barrière infranchissable, sert de rail de rebond',
    center:'Zone centrale — Marque la zone toujours dégagée au centre',
    interactive:'Tuile interactive — Zone spéciale biome (poussière/eau/mousse/dalle)',
    special:"Élément spécial — Autel, trône, étal marchand...",
    entry:"Entrée — Point de spawn du joueur",
    void:'Effacer — Retire la cellule de l\'arène jouable',
    enemy:"Ennemi — Place le type d'ennemi sélectionné à droite →",
    rm_enemy:"Retirer ennemi — Supprime l'ennemi sur la cellule cliquée"
  };
  return m[id]||'';
}

function setTool(id){S.activeTool=id;buildToolBar();}

function buildEnemyPalette(){
  const el=document.getElementById('enemyPalette');
  if(!el)return;
  el.innerHTML=ENEMY_TYPES.map(et=>`
    <div class="enemy-btn${et.id===S.activeEnemy?' active':''}" onclick="setActiveEnemy('${et.id}')" title="${et.label}">
      <div class="enemy-icon" style="background:${et.color};border-color:${et.ring}">${et.symbol[0]}</div>
      <span class="enemy-label">${et.label}</span>
    </div>`).join('');
}

function setActiveEnemy(id){
  S.activeEnemy=id;
  buildEnemyPalette();
  buildToolBar();
}

// ══════════════════════════════════════════════════
// JSON & BIBLIOTHÈQUE
// ══════════════════════════════════════════════════
function buildJSON(){
  if(!S.grid)return;
  const cells=[];
  for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)
    if(S.mask[y][x])cells.push({x,y,t:S.grid[y][x]});
  S.currentJSON={
    version:2,template:S.template,shape:S.shape,biome:S.biome,
    roomType:getRoomType(),
    seed:S.usedSeed,density:S.density,
    name:document.getElementById('arenaNameInput').value||'',
    description:document.getElementById('arenaDesc').value||'',
    entry:S.entryPos,cols:COLS,rows:ROWS,
    enemies:S.enemies,cells
  };
  document.getElementById('jsonBox').textContent=JSON.stringify(S.currentJSON,null,2).substring(0,700)+'\n…';
}

function saveToLibrary(){
  if(!S.currentJSON)return;
  S.library.push({id:Date.now(),data:{...S.currentJSON},grid:S.grid.map(r=>[...r]),mask:S.mask.map(r=>[...r]),biome:S.biome,enemies:[...S.enemies]});
  renderLibrary();
}

function renderLibrary(){
  document.getElementById('libCount').textContent=S.library.length;
  const list=document.getElementById('libraryList');
  if(!S.library.length){list.innerHTML='<div class="empty-lib">Aucun template.</div>';return;}
  list.innerHTML=S.library.map((item,i)=>`
    <div class="lib-item${i===S.selLib?' sel':''}" onclick="loadLib(${i})">
      <div class="lib-preview"><canvas id="lc_${item.id}" width="44" height="25"></canvas></div>
      <div class="lib-info">
        <div class="lib-name">${item.data.name||item.data.template} ${BIOMES[item.biome].emoji}</div>
        <div class="lib-meta">${item.data.shape} · s${item.data.seed} · ${item.data.enemies.length}⚔</div>
      </div>
      <button class="lib-del" onclick="event.stopPropagation();delLib(${i})">✕</button>
    </div>`).join('');
  S.library.forEach(item=>{
    const c=document.getElementById('lc_'+item.id);
    if(c)render(item.grid,item.mask,item.biome,c,true,[]);
  });
}

function loadLib(i){
  const item=S.library[i];
  S.grid=item.grid.map(r=>[...r]);S.mask=item.mask.map(r=>[...r]);
  S.biome=item.biome;S.enemies=[...item.enemies];S.currentJSON={...item.data};
  document.getElementById('arenaNameInput').value=item.data.name||'';
  document.getElementById('arenaDesc').value=item.data.description||'';
  document.getElementById('arenaTitle').textContent=item.data.name||'—';
  S.selLib=i;renderAll();updateStats();renderLibrary();
  document.getElementById('jsonBox').textContent=JSON.stringify(item.data,null,2).substring(0,700)+'\n…';
}

function delLib(i){S.library.splice(i,1);if(S.selLib>=i)S.selLib=null;renderLibrary();}

function exportJSON(){
  if(!S.currentJSON)return;
  const blob=new Blob([JSON.stringify(S.currentJSON,null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);
  a.download=`arena_${S.template}_${S.shape}_${S.usedSeed}.json`;a.click();
}

// ══════════════════════════════════════════════════
// INIT
// ══════════════════════════════════════════════════
buildEnemyPalette();
generateArena(); // buildToolBar appelé après génération via buildToolPalette alias
