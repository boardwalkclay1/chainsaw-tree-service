// ============================================================
// Chainsaw Clay — Universal Email Template (Static + Clean)
// Applies to ALL outgoing emails: estimates, proposals, contracts, receipts
// ============================================================

export function buildChainsawEmail(contentHtml) {
  return `
  <div style="
    position:relative;
    width:100%;
    padding:40px;
    background:#000;
    color:#fff;
    font-family:Arial, sans-serif;
  ">

    <!-- BACKGROUND LOGO (FADED) -->
    <div style="
      position:absolute;
      inset:0;
      background:url('https://chainsawclay.com/img/tree-service-logo.png')
        no-repeat center center;
      background-size:65%;
      opacity:0.12;
      filter:grayscale(100%);
      z-index:0;
    "></div>

    <!-- DARK TINT OVERLAY -->
    <div style="
      position:absolute;
      inset:0;
      background:rgba(0,0,0,0.55);
      z-index:1;
    "></div>

    <!-- MAIN EMAIL CONTENT -->
    <div style="position:relative; z-index:2;">
      ${contentHtml}
    </div>

    <!-- FOOTER -->
    <div style="
      position:relative;
      z-index:2;
      margin-top:40px;
      padding-top:20px;
      border-top:1px solid #333;
      text-align:center;
      font-size:12px;
      opacity:0.85;
      line-height:1.5;
    ">
      <strong>Chainsaw Clay’s Tree Service LLC</strong><br>
      Official Communication — Estimate / Proposal / Contract / Receipt<br>
      Phone: (470) 469‑2358<br>
      Email: support@chainsawclay.com<br>
      Website: https://chainsawclay.com<br>
      <em>This email and its contents are official documents issued by Chainsaw Clay’s Tree Service LLC.</em>
    </div>

  </div>
  `;
}
