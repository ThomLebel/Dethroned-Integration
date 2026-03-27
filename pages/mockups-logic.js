
  // ── Slides
  let cs = 0;
  function gs(n) {
    cs = n;
    document.getElementById('st').style.transform = 'translateX(-'+(n*580)+'px)';
    document.getElementById('sc').textContent = (n+1)+' / 4';
    document.querySelectorAll('.sdot').forEach((d,i)=>d.classList.toggle('on',i===n));
    document.querySelector('.sbtn-next').textContent = n===3 ? 'Commencer →' : 'Suivant →';
  }
  function ns() { cs < 3 ? gs(cs+1) : null; }

  // ── Encyclopédie data
  const ED = {
    mecaniques:[
      {icon:'💨',name:'Déplacement',sub:'Base',ok:true,
        stats:[],
        desc:"Incline la vue pour orienter ta trajectoire. La vitesse accumulée est conservée entre les rebonds. La friction réduit progressivement la vitesse au repos.",
        skills:[]},
      {icon:'⚔️',name:'ACC — Corps à Corps',sub:'Base',ok:true,
        stats:[['Formule','v × m × coeff_ACC'],['Seuil min.','< 1 = aucun dégât'],['Choc frontal','simultané']],
        desc:"L'Attaque au Corps à Corps se déclenche à chaque collision avec une entité active. Dégâts = vitesse_relative × masse_initiateur × coeff_ACC × (1 − coeff_DEF_receveur).",
        skills:[]},
      {icon:'🛡️',name:'DEF — Résistance',sub:'Base',ok:true,
        stats:[['Périmètre','ACC reçus uniquement'],['Cap','0.30'],['Compétences','non affectées']],
        desc:'Le coeff_DEF réduit les dégâts ACC reçus uniquement. Il ne protège pas des dégâts de compétences. Chaque classe et ennemi a sa propre valeur fixe.',
        skills:[]},
      {icon:'💥',name:'Collisions',sub:'Base',ok:true,
        stats:[],
        desc:"Résolution à chaque impact : calcul ACC → application DEF → déclenchement des compétences actives. En choc frontal, les deux entités calculent et infligent simultanément.",
        skills:[]},
      {icon:'↩️',name:'Rebonds',sub:'Base',ok:true,
        stats:[['Souris','coeff 1.0']],
        desc:'Rebond sur les murs selon le coefficient de rebond de la classe. Certaines compétences se déclenchent spécifiquement après un rebond (DA04, DA09).',
        skills:[]},
    ],
    classes:[
      {icon:'🐭',name:'Souris',sub:'Débutant · Savane',ok:true,
        stats:[['PV max','85'],['Vitesse','110%'],['Masse','70%'],['Rebond','1.0'],['coeff_ACC','0.10'],['coeff_DEF','0.05'],['Hitbox','Petite'],['Manœuv.','0.60']],
        desc:'Petite mais téméraire. Gagne en puissance avec chaque seconde de survie grâce aux stacks de Courage. Sa devise : la vitesse compense tout.',
        skills:[
          {name:'P1 — Jamais Vaincu',desc:'Chaque seconde de survie → +1 Courage (max 5). À 5 stacks : prochaine mort annulée.'},
          {name:'P2 — Instinct du Petit',desc:'Collision avec ennemi plus lourd → rebond pleine vitesse + 1 Courage. Aucun dégât reçu. Cooldown 8s.'},
          {name:'B1 — Ruée Courageuse',desc:'Vitesse élevée 2s → dash vers ennemi le plus proche. Puissance proportionnelle aux stacks de Courage.'},
          {name:'B2 — Détermination',desc:'Subir ≥ 15% PV max → soin automatique + boost de vitesse 3s. Soin proportionnel aux stacks.'},
          {name:'Fury — Grande Traversée',desc:'À 10 Cran → prochaine Ruée déclenche la Fury. Traversée totale avec dégâts amplifiés sur tout contact.'},
        ]},
      {icon:'🐰',name:'Lapin',sub:'Moyenne · Forêt',ok:false,stats:[],desc:'',skills:[]},
      {icon:'🐸',name:'Grenouille',sub:'Facile · Zones Humides',ok:false,stats:[],desc:'',skills:[]},
      {icon:'🐑',name:'Mouton',sub:'Facile · Savane',ok:false,stats:[],desc:'',skills:[]},
    ],
    ennemis:[
      {icon:'😂',name:'Hyène Juvénile',sub:'Faible · Savane',ok:true,
        stats:[['PV','Très faibles'],['Vitesse','Élevée'],['Masse','Faible'],['IA','Agressive'],['coeff_ACC','0.05'],['coeff_DEF','0.12']],
        desc:"Une hyène au ricanement incontrôlable. Difficile de savoir si elle attaque ou si elle est juste nerveuse. Probablement les deux.",
        skills:[{name:'Morsure Ricanante',desc:'Chaque contact applique un marquage léger.'}]},
      {icon:'🦂',name:'Scorpion des Sables',sub:'Faible · Savane',ok:true,
        stats:[['PV','Faibles'],['Vitesse','Lente'],['Masse','Faible'],['IA','Mixte'],['coeff_ACC','0.06'],['coeff_DEF','0.28']],
        desc:'Blindé comme un tank, lent comme une tortue avec le dos en galère. Sa carapace est sa fierté.',
        skills:[{name:'Dard Empoisonné',desc:'Contact → poison léger sur 3 secondes.'}]},
      {icon:'🦊',name:'Fennec Fuyard',sub:'Normal · Savane',ok:true,
        stats:[['PV','Faibles'],['Vitesse','Très élevée'],['Masse','Quasi nulle'],['IA','Fuyarde'],['coeff_ACC','0.02'],['coeff_DEF','0.05']],
        desc:"Court plus vite que ses propres pensées. Ce qui n'est pas très rassurant vu la tête qu'il fait.",
        skills:[]},
      {icon:'🐦',name:'Vautour Charognard',sub:'Normal · Savane',ok:true,
        stats:[['PV','Moyens'],['Vitesse','Élevée'],['Masse','Faible'],['IA','Agressive'],['coeff_ACC','0.07'],['coeff_DEF','0.08']],
        desc:'Patient. Très patient. Il attendrait que tu meures de vieillesse si tu ne bougeais plus.',
        skills:[{name:'Piqué',desc:'Après 3s en air libre → piqué dévastateur sur le joueur.'}]},
      {icon:'🐺',name:'Loup Alpha',sub:'Puissant · Savane',ok:false,stats:[],desc:'',skills:[]},
    ],
    reliques:[
      {icon:'🦷',name:'Griffe Ébréchée',sub:'Relique Faible',ok:true,
        stats:[['Rareté','Faible ⚪'],['Effet niv.1','+15% dégâts 1er impact/salle'],['Effet niv.2','+25% dégâts 1er impact']],
        desc:'Une vieille griffe ramassée dans le sable. Elle est ébréchée mais elle fait encore son boulot.',
        skills:[]},
      {icon:'🩸',name:'Soif de Sang',sub:'Relique Forte',ok:true,
        stats:[['Rareté','Forte 🔴'],['Effet niv.1','Gouttes → rechargent cooldowns'],['Effet niv.2','–2 PV par Goutte ramassée']],
        desc:'Quelque chose dans cette relique veut que tu saignes. Pas toi spécifiquement. Enfin si, un peu.',
        skills:[]},
      {icon:'🪶',name:'???',sub:'Non découvert',ok:false,stats:[],desc:'',skills:[]},
    ],
    competences:[
      {icon:'⚡',name:'Déclencheurs',sub:'Règles',ok:true,stats:[['Familles','Actifs / Amélioration / Modif.']],desc:"Les déclencheurs définissent quand une compétence s'active. Ils ne nécessitent aucune action du joueur — tout est automatique.",skills:[]},
      {icon:'✨',name:'Effets',sub:'Règles',ok:true,stats:[['Raretés','Commun / PC / Rare / Épique'],['Niveaux','1 → 2']],desc:"Les effets définissent ce qui se produit quand un déclencheur s'active. Améliorables au niveau 2 en Salle de Repos ou chez le Marchand.",skills:[]},
      {icon:'🎰',name:'Slots',sub:'Règles',ok:true,stats:[['Défaut','4 standard + 2 identité'],['Max pratique','10–12']],desc:'Chaque slot contient une paire Déclencheur+Effet. Les slots identité sont réservés aux compétences de classe.',skills:[]},
      {icon:'⏱️',name:'Cooldowns',sub:'Règles',ok:false,stats:[],desc:'',skills:[]},
      {icon:'⬆️',name:"Niveaux d'effet",sub:'Règles',ok:false,stats:[],desc:'',skills:[]},
    ],
    ressources:[
      {icon:'🦷',name:'Petites Dents',sub:'Monnaie run',ok:true,stats:[],desc:'Ramassées sur les ennemis vaincus. Dépensées chez le Corbeau.',skills:[]},
      {icon:'🩸',name:'Gouttes de Sang',sub:'Ressource salle',ok:true,stats:[],desc:'Apparaissent après des impacts forts. Effets variables selon les reliques équipées.',skills:[]},
      {icon:'💀',name:'Âmes Corrompues',sub:'Méta-progression',ok:true,stats:[],desc:'Gagnées à chaque fin de run. Investies dans la Lignée entre les parties.',skills:[]},
      {icon:'⚡',name:'Cran',sub:'Fury · Souris',ok:false,stats:[],desc:'',skills:[]},
      {icon:'🌙',name:'???',sub:'Non découvert',ok:false,stats:[],desc:'',skills:[]},
    ],
    fury:[{icon:'🌟',name:'Grande Traversée',sub:'Souris',ok:false,stats:[],desc:'',skills:[]}],
    meta:[{icon:'🌳',name:'La Lignée',sub:'Méta',ok:false,stats:[],desc:'',skills:[]}],
    trone:[{icon:'👑',name:'Trône Renversé',sub:'Système',ok:false,stats:[],desc:'',skills:[]}],
  };

  let cf = 'mecaniques';

  function ef(fam, btn) {
    cf = fam;
    document.querySelectorAll('.enc-fam-btn').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    renderEF(fam);
  }

  function renderEF(fam) {
    const data = ED[fam]||[];
    document.getElementById('enc-list').innerHTML = data.map((e,i)=>`
      <div class="enc-card${i===0?' on':''}" onclick="selE('${fam}',${i},this)">
        <div class="enc-thumb${e.ok?'':' locked'}">${e.ok?e.icon:'❓'}</div>
        <div>
          <div class="enc-card-name${e.ok?'':' locked'}">${e.ok?e.name:'???'}</div>
          <div class="enc-card-sub">${e.ok?e.sub:'Non découvert'}</div>
        </div>
      </div>`).join('');
    renderED(fam, 0);
  }

  function selE(fam, idx, el) {
    document.querySelectorAll('.enc-card').forEach(c=>c.classList.remove('on'));
    el.classList.add('on');
    renderED(fam, idx);
  }

  function renderED(fam, idx) {
    const e = (ED[fam]||[])[idx];
    const box = document.getElementById('enc-detail');
    if (!e) return;
    if (!e.ok) {
      box.innerHTML = `<div class="enc-locked-state">
        <div style="font-size:52px;filter:brightness(0);">${e.icon}</div>
        <div style="font-family:'Cinzel',serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;">Non découvert</div>
        <div style="font-size:11px;color:var(--gris);margin-bottom:14px">Rencontre cet élément en jeu pour débloquer sa fiche.</div>
        <div style="display:flex;align-items:center;gap:8px;padding:8px 14px;border:1px solid rgba(85,115,64,0.4);background:rgba(85,115,64,0.07);border-radius:2px">
          <span style="font-size:18px">💀</span>
          <div>
            <div style="font-family:'Cinzel',serif;font-size:10px;color:var(--vert);letter-spacing:1px">+1 ÂME CORROMPUE</div>
            <div style="font-family:'Space Mono',monospace;font-size:8px;color:var(--gris);margin-top:2px">Récompense au déblocage</div>
          </div>
        </div>
      </div>`;
      return;
    }
    const statsH = e.stats.length?`
      <div style="margin-bottom:14px">
        <div class="enc-section-title">Statistiques</div>
        <div class="enc-stats-grid">${e.stats.map(([l,v])=>`<div class="enc-stat"><span class="enc-stat-l">${l}</span><span class="enc-stat-v">${v}</span></div>`).join('')}</div>
      </div>`:'';
    const skillsH = e.skills.length?`
      <div>
        <div class="enc-section-title">Compétences</div>
        ${e.skills.map(s=>`<div class="enc-skill-row"><div class="enc-skill-name">${s.name}</div><div class="enc-skill-desc">${s.desc}</div></div>`).join('')}
      </div>`:'';
    box.innerHTML = `
      <div class="enc-dh">
        <div class="enc-dh-icon">${e.icon}</div>
        <div>
          <div class="enc-dh-fam">${fam}</div>
          <div class="enc-dh-name">${e.name}</div>
          <span class="enc-tag">${e.sub}</span>
        </div>
        <div style="margin-left:auto;display:flex;align-items:center;gap:5px;padding:4px 8px;border:1px solid rgba(85,115,64,0.35);background:rgba(85,115,64,0.08)">
          <span style="font-size:12px">💀</span>
          <span style="font-family:'Space Mono',monospace;font-size:7px;color:var(--vert);letter-spacing:1px">+1 ÂME</span>
          <span style="font-family:'Space Mono',monospace;font-size:7px;color:var(--gris)">DÉBLOQUÉ</span>
        </div>
      </div>
      ${statsH}
      ${e.desc?`<div style="margin-bottom:14px"><div class="enc-section-title">Description</div><div class="enc-desc">${e.desc}</div></div>`:''}
      ${skillsH}`;
  }

  // Init
  renderEF('mecaniques');
