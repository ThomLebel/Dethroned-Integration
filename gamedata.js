/**
 * gamedata.js — Source de vérité partagée
 * Dethroned: The King's Den — Bonaventure Studio
 *
 * Chargé UNE SEULE FOIS par index.html.
 * Tous les modules (build-sim, arena-forge, etc.) lisent depuis window.GD_*.
 * Ne jamais dupliquer ces données dans les modules individuels.
 */

// ══════════════════════════════════════════════════
// CLASSES
// ══════════════════════════════════════════════════
window.GD_CLASSES = [
  { id: 'lapin',       nom: 'Lapin',        archetype: 'Magicien / Invocateur',      element: 'Arcane',    biome: 'Forêt',        tags: ['#trajectoire','#piege','#mouvement','#teleportation','#sequence'], color: '#a0c8e0', emoji: '🐰' },
  { id: 'grenouille',  nom: 'Grenouille',   archetype: 'Ninja Empoisonneur',          element: 'Poison',    biome: 'Zones Humides', tags: ['#dot','#poison','#zone','#rebond','#controle','#slow'],          color: '#6db33f', emoji: '🐸' },
  { id: 'mouton',      nom: 'Mouton',       archetype: 'Char d\'Assaut',              element: 'Physique',  biome: 'Plaines',      tags: ['#impact_physique','#deplacement','#controle','#stun','#buff'],   color: '#d4c89a', emoji: '🐑' },
  { id: 'poule',       nom: 'Poule',        archetype: 'Guerrière Berserk',           element: 'Feu',       biome: 'Savane',       tags: ['#risque','#invocation','#controle','#deplacement','#pv_personnage'], color: '#ff6a20', emoji: '🐔' },
  { id: 'pigeon',      nom: 'Pigeon',       archetype: 'Bombardier Critique',         element: 'Feu',       biome: 'Ville',        tags: ['#critique','#trajectoire','#degat_indirect','#feu','#dot'],      color: '#8a8aaa', emoji: '🐦' },
  { id: 'ecureuil',    nom: 'Écureuil',     archetype: 'Artificier Hyperactif',       element: 'Physique',  biome: 'Forêt',        tags: ['#piege','#rebond','#degat_indirect','#invocation','#zone'],      color: '#c87840', emoji: '🐿️' },
  { id: 'canard',      nom: 'Canard',       archetype: 'Stratège Économiste',         element: 'Eau',       biome: 'Zones Humides', tags: ['#meta','#ressource','#debuff','#buff','#kill'],                  color: '#4ab8e8', emoji: '🦆' },
  { id: 'poisson',     nom: 'Poisson Rouge', archetype: 'Mage Instable',              element: 'Eau',       biome: 'Zones Humides', tags: ['#aleatoire','#zone','#eau','#trigger','#sequence'],              color: '#ff6060', emoji: '🐟' },
  { id: 'loutre',      nom: 'Loutre',       archetype: 'Duelliste de Précision',      element: 'Physique',  biome: 'Zones Humides', tags: ['#rebond','#dot','#critique','#dash','#sequence'],               color: '#c0a87a', emoji: '🦦' },
  { id: 'souris',      nom: 'Souris',       archetype: 'Héroïne Résiliente',          element: 'Arcane',    biome: 'Ville',        tags: ['#mouvement','#vitesse','#risque','#buff','#deplacement','#pv_personnage'], color: '#d8d0c0', emoji: '🐭' },
  { id: 'singe',       nom: 'Singe',        archetype: 'Chapardeur Espiègle',         element: 'Arcane',    biome: 'Savane',       tags: ['#aleatoire','#trigger','#sequence','#trajectoire','#debuff'],    color: '#c89040', emoji: '🐒' },
  { id: 'tortue',      nom: 'Tortue',       archetype: 'Maître du Kung-Fu',           element: 'Physique',  biome: 'Montagne',     tags: ['#controle','#stun','#deplacement','#buff','#defense','#risque'], color: '#70a870', emoji: '🐢' },
];

