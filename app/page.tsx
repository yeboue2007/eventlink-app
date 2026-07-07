export default function LandingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
  :root{
    --navy:#2C1E47;
    --violet:#6A3EC9;
    --pink:#E94E8B;
    --orange:#FF8A00;
    --gold:#FFC107;
    --bg:#F4F6FA;
    --white:#FFFFFF;
    --grad: linear-gradient(120deg, var(--violet) 0%, var(--pink) 55%, var(--orange) 100%);
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  html{scroll-behavior:smooth;}
  body{
    font-family:'Poppins', sans-serif;
    background:var(--bg);
    color:var(--navy);
    overflow-x:hidden;
  }
  a{text-decoration:none;color:inherit;}
  .wrap{max-width:1180px;margin:0 auto;padding:0 32px;}

  /* NAV */
  nav{
    position:sticky;top:0;z-index:50;
    background:rgba(244,246,250,0.85);
    backdrop-filter:blur(10px);
    border-bottom:1px solid rgba(44,30,71,0.08);
  }
  .navrow{display:flex;align-items:center;justify-content:space-between;padding:18px 32px;max-width:1180px;margin:0 auto;}
  .logo{display:flex;align-items:center;gap:10px;font-weight:800;font-size:22px;color:var(--navy);}
  .logo .mark{width:34px;height:34px;border-radius:9px;background:var(--grad);position:relative;flex-shrink:0;}
  .logo .mark::after{
    content:"";position:absolute;inset:8px;border:2.5px solid white;border-radius:5px;border-right:none;border-bottom:none;
    transform:rotate(-45deg) translate(1px,1px);
  }
  .logo span.link{color:var(--violet);}
  .navlinks{display:flex;gap:36px;font-size:15px;font-weight:500;color:var(--navy);}
  .navlinks a{opacity:.75;transition:opacity .2s;}
  .navlinks a:hover{opacity:1;}
  .navcta{display:flex;gap:12px;}
  .btn{
    padding:11px 22px;border-radius:10px;font-weight:600;font-size:14.5px;
    display:inline-flex;align-items:center;gap:8px;cursor:pointer;border:none;
    transition:transform .15s ease, box-shadow .15s ease;
  }
  .btn:hover{transform:translateY(-2px);}
  .btn-primary{background:var(--grad);color:white;box-shadow:0 8px 20px -6px rgba(233,78,139,0.5);}
  .btn-ghost{background:transparent;color:var(--navy);border:1.5px solid rgba(44,30,71,0.2);}
  .btn-ghost:hover{border-color:var(--violet);}

  /* HERO */
  .hero{position:relative;padding:90px 0 60px;overflow:hidden;}
  .hero::before{
    content:"";position:absolute;top:-180px;right:-160px;width:520px;height:520px;
    background:var(--grad);opacity:0.14;border-radius:50%;filter:blur(10px);
  }
  .hero-grid{display:grid;grid-template-columns:1.05fr 1fr;gap:60px;align-items:center;position:relative;z-index:2;}
  .eyebrow{
    display:inline-flex;align-items:center;gap:8px;background:white;border:1px solid rgba(106,62,201,0.18);
    padding:7px 16px;border-radius:100px;font-size:13px;font-weight:600;color:var(--violet);margin-bottom:24px;
  }
  .eyebrow .dot{width:6px;height:6px;border-radius:50%;background:var(--pink);}
  h1{
    font-size:52px;line-height:1.08;font-weight:800;color:var(--navy);letter-spacing:-1.2px;margin-bottom:22px;
  }
  h1 .accent{
    background:var(--grad);-webkit-background-clip:text;background-clip:text;color:transparent;
  }
  .hero p.lead{font-size:18px;line-height:1.65;color:rgba(44,30,71,0.72);max-width:480px;margin-bottom:34px;font-weight:400;}
  .hero-ctas{display:flex;gap:14px;margin-bottom:40px;}
  .btn-lg{padding:15px 26px;font-size:15.5px;border-radius:12px;}
  .trustline{display:flex;gap:26px;font-size:13.5px;color:rgba(44,30,71,0.55);font-weight:500;}
  .trustline b{color:var(--navy);font-weight:700;}

  /* APP MOCK */
  .mock{position:relative;}
  .mock-card{
    background:white;border-radius:20px;box-shadow:0 30px 70px -25px rgba(44,30,71,0.35);
    overflow:hidden;border:1px solid rgba(44,30,71,0.06);
  }
  .mock-top{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid #eee;}
  .mock-top .l{display:flex;align-items:center;gap:8px;font-weight:700;font-size:14px;}
  .mock-top .mark-sm{width:22px;height:22px;border-radius:6px;background:var(--grad);}
  .mock-tabs{display:flex;gap:18px;font-size:12.5px;color:#999;font-weight:500;}
  .mock-tabs .on{color:var(--navy);font-weight:700;}
  .mock-body{padding:26px 24px 30px;}
  .mock-body h3{font-size:21px;font-weight:700;line-height:1.3;margin-bottom:8px;}
  .mock-body p{font-size:13.5px;color:#8a8a99;margin-bottom:20px;}
  .chip-row{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;}
  .chip{
    font-size:12px;font-weight:600;padding:8px 12px;border-radius:9px;background:#F4F6FA;color:var(--navy);
    display:flex;align-items:center;gap:6px;border:1px solid rgba(44,30,71,0.06);
  }
  .chip.active{background:linear-gradient(120deg, rgba(106,62,201,0.12), rgba(233,78,139,0.12));border-color:rgba(233,78,139,0.3);color:var(--pink);}
  .mock-offer{background:#F4F6FA;border-radius:14px;padding:16px;display:flex;justify-content:space-between;align-items:center;}
  .mock-offer .who{font-size:13px;font-weight:700;}
  .mock-offer .sub{font-size:11.5px;color:#999;margin-top:2px;}
  .mock-offer .price{font-size:15px;font-weight:800;color:var(--violet);}
  .float-badge{
    position:absolute;background:white;border-radius:14px;box-shadow:0 20px 40px -18px rgba(44,30,71,0.3);
    padding:12px 16px;font-size:12.5px;font-weight:700;display:flex;align-items:center;gap:8px;
  }
  .float-badge.b1{top:-18px;left:-30px;color:var(--navy);}
  .float-badge.b2{bottom:20px;right:-26px;color:var(--navy);}
  .float-badge .ic{width:26px;height:26px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:13px;}
  .ic-green{background:#E7F8EE;color:#1F9D55;}
  .ic-gold{background:#FFF6DE;color:#B8860B;}

  /* SECTIONS */
  section{padding:90px 0;}
  .section-head{max-width:640px;margin:0 auto 56px;text-align:center;}
  .kicker{font-size:13px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--pink);margin-bottom:14px;}
  .section-head h2{font-size:36px;font-weight:800;letter-spacing:-0.8px;line-height:1.2;margin-bottom:14px;}
  .section-head p{font-size:16.5px;color:rgba(44,30,71,0.65);line-height:1.6;}

  /* HOW IT WORKS */
  .steps{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;}
  .step{background:white;border-radius:18px;padding:32px 26px;border:1px solid rgba(44,30,71,0.06);position:relative;}
  .step .num{
    font-size:44px;font-weight:800;color:transparent;-webkit-text-stroke:1.5px rgba(106,62,201,0.35);
    margin-bottom:14px;line-height:1;
  }
  .step h4{font-size:18px;font-weight:700;margin-bottom:10px;}
  .step p{font-size:14.5px;color:rgba(44,30,71,0.65);line-height:1.6;}

  /* MULTI-SERVICE SIGNATURE */
  .multi{background:var(--navy);border-radius:28px;padding:70px 60px;color:white;position:relative;overflow:hidden;}
  .multi::before{
    content:"";position:absolute;bottom:-200px;left:-100px;width:420px;height:420px;background:var(--grad);opacity:.25;border-radius:50%;filter:blur(30px);
  }
  .multi-grid{display:grid;grid-template-columns:1fr 1fr;gap:50px;align-items:center;position:relative;z-index:2;}
  .multi h2{font-size:32px;font-weight:800;letter-spacing:-0.6px;margin-bottom:18px;line-height:1.25;}
  .multi p{font-size:15.5px;color:rgba(255,255,255,0.72);line-height:1.7;margin-bottom:26px;}
  .multi-tags{display:flex;flex-wrap:wrap;gap:10px;}
  .multi-tags span{
    font-size:12.5px;font-weight:600;padding:8px 14px;border-radius:100px;background:rgba(255,255,255,0.08);
    border:1px solid rgba(255,255,255,0.15);
  }
  .diagram{position:relative;height:280px;display:flex;align-items:center;justify-content:center;}
  .hub{
    width:88px;height:88px;border-radius:22px;background:var(--grad);display:flex;align-items:center;justify-content:center;
    font-weight:800;font-size:13px;color:white;box-shadow:0 0 0 8px rgba(255,255,255,0.06);z-index:3;text-align:center;
    line-height:1.2;
  }
  .node{
    position:absolute;width:64px;height:64px;border-radius:16px;background:rgba(255,255,255,0.08);
    border:1px solid rgba(255,255,255,0.18);display:flex;align-items:center;justify-content:center;font-size:22px;
  }
  .node.n1{top:0;left:14%;}
  .node.n2{top:8%;right:8%;}
  .node.n3{bottom:6%;right:14%;}
  .node.n4{bottom:0;left:6%;}
  svg.lines{position:absolute;inset:0;width:100%;height:100%;}
  svg.lines line{stroke:rgba(255,255,255,0.25);stroke-width:1.5;stroke-dasharray:4 4;}

  /* CATEGORIES */
  .cats{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
  .cat{
    background:white;border-radius:16px;padding:24px 18px;text-align:center;border:1px solid rgba(44,30,71,0.06);
    transition:transform .18s ease, box-shadow .18s ease;
  }
  .cat:hover{transform:translateY(-4px);box-shadow:0 20px 40px -20px rgba(44,30,71,0.25);}
  .cat .em{font-size:26px;margin-bottom:10px;}
  .cat span{font-size:13.5px;font-weight:600;}

  /* TRUST */
  .trust-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
  .trust-list{display:flex;flex-direction:column;gap:20px;}
  .trust-item{display:flex;gap:16px;align-items:flex-start;}
  .trust-item .ic{
    width:42px;height:42px;border-radius:12px;background:linear-gradient(120deg, rgba(106,62,201,0.12), rgba(233,78,139,0.12));
    display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;
  }
  .trust-item h5{font-size:15.5px;font-weight:700;margin-bottom:4px;}
  .trust-item p{font-size:13.5px;color:rgba(44,30,71,0.6);line-height:1.55;}
  .score-card{
    background:white;border-radius:22px;padding:34px;border:1px solid rgba(44,30,71,0.06);
    box-shadow:0 30px 60px -30px rgba(44,30,71,0.3);
  }
  .score-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:22px;}
  .score-top .name{font-weight:700;font-size:16px;}
  .score-top .sub{font-size:12px;color:#999;}
  .score-badge{
    background:linear-gradient(120deg, rgba(255,193,7,0.18), rgba(255,138,0,0.18));color:var(--orange);
    font-size:12px;font-weight:700;padding:6px 12px;border-radius:100px;
  }
  .score-bar-row{margin-bottom:14px;}
  .score-bar-row .lbl{display:flex;justify-content:space-between;font-size:12.5px;font-weight:600;margin-bottom:6px;color:rgba(44,30,71,0.7);}
  .bar-bg{height:7px;background:#F0F1F6;border-radius:100px;overflow:hidden;}
  .bar-fill{height:100%;border-radius:100px;background:var(--grad);}

  /* CTA */
  .cta{
    background:var(--grad);border-radius:28px;padding:70px 50px;text-align:center;color:white;position:relative;overflow:hidden;
  }
  .cta h2{font-size:34px;font-weight:800;margin-bottom:16px;letter-spacing:-0.6px;}
  .cta p{font-size:16px;opacity:.92;margin-bottom:30px;}
  .cta-btns{display:flex;gap:14px;justify-content:center;}
  .btn-white{background:white;color:var(--violet);}
  .btn-outline{background:transparent;color:white;border:1.5px solid rgba(255,255,255,0.5);}

  footer{padding:50px 0;border-top:1px solid rgba(44,30,71,0.08);}
  .foot-row{display:flex;justify-content:space-between;align-items:center;font-size:13.5px;color:rgba(44,30,71,0.5);}
  .foot-links{display:flex;gap:22px;}

  @media (max-width:900px){
    .hero-grid,.multi-grid,.trust-grid{grid-template-columns:1fr;}
    .steps{grid-template-columns:1fr;}
    .cats{grid-template-columns:repeat(2,1fr);}
    h1{font-size:38px;}
    .navlinks{display:none;}
    .mock{margin-top:40px;}
    .multi{padding:44px 26px;}
  }
  @media (prefers-reduced-motion: reduce){
    *{transition:none !important;}
  }
` }} />
      <div dangerouslySetInnerHTML={{ __html: `

<nav>
  <div class="navrow">
    <div class="logo"><div class="mark"></div>Event<span class="link">Link</span></div>
    <div class="navlinks">
      <a href="#comment">Comment ça marche</a>
      <a href="#multi">Multi-services</a>
      <a href="#categories">Catégories</a>
      <a href="#confiance">Confiance</a>
    </div>
    <div class="navcta">
      <a class="btn btn-ghost" href="/login">Se connecter</a>
      <a class="btn btn-primary" href="/inscription">Publier une demande</a>
    </div>
  </div>
</nav>

<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <div class="eyebrow"><span class="dot"></span> Fait pour Abidjan, pensé pour l'Afrique</div>
      <h1>Trouvez les meilleurs <span class="accent">prestataires</span> pour votre événement</h1>
      <p class="lead">Décrivez votre besoin une seule fois. Recevez plusieurs propositions de professionnels vérifiés. Comparez, négociez, choisissez en toute confiance.</p>
      <div class="hero-ctas">
        <a class="btn btn-primary btn-lg" href="/inscription">Publier une demande</a>
        <a class="btn btn-ghost btn-lg" href="/inscription?role=prestataire">Explorer les prestataires</a>
      </div>
      <div class="trustline">
        <div><b>12+</b> catégories de services</div>
        <div><b>0 FCFA</b> pour publier une demande</div>
        <div><b>2 min</b> pour décrire votre projet</div>
      </div>
    </div>

    <div class="mock">
      <div class="float-badge b1"><div class="ic ic-green">✓</div> Identité vérifiée</div>
      <div class="mock-card">
        <div class="mock-top">
          <div class="l"><div class="mark-sm"></div> EventLink</div>
          <div class="mock-tabs"><span class="on">Demandes</span><span>Messages</span><span>Profil</span></div>
        </div>
        <div class="mock-body">
          <h3>Mariage — 200 invités</h3>
          <p>Abidjan, Cocody · 14 décembre · Budget 800 000 – 1 200 000 FCFA</p>
          <div class="chip-row">
            <div class="chip active">🔊 Sonorisation</div>
            <div class="chip active">💡 Éclairage</div>
            <div class="chip">🎧 DJ</div>
            <div class="chip">🌸 Décoration</div>
          </div>
          <div class="mock-offer">
            <div>
              <div class="who">Agence Kora Events</div>
              <div class="sub">Offre groupée · Sono + Éclairage · ⭐ 4.9</div>
            </div>
            <div class="price">450 000 F</div>
          </div>
        </div>
      </div>
      <div class="float-badge b2"><div class="ic ic-gold">3</div> propositions reçues</div>
    </div>
  </div>
</section>

<section id="comment">
  <div class="wrap">
    <div class="section-head">
      <div class="kicker">Comment ça marche</div>
      <h2>Trois étapes, un seul formulaire</h2>
      <p>Pas besoin de démarcher chaque prestataire un par un. EventLink s'en charge pour vous.</p>
    </div>
    <div class="steps">
      <div class="step">
        <div class="num">01</div>
        <h4>Décrivez votre événement</h4>
        <p>Type d'événement, ville, date, budget et prestations recherchées. Publication en moins de deux minutes.</p>
      </div>
      <div class="step">
        <div class="num">02</div>
        <h4>Recevez des propositions</h4>
        <p>Seuls les prestataires concernés par votre demande vous répondent, avec leur prix et leurs conditions.</p>
      </div>
      <div class="step">
        <div class="num">03</div>
        <h4>Comparez et choisissez</h4>
        <p>Discutez directement avec les prestataires, négociez, puis confirmez celui qui vous convient.</p>
      </div>
    </div>
  </div>
</section>

<section id="multi">
  <div class="wrap">
    <div class="multi">
      <div class="multi-grid">
        <div>
          <div class="kicker" style="color:var(--gold)">Ce qui nous différencie</div>
          <h2>Un prestataire, plusieurs services</h2>
          <p>Beaucoup d'agences événementielles à Abidjan proposent sonorisation, éclairage et DJ à la fois. Sur EventLink, un même prestataire peut répondre à toute votre demande en une seule offre groupée — un seul prix, un seul interlocuteur, un seul échange.</p>
          <div class="multi-tags">
            <span>🔊 Sonorisation</span>
            <span>💡 Éclairage</span>
            <span>🎧 DJ</span>
            <span>🌸 Décoration</span>
            <span>📸 Photographie</span>
          </div>
        </div>
        <div class="diagram">
          <svg class="lines"><line x1="50%" y1="50%" x2="18%" y2="12%"/><line x1="50%" y1="50%" x2="88%" y2="18%"/><line x1="50%" y1="50%" x2="90%" y2="82%"/><line x1="50%" y1="50%" x2="12%" y2="92%"/></svg>
          <div class="node n1">🔊</div>
          <div class="node n2">💡</div>
          <div class="node n3">🎧</div>
          <div class="node n4">🌸</div>
          <div class="hub">Kora<br>Events</div>
        </div>
      </div>
    </div>
  </div>
</section>

<section id="categories">
  <div class="wrap">
    <div class="section-head">
      <div class="kicker">Catégories</div>
      <h2>Pour chaque métier de l'événementiel</h2>
      <p>De nouvelles catégories s'ajoutent régulièrement, sans jamais complexifier votre recherche.</p>
    </div>
    <div class="cats">
      <div class="cat"><div class="em">🔊</div><span>Sonorisation</span></div>
      <div class="cat"><div class="em">💡</div><span>Éclairage</span></div>
      <div class="cat"><div class="em">🎧</div><span>DJ</span></div>
      <div class="cat"><div class="em">📸</div><span>Photographie</span></div>
      <div class="cat"><div class="em">🎥</div><span>Vidéo</span></div>
      <div class="cat"><div class="em">🌸</div><span>Décoration</span></div>
      <div class="cat"><div class="em">🍽️</div><span>Traiteur</span></div>
      <div class="cat"><div class="em">🛡️</div><span>Sécurité</span></div>
    </div>
  </div>
</section>

<section id="confiance">
  <div class="wrap">
    <div class="trust-grid">
      <div>
        <div class="kicker">Confiance</div>
        <h2 style="font-size:32px;font-weight:800;letter-spacing:-0.6px;margin-bottom:18px;">Chaque prestataire a un indice de fiabilité</h2>
        <div class="trust-list">
          <div class="trust-item">
            <div class="ic">✓</div>
            <div><h5>Identité et numéro vérifiés</h5><p>Un badge visible sur chaque profil, dès l'inscription.</p></div>
          </div>
          <div class="trust-item">
            <div class="ic">⭐</div>
            <div><h5>Avis clients authentiques</h5><p>Notes et commentaires uniquement après un projet réalisé.</p></div>
          </div>
          <div class="trust-item">
            <div class="ic">⏱️</div>
            <div><h5>Taux et délai de réponse</h5><p>Visible avant même d'entamer une conversation.</p></div>
          </div>
        </div>
      </div>
      <div class="score-card">
        <div class="score-top">
          <div><div class="name">Agence Kora Events</div><div class="sub">128 événements réalisés</div></div>
          <div class="score-badge">Pro vérifié</div>
        </div>
        <div class="score-bar-row"><div class="lbl"><span>Fiabilité</span><span>96%</span></div><div class="bar-bg"><div class="bar-fill" style="width:96%"></div></div></div>
        <div class="score-bar-row"><div class="lbl"><span>Taux de réponse</span><span>91%</span></div><div class="bar-bg"><div class="bar-fill" style="width:91%"></div></div></div>
        <div class="score-bar-row"><div class="lbl"><span>Avis clients</span><span>4.9 / 5</span></div><div class="bar-bg"><div class="bar-fill" style="width:98%"></div></div></div>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta">
      <h2>Prêt à organiser votre prochain événement ?</h2>
      <p>Connexion. Confiance. Événements réussis.</p>
      <div class="cta-btns">
        <a class="btn btn-white btn-lg" href="/inscription">Publier une demande gratuitement</a>
        <a class="btn btn-outline btn-lg" href="/inscription?role=prestataire">Je suis prestataire</a>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap foot-row">
    <div class="logo" style="font-size:16px;"><div class="mark" style="width:24px;height:24px;"></div>Event<span class="link">Link</span></div>
    <div class="foot-links">
      <a href="/inscription?role=prestataire">Prestataires</a>
      <a href="#comment">À propos</a>
      <a href="mailto:contact@eventlink.ci">Contact</a>
    </div>
    <div>© 2026 EventLink — Abidjan, Côte d'Ivoire</div>
  </div>
</footer>

` }} />
    </>
  );
}
