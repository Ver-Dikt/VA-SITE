(()=>{'use strict';
const docs={technical:['Технические требования','assets/pdf/technical-requirements.pdf'],hospitality:['Бытовой райдер','assets/pdf/hospitality-rider.pdf'],promoter:['Памятка промоутера','assets/pdf/promoter-guide.pdf']};
const key=new URLSearchParams(location.search).get('document'),doc=docs[key]||docs.technical;
document.title=`${doc[0]} — Ver-Dikt & Andy Dav`;document.querySelector('[data-title]').textContent=doc[0];
for(const selector of ['[data-download]','[data-open]'])document.querySelector(selector).href=doc[1];
document.querySelector('[data-pdf]').src=`${doc[1]}#view=FitH&toolbar=1`;document.querySelector('[data-year]').textContent=new Date().getFullYear();
})();