// ══════════════════════════════════════════════════
// EFFETS (extrait représentatif — les 100 complets sont dans effets_catalogue_v4.md)
// ══════════════════════════════════════════════════
window.GD_EFFECTS = [
  { id:'CàC-D01', nom:'Percussion Brute',        r:'Commun',    req:'#req_cible', cd:'5s',  tags:['#degat_direct','#impact_physique','#corps_a_corps'], desc:'Inflige 13 PV au contact.' },
  { id:'CàC-D02', nom:'Frappe Brisante',          r:'Commun',    req:'#req_cible', cd:'5s',  tags:['#degat_direct','#impact_physique','#corps_a_corps'], desc:'Inflige 11 PV + applique Brisé.' },
  { id:'CàC-D03', nom:'Morsure de Feu',           r:'Commun',    req:'#req_cible', cd:'5s',  tags:['#degat_direct','#feu','#corps_a_corps'],             desc:'Inflige 11 PV + applique Chauffé.' },
  { id:'CàC-D04', nom:'Arc de Contact',           r:'Commun',    req:'#req_cible', cd:'5s',  tags:['#degat_direct','#electricite','#corps_a_corps'],       desc:'Inflige 11 PV + applique Électrifié.' },
  { id:'CàC-D05', nom:'Injection Toxique',        r:'Commun',    req:'#req_cible', cd:'5s',  tags:['#degat_direct','#poison','#corps_a_corps'],            desc:'Inflige 11 PV + applique Intoxiqué.' },
  { id:'CàC-D06', nom:'Onde de Choc',             r:'Commun',    req:'#req_cible', cd:'5s',  tags:['#degat_direct','#aoe','#impact_physique','#corps_a_corps'], desc:'11 PV en zone autour du contact.' },
  { id:'CàC-T01', nom:'Hémorragie',               r:'Commun',    req:'#req_cible', cd:'5s',  tags:['#degat_indirect','#dot','#saignement','#corps_a_corps'], desc:'Applique 1 stack Saignement (3 PV/s, 5s).' },
  { id:'CàC-T02', nom:'Venin',                    r:'Commun',    req:'#req_cible', cd:'5s',  tags:['#degat_indirect','#dot','#poison','#corps_a_corps'],   desc:'Applique Empoisonné (4 PV/s, 6s).' },
  { id:'SCE-01',  nom:'Percussion Repoussante',   r:'Commun',    req:'#req_cible', cd:'6s',  tags:['#controle','#deplacement','#pousser','#impact_physique'], desc:'Repousse la cible avec force.' },
  { id:'SCE-02',  nom:'Glace Ralentissante',      r:'Commun',    req:'#req_cible', cd:'6s',  tags:['#controle','#slow','#eau'],                           desc:'Réduit la vitesse de 30% pendant 4s.' },
  { id:'SCE-03',  nom:'Stase Électrique',         r:'Rare',      req:'#req_cible', cd:'9s',  tags:['#controle','#stun','#electricite'],                   desc:'Immobilise 1,5s (×0,3 sur boss).' },
  { id:'SMO-01',  nom:'Impulsion Vive',           r:'Commun',    req:'#req_soi',   cd:'7s',  tags:['#mouvement','#vitesse','#buff'],                      desc:'+60% vitesse pendant 2s.' },
  { id:'SMO-02',  nom:'Blink',                    r:'Rare',      req:'#req_soi',   cd:'11s', tags:['#mouvement','#teleportation','#dash'],                 desc:'Téléportation instantanée vers le point cible.' },
  { id:'SDE-01',  nom:'Bouclier de Force',        r:'Rare',      req:'#req_soi',   cd:'12s', tags:['#defense','#bouclier','#buff'],                       desc:'Absorbe 30 PV de dégâts pendant 6s.' },
  { id:'SSO-01',  nom:'Saignée Inverse',          r:'Commun',    req:'#req_soi',   cd:'8s',  tags:['#soin','#vol_de_vie'],                                desc:'Restaure 25% des dégâts infligés.' },
  { id:'Inv-01',  nom:'Larve de Combat',          r:'Rare',      req:'#req_point', cd:'15s', tags:['#invocation','#structures'],                          desc:'Invoque une larve alliée (15 PV, 8s).' },
  { id:'PZ-01',   nom:'Zone Acide',               r:'Rare',      req:'#req_point', cd:'12s', tags:['#zone','#dot','#poison','#structures'],               desc:'Zone persistante 4s infligeant poison.' },
  { id:'CàC-D10', nom:'Fracas Volcanique',        r:'Épique',    req:'#req_cible', cd:'8s',  tags:['#degat_direct','#explosion','#aoe','#feu','#corps_a_corps'], desc:'22 PV + explosion Feu en zone. Chauffé garanti.' },
  { id:'CàC-D11', nom:'Loi du Marteau',           r:'Épique',    req:'#req_soi',   cd:'8s',  tags:['#degat_direct','#impact_physique','#corps_a_corps','#buff'], desc:'+40% dégâts suivants si ACC > 30.' },
  { id:'RES-01',  nom:'Pillage',                  r:'Commun',    req:'#req_cible', cd:'5s',  tags:['#ressource','#collecte','#kill'],                     desc:'Génère 2 Petites Dents à chaque kill.' },
];

// ══════════════════════════════════════════════════
// DÉCLENCHEURS (extrait représentatif)
// ══════════════════════════════════════════════════
window.GD_TRIGGERS = [
  { id:'DB-COL-01', nom:'Collision Standard',         type:'base',     famille:'Collision', rarete:'Commun', loc:'#loc_cible', tags:['#collision','#mouvement'],         cond:'À chaque collision avec un ennemi.' },
  { id:'DB-COL-02', nom:'Premier Contact',            type:'base',     famille:'Collision', rarete:'Commun', loc:'#loc_cible', tags:['#collision','#sequence'],          cond:'La toute première collision de la salle.' },
  { id:'DB-COL-05', nom:'Choc Frontal',               type:'base',     famille:'Collision', rarete:'Rare',   loc:'#loc_cible', tags:['#collision','#choc_frontal','#risque'], cond:'Collision mutuelle frontale.' },
  { id:'DB-REB-01', nom:'Rebond sur Obstacle',        type:'base',     famille:'Rebond',    rarete:'Commun', loc:'#loc_point', tags:['#rebond','#trajectoire'],         cond:'À chaque rebond sur un mur ou obstacle.' },
  { id:'DB-TIR-01', nom:'Tir Relâché',                type:'base',     famille:'Tir',       rarete:'Commun', loc:'#loc_soi',   tags:['#tir'],                           cond:'À chaque lancer de bille.' },
  { id:'DB-TIR-04', nom:'Charge Maximale',            type:'base',     famille:'Tir',       rarete:'Rare',   loc:'#loc_soi',   tags:['#tir','#charge_tir'],             cond:'Tir à charge maximale uniquement.' },
  { id:'DB-KIL-01', nom:'Kill Direct',                type:'base',     famille:'Kill',      rarete:'Commun', loc:'#loc_soi',   tags:['#kill'],                          cond:'Chaque mort causée directement.' },
  { id:'DB-TPS-01', nom:'Minuterie Passive',          type:'base',     famille:'Temps',     rarete:'Commun', loc:'#loc_soi',   tags:['#temps'],                         cond:'Toutes les N secondes.' },
  { id:'DB-HEU-01', nom:'Heurt par un Ennemi',        type:'base',     famille:'Heurt',     rarete:'Commun', loc:'#loc_soi',   tags:['#heurt','#risque'],               cond:'Quand un ennemi percute la bille.' },
  { id:'DA-DOT-01', nom:'Ennemi Sous DoT',            type:'advanced', famille:'DoT',       rarete:'Commun', loc:'#loc_cible', tags:['#dot','#trigger'],                cond:'Collision sur ennemi avec DoT actif.' },
  { id:'DA-ELE-01', nom:'Synergie Élémentaire',       type:'advanced', famille:'Élémentaire',rarete:'Rare',  loc:'#loc_cible', tags:['#etat_elementaire','#synergie'],   cond:'Quand deux états élémentaires interagissent.' },
  { id:'DA-BUF-01', nom:'Buff Appliqué',              type:'advanced', famille:'Buff',      rarete:'Commun', loc:'#loc_soi',   tags:['#buff','#trigger'],               cond:'Au moment précis où un buff est appliqué.' },
  { id:'DA-INV-01', nom:'Invocation Posée',           type:'advanced', famille:'Invocation',rarete:'Rare',   loc:'#loc_point', tags:['#invocation','#structures'],      cond:'Quand une invocation est posée.' },
  { id:'DA-SEQ-01', nom:'Séquence Parfaite',          type:'advanced', famille:'Séquence',  rarete:'Légendaire',loc:'#loc_soi', tags:['#sequence','#trigger'],           cond:'5 compétences déclenchées dans l\'ordre exact.' },
];

// ══════════════════════════════════════════════════
// RELIQUES (extrait)
// ══════════════════════════════════════════════════
window.GD_RELICS = [
  { id:'RF01', nom:'Galet Poli',          rarete:'Faible', tags:['#rebond','#mouvement'],             effet:'La bille ne perd plus de vitesse au contact des murs.' },
  { id:'RF02', nom:'Dent de Lait',        rarete:'Faible', tags:['#collecte','#ressource'],           effet:'La première ressource par salle est doublée.' },
  { id:'RF03', nom:'Horloge Cassée',      rarete:'Faible', tags:['#temps'],                           effet:'Délai des déclencheurs #temps réduit de 1s (min 1s).' },
  { id:'RF06', nom:'Amulette du Boucher', rarete:'Faible', tags:['#kill','#compteur'],                effet:'Chaque 5e kill de la salle restaure 2 Gouttes de Sang.' },
  { id:'RS01', nom:'Cœur de Pierre',      rarete:'Forte',  tags:['#defense','#pv_personnage'],        effet:'+15 PV max. Permanent.' },
  { id:'RS04', nom:'Lunettes Télescopes', rarete:'Forte',  tags:['#trajectoire','#critique'],         effet:'Tirs sans rebond avant impact : +25% dégâts.' },
  { id:'RS07', nom:'Instinct Prédateur',  rarete:'Forte',  tags:['#kill','#vitesse','#buff'],         effet:'+20% vitesse pendant 3s après chaque kill.' },
  { id:'RS14', nom:'Bouclier Miroir',     rarete:'Forte',  tags:['#defense','#bouclier','#renvoi'],   effet:'Bouclier actif renvoie 30% des dégâts absorbés.' },
  { id:'RA01', nom:'Dé Enchanté',         rarete:'Active', tags:['#aleatoire','#meta'],               effet:'Activation : réinitialise tous les cooldowns (aléatoire 30-100%).' },
];

// ══════════════════════════════════════════════════
// SYNERGIES
// ══════════════════════════════════════════════════
window.GD_SYNERGIES = [
  { id:'SYN-01', nom:'Maelström de Saignement', tags:['#saignement','#dot'],          palier1:'2 compétences #saignement → +15% dégâts DoT', palier2:'3 → stacks max 7', palier3:'4 → tout kill propage Saignement' },
  { id:'SYN-02', nom:'Alchimiste du Chaos',     tags:['#aleatoire','#trigger'],       palier1:'2 compétences #aleatoire → 1 reroll/salle',   palier2:'3 → effets bonus +20%', palier3:'4 → double résultat 1/3' },
  { id:'SYN-03', nom:'Ingénieur de Terrain',    tags:['#invocation','#zone'],         palier1:'2 structures → durée +3s',                    palier2:'3 → structures dégâts +20%', palier3:'4 → spawn auto 1 structure/salle' },
  { id:'SYN-04', nom:'Éclair de Précision',     tags:['#critique','#trajectoire'],    palier1:'2 compétences → critique +8%',                palier2:'3 → Choc Frontal double-critique', palier3:'4 → tir dans l\'axe crit garanti' },
  { id:'SYN-05', nom:'Danseur des Ombres',      tags:['#mouvement','#dash'],          palier1:'2 → vitesse +10% permanente',                 palier2:'3 → dash recharge au kill', palier3:'4 → dash déclenche toutes compétences #mouvement' },
];

// ══════════════════════════════════════════════════
// ENNEMIS (extrait — données complètes dans ennemis_v10.csv)
// ══════════════════════════════════════════════════
window.GD_ENEMIES = [
  { id:'F01', nom:'Rat Fouisseur',    biome:'Forêt',   tier:'Faible',  ia:'Seek',   pv:18, vitesse:220, masse:0.7, coeff_acc:0.6, coeff_def:0.0, affinites:['#collision'] },
  { id:'F02', nom:'Fennec Fuyard',    biome:'Savane',  tier:'Faible',  ia:'Flee',   pv:14, vitesse:310, masse:0.5, coeff_acc:0.5, coeff_def:0.0, affinites:['#mouvement'] },
  { id:'N01', nom:'Sanglier Chargeur',biome:'Forêt',   tier:'Normal',  ia:'Charge', pv:35, vitesse:280, masse:1.4, coeff_acc:1.0, coeff_def:0.1, affinites:['#impact_physique','#deplacement'] },
  { id:'N02', nom:'Varan Crache-Feu', biome:'Savane',  tier:'Normal',  ia:'Seek',   pv:30, vitesse:200, masse:1.1, coeff_acc:0.8, coeff_def:0.1, affinites:['#feu','#dot'] },
  { id:'N03', nom:'Tortue Épineuse',  biome:'Forêt',   tier:'Normal',  ia:'Orbit',  pv:45, vitesse:150, masse:1.8, coeff_acc:0.7, coeff_def:0.3, affinites:['#defense','#controle'] },
  { id:'E01', nom:'Alpha Prédateur',  biome:'Savane',  tier:'Élite',   ia:'Guided', pv:80, vitesse:260, masse:1.6, coeff_acc:1.2, coeff_def:0.2, affinites:['#collision','#choc_frontal','#risque'] },
  { id:'E02', nom:'Sorcier Venimeux', biome:'Forêt',   tier:'Élite',   ia:'Guided', pv:65, vitesse:240, masse:1.0, coeff_acc:0.9, coeff_def:0.15,affinites:['#poison','#dot','#zone'] },
  { id:'MB1', nom:'Hyène Ricanante',  biome:'Savane',  tier:'Mini-Boss',ia:'Boss',  pv:150,vitesse:300, masse:2.0, coeff_acc:1.3, coeff_def:0.25,affinites:['#collision','#sequence','#kill'] },
];

// ══════════════════════════════════════════════════
// ARCHÉTYPES DE BUILD
// ══════════════════════════════════════════════════
window.GD_ARCHETYPES = [
  { id:'sniper',    nom:'Sniper',           tags:['#trajectoire','#critique','#charge_tir'],    desc:'Maximise les dégâts sur cible unique, tirs chargés.' },
  { id:'aoe',       nom:'Dévastateur AoE',  tags:['#aoe','#explosion','#multi_cible'],          desc:'Dégâts en zone, priorité aux groupes.' },
  { id:'dot',       nom:'Érosion DoT',      tags:['#dot','#poison','#saignement','#feu'],       desc:'Stacks de DoT, dégâts dans le temps.' },
  { id:'control',   nom:'Controleur',       tags:['#controle','#stun','#slow','#deplacement'], desc:'Immobilise et positionne les ennemis.' },
  { id:'summoner',  nom:'Invocateur',       tags:['#invocation','#zone','#structures'],        desc:'Terrain vivant, entités alliées persistantes.' },
  { id:'speed',     nom:'Boule de Feu',     tags:['#mouvement','#vitesse','#dash','#rebond'],  desc:'Vitesse extrême, exploitation des rebonds.' },
  { id:'tank',      nom:'Bouclier Vivant',  tags:['#defense','#bouclier','#soin','#risque'],   desc:'Absorbe et riposte.' },
  { id:'economy',   nom:'Économiste',       tags:['#ressource','#collecte','#meta'],           desc:'Maximise les Petites Dents et la méta-progression.' },
  { id:'elemental', nom:'Alchimiste',       tags:['#etat_elementaire','#synergie','#feu','#electricite','#eau','#poison'], desc:'Synergies élémentaires en cascade.' },
  { id:'chain',     nom:'Réacteur en Chaîne',tags:['#trigger','#sequence','#combo'],           desc:'Cascade de compétences auto-déclenchées.' },
];

// ══════════════════════════════════════════════════
// PLAYLIST (musiques de référence)
// ══════════════════════════════════════════════════
window.GD_PLAYLIST = [
  {
    titre: 'Luv(sic) Part 3',
    artiste: 'Nujabes ft. Shing02',
    style: 'Lo-fi Hip-Hop · Jazz',
    plateforme: 'YouTube',
    url: 'https://www.youtube.com/watch?v=kE1nJOHb5q8',
    tags: ['référence', 'nujabes', 'lo-fi'],
    note: 'Référence principale — ambiance Samurai Champloo',
    cover_color: '#3a5a8a'
  },
  {
    titre: 'Feather',
    artiste: 'Nujabes ft. CL Smooth',
    style: 'Lo-fi Hip-Hop',
    plateforme: 'YouTube',
    url: 'https://www.youtube.com/watch?v=kqHcs_sIBPg',
    tags: ['référence', 'nujabes'],
    note: 'Mélodie mélancolique, parfaite pour l\'écran titre',
    cover_color: '#5a3a8a'
  },
  {
    titre: 'Mystical Safari',
    artiste: 'Uppbeat',
    style: 'Lo-fi · World',
    plateforme: 'Uppbeat',
    url: 'https://uppbeat.io',
    tags: ['savane', 'biome', 'lo-fi'],
    note: 'Candidate biome Savane — percussions organiques',
    cover_color: '#6b4a18'
  },
  {
    titre: 'Ancient Forest',
    artiste: 'Epidemic Sound',
    style: 'Ambient · Nature',
    plateforme: 'Epidemic Sound',
    url: 'https://www.epidemicsound.com',
    tags: ['forêt', 'biome', 'ambient'],
    note: 'Candidate biome Forêt — calme et profond',
    cover_color: '#2a4a2a'
  },
  {
    titre: 'Marble Run',
    artiste: 'Epidemic Sound',
    style: 'Lo-fi · Électronique',
    plateforme: 'Epidemic Sound',
    url: 'https://www.epidemicsound.com',
    tags: ['run', 'loop', 'lo-fi'],
    note: 'Candidate pour les salles de combat — énergie basse',
    cover_color: '#4a3a6a'
  },

  {
    titre: 'Forest Waltz',
    artiste: 'Various — Uppbeat',
    style: 'Ambient · Nature',
    plateforme: 'Uppbeat',
    url: 'https://uppbeat.io/my/boards/shared/5452b3b2-802d-46e6-8d9a-9627e33dff5b',
    tags: ['forêt', 'biome', 'ambient'],
    note: 'Candidate biome Forêt — texture organique',
    cover_color: '#2a4a2a'
  },
  {
    titre: 'Desert Wind',
    artiste: 'Various — Uppbeat',
    style: 'World · Cinematic',
    plateforme: 'Uppbeat',
    url: 'https://uppbeat.io/my/boards/shared/5452b3b2-802d-46e6-8d9a-9627e33dff5b',
    tags: ['savane', 'cinematic'],
    note: 'Candidate biome Savane — vent du désert',
    cover_color: '#5a4020'
  },
  {
    titre: 'Golden Throne',
    artiste: 'Fat Jon',
    style: 'Hip-Hop Instrumental',
    plateforme: 'YouTube',
    url: 'https://www.youtube.com/results?search_query=fat+jon+instrumental',
    tags: ['boss', 'lion', 'hip-hop'],
    note: 'Candidate Boss du Lion — groove dramatique',
    cover_color: '#6a4a18'
  },
];

// ══════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════
window.GD = {
  rarityColor(r) {
    return { Commun:'#8a8a8a', Rare:'#4a7aaa', Épique:'#8a5aaa', Légendaire:'#c8952a', Faible:'#6a6a6a', Forte:'#c8952a', Active:'#4a8a6a' }[r] || '#8a8a8a';
  },
  findClass(id)   { return GD_CLASSES.find(c => c.id === id); },
  findEffect(id)  { return GD_EFFECTS.find(e => e.id === id); },
  findTrigger(id) { return GD_TRIGGERS.find(t => t.id === id); },
  findRelic(id)   { return GD_RELICS.find(r => r.id === id); },
  effectsByTag(tag) { return GD_EFFECTS.filter(e => e.tags.includes(tag)); },
  triggersByTag(tag){ return GD_TRIGGERS.filter(t => t.tags.includes(tag)); },
};

console.log('[gamedata.js] Chargé — Classes:', GD_CLASSES.length, '| Effets:', GD_EFFECTS.length, '| Déclencheurs:', GD_TRIGGERS.length, '| Reliques:', GD_RELICS.length);
